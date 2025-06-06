
import * as React from 'react';
import { Link } from 'react-router-dom';

const MarketingFeaturesPage: React.FC = () => {
  return (
    <div className="bg-white"> 
      <section className="py-16 md:py-24 features-gradient-bg">
        <div className="container mx-auto px-6 md:px-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-[#111518] text-4xl md:text-5xl font-bold leading-tight tracking-[-0.02em] mb-6">
              Empowering Young Minds Through <span className="features-text-primary" style={{ color: '#30abe8' }}>Voice</span>
            </h1>
            <p className="text-[#4A5568] text-lg md:text-xl leading-relaxed mb-8">
              WonderChat offers a unique blend of fun and learning, designed to nurture your child's communication skills in a safe and engaging environment.
            </p>
            <Link to="/login" className="inline-flex min-w-[160px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-[#30abe8] text-white text-lg font-bold leading-normal tracking-[0.015em] hover:bg-[#2894c9] transition-colors shadow-lg hover:shadow-xl transform hover:scale-105">
              <span className="truncate">Get Started Free</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 md:px-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[#111518] text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em]">Discover the Magic of WonderChat</h2>
            <p className="text-[#4A5568] text-lg mt-4 max-w-2xl mx-auto">Our innovative features make learning an adventure.</p>
          </div>
          <div className="space-y-16 md:space-y-24">
            {/* Feature Card 1 */}
            <div className="feature-card flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="md:w-1/2 relative feature-image">
                <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105">
                  <img alt="Interactive Voice Chat Illustration" className="object-cover w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAb70GFcc1L4AMjIT78O_h46Aflg4qiDV7sLocHfSr7Q4pD-AmOp2AQuv_6OCfPI4bAZ9ESVqEWAKuO7KQdmFAFrmKneqZ1XBJUjBebrT55xpf2AzIY40wTGQOVma8T9Tfm5gXxSLiHN1A8bRQ-7Y75NrEg1X4rCUKqLHsITyfw8wb2bmJZzlC-0tCJWxhdZa5joD9JGQtCEM9Kt6jEZ9CqnDPfCnjRzxa2FT8yRgsaTeAGeOSvKR3dScp5wEs6LQwtMcOlnV2i-V8"/>
                </div>
                <div className="absolute -top-6 -left-6 size-16 bg-[#FFD700] rounded-full flex items-center justify-center text-white text-2xl shadow-lg animate-pulse">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
              </div>
              <div className="md:w-1/2 feature-text">
                <h3 className="text-[#111518] text-2xl md:text-3xl font-bold mb-4">Interactive Voice Chat</h3>
                <p className="text-[#4A5568] text-lg leading-relaxed mb-6">
                  Engage in natural, voice-based conversations with our friendly AI characters. This helps children practice speaking, listening, and expressing themselves clearly, fostering confidence and verbal fluency.
                </p>
                <Link className="features-text-primary font-semibold text-lg hover:underline" to="#" style={{ color: '#30abe8' }}>Learn More →</Link>
              </div>
            </div>
            {/* Feature Card 2 */}
            <div className="feature-card flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="md:w-1/2 relative feature-image md:order-2"> 
                    <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105">
                    <img alt="Adaptive Dialogue Illustration" className="object-cover w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDstEddFIxrspK35igrHnfoMPLPIu-nPxGtty0PTloNjnpjYmSjw3aWweH1hydah8nQqqFdWHDybXr92rIfZE1zJ762CXP_ixbnKZ5OafFAuDntMdtFHKD3KFwJ1Xs4dcWCvoQgztTv2gltzI_bauZXxNEOSuAbdJjZDqqrzr8Hb2uuLwvhh5NrmOLWc_k0N8tMf3WLEmVLroIVsXk3P4F3K-rHRLMJLPzmXeUc7htF32AEiHZCWVOJCIdDt3rMae3D_olePgfPu70"/>
                    </div>
                    <div className="absolute -top-6 -right-6 size-16 bg-[#34D399] rounded-full flex items-center justify-center text-white text-2xl shadow-lg animate-pulse">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.875 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.125 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12h.008v.008h-.008V12zm0 0h.008v.008h-.008V12zm0 0h.008v.008h-.008V12zm0 0h.008v.008h-.008V12z" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    </div>
                </div>
                <div className="md:w-1/2 feature-text md:order-1"> 
                    <h3 className="text-[#111518] text-2xl md:text-3xl font-bold mb-4">Adaptive Dialogue</h3>
                    <p className="text-[#4A5568] text-lg leading-relaxed mb-6">
                    Our AI doesn't just talk; it listens! Conversations dynamically adapt to your child's responses, interests, and learning pace, ensuring each interaction is uniquely engaging and educational.
                    </p>
                    <Link className="features-text-primary font-semibold text-lg hover:underline" to="#" style={{ color: '#30abe8' }}>Learn More →</Link>
                </div>
            </div>
             {/* Feature Card 3 */}
            <div className="feature-card flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="md:w-1/2 relative feature-image">
                <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105">
                  <img alt="Communication Skill Building Illustration" className="object-cover w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-7E8gmlqHDPJbGQpwZyZDbWRIo96iIzzuT_upzHU29IZ0Hc115oLtF12EmPmimAkXE01se7JWqxFxHFZvfPM2XJboyrpyKRnA5N0ZOTyTE2OwtoUhkCM77FP6_q4V23Afyq1Il3ZnuGRZKZiRl7J9JvXfN-YxHy3oExaUAQ5tQmpiGm-sgALA74uWQjhBHfxb9X7lmm8Vy5oKhi0xaWMeR46sFZqn8O-YPBW6Jq3paDw9J-gdVym0cccZmhk56y4Sz9ffwyq_Wao"/>
                </div>
                <div className="absolute -bottom-6 -left-6 size-16 bg-[#FB923C] rounded-full flex items-center justify-center text-white text-2xl shadow-lg animate-pulse">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
              </div>
              <div className="md:w-1/2 feature-text">
                <h3 className="text-[#111518] text-2xl md:text-3xl font-bold mb-4">Communication Skill Building</h3>
                <p className="text-[#4A5568] text-lg leading-relaxed mb-6">
                  WonderChat helps develop crucial communication skills such as active listening, clear articulation, storytelling, and expressing emotions appropriately, all within a fun and supportive context.
                </p>
                <Link className="features-text-primary font-semibold text-lg hover:underline" to="#" style={{ color: '#30abe8' }}>Learn More →</Link>
              </div>
            </div>
            {/* Feature Card 4 */}
            <div className="feature-card flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="md:w-1/2 relative feature-image md:order-2">
                    <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105">
                    <img alt="Safe & Moderated Environment Illustration" className="object-cover w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8ncrnvFng51fQFiBn3lsMS9eskqdltT0vbtLJ9LUJ8MIcjgHyq426USBGzrCq5ufOW205URA0utm_VwfQN_rTjsps5Nqz9_rJe91C6ogGsNvXH6VQbAwzY9ytgpvuCjwRh1jcFxcrfZmj4STFhUqMP5ZQIfyZ1CClAOLheO6RibG5DTb64WAth9JBlLwX77cJf_O9fhuC_8DWF9qwyust9lbJgiy9R0-4pNazVtGIDAOaMjk_6meKozljPAhhgOjkbTKYc2-2LgQ"/>
                    </div>
                    <div className="absolute -bottom-6 -right-6 size-16 bg-[#F472B6] rounded-full flex items-center justify-center text-white text-2xl shadow-lg animate-pulse">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    </div>
                </div>
                <div className="md:w-1/2 feature-text md:order-1">
                    <h3 className="text-[#111518] text-2xl md:text-3xl font-bold mb-4">Safe &amp; Moderated Environment</h3>
                    <p className="text-[#4A5568] text-lg leading-relaxed mb-6">
                    Your child's safety is our top priority. We employ robust content moderation and safety protocols to ensure all interactions are positive, age-appropriate, and constructive.
                    </p>
                    <Link className="features-text-primary font-semibold text-lg hover:underline" to="#" style={{ color: '#30abe8' }}>Learn More →</Link>
                </div>
            </div>

          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-6 md:px-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[#111518] text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em]">The Technology Behind the Wonder</h2>
            <p className="text-[#4A5568] text-lg mt-4 max-w-2xl mx-auto">
              WonderChat leverages cutting-edge AI to create a truly interactive and personalized learning experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <img alt="AI Technology Illustration" className="rounded-xl shadow-2xl w-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc8Axjigmd8N1jLlyxhzuG2MPhG0e5y1ZctQUHfhXgXelcjoVVDieayNG1kQ9tLUJZqGnHcaDtN5APw1aFAWMgtcx8G4F3NGtFuQI1f2eTTeDOuy5sQ1VhzLFegJ_H6IzoQcNXuLnlgmzaIyWv9QtK2AGcOg8liW9O42ZBEpM-OKVSVI08lFjmEmQQBTzoyg50QznGU36MkP0-Djti1H-OwEESWgLWyuKFnrj4eX1XLMxbb0ZU8BN9mcmq8PB-LJNvrfi7U2PxuGA"/>
            </div>
            <div>
              <h3 className="text-[#111518] text-2xl font-semibold mb-4">Advanced AI, Child-Friendly Interface</h3>
              <p className="text-[#4A5568] text-lg leading-relaxed mb-4">
                Our sophisticated AI models are trained to understand and respond to children's speech patterns, nuances, and even their imaginative stories. This allows for natural conversations that feel real and engaging.
              </p>
              <p className="text-[#4A5568] text-lg leading-relaxed">
                We've wrapped this powerful technology in a simple, intuitive, and colorful interface that kids love, making learning feel like play.
              </p>
              <ul className="mt-6 space-y-3 text-[#4A5568] text-lg">
                <li className="flex items-center"><svg className="w-5 h-5 features-text-primary mr-2" style={{ color: '#30abe8' }} fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path></svg>Real-time speech recognition &amp; NLU</li>
                <li className="flex items-center"><svg className="w-5 h-5 features-text-primary mr-2" style={{ color: '#30abe8' }} fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path></svg>Personalized learning paths</li>
                <li className="flex items-center"><svg className="w-5 h-5 features-text-primary mr-2" style={{ color: '#30abe8' }} fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path></svg>COPPA compliant and secure</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-[#30abe8] text-white">
        <div className="container mx-auto px-6 md:px-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">Ready to Unlock Your Child's Potential?</h2>
          <p className="text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Join thousands of parents who are helping their children become confident communicators with WonderChat.
          </p>
          <Link to="/login" className="inline-flex min-w-[200px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 bg-white text-[#30abe8] text-lg font-bold leading-normal tracking-[0.015em] hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105">
            <span className="truncate">Download the App Now</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MarketingFeaturesPage;
