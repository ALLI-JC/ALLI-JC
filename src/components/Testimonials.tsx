import { motion, useReducedMotion } from 'framer-motion';

const testimonials = [
  {
    initials: 'ML',
    name: 'Marie L.',
    location: 'Pontarlier',
    text: '"Vitres impeccables, ponctuel et très soigneux. Je recommande sans hésiter pour l\'entretien régulier."',
  },
  {
    initials: 'SD',
    name: 'Sandrine D.',
    location: 'Mouthe',
    text: '"Terrasse nettoyée comme neuve. Tarif honnête et travail propre. Parfait pour nos locaux commerciaux."',
  },
  {
    initials: 'PB',
    name: 'Pierre B.',
    location: 'La Rivière-Drugeon',
    text: '"Ménage de fin de bail réalisé avec soin. L\'état des lieux s\'est très bien passé grâce à lui."',
  },
];

const headerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const gridVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.45, ease: 'easeOut' } },
};

const starVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const starItem = {
  hidden:  { opacity: 0, scale: 0.4 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 18 } },
};

export default function Testimonials() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="px-8 py-12" id="sec-temos">

      {/* En-tête */}
      <motion.div
        className="text-center mb-8"
        variants={prefersReducedMotion ? {} : headerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        style={{ fontFamily: 'var(--font-palatino)' }}
      >
        <motion.div
          className="text-[11px] font-medium uppercase tracking-widest text-teal-400 mb-2"
          variants={prefersReducedMotion ? {} : fadeUp}
        >
          Ce qu'ils en disent
        </motion.div>
        <motion.h2
          className="font-serif text-[26px] font-semibold text-gray-900"
          variants={prefersReducedMotion ? {} : fadeUp}
        >
          Avis clients
        </motion.h2>
      </motion.div>

      {/* Grille */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={prefersReducedMotion ? {} : gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {testimonials.map(({ initials, name, location, text }) => (
          <motion.div
            key={name}
            variants={prefersReducedMotion ? {} : cardVariants}
            whileHover={prefersReducedMotion ? {} : {
              y: -4,
              boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
              borderColor: 'rgba(94,234,212,0.5)',
            }}
            className="border border-gray-200 rounded-xl p-5 bg-white"
            style={{ transition: 'border-color 0.2s' }}
          >
            {/* Étoiles en stagger */}
            <motion.div
              className="flex gap-0.5 mb-2.5"
              variants={prefersReducedMotion ? {} : starVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="text-yellow-400 text-[13px]"
                  variants={prefersReducedMotion ? {} : starItem}
                >
                  ★
                </motion.span>
              ))}
            </motion.div>

            <p className="text-[13px] text-gray-600 leading-relaxed italic mb-3.5">{text}</p>

            <div className="flex items-center gap-2.5">
              <motion.div
                className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-[12px] font-medium text-teal-700 shrink-0"
                whileHover={prefersReducedMotion ? {} : { scale: 1.12 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {initials}
              </motion.div>
              <div>
                <div className="text-[12px] font-medium text-gray-900">{name}</div>
                <div className="text-[11px] text-gray-400">{location}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}