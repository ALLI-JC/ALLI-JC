import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface FloatingLogoSpinProps {
  src?: string;
  size?: number;
  offset?: number;
  className?: string;
}

// Hook personnalisé pour les media queries
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
}

export default function FloatingLogoSpin({
  src = '/alliéjc-logo-3.png',
  size = 140,
  offset = 100,
  className = '',
}: FloatingLogoSpinProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { scrollY } = useScroll();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Position du logo
  const yPosition = useTransform(scrollY, (value) => {
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const maxScroll = documentHeight - windowHeight;
    const progress = maxScroll > 0 ? value / maxScroll : 0;
    const maxOffset = windowHeight - size - 40;
    const minOffset = offset;
    const easedProgress = progress < 0.95 ? progress : 0.95;
    return minOffset + (maxOffset - minOffset) * easedProgress;
  });

  // Opacité basée sur le scroll : invisible en haut (scrollY < 100), visible après
  const opacity = useTransform(scrollY, [0, 150, 200], [0, 0.5, 1]);

  useEffect(() => {
    const handleScroll = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      if (window.scrollY + windowHeight >= documentHeight - 10) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cacher sur mobile
  if (isMobile) {
    return null;
  }

  return (
    <motion.div
      className={`fixed left-6 z-50 ${className}`}
      style={{
        top: yPosition,
        opacity: isVisible ? opacity : 0,
        pointerEvents: isVisible && scrollY.get() > 150 ? 'auto' : 'none',
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative cursor-pointer rounded-2xl bg-gradient-to-br from-[#0e2b38] via-[#1a4a5a] to-[#237395] shadow-2xl"
        style={{
          width: size,
          height: size,
        }}
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <img
          src={src}
          alt="AlliéJC Logo"
          className="h-full w-full object-contain p-0 drop-shadow-2xl"
        />
      </motion.div>
    </motion.div>
  );
}