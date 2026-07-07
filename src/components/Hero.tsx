import { Send, Phone, ChevronDown } from 'lucide-react';
import { useState, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';

interface HeroProps {
  onDevisClick: () => void;
}

interface Service {
  label: string;
  img: string;
}

const SERVICES: Service[] = [
  { label: 'Nettoyage de vitres', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200' },
  { label: 'Bricolage', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200' },
  { label: 'Nettoyage intérieur / extérieur', img: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1200' },
  { label: 'Entretien terrasses et jardin', img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200' },
  { label: 'Espaces verts copropriétés & communes', img: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Ménage de remise en état fin de bail', img: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=1200' },
  { label: 'Ménage de fin de chantier', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200' },
  { label: 'Nettoyage de locaux commerciaux', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200' },
  { label: 'Nettoyage des parties communes', img: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=1200' },
  { label: 'Et bien plus encore…', img: 'https://images.unsplash.com/photo-1556909114-44e3e9399f2e?w=1200' },
];

const DEFAULT_IMG = '/Mug-alliéjc.jpeg';

// Stagger container pour les enfants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.15,
    },
  },
};

// Chaque item de la liste entre par la gauche
const itemVariants = {
  hidden: { opacity: 0, x: -18 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

// Titre : entrée par le haut
const titleVariants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

// Séparateur : s'étire horizontalement
const dividerVariants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.5, ease: 'easeOut', delay: 0.4 } },
};

// Boutons : fade-in léger
const buttonsVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut', delay: 0.2 } },
};

export default function Hero({ onDevisClick }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();

  const [activeImg, setActiveImg] = useState<string>(DEFAULT_IMG);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = (service: Service) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setActiveImg(service.img);
    setActiveLabel(service.label);
  };

  const handleLeave = () => {
    leaveTimer.current = setTimeout(() => {
      setActiveImg(DEFAULT_IMG);
      setActiveLabel(null);
    }, 180);
  };

  return (
    <section className="relative flex items-start bg-[#237395]">

      {/* ── LEFT PANEL ── */}
      <div className="relative z-10 flex flex-col w-full lg:w-[55%] bg-[#237395] px-6 sm:px-10 lg:px-16 py-14 md:py-20">

        {/* Titre */}
        <motion.h1
          className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] text-white leading-[1.1] mb-5"
          style={{ fontFamily: 'var(--font-palatino)' }}
          variants={prefersReducedMotion ? {} : titleVariants}
          initial="hidden"
          animate="visible"
        >
          Votre allié pour
          <span className="block mt-1 text-[#D2B093]">l'entretien</span>
          <span className="block text-white">de votre habitat</span>
        </motion.h1>

        {/* Séparateur */}
        <motion.div
          className="flex items-center gap-3 mb-7"
          variants={prefersReducedMotion ? {} : dividerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="h-[2px] w-10 rounded-full bg-[#237395]" />
          <div className="h-[2px] w-4 rounded-full bg-[#D2B093]" />
        </motion.div>

        {/* Liste de services — stagger */}
        <motion.ul
          className="mb-9 space-y-0.5"
          variants={prefersReducedMotion ? {} : containerVariants}
          initial="hidden"
          animate="visible"
        >
          {SERVICES.map((service, i) => (
            <motion.li
              key={`${service.label}-${i}`}
              variants={prefersReducedMotion ? {} : itemVariants}
              onMouseEnter={() => handleEnter(service)}
              onMouseLeave={handleLeave}
              whileHover={prefersReducedMotion ? {} : { x: 6 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-default border-l-2 border-transparent
                         text-white/60 text-sm font-sans
                         hover:text-[#D2B093]"
            >
              <motion.span
                className="text-xs shrink-0"
                animate={{ color: activeLabel === service.label ? '#D2B093' : 'rgba(255,255,255,0.4)' }}
                transition={{ duration: 0.2 }}
              >
                —
              </motion.span>
              {service.label}
            </motion.li>
          ))}
        </motion.ul>

        {/* Boutons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 pb-2"
          variants={prefersReducedMotion ? {} : buttonsVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            onClick={onDevisClick}
            whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            className="group relative inline-flex items-center justify-center gap-2 text-white px-7 py-3.5 rounded-xl text-sm font-bold shadow-lg overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #237395 0%, #1a5870 100%)' }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              style={{ background: 'linear-gradient(135deg, #D2B093 0%, #b8936e 100%)' }}
            />
            <Send size={14} className="relative z-10" />
            <span className="relative z-10">Demander un devis gratuit</span>
          </motion.button>

          <motion.a
            href="tel:0607979074"
            whileHover={prefersReducedMotion ? {} : {
              scale: 1.03,
              backgroundColor: 'rgba(210,176,147,0.18)',
            }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 border text-white px-7 py-3.5 rounded-xl text-sm font-semibold"
            style={{
              borderColor: 'rgba(210,176,147,0.45)',
              backgroundColor: 'rgba(210,176,147,0.07)',
            }}
          >
            <Phone size={14} style={{ color: '#D2B093' }} />
            06 07 97 90 74
          </motion.a>
        </motion.div>

        {/* Chevron mobile */}
        <motion.div
          className="flex justify-center mt-8 lg:hidden"
          animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
        >
          <ChevronDown size={22} className="text-white/30" />
        </motion.div>
      </div>

      {/* ── RIGHT PANEL — sticky ── */}
      <div className="hidden lg:block lg:w-[45%] self-stretch">
        <div className="sticky top-0 h-screen overflow-hidden">

          {/* Crossfade image via AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImg}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <img
                src={activeImg}
                alt={activeLabel ?? 'Service'}
                className="w-full h-full object-cover"
              />
              {/* Raccord dégradé gauche */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#237395] via-[#237395]/15 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Label flottant */}
          <AnimatePresence>
            {activeLabel && (
              <motion.div
                key={activeLabel}
                className="absolute bottom-10 left-8 z-10"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <span className="inline-block bg-[#237395]/80 backdrop-blur-sm border border-[#D2B093]/30 text-[#D2B093] text-xs font-semibold font-sans px-4 py-2 rounded-lg">
                  {activeLabel}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bande décorative bas */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] z-20 bg-gradient-to-r from-[#D2B093] via-[#237395] to-[#D2B093]" />
    </section>
  );
}