
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
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Votre <span className="gradient-text-gold">Shopping</span><br />
              <span className="arabic-decoration font-arabic text-3xl md:text-4xl lg:text-5xl">تسوق مميز</span> en Algérie
            </h1>
            <p className="text-xl md:text-2xl mb-10 font-light max-w-lg opacity-90 mx-auto lg:mx-0">
              Découvrez des milliers de produits avec livraison express partout en Algérie
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button className="bg-white text-[#0A7D3E] font-bold py-4 px-8 rounded-full hover:shadow-xl transition-all duration-300 glow-on-hover hover:scale-105 flex items-center gap-2">
                <span>Boutique Maintenant</span>
                <ArrowRight size={20} />
              </button>
              <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-[#0A7D3E] transition-all duration-300 hover:scale-105 flex items-center gap-2">
                <Play size={20} />
                <span>Voir la Vidéo</span>
              </button>
            </div>

            {/* Customer Stats */}
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-3">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" alt="" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" alt="" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                <img src="https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop&crop=face" alt="" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
              </div>
              <div className="text-left">
                <div className="flex text-[#FFD700]">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" className="opacity-50" />
                </div>
                <p className="text-sm opacity-85">4.8/5 par 12K clients</p>
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
