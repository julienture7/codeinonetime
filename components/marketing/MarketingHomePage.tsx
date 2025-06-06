import * as React from 'react';
import { Link } from 'react-router-dom';

const MarketingHomePage: React.FC = () => {
  return (
    <>
      <section className="marketing-bg-hero-gradient bg-cover bg-center">
        <div className="px-6 md:px-10 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-[-0.033em] mb-6">Unlock Your Child's Voice with WonderChat</h1>
            <p className="text-white text-base sm:text-lg md:text-xl font-normal leading-normal mb-8">
              Empower your child's communication skills with our AI-powered voice chat app. Safe, educational, and fun, WonderChat helps children aged 5-10 express
              themselves confidently.
            </p>
            <Link to="/login" className="inline-flex min-w-[150px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 sm:h-14 sm:px-8 marketing-btn-primary text-base sm:text-lg font-bold leading-normal tracking-[0.015em] transition-opacity shadow-lg">
              <span className="truncate">Get Started Free</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="px-6 md:px-10 max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[#111518] text-3xl sm:text-4xl font-bold leading-tight tracking-[-0.015em] mb-4">Why Choose WonderChat?</h2>
            <p className="text-[#637c88] text-base sm:text-lg font-normal leading-normal max-w-2xl mx-auto">Discover the benefits of WonderChat for your child's development.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4 rounded-xl border border-[#dce2e5] bg-white p-6 shadow-md marketing-hover-lift transition-all duration-300">
              <div className="marketing-text-primary size-10 p-2 bg-sky-100 rounded-full flex items-center justify-center">
                <svg fill="currentColor" height="32px" viewBox="0 0 256 256" width="32px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"></path>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[#111518] text-xl font-bold leading-tight">Safe &amp; Secure</h3>
                <p className="text-[#637c88] text-sm font-normal leading-normal">
                  Our app prioritizes your child's safety with strict privacy measures and age-appropriate content.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-[#dce2e5] bg-white p-6 shadow-md marketing-hover-lift transition-all duration-300">
              <div className="marketing-text-primary size-10 p-2 bg-sky-100 rounded-full flex items-center justify-center">
                <svg fill="currentColor" height="32px" viewBox="0 0 256 256" width="32px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M224,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h64a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64Z"></path>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[#111518] text-xl font-bold leading-tight">Educational Content</h3>
                <p className="text-[#637c88] text-sm font-normal leading-normal">WonderChat offers a range of educational activities and stories to enhance learning.</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-[#dce2e5] bg-white p-6 shadow-md marketing-hover-lift transition-all duration-300">
              <div className="marketing-text-primary size-10 p-2 bg-sky-100 rounded-full flex items-center justify-center">
                <svg fill="currentColor" height="32px" viewBox="0 0 256 256" width="32px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[#111518] text-xl font-bold leading-tight">Fun &amp; Engaging</h3>
                <p className="text-[#637c88] text-sm font-normal leading-normal">Children will love interacting with our friendly AI and exploring exciting voice chat features.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="px-6 md:px-10 max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[#111518] text-3xl sm:text-4xl font-bold leading-tight tracking-[-0.015em]">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex items-center justify-center size-16 rounded-full bg-sky-100 marketing-text-primary border-2 marketing-border-primary shadow-lg">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-[#111518] text-xl font-medium leading-normal mb-2">Parents Sign Up</h3>
              <p className="text-[#637c88] text-sm font-normal leading-normal">Easily create an account and set up your child's profile.</p>
              <img alt="Download App Illustration" className="mt-6 w-32 h-32 object-contain" src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=300&fit=crop&crop=center&auto=format&q=80"/>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex items-center justify-center size-16 rounded-full bg-sky-100 marketing-text-primary border-2 marketing-border-primary shadow-lg">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-[#111518] text-xl font-medium leading-normal mb-2">Personalize Experience</h3>
              <p className="text-[#637c88] text-sm font-normal leading-normal">Set up your child's name for the AI and choose a voice.</p>
              <img alt="Create Profile Illustration" className="mt-6 w-32 h-32 object-contain" src="https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=300&h=300&fit=crop&crop=center&auto=format&q=80"/>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex items-center justify-center size-16 rounded-full bg-sky-100 marketing-text-primary border-2 marketing-border-primary shadow-lg">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-[#111518] text-xl font-medium leading-normal mb-2">Start Chatting</h3>
              <p className="text-[#637c88] text-sm font-normal leading-normal">Let your child explore and interact with our AI voice assistant.</p>
              <img alt="Start Chatting Illustration" className="mt-6 w-32 h-32 object-contain" src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=300&h=300&fit=crop&crop=center&auto=format&q=80"/>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="px-6 md:px-10 max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[#111518] text-3xl sm:text-4xl font-bold leading-tight tracking-[-0.015em] mb-4">Explore Exciting Features</h2>
            <p className="text-[#637c88] text-base sm:text-lg font-normal leading-normal max-w-2xl mx-auto">
              WonderChat offers a variety of features to keep your child entertained and learning.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4 rounded-xl overflow-hidden bg-white shadow-lg marketing-hover-lift transition-all duration-300">
              <div className="w-full h-56 bg-center bg-no-repeat bg-cover" style={{backgroundImage: `url("https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop&crop=center&auto=format&q=80")`}}></div>
              <div className="p-6">
                <h3 className="text-[#111518] text-xl font-medium leading-normal mb-2">Interactive Voice Games</h3>
                <p className="text-[#637c88] text-sm font-normal leading-normal">
                  Engage your child with fun and educational voice-based games that promote learning and creativity.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl overflow-hidden bg-white shadow-lg marketing-hover-lift transition-all duration-300">
              <div className="w-full h-56 bg-center bg-no-repeat bg-cover" style={{backgroundImage: `url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center&auto=format&q=80")`}}></div>
              <div className="p-6">
                <h3 className="text-[#111518] text-xl font-medium leading-normal mb-2">Storytelling Adventures</h3>
                <p className="text-[#637c88] text-sm font-normal leading-normal">Immerse your child in captivating stories and adventures narrated by our AI voice assistant.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="px-6 md:px-10 max-w-3xl mx-auto text-center">
          <h2 className="text-[#111518] text-3xl sm:text-4xl font-bold leading-tight tracking-[-0.015em] mb-8">What Parents Say</h2>
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <p className="text-[#111518] text-base italic font-normal leading-relaxed mb-3">
                "My daughter loves WonderChat! It's a safe and fun way for her to practice her communication skills. The interactive stories are her favorite!"
              </p>
              <p className="text-[#637c88] text-sm font-medium">- Sarah M., Parent</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <p className="text-[#111518] text-base italic font-normal leading-relaxed mb-3">
                "WonderChat has helped my son become more confident in expressing himself. The educational content is a great bonus, and I love the parent controls!"
              </p>
              <p className="text-[#637c88] text-sm font-medium">- David L., Parent</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 marketing-bg-primary">
        <div className="px-6 md:px-10 max-w-3xl mx-auto text-center" style={{ backgroundColor: '#30abe8' }}>
          <h2 className="text-white text-3xl sm:text-4xl font-bold leading-tight tracking-[-0.015em] mb-6">Ready to Unlock Your Child's Voice?</h2>
          <p className="text-white/90 text-base sm:text-lg font-normal leading-normal mb-8">Join thousands of parents who trust WonderChat for their child's development and fun.</p>
          <Link to="/login" className="inline-flex min-w-[150px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 sm:h-14 sm:px-8 bg-white marketing-text-primary text-base sm:text-lg font-bold leading-normal tracking-[0.015em] hover:bg-gray-100 transition-colors shadow-lg">
            <span className="truncate">Get Started Free</span>
          </Link>
        </div>
      </section>
    </>
  );
};

export default MarketingHomePage;
