
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
              <img alt="Download App Illustration" className="mt-6 w-32 h-32 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsw5srLF-yAoHWp5_2SQSuwlZ-z7_MZosuYbVmqYRxG51a2ayv_fqtVdNpyatZG-P5T5FdnB4ZDe86EfGMYZoIyHjfvyvtdtYb0ev-dsZNwGGOyDCkyhCuc0-vnX75AEzv1UDSAEi8WOKYSWrbG4gjbqcJULvCI9T4gLkofRVtjZMqaZFZDtYR-k7FYfaiVh6R2orHVETDl-HWMyiXokjEXnTtVGCVbnlHRIkccpHzIaWH_4ok607gSBebc7Izq1NXdhwFeSv77no"/>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex items-center justify-center size-16 rounded-full bg-sky-100 marketing-text-primary border-2 marketing-border-primary shadow-lg">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-[#111518] text-xl font-medium leading-normal mb-2">Personalize Experience</h3>
              <p className="text-[#637c88] text-sm font-normal leading-normal">Set up your child's name for the AI and choose a voice.</p>
              <img alt="Create Profile Illustration" className="mt-6 w-32 h-32 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdzb-HQjf4uxhkB3t-MJ0ugN643_EB-U8-DTRNicQp20NSeeTjSoNzep0_-dHjc1M6wJkqS9-SVP2d88T7YL3ZOblhVeahcv80TwzGjgCi1CJiQ-5MNBPyaXrN_dz26D3lQlO9F09J49MbvWH1KSaf9e7TAp1qLKARAExc54XXNC-XYdxReiLBt_CtfQizFDQtRSsp_r-9a8JwlEtJ_P45dxqKvM6II3G2lQELgR6GS2avBA9zKm_oqysicw_HHrZhkrV5n6GDImo"/>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex items-center justify-center size-16 rounded-full bg-sky-100 marketing-text-primary border-2 marketing-border-primary shadow-lg">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-[#111518] text-xl font-medium leading-normal mb-2">Start Chatting</h3>
              <p className="text-[#637c88] text-sm font-normal leading-normal">Let your child explore and interact with our AI voice assistant.</p>
              <img alt="Start Chatting Illustration" className="mt-6 w-32 h-32 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHhDs7tqOiuOGlkD9Feb_w7QYJuci8PjuUhk6kTyNkqXyww_BTA1YSS2lED1M5EZDTojazzApr1XdNKF9Yr-HVNkO4yDwtbzv9s5b5kGCg_e1cI8MGG82h14FFF7pE-rj0wjOzRw9xbnsllJDsPmlXdtyI2K0hFcGTVnRMJbPzb4qFQFkiZgOnfQdyI0UVJNFsl7woS_ptUgShZiFC_0FQuC9yX78kKS9owRf-RYVRREfeUrU9bprVKIQf_6wUcl9OC3YjFNpzc50"/>
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
              <div className="w-full h-56 bg-center bg-no-repeat bg-cover" style={{backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDlfLu8Y4N4_9fsaPd8DKs9JoFoKvfFyg4iOIhESEi84V1qKuI34785BPZF-2hlRBl3qhp0P6XA7St-mE-pwgcQB3jxNRHsyNUeMzs5r706Hr6-us_h8WSdC1KMPye3vZP89JOhR3fcx5UpfsNhjaLw5-Cm1YDtfHRV79qENaF3v8PLOPOsW3rDpobk4WmBseJydYnhVx1LwafNknuqZCRzK5LR8Ya-FxZzM-CTyuzPaSHM5zkrULk49E4FLUfBzXtv9ioy32ezEoA")`}}></div>
              <div className="p-6">
                <h3 className="text-[#111518] text-xl font-medium leading-normal mb-2">Interactive Voice Games</h3>
                <p className="text-[#637c88] text-sm font-normal leading-normal">
                  Engage your child with fun and educational voice-based games that promote learning and creativity.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl overflow-hidden bg-white shadow-lg marketing-hover-lift transition-all duration-300">
              <div className="w-full h-56 bg-center bg-no-repeat bg-cover" style={{backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAZK3n0qoPGd7HhyXTjtY_sxPCwJ2nwDsT8Ad4nUiPUJGKs-BPQ5nFkg1fyaZAp_QyaJinmEe1sztdoDTuOUbVATzDURPaKvNrY95doLeZ8BBK7S3Va8hqux2Szl1nkFOXjd3GEMzFBMe7HYZbWkzk7Q3kO9b8KVTVGM8DGlKKjOYXOR684y9sMcJpWKkAVm-7zCWi10w_tZ_TuB40w98wTwqW15yOUf5JJiM8Ak1TNU5Jtsfz6QCl5s3BJry_Fo6scptk4-W88idU")`}}></div>
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
