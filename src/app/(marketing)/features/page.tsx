
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'; // Corrected relative path
import { CheckCircle, Zap, MessageSquare, ShieldAlert, Volume2, UserCog } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: Volume2,
    title: "Interactive Voice Chat",
    description: "Real-time, voice-based conversations with an AI companion tailored for children. Uses advanced speech recognition and generation.",
  },
  {
    icon: MessageSquare,
    title: "Adaptive Dialogue",
    description: "The AI adjusts its language complexity and topics based on the child's responses, ensuring conversations are always engaging and age-appropriate.",
  },
  {
    icon: Zap,
    title: "Communication Skill Building",
    description: "Focuses on developing vocabulary, sentence structure, storytelling, turn-taking, and active listening skills through natural interaction.",
  },
  {
    icon: ShieldAlert,
    title: "Safe & Moderated Environment",
    description: "Built with child safety first. Content is filtered, and conversations are guided to be positive and constructive. COPPA-compliant design.",
  },
  {
    icon: UserCog,
    title: "Parental Controls & Insights",
    description: "Parents can set up child profiles, select AI voices, and (in future versions) monitor progress and conversation themes.",
  },
  {
    icon: CheckCircle,
    title: "Engaging AI Personalities",
    description: "Choose from different AI voices and personalities (e.g., 'Aoede', 'Puck') to find the perfect chat buddy for your child.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="container py-12 md:py-20">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 primary-text">WonderChat Features</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover how WonderChat's innovative features create a unique and effective learning experience for your child.
        </p>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <feature.icon className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground flex-grow">
              {feature.description}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="bg-muted/30 p-8 md:p-12 rounded-lg">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-4">The Technology Behind the Magic</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              WonderChat utilizes state-of-the-art AI from Google Gemini, specifically the `gemini-2.5-flash-preview-native-audio-dialog` model, designed for live, bidirectional voice interactions. This allows for low-latency, natural-sounding conversations.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our secure WebSocket proxy ensures that audio data is streamed efficiently and safely between your child&apos;s device and the AI, providing a seamless and responsive chat experience. We prioritize robust Voice Activity Detection (VAD) to make interactions feel intuitive.
            </p>
          </div>
          <div className="flex justify-center">
            <Image 
              src="https://picsum.photos/seed/wonderchatTech/400/300" 
              alt="Abstract technology representation" 
              width={400} 
              height={300} 
              className="rounded-lg shadow-xl" 
            />
          </div>
        </div>
      </section>
      
      <section className="text-center mt-16">
         <h2 className="text-2xl md:text-3xl font-semibold mb-4 primary-text">Ready to Explore?</h2>
         <p className="text-md text-muted-foreground mb-6">
            Sign up today and let your child embark on a wonderful journey of communication with WonderChat!
         </p>
         <a href="/dashboard" className="inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 transition duration-150">
            Get Started
         </a>
      </section>
    </div>
  );
}