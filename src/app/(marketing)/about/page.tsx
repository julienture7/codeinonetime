
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'; // Corrected relative path
import { Users, Lightbulb, Smile } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-20">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 primary-text">About WonderChat</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          We are passionate about leveraging technology to foster growth and development in children. WonderChat is born from the belief that communication is key to a child&apos;s success and happiness.
        </p>
      </section>

      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              To provide a safe, engaging, and innovative platform that empowers children to develop strong communication skills and social confidence through joyful interaction with AI. We aim to make learning to converse a delightful adventure.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We envision a world where every child can express themselves clearly and confidently, building meaningful connections and navigating social situations with ease. WonderChat is a step towards that vision, offering a supportive practice partner that&apos;s always ready to listen and respond.
            </p>
          </div>
          <div>
             <Image 
                src="https://picsum.photos/seed/wonderchatMission/500/350" 
                alt="Children happily interacting" 
                width={500} 
                height={350} 
                className="rounded-lg shadow-xl" 
              />
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-10">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="p-3 bg-primary/10 rounded-full mb-3 w-16 h-16 mx-auto flex items-center justify-center">
                <Smile className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Child-Centric</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Every feature is designed with the child&apos;s engagement, safety, and developmental needs at its core.
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="p-3 bg-primary/10 rounded-full mb-3 w-16 h-16 mx-auto flex items-center justify-center">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Innovation</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              We continuously explore cutting-edge AI to create enriching and effective learning experiences.
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="p-3 bg-primary/10 rounded-full mb-3 w-16 h-16 mx-auto flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Parental Partnership</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              We believe in empowering parents with tools and insights to support their child&apos;s journey.
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Placeholder for Team Section if desired in future */}
      {/* <section>
        <h2 className="text-3xl font-semibold text-center mb-10">Meet the Team</h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto">
            WonderChat is built by a dedicated team of educators, technologists, and parents. (Team details would go here).
        </p>
      </section> */}
    </div>
  );
}