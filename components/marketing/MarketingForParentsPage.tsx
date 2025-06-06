
import * as React from 'react';
import { Link } from 'react-router-dom';

const MarketingForParentsPage: React.FC = () => {
  return (
    <div className="bg-slate-50"> 
      <section className="relative py-20 md:py-32 forparents-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern height="20" id="dots-forparents" patternUnits="userSpaceOnUse" width="20" x="0" y="0"><circle cx="2.5" cy="2.5" fill="#FFF" r="2.5"></circle></pattern></defs><rect fill="url(#dots-forparents)" height="100%" width="100%"></rect></svg>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6 drop-shadow-lg">
            Peace of Mind for Parents, <br className="hidden md:block"/>A World of Wonder for Kids
          </h1>
          <p className="text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">
            Discover how WonderChat provides a safe, engaging, and educational AI voice chat experience designed specifically for children aged 5-10.
          </p>
          <Link to="/login" className="forparents-gradient-cta inline-flex min-w-[180px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-8 mx-auto text-white text-lg font-semibold leading-normal tracking-[0.015em] shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <span className="truncate">Get Started Today</span>
          </Link>
        </div>
      </section>
      <div className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-10">
              <div className="flex items-start gap-6 p-6 bg-slate-50 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex-shrink-0 forparents-section-icon">
                  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 21C8.03 19.89 5 15.78 5 11.22V6.3L12 3.18V21Z"></path></svg>
                </div>
                <div>
                  <h2 className="text-[#111518] text-2xl font-bold leading-tight tracking-[-0.015em] mb-2">Safety &amp; Privacy First</h2>
                  <p className="text-slate-600 text-base font-normal leading-relaxed">
                    We employ robust security, end-to-end encryption, and strict data protection. Our AI is age-appropriate, filtering harmful content and adhering to child privacy regulations for a secure environment.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6 p-6 bg-slate-50 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex-shrink-0 forparents-section-icon">
                  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 2.5A3.5 3.5 0 0 0 14 6H10A3.5 3.5 0 0 0 6.5 2.5A3.5 3.5 0 0 0 3 6V21.5A.5.5 0 0 0 3.5 22H6V15H8V22H16V15H18V22H20.5A.5.5 0 0 0 21 21.5V6A3.5 3.5 0 0 0 17.5 2.5ZM16 13H8V8H16V13Z"></path></svg>
                </div>
                <div>
                  <h2 className="text-[#111518] text-2xl font-bold leading-tight tracking-[-0.015em] mb-2">Educational Benefits</h2>
                  <p className="text-slate-600 text-base font-normal leading-relaxed">
                    WonderChat fosters language development, critical thinking, and creativity. Engaging conversations and interactive activities expand vocabulary and improve communication, with AI adapting to each child's pace.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl">
              <img alt="Child engaging with WonderChat" className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9jjpjumO-Ah_XqgcXw0GbxntwArbU7bUltMlTKVxC4YxcoFDRSfC5QRAsN_xkrmgHNmNRjvUm1Wmr89hvJ485ZLu88sXQJHEpgybCMF9Rm9hMwgw9WR-gZ3HHtTiXq8LmkR4mykx8Psg7MCwH8VVelanwc8chXgbqxfgaMdBU0sijNq9DoytaUG3xrV63Sufuf-WmpFEoWBikSZFkDOdC5ZoRs_ZUTwD5SOrXWaWxB1nm_vJHAEGQnoHTuExl8eIo3CGB2nRBINI"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <h3 className="text-white text-2xl md:text-3xl font-semibold">Interactive Learning, Reimagined.</h3>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center mt-16 md:mt-24">
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl md:order-2">
              <img alt="Parent managing WonderChat settings" className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy2MeEX6UhKggqWLYU9FHBI_Qy0bXhGivtLARhezvH_zrY6s9lrCNcq-gdbX5xfCe_W-GQxW5-bBYpt9TvQgGSfcBscyb3X9z4GqI4dooirl48lZzV5b6rlTPopYZl1yGXrQ4YiYkhm4sesu2Bxx-N2rC9bfLSd3wYb8DEh7EAEBOQmHuALIvnJY4ndm5ZGe97NcZ8BgNHjnx36PNp-mUb3-9p7jS-OKa5Kdd4iVv1fqLISZPCY4YcsYbf7M_ZHOlsbcUeNb4q_Ro"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-0 right-0 p-6 md:p-8 text-right">
                <h3 className="text-white text-2xl md:text-3xl font-semibold">You're Always in Control.</h3>
              </div>
            </div>
            <div className="space-y-10 md:order-1">
              <div className="flex items-start gap-6 p-6 bg-slate-50 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex-shrink-0 forparents-section-icon">
                  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.78 11.78L13.22 5.22C12.83 4.83 12.2 4.83 11.81 5.22L5.25 11.78C4.86 12.17 4.86 12.8 5.25 13.19L11.81 19.75C12.2 20.14 12.83 20.14 13.22 19.75L19.78 13.19C20.17 12.8 20.17 12.17 19.78 11.78ZM7 12.5L12.5 7L18 12.5L12.5 18L7 12.5Z"></path></svg>
                </div>
                <div>
                  <h2 className="text-[#111518] text-2xl font-bold leading-tight tracking-[-0.015em] mb-2">How to Get Started</h2>
                  <p className="text-slate-600 text-base font-normal leading-relaxed">
                    Download the app, create a parent account, and set up your child's profile. Our intuitive interface makes it easy for kids to navigate and begin their learning adventure.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6 p-6 bg-slate-50 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex-shrink-0 forparents-section-icon">
                  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 7C16 9.21 14.21 11 12 11S8 9.21 8 7C8 4.79 9.79 3 12 3S16 4.79 16 7ZM12 13C14.67 13 20 14.34 20 17V20H4V17C4 14.34 9.33 13 12 13Z"></path></svg>
                </div>
                <div>
                  <h2 className="text-[#111518] text-2xl font-bold leading-tight tracking-[-0.015em] mb-2">Parental Controls</h2>
                  <p className="text-slate-600 text-base font-normal leading-relaxed">
                    Monitor activity, set time limits, and customize experiences. Review conversation history, manage features, and receive notifications, empowering independent learning with peace of mind.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="py-16 md:py-24 bg-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[#111518] text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em] mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">Got questions? We've got answers. Check out some common queries below.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            <details className="faq-item group rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md">
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 list-none">
                <p className="text-[#111518] text-base md:text-lg font-semibold">Is WonderChat safe for my child?</p>
                <div className="text-slate-500 group-open:rotate-180 transition-transform duration-300">
                  <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
              </summary>
              <div className="px-5 pb-5">
                <p className="text-slate-600 text-sm md:text-base font-normal leading-relaxed">
                  Absolutely! Child safety is our utmost priority. We use advanced AI moderation, end-to-end encryption, and comply with all child data privacy laws like COPPA. Parents also have robust controls.
                </p>
              </div>
            </details>
            <details className="faq-item group rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md">
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 list-none">
                <p className="text-[#111518] text-base md:text-lg font-semibold">What age range is WonderChat suitable for?</p>
                <div className="text-slate-500 group-open:rotate-180 transition-transform duration-300">
                  <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
              </summary>
              <div className="px-5 pb-5">
                <p className="text-slate-600 text-sm md:text-base font-normal leading-relaxed">
                  WonderChat is designed for children aged 5 to 10 years old. The content and conversation complexity are tailored to this developmental stage.
                </p>
              </div>
            </details>
            <details className="faq-item group rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md">
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 list-none">
                <p className="text-[#111518] text-base md:text-lg font-semibold">How does WonderChat support my child's learning?</p>
                <div className="text-slate-500 group-open:rotate-180 transition-transform duration-300">
                  <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
              </summary>
              <div className="px-5 pb-5">
                <p className="text-slate-600 text-sm md:text-base font-normal leading-relaxed">
                  WonderChat promotes vocabulary expansion, critical thinking, storytelling, and conversational skills through interactive AI dialogues and age-appropriate educational content.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-[#111518] text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em] mb-6">Ready to Empower Your Child's Curiosity?</h2>
          <p className="text-slate-600 text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Join thousands of parents who trust WonderChat to provide a safe and enriching digital playground for their children.
          </p>
          <Link to="/login" className="forparents-gradient-cta inline-flex min-w-[200px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-8 mx-auto text-white text-lg font-semibold leading-normal tracking-[0.015em] shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <span className="truncate">Sign Up for WonderChat</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MarketingForParentsPage;
