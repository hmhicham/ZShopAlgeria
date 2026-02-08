
import React from 'react';
import { ArrowRight, Star, Play } from 'lucide-react';
import { HeroContent } from '../types';

interface HeroProps {
  content: HeroContent;
}

export const Hero: React.FC<HeroProps> = ({ content }) => {
  return (
    <section className="relative overflow-hidden bg-[#003820] text-white">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Animated Mesh Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#003820] via-[#0A7D3E] to-[#003820] opacity-90" />

        {/* Vibrant Floating Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0A7D3E] rounded-full blur-[120px] animate-float opacity-40" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#FFD700] rounded-full blur-[150px] animate-float animation-delay-2000 opacity-20" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[#0A7D3E] rounded-full blur-[100px] animate-float animation-delay-4000 opacity-30" />

        {/* Glassmorphic Patterns */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30 L30 0 M30 30 L60 30 M30 30 L30 60 M30 30 L0 30' stroke='white' stroke-width='1' fill='none'/%3E%3C/svg%3E")`, backgroundSize: '60px 60px' }}
        />

        {/* Subtle Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content - Professional Left Side */}
          <div className="text-center lg:text-left space-y-8">
            {/* Trust Badge */}
            

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight">
                <span className="block">Votre Shopping</span>
                <span className="block mt-2">
                  <span className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent">Premium</span>
                  <span className="font-light text-white/90"> en Algérie</span>
                </span>
              </h1>
              
              {/* Arabic Tagline */}
              
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Découvrez notre collection exclusive de produits soigneusement sélectionnés. 
              Qualité garantie, livraison rapide et service client disponible 24/7.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => {
                  const productGrid = document.getElementById('product-grid');
                  if (productGrid) {
                    productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="group relative bg-white text-[#003820] font-bold py-4 px-8 rounded-full hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 overflow-hidden"
              >
                <span className="relative z-10">Explorer la Collection</span>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              {/*<button className="group border-2 border-white/30 text-white font-semibold py-4 px-8 rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2">
                <span>Nouveautés</span>
                <span className="bg-[#FF6B35] text-white text-xs font-bold px-2 py-1 rounded-full">NEW</span>
              </button>*/}
            </div>



            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-6 border-t border-white/10">
              <div className="flex -space-x-3">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" alt="Client" className="w-12 h-12 rounded-full border-3 border-[#003820] object-cover" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" alt="Client" className="w-12 h-12 rounded-full border-3 border-[#003820] object-cover" />
                
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" alt="Client" className="w-12 h-12 rounded-full border-3 border-[#003820] object-cover" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 mb-1">
                  <div className="flex text-[#FFD700]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-white font-bold ml-2">4.9</span>
                </div>
                <p className="text-white/60 text-sm">Plus de <span className="text-white font-semibold">50,000 clients</span> satisfaits</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative group lg:ml-auto">
            {/* The "Cadre" from the screenshot - a light decorative box behind */}
            <div className="absolute -top-6 -right-6 w-full h-full bg-white/10 rounded-[3rem] -z-10" />

            <div className="relative">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-2 border-white/20 bg-white p-2 animate-float-gentle max-w-sm mx-auto">
                <img
                  src={content.image}
                  alt="Shopping en Algérie"
                  className="w-full h-full object-cover rounded-[2rem]"
                />
              </div>

              {/* Refined Badges integrated with the cadre */}
              <div className="absolute -bottom-6 -left-4 bg-white rounded-2xl shadow-2xl p-4 text-center z-20 border border-slate-100">
                <div className="text-[#0A7D3E] font-black text-3xl leading-tight">-25%</div>
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">OFFRE SPÉCIALE</div>
              </div>

              <div className="absolute -top-6 -right-4 bg-[#FF6B35] rounded-2xl shadow-xl p-3 text-center z-20 border border-white/20">
                <div className="text-white text-3xl mb-1">⚡</div>
                <div className="text-white text-[10px] font-black uppercase tracking-widest leading-none">TOP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
