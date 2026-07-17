import { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // On attend que l'animation de sortie soit terminée avant d'appeler onComplete
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 600); // Durée de l'animation de sortie

      return () => clearTimeout(exitTimer);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Version avec des arcs de cercle parfaits (utilisant des transitions séparées)
const chamoisTraverseVariants: Variants = {
  initial: {
    x: "120vw",
    y: 0,
    scale: 0.85,
    rotate: 5,
  },

  animate: {
    x: [
      "120vw",  // départ droite
      "90vw",
      "60vw",
      "30vw",
      "0vw",    // centre
      "-10vw",  // légèrement gauche
      "-25vw"   // sortie douce
    ],

    y: [
      0,
      -80,
      -170,
      -240,
      0,
      -150,
      0
    ],

    scale: [
      0.85,
      1,
      1.12,
      1.15,
      1,
      1.08,
      0.85
    ],

    rotate: [
      5,
      -5,
      -10,
      -12,
      5,
      -8,
      -12
    ],

    transition: {
      duration: 8,
      ease: "easeInOut",
      times: [
        0,
        0.15,
        0.3,
        0.42,
        0.65,
        0.85,
        1
      ]
    }
  },

  exit: {
    opacity: 0,
    transition: {
      duration: 0.6
    }
  }
};
  // Animation de l'ombre du chamois au sol (synchronisée sur le rythme du saut)
  const shadowVariants: Variants = {
    initial: {
      opacity: 0,
      scale: 0.5
    },
    animate: {
      // L'ombre devient très discrète et s'étale lorsque le chamois est au sommet du saut (-220px)
      opacity: [0, 0.15, 0.5, 0.5, 0.15, 0],
      scale: [0.5, 0.6, 1.2, 1.2, 0.6, 0.5],
      transition: {
        duration: 4.5,
        times: [0, 0.25, 0.45, 0.55, 0.75, 1],
        ease: ["easeOut", "easeIn", "linear", "easeOut", "easeIn"]
      }
    },
    exit: {
      opacity: 0,
      scale: 0.3,
      transition: { duration: 0.5 }
    }
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
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
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
    exit: {
      opacity: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
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
        duration: 5,
        delay: i * 0.4,
        repeat: Infinity,
        repeatType: 'loop' as const,
        ease: 'easeInOut',
      }
    }),
    exit: {
      opacity: 0,
      scale: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={bgVariants}
          initial="initial"
          animate="animate"
          exit="exit"
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
              exit="exit"
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
            exit="exit"
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

            {/* Logo image central - Ton logo ici */}
            {/* Sous-titre - Ton sous-titre ici */}
          </motion.div>

          {/* Ombre du chamois au sol */}
          <motion.div
            className="absolute z-4 pointer-events-none"
            variants={shadowVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              top: '58%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '150px',
              height: '30px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.3)',
              filter: 'blur(8px)'
            }}
          />

          {/* Chamois qui saute en demi-cercle : droite → centre, puis centre → très à gauche */}
          <motion.div
            className="absolute z-10"
            initial={{ x: "120vw" }}
            animate={{ x: "-80vw" }}
            transition={{
              duration: 5,
              ease: "linear"
            }}
          >
            <motion.img
              src="/shamois.png"
              animate={{
                y: [0, -240, 0, -280, 0, -220, 0],
                rotate: [8, -12, 8, -15, 8, -10, 8],
                scale: [0.9, 1.15, 0.9, 1.2, 0.9, 1.1, 0.85]
              }}
              transition={{
                duration: 5,
                ease: "easeInOut",
                times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1]
              }}
              className="w-80 md:w-[400px]"
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
      )}
    </AnimatePresence>
  );
}