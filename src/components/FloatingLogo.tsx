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
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const { scrollY } = useScroll();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Détecter si on est dans la section Hero - Version améliorée
  useEffect(() => {
    // Essayer plusieurs sélecteurs possibles
    const heroSelectors = ['#hero', '#Hero', '[id="hero"]', 'section:first-of-type', '.hero-section'];
    let heroSection = null;
    
    for (const selector of heroSelectors) {
      heroSection = document.querySelector(selector);
      if (heroSection) break;
    }

    // Si toujours pas trouvé, chercher le premier élément avec une classe contenant "hero"
    if (!heroSection) {
      const allElements = document.querySelectorAll('*');
      for (const element of allElements) {
        if (element.className && typeof element.className === 'string' && 
            element.className.toLowerCase().includes('hero')) {
          heroSection = element;
          break;
        }
      }
    }

    if (!heroSection) {
      console.warn('Section Hero non trouvée pour FloatingLogoSpin');
      // Si pas de hero, on considère qu'on est toujours visible
      setIsHeroVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Le logo s'affiche quand la section Hero n'est plus visible
        const isIntersecting = entry.isIntersecting;
        setIsHeroVisible(!isIntersecting);
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

  // Gestion de la visibilité : invisible en bas de page
  useEffect(() => {
    const handleScroll = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      
      // Vérifier si on est en bas de page (dernier 150px)
      const bottomThreshold = 150;
      const isAtBottomNow = scrollPosition + windowHeight >= documentHeight - bottomThreshold;
      
      setIsAtBottom(isAtBottomNow);
      
      // Si on est en bas de page, cacher le logo
      if (isAtBottomNow) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cacher sur mobile
  if (isMobile) {
    return null;
  }

  // Calculer si le logo doit être affiché
  const shouldShow = isHeroVisible && isVisible && !isAtBottom;

  // Bulles flottantes élégantes
  const bubbles = [
    { x: 8, y: 12, size: 8, delay: 0, duration: 4.2, color: 'rgba(255,255,255,0.12)' },
    { x: 65, y: 5, size: 5, delay: 0.7, duration: 4.8, color: 'rgba(255,255,255,0.15)' },
    { x: 88, y: 42, size: 10, delay: 1.2, duration: 3.6, color: 'rgba(255,255,255,0.10)' },
    { x: 18, y: 78, size: 6, delay: 1.8, duration: 4.5, color: 'rgba(255,255,255,0.14)' },
    { x: 78, y: 82, size: 9, delay: 0.5, duration: 5.0, color: 'rgba(255,255,255,0.11)' },
    { x: 42, y: 30, size: 11, delay: 1.5, duration: 3.9, color: 'rgba(255,255,255,0.09)' },
    { x: 52, y: 68, size: 6, delay: 0.3, duration: 4.3, color: 'rgba(255,255,255,0.13)' },
    { x: 28, y: 48, size: 4, delay: 2.0, duration: 5.2, color: 'rgba(255,255,255,0.16)' },
    { x: 90, y: 70, size: 5, delay: 0.9, duration: 3.8, color: 'rgba(255,255,255,0.12)' },
    { x: 10, y: 55, size: 7, delay: 1.3, duration: 4.6, color: 'rgba(255,255,255,0.10)' },
  ];

  // Particules d'étoiles
  const stars = [
    { x: 15, y: 20, size: 2, delay: 0, duration: 2.5 },
    { x: 70, y: 15, size: 1.5, delay: 0.8, duration: 3.0 },
    { x: 85, y: 60, size: 2.5, delay: 1.5, duration: 2.8 },
    { x: 25, y: 85, size: 1.8, delay: 0.4, duration: 3.2 },
    { x: 60, y: 90, size: 2, delay: 1.0, duration: 2.6 },
    { x: 45, y: 50, size: 3, delay: 0.6, duration: 3.5 },
  ];

  return (
    <motion.div
      className={`fixed left-6 z-50 ${className}`}
      style={{
        top: yPosition,
        opacity: shouldShow ? 1 : 0,
        pointerEvents: shouldShow ? 'auto' : 'none',
      }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        className="relative cursor-pointer rounded-2xl bg-gradient-to-br from-[#0e2b38] via-[#1a4a5a] to-[#237395] shadow-2xl overflow-hidden"
        style={{
          width: size,
          height: size,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ 
          scale: 1.12,
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 17,
          }
        }}
        whileTap={{ 
          scale: 0.92,
          transition: {
            duration: 0.1,
          }
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        {/* Dégradé d'arrière-plan animé */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: isHovered 
              ? 'radial-gradient(circle at 30% 30%, rgba(35,115,149,0.6) 0%, rgba(14,43,56,0.8) 100%)'
              : 'radial-gradient(circle at 70% 70%, rgba(35,115,149,0.3) 0%, rgba(14,43,56,0.6) 100%)',
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        {/* Cercle de lueur principal */}
        <motion.div
          className="absolute inset-[-20%] rounded-full"
          animate={{
            scale: isHovered ? 1.6 : 0.9,
            opacity: isHovered ? 0.8 : 0.3,
          }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
          }}
          style={{
            background: 'radial-gradient(circle, rgba(35,115,149,0.6) 0%, rgba(35,115,149,0.2) 30%, rgba(35,115,149,0) 70%)',
          }}
        />

        {/* Cercle de lueur secondaire */}
        <motion.div
          className="absolute inset-[-10%] rounded-full"
          animate={{
            scale: isHovered ? 1.3 : 0.7,
            opacity: isHovered ? 0.5 : 0.1,
          }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
          }}
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)',
          }}
        />

        {/* Effet de brillance au survol */}
        <motion.div
          className="absolute inset-0"
          animate={{
            x: isHovered ? '100%' : '-100%',
          }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
          }}
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
            transform: 'skewX(-20deg)',
          }}
        />

        {/* Contour brillant */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: isHovered 
              ? 'inset 0 0 30px rgba(255,255,255,0.15), 0 0 40px rgba(35,115,149,0.3)'
              : 'inset 0 0 10px rgba(255,255,255,0.05)',
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />

        {/* Logo */}
        <motion.img
          src={src}
          alt="AlliéJC Logo"
          className="h-full w-full object-contain p-0 drop-shadow-2xl relative z-10"
          animate={{
            scale: isHovered ? 1.08 : 1,
            filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
        />

        {/* Anneau décoratif avec rotation */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-white/10"
          animate={{
            scale: isHovered ? 1.06 : 1,
            borderColor: isHovered ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)',
            rotate: isHovered ? 5 : 0,
          }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
          }}
        />

        {/* Anneau intérieur */}
        <motion.div
          className="absolute inset-2 rounded-xl border border-white/5"
          animate={{
            scale: isHovered ? 1.04 : 1,
            borderColor: isHovered ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.03)',
            rotate: isHovered ? -3 : 0,
          }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
          }}
        />

        {/* Bulles flottantes */}
        {bubbles.map((bubble, index) => (
          <motion.div
            key={`bubble-${index}`}
            className="absolute rounded-full"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: bubble.x,
              top: bubble.y,
              background: bubble.color,
              boxShadow: `0 0 ${bubble.size * 2}px ${bubble.color}`,
            }}
            animate={{
              y: [0, -30 - bubble.size * 2, 0],
              x: [0, (Math.random() - 0.5) * 15, 0],
              scale: [1, 1.5 + bubble.size * 0.05, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Étoiles scintillantes */}
        {stars.map((star, index) => (
          <motion.div
            key={`star-${index}`}
            className="absolute rounded-full bg-white"
            style={{
              width: star.size,
              height: star.size,
              left: star.x,
              top: star.y,
              boxShadow: `0 0 ${star.size * 3}px rgba(255,255,255,0.5)`,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Bulles au survol */}
        {isHovered && 
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => {
            const size = 3 + Math.random() * 10;
            return (
              <motion.div
                key={`hover-bubble-${index}`}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  left: Math.random() * 80 + 10,
                  top: Math.random() * 80 + 10,
                  background: `rgba(255,255,255,${0.1 + Math.random() * 0.2})`,
                  boxShadow: `0 0 ${size * 2}px rgba(255,255,255,0.1)`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 2 + Math.random(), 0],
                  opacity: [0, 0.6 + Math.random() * 0.3, 0],
                  y: [-5, -50 - Math.random() * 40],
                  x: [-5, (Math.random() - 0.5) * 30],
                }}
                transition={{
                  duration: 1.5 + Math.random() * 2,
                  delay: Math.random() * 0.8,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            );
          })
        }

        {/* Lumière pulsante principale */}
        <motion.div
          className="absolute top-2 right-2 h-3 w-3 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 100%)',
            boxShadow: '0 0 20px rgba(255,255,255,0.3)',
          }}
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Lumière secondaire */}
        <motion.div
          className="absolute bottom-2 left-2 h-2 w-2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(35,115,149,0.8) 0%, transparent 100%)',
            boxShadow: '0 0 15px rgba(35,115,149,0.3)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />

        {/* Indicateur "↑" */}
        <motion.div
          className="absolute bottom-2 right-2 text-white/50 text-xs font-bold z-10"
          initial={{ opacity: 0, y: 5 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 5,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
          }}
        >
          ↑
        </motion.div>

        {/* Tooltip */}
        <motion.div
          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0e2b38]/90 backdrop-blur-sm text-white text-xs py-1.5 px-4 rounded-full whitespace-nowrap shadow-xl border border-white/10 z-20"
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10,
            scale: isHovered ? 1 : 0.9,
          }}
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
          }}
        >
          <span className="flex items-center gap-1">
            <span className="text-[#237395]">↑</span>
            Retour en haut
          </span>
        </motion.div>

        {/* Flèche du tooltip */}
        <motion.div
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#0e2b38]/90 rotate-45 border-r border-b border-white/10"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
          }}
        />

        {/* Pulsation de fond */}
        <motion.div
          className="absolute inset-[-30%] rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: 'radial-gradient(circle, rgba(35,115,149,0.3) 0%, transparent 70%)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}
