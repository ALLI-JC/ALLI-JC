import { motion, useReducedMotion } from 'framer-motion';

// Liste des services (identique au Hero)
const SERVICES = [
  'Nettoyage de vitres',
  'Bricolage',
  'Nettoyage intérieur / extérieur',
  'Entretien terrasses et jardin',
  'Espaces verts copropriétés & communes',
  'Ménage de remise en état fin de bail',
  'Ménage de fin de chantier',
  'Nettoyage de locaux commerciaux',
  'Nettoyage des parties communes',
  'Et bien plus encore…',
];

export default function ServicesMarquee() {
  const prefersReducedMotion = useReducedMotion();

  // On duplique la liste pour un défilement en boucle sans couture (-50% = 1 copie)
  const items = [...SERVICES, ...SERVICES];

  return (
    <div className="relative overflow-hidden bg-[#237395] py-3.5">
      {/* Fondus sur les bords gauche / droite */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#237395] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#237395] to-transparent" />

      <motion.div
        className="flex w-max whitespace-nowrap"
        animate={prefersReducedMotion ? undefined : { x: ['0%', '-50%'] }}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 45, ease: 'linear', repeat: Infinity }
        }
      >
        {items.map((label, i) => (
          <span key={i} className="flex items-center">
            <span className="px-6 text-sm font-medium text-white/90">
              {label}
            </span>
            <span className="text-[#D2B093]" aria-hidden="true">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
