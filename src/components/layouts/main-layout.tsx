
import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button'; // Corrected relative path

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/features', label: 'Features' },
  { href: '/for-parents', label: 'For Parents' },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="WonderChat Logo" className="h-10 w-10" />
            <span className="font-bold text-xl primary-text">WonderChat</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-2">
            <Button asChild variant="outline">
              <Link href="/login">Parent Login</Link>
            </Button>
            {/* <Button asChild>
              <Link href="/register">Sign Up</Link> 
            </Button> */}
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="py-8 border-t bg-muted/50">
        <div className="container text-center text-muted-foreground text-sm">
          <img src="/logo.png" alt="WonderChat Logo" className="h-12 w-12 mx-auto mb-2" />
          &copy; {new Date().getFullYear()} WonderChat. Nurturing communication, one conversation at a time.
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}