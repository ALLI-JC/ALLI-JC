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
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const { scrollY } = useScroll();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Position du logo - suit le scroll
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

  // Opacité avec transition plus douce
  const opacity = useTransform(scrollY, [0, 100, 250], [0, 0.3, 1]);

  // Scale pour un effet d'apparition fluide
  const scale = useTransform(scrollY, [0, 100, 250], [0.8, 0.9, 1]);

  // Gestion de la visibilité en bas de page
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

  // Fonction pour scroller vers le haut
  const scrollToTop = () => {
    setIsClicked(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      setIsClicked(false);
    }, 800);
  };

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
        scale: isVisible ? scale : 0.8,
        pointerEvents: isVisible && scrollY.get() > 150 ? 'auto' : 'none',
      }}
      transition={{ 
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      }}
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
          scale: 1.15,
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 17,
          }
        }}
        whileTap={{
          scale: 0.9,
          transition: {
            duration: 0.1,
          }
        }}
        animate={{
          scale: isClicked ? [1, 0.85, 1.1, 1] : 1,
        }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut',
        }}
        onClick={scrollToTop}
      >
        {/* Effet de brillance au survol */}
        <motion.div
          className="absolute inset-0 -z-10 bg-gradient-to-tr from-white/0 via-white/20 to-white/0"
          animate={{
            x: isHovered ? '100%' : '-100%',
          }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
          }}
        />

        {/* Cercle de lueur - Effet bulle */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            scale: isHovered ? 1.4 : 0.8,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
          }}
          style={{
            background: 'radial-gradient(circle, rgba(35,115,149,0.5) 0%, rgba(35,115,149,0.2) 30%, transparent 70%)',
          }}
        />

        {/* Effet de vague au clic */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/30"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: isClicked ? [0.5, 1.8, 1] : 0.5,
            opacity: isClicked ? [0.8, 0, 0] : 0,
          }}
          transition={{
            duration: 0.7,
            ease: 'easeOut',
          }}
        />

        {/* Logo - Sans rotation */}
        <motion.img
          src={src}
          alt="AlliéJC Logo"
          className="h-full w-full object-contain p-0 drop-shadow-2xl relative z-10"
          animate={{
            scale: isHovered ? 1.08 : 1,
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
        />

        {/* Anneau décoratif */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-white/10"
          animate={{
            scale: isHovered ? 1.06 : 1,
            borderColor: isHovered ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)',
          }}
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
          }}
        />

        {/* Bulles flottantes - Animation de bulle */}
        {[
          { x: 15, y: 20, size: 6, delay: 0, duration: 3.5 },
          { x: 60, y: 10, size: 4, delay: 0.5, duration: 4 },
          { x: 80, y: 50, size: 8, delay: 1, duration: 3 },
          { x: 25, y: 70, size: 5, delay: 1.5, duration: 3.8 },
          { x: 70, y: 75, size: 7, delay: 0.8, duration: 4.2 },
          { x: 45, y: 40, size: 9, delay: 1.2, duration: 3.3 },
        ].map((bubble, index) => (
          <motion.div
            key={`bubble-${index}`}
            className="absolute rounded-full bg-white/15"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: bubble.x,
              top: bubble.y,
            }}
            animate={{
              y: [0, -25 - bubble.size, 0],
              x: [0, (Math.random() - 0.5) * 10, 0],
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Bulles supplémentaires au survol */}
        {isHovered && 
          [0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
            <motion.div
              key={`hover-bubble-${index}`}
              className="absolute rounded-full bg-white/25"
              style={{
                width: 3 + Math.random() * 8,
                height: 3 + Math.random() * 8,
                left: Math.random() * 80 + 10,
                top: Math.random() * 80 + 10,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.8, 0],
                opacity: [0, 0.9, 0],
                y: [-5, -40 - Math.random() * 30],
                x: [-5, (Math.random() - 0.5) * 25],
              }}
              transition={{
                duration: 1.5 + Math.random() * 1.5,
                delay: Math.random() * 0.8,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          ))
        }

        {/* Lumière pulsante */}
        <motion.div
          className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-white/40"
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Indicateur "↑" */}
        <motion.div
          className="absolute bottom-2 right-2 text-white/60 text-xs font-bold"
          initial={{ opacity: 0, y: 5 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 5,
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
        >
          ↑
        </motion.div>

        {/* Tooltip "Retour en haut" */}
        <motion.div
          className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0e2b38] text-white text-xs py-1.5 px-4 rounded-full whitespace-nowrap shadow-lg border border-white/10"
          initial={{ opacity: 0, y: 5, scale: 0.8 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 5,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
        >
          Retour en haut
        </motion.div>

        {/* Flèche du tooltip */}
        <motion.div
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#0e2b38] rotate-45 border-r border-b border-white/10"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </motion.div>
  );
}
