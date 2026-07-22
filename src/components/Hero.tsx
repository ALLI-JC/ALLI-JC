import { Send, Phone, Sparkles, Building2, Leaf, Euro, BadgePercent } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import TrustBar from './TrustBar';
import ServicesMarquee from './ServicesMarquee';
import ReassurancePillars from './ReassurancePillars';

interface HeroProps {
  onDevisClick: () => void;
}

interface Service {
  label: string;
  img: string;
  tag: string;
}

// 6 images de couverture selon le cahier des charges
const SERVICES: Service[] = [
  { 
    label: 'Entretien Extérieur & Espaces Verts', 
    img: '/3.png',
    tag: 'Particuliers'
  },
  { 
    label: 'Jardinage & Espaces Verts', 
    img: '/7.png',
    tag: 'Particuliers'
  },
  { 
    label: 'Nettoyage de vitres & Façades', 
    img: '/2.jpg',
    tag: 'Particuliers & Pro'
  },
  { 
    label: 'Services Professionnels & Copropriétés', 
    img: '/8.png',
    tag: 'Entreprises & Syndics'
  },
  { 
    label: 'Nettoyage de fin de bail', 
    img: '/5.png',
    tag: 'Immobilier'
  },
  { 
    label: 'Nettoyage de fin de chantier', 
    img: '/6.png',
    tag: 'Construction'
  },
];

// 3 boutons d'accès rapide vers la section services
const QUICK_LINKS = [
  {
    label: 'Entretien Extérieur & Espaces Verts',
    tag: 'Particuliers',
    href: '#sec-services',
    icon: Leaf,
  },
  {
    label: 'Nettoyages Spécifiques & Remise en État',
    tag: 'Transitions Immobilières',
    href: '#sec-services',
    icon: Sparkles,
  },
  {
    label: 'Services Professionnels & Copropriétés',
    tag: 'Entreprises & Syndics',
    href: '#sec-services',
    icon: Building2,
  },
];

const HIGHLIGHTS = [
  'Entretien soigné de l\'extérieur, des jardins et des espaces communs',
  'Nettoyage spécifique pour les transitions immobilières',
  'Interventions fiables pour les professionnels et les copropriétés',
];

export default function Hero({ onDevisClick }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImg, setActiveImg] = useState<string>(SERVICES[0].img);
  const [activeLabel, setActiveLabel] = useState<string>(SERVICES[0].label);

  useEffect(() => {
    if (prefersReducedMotion) {
      setActiveImg(SERVICES[0].img);
      setActiveLabel(SERVICES[0].label);
      return;
    }

    let index = 0;
    const id = window.setInterval(() => {
      index = (index + 1) % SERVICES.length;
      setActiveIndex(index);
      setActiveImg(SERVICES[index].img);
      setActiveLabel(SERVICES[index].label);
    }, 5000);

    return () => window.clearInterval(id);
  }, [prefersReducedMotion]);

  return (
    <>
    <section className="relative overflow-hidden bg-[#0e2b38] min-h-[70vh] lg:min-h-[80vh]">
      {/* Image de fond en slideshow */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImg}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <img 
              src={activeImg} 
              alt={activeLabel} 
              className="h-full w-full object-cover object-center" 
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Overlay plus clair et plus transparent pour mieux voir les photos */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e2b38]/60 via-[#0e2b38]/40 to-[#0e2b38]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e2b38]/50 via-transparent to-transparent" />
        
        {/* Indicateurs de slide en bas à gauche */}
        <div className="absolute bottom-8 left-8 z-20 flex gap-1.5">
          {SERVICES.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index);
                setActiveImg(SERVICES[index].img);
                setActiveLabel(SERVICES[index].label);
              }}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'w-8 bg-[#D2B093]' 
                  : 'w-4 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Voir slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 mx-auto flex min-h-[70vh] lg:min-h-[80vh] max-w-7xl items-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-[#D2B093] backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#D2B093]" />
            {activeLabel}
          </motion.div>

          {/* Titre principal */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-serif text-4xl font-light leading-[1.1] text-white sm:text-5xl lg:text-7xl"
            style={{ fontFamily: 'var(--font-palatino)' }}
          >
            Prendre soin de
            <span className="block text-[#D2B093]">votre habitat</span>
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg"
          >
            Des interventions propres, rapides et soignées pour préserver le confort 
            de votre intérieur comme de votre extérieur.
          </motion.p>

          {/* CARTE CRÉDIT D'IMPÔT - VERSION GRANDE ET ATTRACTIVE */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mt-6 overflow-hidden rounded-2xl border-2 border-[#D2B093] bg-gradient-to-r from-[#D2B093]/40 via-[#D2B093]/25 to-[#D2B093]/10 p-5 backdrop-blur-xl shadow-[0_18px_45px_rgba(0,0,0,0.3)] shadow-[#D2B093]/10"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              {/* Icône avec badge */}
              <div className="relative flex-shrink-0">
                <div className="rounded-full bg-[#D2B093] p-3.5 shadow-lg shadow-[#D2B093]/40">
                  <BadgePercent size={28} className="text-white" />
                </div>
                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#F8E4C7] text-[8px] font-black text-[#0e2b38]">
                  50%
                </div>
              </div>

              {/* Contenu */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold uppercase tracking-[0.12em] text-[#F8E4C7]">
                    💰 Avantage fiscal
                  </span>
                  <span className="rounded-full bg-[#D2B093]/30 px-3 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                    Jusqu'à 50 %
                  </span>
                </div>
                <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                  Crédit d'impôt de 50 %
                </h3>
                <p className="mt-0.5 text-sm text-white/80">
                  Réduction applicable sur nos prestations de service à la personne, sous conditions.
                </p>
              </div>

      
            </div>

            {/* Barre de progression stylisée */}
            <div className="mt-3 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
                <motion.div 
                  className="h-full rounded-full bg-gradient-to-r from-[#D2B093] to-[#F8E4C7]"
                  initial={{ width: 0 }}
                  animate={{ width: '50%' }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                />
              </div>
              <span className="text-[10px] font-bold text-[#D2B093]">50%</span>
            </div>
          </motion.div>

          {/* 3 BOUTONS D'ACCÈS RAPIDE - Style élégant */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-5 flex flex-col gap-2 max-w-sm"
          >
            {QUICK_LINKS.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                whileHover={prefersReducedMotion ? {} : { y: -2, scale: 1.01 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-black/20"
              >
                <div className="flex items-start gap-2.5">
                  <link.icon size={16} className="mt-0.5 text-[#D2B093] shrink-0" />
                  <div>
                    <span className="block text-xs font-medium text-white/90 group-hover:text-white">
                      {link.label}
                    </span>
                    <span className="mt-0.5 block text-[9px] font-medium uppercase tracking-wider text-[#D2B093]">
                      {link.tag}
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Boutons CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <motion.button
              onClick={onDevisClick}
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#C4A882] px-8 py-4 text-sm font-medium text-white transition-all hover:bg-[#D4B896] hover:shadow-lg hover:shadow-[#C4A882]/25"
            >
              <Send size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              Demander un devis gratuit
            </motion.button>

            <motion.a
              href="tel:0607979074"
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/40"
            >
              <Phone size={16} className="text-[#D2B093]" />
              06 07 97 90 74
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
    <ServicesMarquee />
    <TrustBar />
    </>
  );
}