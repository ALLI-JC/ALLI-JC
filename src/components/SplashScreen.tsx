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

  // Animation du chamois qui saute 2 fois : droite → centre, puis centre → gauche (très à gauche)
  // Utilisation de transitions séparées pour X et Y afin de créer des paraboles arrondies (demi-cercles)
  const chamoisTraverseVariants: Variants = {
    initial: {
      x: "120vw",
      y: 0,
      scale: 0.8,
      rotate: 8,
    },

    animate: {
      x: [
        "120vw",
        "100vw",
        "80vw",
        "60vw",
        "40vw",
        "20vw",
        "0vw",
        "-20vw",
        "-40vw",
        "-60vw"
      ],

      y: [
        0,
        -60,
        -150,
        -250,
        -150,
        -60,
        0,
        -150,
        -250,
        0
      ],

      scale: [
        0.8,
        0.9,
        1,
        1.2,
        1.1,
        1,
        1,
        1.1,
        1.2,
        0.8
      ],

      rotate: [
        8,
        5,
        2,
        0,
        -2,
        -4,
        -5,
        -7,
        -9,
        -10
      ],

      transition: {
        duration: 5,
        ease: [0.45, 0, 0.55, 1],
        times: [
          0,
          0.10,
          0.22,
          0.35,
          0.50,
          0.65,
          0.78,
          0.90,
          1
        ]
      }
    },

    exit: {
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
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
            className="absolute z-5 pointer-events-none"
            variants={chamoisTraverseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: 1
            }}
          >
            <img
              src="/shamois.png"
              alt="Chamois"
              className="w-80 h-auto md:w-[400px] object-contain drop-shadow-2xl brightness-110"
              style={{ opacity: 1 }}
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