
import { Button } from '../../components/ui/button'; // Corrected relative path
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'; // Corrected relative path
import { ArrowRight, MessageCircle, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'; // Using Next.js Image for potential optimization

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 gradient-bg text-white">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container relative z-10 text-center">
          <img src="/logo-white.png" alt="WonderChat Logo" className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Unlock Your Child&apos;s Voice with WonderChat
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto">
            An engaging AI companion designed to help children (5-10) develop communication and social skills in a fun, safe, and interactive way.
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild>
            <Link href="/dashboard">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
           <p className="mt-4 text-sm text-gray-200">Parents, sign up or log in to begin!</p>
        </div>
      </section>

      {/* Features Overview Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 primary-text">
            Why WonderChat?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-3">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Engaging Conversations</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Our AI is trained to have natural, age-appropriate dialogues that captivate and encourage children to express themselves.
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="items-center text-center">
                 <div className="p-3 bg-primary/10 rounded-full mb-3">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Skill Development</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                WonderChat helps improve vocabulary, sentence construction, active listening, and social understanding through playful interaction.
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="items-center text-center">
                 <div className="p-3 bg-primary/10 rounded-full mb-3">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Safe & Secure</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                A COPPA-compliant and parent-controlled environment ensures a secure space for your child to learn and grow.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* How it Works Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 primary-text">
            Simple Steps to Start the Adventure
          </h2>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              {/* Using picsum for placeholder. Replace with actual app screenshot or illustration */}
              <Image 
                src="https://picsum.photos/seed/wonderchatApp/600/400" 
                alt="WonderChat Interface Illustration" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-xl" 
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">1</div>
                <div>
                  <h3 className="text-xl font-semibold">Parents Sign Up</h3>
                  <p className="text-muted-foreground">Create a secure parent account and set up your child&apos;s profile with their name.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">2</div>
                <div>
                  <h3 className="text-xl font-semibold">Choose a Voice</h3>
                  <p className="text-muted-foreground">Select a friendly AI voice companion for your child&apos;s chat sessions.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">3</div>
                <div>
                  <h3 className="text-xl font-semibold">Start Chatting!</h3>
                  <p className="text-muted-foreground">Your child can begin their voice adventure with WonderChat, guided by you.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 primary-text">
            Ready to Hear Your Child Shine?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join WonderChat today and give your child a unique tool to explore their voice and build confidence.
          </p>
          <Button size="lg" asChild>
            <Link href="/dashboard">Sign Up for Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}