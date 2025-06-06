
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react'; // Import SessionProvider
import { Toaster } from '../components/ui/sonner'; // Corrected relative path
import './globals.css';
import { authOptions } from '../lib/auth'; // Corrected relative path
import { getServerSession } from 'next-auth';

export const metadata: Metadata = {
  title: 'WonderChat - AI Voice Chat for Kids',
  description: 'Engaging AI voice chat to help children develop communication skills.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions); // Fetch session on server

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans antialiased">
        <SessionProvider session={session}> {/* Pass session to provider */}
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}