import { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export default function AnimatedText({ text, className = "" }: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2']
  });

  const words = text.split("");

  return (
    <p ref={containerRef} className={`relative flex flex-wrap justify-center ${className}`}>
      {words.map((char, i) => {
        const start = i / words.length;
        const end = (i + 1) / words.length;
        
        // Use individual scroll progress for each character
        // But the user request says "based on its position in the text relative to scroll progress"
        // Usually we map 0.2 -> 1 opacity over the range
        // I'll use simple staggered approach or more advanced mapping
        
        return (
          <Character key={i} progress={scrollYProgress} range={[start, end]}>
            {char === " " ? "\u00A0" : char}
          </Character>
        );
      })}
    </p>
  );
}

function Character({ children, progress, range }: { children: ReactNode, progress: any, range: [number, number], key?: any }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  
  return (
    <span className="relative">
      <span className="opacity-20">{children}</span>
      <motion.span style={{ opacity }} className="absolute inset-0 flex justify-center">
        {children}
      </motion.span>
    </span>
  );
}
