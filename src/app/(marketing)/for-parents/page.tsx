
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'; // Corrected relative path
import { Lock, Heart, Users, BarChart2, CheckSquare } from 'lucide-react';
import Image from 'next/image';

const parentPoints = [
  {
    icon: Lock,
    title: "Safety First",
    description: "WonderChat is designed with your child's safety as our top priority. We use content filtering and secure technologies to create a protected space. All data handling is COPPA compliant.",
  },
  {
    icon: Heart,
    title: "Nurturing Environment",
    description: "Our AI is programmed to be encouraging, patient, and positive, fostering a supportive atmosphere for your child to practice speaking and build confidence without judgment.",
  },
  {
    icon: Users,
    title: "You're in Control",
    description: "As a parent, you manage the account, set up your child's profile (just their first name for personalization), and initiate chat sessions. You decide when and how your child uses WonderChat.",
  },
  {
    icon: BarChart2,
    title: "Skill Development Focus",
    description: "WonderChat isn't just a toy; it's a tool. Conversations are subtly guided to encourage vocabulary expansion, better sentence construction, and improved social understanding.",
  },
  {
    icon: CheckSquare,
    title: "Easy to Use",
    description: "A simple, intuitive interface for both parents and children makes getting started and using WonderChat a breeze. No complicated setups or instructions.",
  },
];

export default function ForParentsPage() {
  return (
    <div className="container py-12 md:py-20">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 primary-text">WonderChat: A Partner for Parents</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          We understand that as a parent, your child&apos;s development and safety are paramount. Here&apos;s how WonderChat is designed with you and your child in mind.
        </p>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {parentPoints.map((point) => (
          <Card key={point.title} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <point.icon className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">{point.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground flex-grow">
              {point.description}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="bg-muted/30 p-8 md:p-12 rounded-lg mb-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
           <div className="flex justify-center md:order-last">
            <Image 
              src="https://picsum.photos/seed/wonderchatParent/450/350" 
              alt="Parent and child interacting with a tablet" 
              width={450} 
              height={350} 
              className="rounded-lg shadow-xl" 
            />
          </div>
          <div className="md:order-first">
            <h2 className="text-3xl font-semibold mb-4">Tips for Getting Started</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Introduce WonderChat together:</strong> Explain to your child that they&apos;ll be talking to a friendly AI character.</li>
              <li><strong>Be present initially:</strong> Especially for younger children, your presence can make them feel more comfortable during their first few sessions.</li>
              <li><strong>Encourage exploration:</strong> Let your child lead the conversation and explore different topics with the AI.</li>
              <li><strong>Discuss their experience:</strong> After a session, talk to your child about what they discussed and learned. This reinforces their learning.</li>
              <li><strong>Set healthy screen time limits:</strong> While WonderChat is educational, balance is key. Integrate it as part of a varied routine.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 primary-text">Have Questions?</h2>
        <p className="text-md text-muted-foreground mb-6 max-w-xl mx-auto">
          We&apos;re here to help! Visit our FAQ page or contact our support team for any inquiries you might have.
        </p>
        {/* <Button asChild variant="outline">
          <Link href="/faq">View FAQs</Link>
        </Button> */}
        <a href="mailto:support@wonderchat.example.com" className="inline-block px-6 py-3 ml-3 border border-primary text-primary font-semibold rounded-lg shadow-sm hover:bg-primary/5 transition duration-150">
          Contact Support
        </a>
      </section>
    </div>
  );
}