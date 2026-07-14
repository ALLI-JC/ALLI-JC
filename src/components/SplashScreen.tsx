import { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return null;
  }

  // Animation du chamois qui traverse l'écran - PLUS DOUCE
  const chamoisTraverseVariants: Variants = {
    initial: { 
      x: '-50vw', 
      y: 20, 
      opacity: 0, 
      scale: 0.6 
    },
    animate: { 
      x: '150vw', 
      y: [20, 12, 20, 15, 20],
      opacity: [0, 0.5, 0.7, 0.8, 0.5, 0],
      scale: [0.6, 0.85, 0.95, 1, 0.85],
      transition: { 
        duration: 7,
        ease: [0.42, 0, 0.58, 1],
        times: [0, 0.12, 0.3, 0.55, 0.8, 1]
      } 
    },
  };

  // Animation du logo central
  const logoVariants: Variants = {
    initial: { 
      scale: 0.6, 
      opacity: 0, 
      y: 20 
    },
    animate: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        delay: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      } 
    },
  };

  // Animation du slogan
  const sloganVariants: Variants = {
    initial: { 
      opacity: 0, 
      y: 10 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: 0.6,
        ease: 'easeOut'
      } 
    },
  };

  // Animation du fond
  const bgVariants: Variants = {
    initial: { 
      opacity: 0 
    },
    animate: { 
      opacity: 1,
      transition: { duration: 0.8 }
    },
  };

  // Animation de la particule
  const particleVariants: Variants = {
    initial: { 
      opacity: 0, 
      scale: 0 
    },
    animate: (i: number) => ({
      opacity: [0, 0.4, 0],
      scale: [0, 1, 0],
      x: [0, (i - 2) * 50],
      y: [0, (i % 3 - 1) * 30],
      transition: {
        duration: 4,
        delay: i * 0.4,
        repeat: Infinity,
        repeatType: 'loop' as const,
        ease: 'easeInOut',
      }
    }),
  };

  return (
    <motion.div
      variants={bgVariants}
      initial="initial"
      animate="animate"
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a4a5a 0%, #237395 40%, #2a8ba8 70%, #3a9a9b 100%)',
      }}
    >
      {/* Cercles décoratifs en arrière-plan */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 360, 0],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/10"
        animate={{ 
          scale: [1, 0.9, 1],
          rotate: [360, 0, 360],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-white/5 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Particules flottantes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={particleVariants}
          initial="initial"
          animate="animate"
          className="absolute w-1.5 h-1.5 rounded-full bg-white/30"
          style={{
            top: `${20 + i * 12}%`,
            left: `${10 + i * 15}%`,
          }}
        />
      ))}

      {/* Logo central avec l'image */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        variants={logoVariants}
        initial="initial"
        animate="animate"
      >
        {/* Cercle de lumière derrière le logo */}
        <motion.div
          className="absolute -inset-24 rounded-full bg-white/10 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        {/* Logo image central */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
        >
          <img
            src="/alliéjc-logo-3.png"
            alt="Allié JC Habitat"
            className="w-40 h-auto md:w-52 lg:w-60 object-contain drop-shadow-2xl brightness-110 contrast-105"
          />
        </motion.div>

        {/* Sous-titre */}
        <motion.div
          className="mt-4 flex items-center gap-3"
          variants={sloganVariants}
          initial="initial"
          animate="animate"
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-300/60" />
          <span className="text-sm md:text-base font-light tracking-[0.3em] text-amber-100/90">
            HABITAT
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-amber-300/60" />
        </motion.div>

        {/* Slogan */}
        <motion.p
          className="mt-3 text-xs font-light tracking-[0.15em] text-white/70"
          variants={sloganVariants}
          initial="initial"
          animate="animate"
        >
          Entretien • Jardinage • Propreté
        </motion.p>

        {/* Barre de chargement */}
        <motion.div
          className="mt-8 w-56 h-1 rounded-full bg-white/20 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-400"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 3.8, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>

      {/* Chamois qui traverse l'écran - PLUS DOUCEMENT */}
      <motion.div
        className="absolute z-5 pointer-events-none"
        variants={chamoisTraverseVariants}
        initial="initial"
        animate="animate"
        style={{ y: '50%' }}
      >
        <img
          src="/shamois.png"
          alt="Chamois"
          className="w-28 h-auto md:w-36 object-contain drop-shadow-2xl brightness-110"
        />
      </motion.div>

      {/* Effet de lumière subtil */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
    </motion.div>
  );
}