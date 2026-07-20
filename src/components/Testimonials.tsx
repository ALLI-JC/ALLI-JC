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
    <section className="px-4 py-16 md:px-8" id="sec-temos" style={{ backgroundColor: '#eef6f6' }}>

      {/* En-tête */}
      <motion.div
        className="text-center mb-8"
        variants={prefersReducedMotion ? {} : headerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
      >
        <motion.div
          className="text-[11px] font-medium uppercase tracking-widest mb-2"
          style={{ color: '#237395' }}
          variants={prefersReducedMotion ? {} : fadeUp}
        >
          Ce qu'ils en disent
        </motion.div>
        <motion.h2
          className="font-serif text-[26px] font-semibold"
          style={{ color: '#1c3a47' }}
          variants={prefersReducedMotion ? {} : fadeUp}
        >
          Avis clients
        </motion.h2>
      </motion.div>

      {/* Grille */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto"
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
              boxShadow: '0 12px 32px rgba(35,115,149,0.12)',
              borderColor: '#237395',
            }}
            className="border rounded-xl p-5 bg-white card-hover"
            style={{ 
              borderColor: 'rgba(35,115,149,0.15)',
              transition: 'border-color 0.2s, box-shadow 0.3s, transform 0.3s'
            }}
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
                  className="text-[13px]"
                  style={{ color: '#e0a84a' }}
                  variants={prefersReducedMotion ? {} : starItem}
                >
                  ★
                </motion.span>
              ))}
            </motion.div>

            <p className="text-[13px] leading-relaxed italic mb-3.5" style={{ color: '#4a6b78' }}>
              {text}
            </p>

            <div className="flex items-center gap-2.5">
              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium shrink-0"
                style={{ 
                  backgroundColor: 'rgba(35,115,149,0.12)',
                  color: '#237395'
                }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.12 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {initials}
              </motion.div>
              <div>
                <div className="text-[12px] font-medium" style={{ color: '#1c3a47' }}>
                  {name}
                </div>
                <div className="text-[11px]" style={{ color: '#4a6b78' }}>
                  {location}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}