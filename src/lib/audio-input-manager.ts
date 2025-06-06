
// Acknowledgment: ScriptProcessorNode is deprecated. For production, consider AudioWorkletNode.
// This is a simplified implementation for demonstration.

interface VadOptions {
  threshold: number; // RMS threshold for speech detection
  silenceDuration: number; // ms of silence before ending speech
  speakingCooldown: number; // ms to keep "speaking" status after RMS drops below threshold
}

const DEFAULT_VAD_OPTIONS: VadOptions = {
  threshold: 0.01, // Adjust based on microphone sensitivity and environment
  silenceDuration: 1000, // 1 second of silence
  speakingCooldown: 300,  // Keep speaking for 300ms after sound drops
};

export const TARGET_SAMPLE_RATE = 16000;

export class AudioInputManager {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private gainNode: GainNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  
  private vadOptions: VadOptions;
  private silenceTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private speakingCooldownTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private isSpeaking: boolean = false;

  private onAudioData: (pcmData: Float32Array) => void;
  private onActivityStart: () => void;
  private onActivityEnd: () => void;
  private onError: (error: string) => void;

  constructor(
    onAudioData: (pcmData: Float32Array) => void,
    onActivityStart: () => void,
    onActivityEnd: () => void,
    onError: (error: string) => void,
    vadOptions?: Partial<VadOptions>
  ) {
    this.onAudioData = onAudioData;
    this.onActivityStart = onActivityStart;
    this.onActivityEnd = onActivityEnd;
    this.onError = onError;
    this.vadOptions = { ...DEFAULT_VAD_OPTIONS, ...vadOptions };
  }

  public async start(): Promise<void> {
    if (this.audioContext) {
      console.warn('AudioInputManager already started.');
      return;
    }

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: TARGET_SAMPLE_RATE, // Request target sample rate
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });

      this.audioContext = new AudioContext({ sampleRate: TARGET_SAMPLE_RATE });
      
      // Check actual sample rate
      const trackSettings = this.mediaStream.getAudioTracks()[0].getSettings();
      if (trackSettings.sampleRate && trackSettings.sampleRate !== TARGET_SAMPLE_RATE) {
        console.warn(`Requested ${TARGET_SAMPLE_RATE}Hz but got ${trackSettings.sampleRate}Hz. Resampling might occur or be needed.`);
        // Ideally, resample here if AudioContext couldn't enforce it. For ScriptProcessor, it should handle it.
      }


      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      // Buffer size for ScriptProcessorNode. Powers of 2 are common.
      // 4096 samples at 16000Hz is ~256ms. Smaller buffers give lower latency but more processing overhead.
      const bufferSize = 4096; 
      this.scriptProcessor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);

      this.scriptProcessor.onaudioprocess = this.handleAudioProcess.bind(this);

      this.gainNode = this.audioContext.createGain(); // Can be used for volume control if needed
      this.gainNode.gain.value = 1.0;

      this.sourceNode.connect(this.gainNode);
      this.gainNode.connect(this.scriptProcessor);
      this.scriptProcessor.connect(this.audioContext.destination); // Connect to destination to keep processing active
      
      console.log('AudioInputManager started successfully with sample rate:', this.audioContext.sampleRate);

    } catch (err) {
      console.error('Error starting AudioInputManager:', err);
      this.onError(`Error accessing microphone: ${(err as Error).message}`);
      this.stop(); // Clean up if start failed
    }
  }

  private handleAudioProcess(event: AudioProcessingEvent): void {
    if (!this.audioContext || !this.scriptProcessor) return;

    const inputBuffer = event.inputBuffer;
    const pcmData = inputBuffer.getChannelData(0); // Get data from the first channel (mono)
    
    // Simple VAD: Calculate RMS of the buffer
    let sumSquares = 0.0;
    for (let i = 0; i < pcmData.length; i++) {
      sumSquares += pcmData[i] * pcmData[i];
    }
    const rms = Math.sqrt(sumSquares / pcmData.length);

    if (rms > this.vadOptions.threshold) {
      if (!this.isSpeaking) {
        this.isSpeaking = true;
        this.onActivityStart();
      }
      // Clear silence timeout as there's sound
      if (this.silenceTimeoutId) {
        clearTimeout(this.silenceTimeoutId);
        this.silenceTimeoutId = null;
      }
      // Reset (or start) speaking cooldown timeout
      if (this.speakingCooldownTimeoutId) clearTimeout(this.speakingCooldownTimeoutId);
      this.speakingCooldownTimeoutId = setTimeout(() => {
        if (this.isSpeaking) { // Only end if still speaking and cooldown expires
          // This path means sound dropped below threshold but cooldown kept it "speaking"
          // Now cooldown is over, check again. If still low, then end.
          // For simplicity here, we assume if cooldown expires, speech might be ending.
          // A more robust VAD would re-evaluate RMS here.
        }
      }, this.vadOptions.speakingCooldown);

      this.onAudioData(new Float32Array(pcmData)); // Send a copy

    } else { // Below threshold (silence or very quiet)
      if (this.isSpeaking) {
        // If it was speaking, and now it's quiet, start silence timer
        if (!this.silenceTimeoutId) {
          this.silenceTimeoutId = setTimeout(() => {
            if (this.isSpeaking) { // Check again if it's still considered speaking
               this.isSpeaking = false;
               this.onActivityEnd();
            }
            this.silenceTimeoutId = null;
          }, this.vadOptions.silenceDuration);
        }
      }
    }
  }

  public stop(): void {
    if (this.silenceTimeoutId) clearTimeout(this.silenceTimeoutId);
    if (this.speakingCooldownTimeoutId) clearTimeout(this.speakingCooldownTimeoutId);
    this.silenceTimeoutId = null;
    this.speakingCooldownTimeoutId = null;
    this.isSpeaking = false;

    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect();
      this.scriptProcessor.onaudioprocess = null; // Remove listener
      this.scriptProcessor = null;
    }
    if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
    }
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(e => console.error("Error closing AudioContext:", e));
      this.audioContext = null;
    }
    console.log('AudioInputManager stopped.');
  }

  public isStarted(): boolean {
    return !!this.audioContext;
  }
}
