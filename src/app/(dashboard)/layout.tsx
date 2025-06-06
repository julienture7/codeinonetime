
import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth'; // Corrected relative path
import Link from 'next/link';
import { Button } from '../../components/ui/button'; // Corrected relative path
import { LogOut, UserCircle } from 'lucide-react';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Assuming you have Avatar

// A simple SignOutButton component
const SignOutButton = () => {
  return (
    <form action="/api/auth/signout" method="POST">
      <Button type="submit" variant="ghost" className="text-red-500 hover:text-red-600">
        <LogOut className="mr-2 h-4 w-4" /> Sign Out
      </Button>
    </form>
  );
};


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <img src="/logo.png" alt="WonderChat Logo" className="h-8 w-8" />
            <span className="font-bold text-lg">WonderChat Dashboard</span>
          </Link>
          <div className="flex items-center space-x-4">
            {session?.user && (
              <div className="flex items-center space-x-2 text-sm">
                {/* <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                  <AvatarFallback>
                    {session.user.name ? session.user.name.charAt(0).toUpperCase() : <UserCircle />}
                  </AvatarFallback>
                </Avatar> */}
                <UserCircle className="h-6 w-6 text-muted-foreground"/>
                <span className="text-muted-foreground hidden sm:inline">
                  {session.user.name || session.user.email}
                  {session.user.kidName && ` (Parent of ${session.user.kidName})`}
                </span>
              </div>
            )}
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8 container max-w-screen-2xl">
        {children}
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} WonderChat. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}