import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

interface FloatingLogoSpinProps {
  src?: string;
  size?: number;
  offset?: number;
  className?: string;
  showTooltip?: boolean;
}

// Hook personnalisé pour les media queries
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const updateMatch = () => setMatches(media.matches);
    updateMatch();
    media.addEventListener('change', updateMatch);
    return () => media.removeEventListener('change', updateMatch);
  }, [query]);

  return matches;
}

export default function FloatingLogoSpin({
  src = '/shamois.png',
  size = 90,
  offset = 80,
  className = '',
  showTooltip = true,
}: FloatingLogoSpinProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // Détection de la section Hero améliorée
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  
  useEffect(() => {
    const findHeroSection = () => {
      const selectors = [
        '#hero', '#Hero', 
        '[id="hero"]', 
        'section.hero', 
        '.hero-section',
        'section:first-of-type'
      ];
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) return element;
      }
      
      // Fallback: chercher un élément avec hero dans la classe
      const allElements = document.querySelectorAll('*');
      for (const element of allElements) {
        if (element.className && typeof element.className === 'string') {
          const classes = element.className.split(' ');
          if (classes.some(c => c.toLowerCase().includes('hero'))) {
            return element;
          }
        }
      }
      return null;
    };

    const heroSection = findHeroSection();
    
    if (!heroSection) {
      setIsHeroVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(!entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '-50px 0px 0px 0px',
      }
    );

    observer.observe(heroSection);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Position verticale avec animation fluide
  const rawY = useTransform(scrollY, (value) => {
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const maxScroll = documentHeight - windowHeight;
    const progress = maxScroll > 0 ? Math.min(value / maxScroll, 0.95) : 0;
    const maxOffset = windowHeight - size - 40;
    return offset + (maxOffset - offset) * progress;
  });

  const yPosition = useSpring(rawY, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  // Gestion de la visibilité en bas de page
  useEffect(() => {
    const handleScroll = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      const isAtBottom = scrollPosition + windowHeight >= documentHeight - 150;
      setIsVisible(!isAtBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Cacher sur mobile
  if (isMobile) return null;

  const shouldShow = isHeroVisible && isVisible;

  // Bulles flottantes
  const bubbles = Array.from({ length: 10 }, (_, i) => ({
    x: 5 + Math.random() * 90,
    y: 5 + Math.random() * 90,
    size: 2 + Math.random() * 6,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    color: `rgba(255,255,255,${0.06 + Math.random() * 0.10})`,
  }));

  return (
    <motion.div
      ref={logoRef}
      className={`fixed left-6 z-50 ${className}`}
      style={{
        top: yPosition,
        opacity: shouldShow ? 1 : 0,
        pointerEvents: shouldShow ? 'auto' : 'none',
        transition: 'opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
    >
      <motion.div
        className="relative cursor-pointer rounded-full overflow-hidden bg-gradient-to-br from-[#0e2b38] via-[#1a4a5a] to-[#237395] shadow-lg"
        style={{
          width: size,
          height: size,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2), 0 0 30px rgba(35,115,149,0.08)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        whileHover={!prefersReducedMotion ? { 
          scale: 1.08,
          transition: { type: 'spring', stiffness: 400, damping: 17 }
        } : {}}
        whileTap={!prefersReducedMotion ? { 
          scale: 0.95,
          transition: { duration: 0.1 }
        } : {}}
      >
        {/* Dégradé d'arrière-plan animé */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            background: isHovered 
              ? 'radial-gradient(circle at 30% 30%, rgba(35,115,149,0.3) 0%, rgba(14,43,56,0.6) 100%)'
              : 'radial-gradient(circle at 70% 70%, rgba(35,115,149,0.1) 0%, rgba(14,43,56,0.4) 100%)',
          }}
          transition={{ duration: 0.6 }}
        />

        {/* Lueur */}
        <motion.div
          className="absolute inset-[-10%] rounded-full"
          animate={{
            scale: isHovered ? 1.2 : 0.9,
            opacity: isHovered ? 0.3 : 0.1,
          }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'radial-gradient(circle, rgba(35,115,149,0.2) 0%, transparent 60%)',
          }}
        />

        {/* Bulles flottantes */}
        {!prefersReducedMotion && bubbles.map((bubble, index) => (
          <motion.div
            key={`bubble-${index}`}
            className="absolute rounded-full"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              background: bubble.color,
              boxShadow: `0 0 ${bubble.size * 2}px ${bubble.color}`,
            }}
            animate={{
              y: [0, -(15 + bubble.size * 2), 0],
              x: [0, (Math.random() - 0.5) * 15, 0],
              scale: [1, 1.3 + bubble.size * 0.05, 1],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Logo - Légèrement agrandi */}
        <motion.img
          src={src}
          alt="AlliéJC Logo"
          className="relative z-10 h-full w-full object-contain p-1 drop-shadow-xl"
          animate={{
            scale: isHovered ? 1.08 : 1.02,
            filter: isHovered ? 'brightness(1.1) drop-shadow(0 0 20px rgba(35,115,149,0.2))' : 'brightness(1)',
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Petit anneau décoratif */}
        <motion.div
          className="absolute inset-0 rounded-full border border-white/5"
          animate={{
            scale: isHovered ? 1.02 : 1,
            borderColor: isHovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Point lumineux */}
        <motion.div
          className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-white/40"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Tooltip */}
        {showTooltip && (
          <motion.div
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0e2b38]/90 backdrop-blur-sm text-white text-xs py-1.5 px-4 rounded-full whitespace-nowrap shadow-xl border border-white/10 z-20"
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 5,
              scale: isHovered ? 1 : 0.9,
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="flex items-center gap-1.5">
              <span className="text-[#237395] text-sm">↑</span>
              Retour en haut
            </span>
          </motion.div>
        )}

        {/* Flèche du tooltip */}
        {showTooltip && (
          <motion.div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#0e2b38]/90 rotate-45 border-r border-b border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}