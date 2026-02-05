
import React, { useState } from 'react';
import {
    ShoppingCart,
    MapPin,
    Phone,
    Mail,
    Facebook,
    Instagram,
    Send,
    CreditCard,
    HeadphonesIcon
} from 'lucide-react';

interface FooterProps {
    setView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <footer id="footer" className="bg-[#003820] text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#0A7D3E] to-[#FFD700] rounded-xl flex items-center justify-center">
                                <ShoppingCart size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">
                                    <span className="text-[#FFD700]">ZShop</span>Algeria
                                </h3>
                            </div>
                        </div>
                        <p className="text-white/60 text-xs leading-relaxed max-w-xs">
                            Votre destination shopping premium en Algérie. Qualité, rapidité et service client exceptionnel.
                        </p>
                        <div className="flex gap-2">
                            <a href="#" className="w-8 h-8 bg-white/10 hover:bg-[#0A7D3E] rounded-lg flex items-center justify-center transition-all">
                                <Facebook size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 bg-white/10 hover:bg-[#0A7D3E] rounded-lg flex items-center justify-center transition-all">
                                <Instagram size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Support & Contact */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-[#FFD700] rounded-full"></span>
                            Support Client
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#0A7D3E]/20 rounded-lg flex items-center justify-center shrink-0">
                                    <CreditCard size={14} className="text-[#FFD700]" />
                                </div>
                                <div>
                                    <h5 className="text-[11px] font-bold">Paiement à la Livraison</h5>
                                    <p className="text-[9px] text-white/40">Simple et sécurisé</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#0A7D3E]/20 rounded-lg flex items-center justify-center shrink-0">
                                    <HeadphonesIcon size={14} className="text-[#FFD700]" />
                                </div>
                                <div>
                                    <h5 className="text-[11px] font-bold">Assistance 24/7</h5>
                                    <p className="text-[9px] text-white/40">Par téléphone ou mail</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter & Contact */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-[#FFD700] rounded-full"></span>
                            Newsletter & Info
                        </h4>
                        <form onSubmit={handleSubscribe} className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Newsletter..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-3 pr-10 text-xs focus:outline-none focus:border-[#FFD700] transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute right-1 top-1 w-6 h-6 bg-[#FFD700] text-[#003820] rounded-md flex items-center justify-center hover:bg-white transition-colors"
                            >
                                <Send size={12} />
                            </button>
                            {subscribed && (
                                <p className="absolute -bottom-5 left-0 text-[#FFD700] text-[10px] font-bold">✓ Inscrit!</p>
                            )}
                        </form>

                        <div className="space-y-2 pt-2">
                            <div className="flex items-center gap-2 text-xs text-white/50">
                                <MapPin size={14} className="text-[#FFD700] shrink-0" />
                                <span className="text-[11px]">Alger, Algérie</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/50">
                                <Phone size={14} className="text-[#FFD700] shrink-0" />
                                <span className="text-[11px]">+213 555 123 456</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/50">
                                <Mail size={14} className="text-[#FFD700] shrink-0" />
                                <span className="text-[11px]">contact@zshop.dz</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <p className="text-white/30 text-[10px] text-center">
                        © 2026 ZShop Algeria. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
};
