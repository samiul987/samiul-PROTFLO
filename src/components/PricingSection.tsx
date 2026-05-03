import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';
import { subscribeCollection } from '../services/dataService';
import { PricingCard } from '../types';
import FadeIn from './FadeIn';

export default function PricingSection() {
  const [pricing, setPricing] = useState<PricingCard[]>([]);

  useEffect(() => {
    const unsub = subscribeCollection<PricingCard>('pricing', (data) => {
      setPricing(data.sort((a, b) => a.order - b.order));
    });
    return () => unsub();
  }, []);

  if (pricing.length === 0) return null;

  return (
    <section id="price" className="bg-[#0C0C0C] px-6 md:px-10 py-32 relative overflow-hidden">
      {/* Background decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
         <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             opacity: [0.1, 0.2, 0.1] 
           }}
           transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
           className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#7721B1] blur-[180px] rounded-full" 
         />
         <motion.div 
           animate={{ 
             scale: [1.2, 1, 1.2],
             opacity: [0.1, 0.15, 0.1] 
           }}
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
           className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#B600A8] blur-[180px] rounded-full" 
         />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 md:mb-32">
          <FadeIn delay={0.1} y={20}>
            <span className="text-[#D7E2EA] font-bold uppercase tracking-[0.6em] text-[10px] sm:text-xs opacity-50 block mb-6">Investment Plans</span>
          </FadeIn>
          <FadeIn delay={0.2} y={30}>
            <h2 className="hero-heading font-black uppercase text-5xl sm:text-7xl md:text-9xl mt-4 tracking-tighter leading-none">
              Pricing<span className="text-[#D7E2EA]/20">.</span>
            </h2>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-stretch">
          {pricing.map((card, i) => (
            <FadeIn key={card.id} delay={0.3 + i * 0.1} y={40} className="h-full">
              <motion.div
                whileHover={{ y: -15, scale: 1.02 }}
                className={`relative h-full flex flex-col p-10 sm:p-12 rounded-[50px] border transition-all duration-700 overflow-hidden group ${
                   card.isPopular 
                   ? 'bg-[#1A1A1A]/80 backdrop-blur-xl border-[#D7E2EA]/30 shadow-[0_40px_80px_-20px_rgba(119,33,177,0.4)]' 
                   : 'bg-[#141414]/60 backdrop-blur-lg border-white/5 hover:border-white/10 shadow-2xl'
                }`}
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-20 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {card.isPopular && (
                  <div className="absolute top-10 right-10 bg-white text-[#0C0C0C] text-[10px] uppercase font-black tracking-widest px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xl">
                    <Sparkles size={12} className="animate-pulse" />
                    Most Popular
                  </div>
                )}

                <div className="mb-12 relative z-10">
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#D7E2EA] opacity-40 mb-4">{card.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl sm:text-6xl font-black text-white tracking-tighter">{card.price}</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-6 mb-16 relative z-10">
                  {card.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-4 group/item">
                      <div className="mt-1.5 w-6 h-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover/item:border-white/30 transition-colors duration-500">
                        <Check size={14} className="text-[#D7E2EA]" />
                      </div>
                      <span className="text-sm sm:text-base text-[#D7E2EA]/60 font-medium leading-snug group-hover/item:text-white transition-colors duration-500">{feature}</span>
                    </div>
                  ))}
                </div>

                <motion.a
                  href={card.ctaLink || "#contact"}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center transition-all relative z-10 ${
                    card.isPopular 
                    ? 'bg-white text-black shadow-[0_20px_40px_rgba(255,255,255,0.2)] hover:shadow-[0_25px_50px_rgba(255,255,255,0.3)]' 
                    : 'bg-[#D7E2EA]/10 text-white border border-white/10 hover:bg-white hover:text-black'
                  }`}
                >
                  {card.ctaText}
                </motion.a>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
