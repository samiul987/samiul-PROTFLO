import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export function ContactButton({ className = "" }: { className?: string }) {
  return (
    <motion.a
      href="#contact"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative rounded-full px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base font-medium uppercase tracking-widest text-white transition-all duration-300 inline-block text-center ${className}`}
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid white',
        outlineOffset: '-3px'
      }}
    >
      Contact Me
    </motion.a>
  );
}

export function LiveProjectButton({ className = "", href }: { className?: string, href?: string }) {
  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(215, 226, 234, 0.1)' }}
        whileTap={{ scale: 0.95 }}
        className={`rounded-full border-2 border-[#D7E2EA] px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base font-medium uppercase tracking-widest text-[#D7E2EA] transition-all flex items-center gap-2 ${className}`}
      >
        Live Project
        <ArrowUpRight size={18} />
      </motion.a>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05, backgroundColor: 'rgba(215, 226, 234, 0.1)' }}
      whileTap={{ scale: 0.95 }}
      className={`rounded-full border-2 border-[#D7E2EA] px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base font-medium uppercase tracking-widest text-[#D7E2EA] transition-all flex items-center gap-2 ${className}`}
    >
      Live Project
      <ArrowUpRight size={18} />
    </motion.button>
  );
}

