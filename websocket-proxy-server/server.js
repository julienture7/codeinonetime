
const WebSocket = require('ws');
const { GoogleAuth } = require('google-auth-library');
// Attempt to load .env variables
try {
    require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
} catch (e) {
    console.warn("dotenv not found or failed to load, relying on environment variables set externally.");
}

const PROXY_SERVER_PORT = process.env.PROXY_SERVER_PORT || 3001;
const GOOGLE_BIDI_WEBSOCKET_ENDPOINT = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent';

const wss = new WebSocket.Server({ port: PROXY_SERVER_PORT });

console.log(`WebSocket Proxy Server started on port ${PROXY_SERVER_PORT}`);

// Determine auth method
const API_KEY = process.env.API_KEY; // Preferred as per guidelines
const GOOGLE_GEMINI_API_KEY_FALLBACK = process.env.GOOGLE_GEMINI_API_KEY;
const USE_SERVICE_ACCOUNT = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;

let effectiveApiKey = API_KEY || GOOGLE_GEMINI_API_KEY_FALLBACK;

if (!USE_SERVICE_ACCOUNT && !effectiveApiKey) {
    console.error("FATAL ERROR: No API key or Service Account configured. Set API_KEY (recommended) or GOOGLE_GEMINI_API_KEY, or GOOGLE_APPLICATION_CREDENTIALS.");
    process.exit(1);
}

if (USE_SERVICE_ACCOUNT) {
    console.log("Using Service Account authentication (GOOGLE_APPLICATION_CREDENTIALS).");
} else {
    console.log(`Using API Key authentication (API_KEY or GOOGLE_GEMINI_API_KEY). Prioritizing API_KEY: ${!!API_KEY}`);
}

wss.on('connection', async (clientWs, req) => {
    console.log('Client connected to proxy');
    let googleWs = null;
    const headers = {};
    let finalGoogleApiUrl = GOOGLE_BIDI_WEBSOCKET_ENDPOINT;

    if (USE_SERVICE_ACCOUNT) {
        try {
            const auth = new GoogleAuth({
                scopes: ['https://www.googleapis.com/auth/cloud-platform'],
            });
            const gAuthClient = await auth.getClient();
            const tokenResponse = await gAuthClient.getAccessToken();
            if (!tokenResponse.token) {
                throw new Error('Failed to obtain Google authentication token via Service Account.');
            }
            console.log('Successfully obtained Google Auth Token via Service Account.');
            headers['Authorization'] = `Bearer ${tokenResponse.token}`;
        } catch (authError) {
            console.error('Google Service Account Authentication Error:', authError.message);
            clientWs.send(JSON.stringify({ type: 'error', error: 'Proxy authentication with Google (SA) failed: ' + authError.message }));
            clientWs.close(1011, 'Proxy SA authentication failed');
            return;
        }
    } else if (effectiveApiKey) {
        finalGoogleApiUrl = `${GOOGLE_BIDI_WEBSOCKET_ENDPOINT}?key=${effectiveApiKey}`;
        console.log('Using API Key for Google connection, appended to URL.');
    } else {
        // This case should be prevented by the check above, but as a safeguard:
        console.error('Configuration error: No valid auth method for Google API.');
        clientWs.send(JSON.stringify({ type: 'error', error: 'Proxy configuration error with Google auth.' }));
        clientWs.close(1011, 'Proxy auth config error');
        return;
    }
    
    console.log(`Proxying to Google WebSocket URL: ${finalGoogleApiUrl}`);
    try {
      googleWs = new WebSocket(finalGoogleApiUrl, { headers });
    } catch (e) {
       console.error('Error creating WebSocket connection to Google:', e.message);
        if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'error', error: 'Proxy failed to initiate connection to Google: ' + e.message }));
        }
        clientWs.close(1011, 'Proxy to Google connection init failed');
        return;
    }


    googleWs.on('open', () => {
        console.log('Proxy connected to Google API');
        if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'proxy_status', status: 'connected_to_google' }));
        }
    });

    googleWs.on('message', (messageBuffer) => {
        const messageString = messageBuffer.toString();
        // console.log('Message from Google:', messageString.substring(0, 100) + "..."); // Log snippet
        if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(messageString); 
        }
    });

    googleWs.on('error', (error) => {
        console.error('Error on WebSocket connection to Google:', error.message);
        if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'error', error: 'Google API connection error: ' + error.message }));
        }
    });

    googleWs.on('close', (code, reasonBuffer) => {
        const reason = reasonBuffer ? reasonBuffer.toString() : 'No reason';
        console.log(`Disconnected from Google API: ${code} - ${reason}`);
        if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'proxy_status', status: 'disconnected_from_google', code, reason }));
            clientWs.close(1000, `Google service disconnected: ${reason}`);
        }
    });

    clientWs.on('message', (messageBuffer) => {
        const messageString = messageBuffer.toString();
        // console.log('Message from client:', messageString.substring(0,100) + "..."); // Log snippet
        if (googleWs && googleWs.readyState === WebSocket.OPEN) {
            googleWs.send(messageString); 
        } else {
            console.warn('Google WebSocket not open. Cannot forward client message.');
            if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: 'error', error: 'Proxy not connected to Google.' }));
            }
        }
    });

    clientWs.on('close', () => {
        console.log('Client disconnected from proxy');
        if (googleWs && (googleWs.readyState === WebSocket.OPEN || googleWs.readyState === WebSocket.CONNECTING)) {
            googleWs.close();
        }
    });

    clientWs.on('error', (error) => {
        console.error('Error on client WebSocket connection:', error.message);
        if (googleWs && (googleWs.readyState === WebSocket.OPEN || googleWs.readyState === WebSocket.CONNECTING)) {
            googleWs.close(1000, "Client connection error");
        }
    });
});

wss.on('error', (error) => {
    console.error('WebSocket Proxy Server Error:', error);
});

process.on('SIGINT', () => {
    console.log('Shutting down WebSocket Proxy Server...');
    wss.close(() => {
        console.log('All connections closed. Exiting.');
        process.exit(0);
    });
});
