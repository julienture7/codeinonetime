
import * as React from 'react';

const MarketingAboutPage: React.FC = () => {
  return (
    <div className="py-12 px-6 md:px-10 lg:px-20 bg-white"> {/* Enforce white background */}
      <div className="mx-auto max-w-4xl">
        <section className="mb-16 text-center">
          <h1 className="text-slate-900 text-5xl font-bold leading-tight tracking-tight mb-6">About WonderChat</h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto">
            Discover the story behind WonderChat and our commitment to creating a magical and educational experience for children.
          </p>
        </section>
        <section className="mb-16 p-8 bg-slate-50 rounded-xl shadow-lg">
          <h2 className="about-text-primary text-3xl font-bold leading-tight tracking-tight mb-4" style={{ color: '#30abe8' }}>Our Mission</h2>
          <p className="text-slate-700 text-lg leading-relaxed">
            At WonderChat, our mission is to create a safe and engaging environment where children aged 5-10 can explore their imagination and develop their communication skills
            through AI-powered voice chat. We aim to foster creativity, curiosity, and a love for learning in young minds.
          </p>
        </section>
        <section className="mb-16 p-8 bg-sky-50 rounded-xl shadow-lg">
          <h2 className="about-text-primary text-3xl font-bold leading-tight tracking-tight mb-4" style={{ color: '#30abe8' }}>Our Vision</h2>
          <p className="text-slate-700 text-lg leading-relaxed">
            Our vision is to become the leading platform for children's voice-based learning and entertainment. We envision a future where WonderChat empowers children worldwide to
            express themselves, learn new things, and connect with others in a positive and enriching way.
          </p>
        </section>
        <section className="mb-16">
          <h2 className="text-slate-900 text-3xl font-bold leading-tight tracking-tight mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="p-4 bg-[#30abe8] rounded-full mb-4 inline-block">
                <span className="material-symbols-outlined text-white text-4xl">security</span>
              </div>
              <h3 className="text-slate-900 text-xl font-bold leading-tight mb-2">Safety First</h3>
              <p className="text-slate-600 text-base leading-relaxed">
                We prioritize the safety and well-being of our young users. Our platform is designed with robust security measures and parental controls to ensure a secure and
                supervised experience.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="p-4 bg-[#30abe8] rounded-full mb-4 inline-block">
                <span className="material-symbols-outlined text-white text-4xl">child_care</span>
              </div>
              <h3 className="text-slate-900 text-xl font-bold leading-tight mb-2">Child-Centric</h3>
              <p className="text-slate-600 text-base leading-relaxed">
                We are dedicated to creating content and features that are specifically tailored to the needs and interests of children. Our approach is playful, educational, and
                always age-appropriate.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="p-4 bg-[#30abe8] rounded-full mb-4 inline-block">
                <span className="material-symbols-outlined text-white text-4xl">emoji_objects</span>
              </div>
              <h3 className="text-slate-900 text-xl font-bold leading-tight mb-2">Innovation</h3>
              <p className="text-slate-600 text-base leading-relaxed">
                We embrace innovation to continuously improve and enhance the WonderChat experience. We are committed to exploring new technologies and creative ideas to keep our
                platform fresh and engaging.
              </p>
            </div>
          </div>
        </section>
        <section className="p-8 bg-amber-50 rounded-xl shadow-lg">
          <h2 className="text-amber-500 text-3xl font-bold leading-tight tracking-tight mb-4">Our Team</h2>
          <p className="text-slate-700 text-lg leading-relaxed">
            Our team is composed of passionate educators, technologists, and creatives who are dedicated to making a positive impact on children's lives. We believe in the power of
            technology to inspire and educate, and we are excited to bring WonderChat to young learners everywhere. (Team information coming soon!)
          </p>
        </section>
      </div>
    </div>
  );
};

export default MarketingAboutPage;
