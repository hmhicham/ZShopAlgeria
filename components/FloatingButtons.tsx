
import React, { useState, useEffect } from 'react';
import { MessageCircle, ArrowUp, X } from 'lucide-react';

export const FloatingButtons: React.FC = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [showWhatsAppTooltip, setShowWhatsAppTooltip] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openWhatsApp = () => {
        window.open('https://wa.me/213555555500?text=Bonjour, je suis intéressé par vos produits!', '_blank');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            {/* Back to Top */}
            <button
                onClick={scrollToTop}
                className={`w-12 h-12 bg-[#003820] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#0A7D3E] transition-all duration-300 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
            >
                <ArrowUp size={20} />
            </button>

            {/* WhatsApp Button */}
            <div className="relative">
                {showWhatsAppTooltip && (
                    <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-white text-slate-900 px-4 py-2 rounded-xl shadow-lg text-sm font-bold whitespace-nowrap animate-fadeIn">
                        <button
                            onClick={() => setShowWhatsAppTooltip(false)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center"
                        >
                            <X size={12} />
                        </button>
                        Besoin d'aide? Contactez-nous!
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-white rotate-45"></div>
                    </div>
                )}

                <button
                    onClick={openWhatsApp}
                    onMouseEnter={() => setShowWhatsAppTooltip(true)}
                    onMouseLeave={() => setShowWhatsAppTooltip(false)}
                    className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 animate-bounce-slow"
                >
                    <MessageCircle size={26} fill="white" />
                </button>
            </div>
        </div>
    );
};
