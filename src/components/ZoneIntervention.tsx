import { MapPin, Zap } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const zones = [
  'Pontarlier', 'Mouthe', 'La Rivière-Drugeon',
  'Champagnole', 'Pontarlier agglo', 'Haut-Doubs',
];

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const chipVariant = {
  hidden:  { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

const imageVariant = {
  hidden:  { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const contentVariant = {
  hidden:  { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut', delay: 0.1 } },
};

export default function ZoneIntervention() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-16 bg-gray-50" id="sec-zone">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* ── En-tête ── */}
        <motion.div
          className="text-center mb-10"
          variants={prefersReducedMotion ? {} : stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 text-[#79DBDC] mb-2"
            variants={prefersReducedMotion ? {} : fadeUp}
          >
            <MapPin size={16} />
            <span className="text-xs font-medium tracking-wide">Zone d'intervention</span>
          </motion.div>

          <motion.h2
            className="text-3xl font-serif font-bold text-gray-800 mb-5"
            variants={prefersReducedMotion ? {} : fadeUp}
          >
            Doubs & <span className="text-[#79DBDC]">Jura</span>
          </motion.h2>

          {/* ── Intervention rapide — badge proéminent ── */}
          {/* <motion.div
            variants={prefersReducedMotion ? {} : fadeUp}
            className="inline-flex"
          >
            <motion.div
              animate={prefersReducedMotion ? {} : {
                boxShadow: [
                  '0 0 0px 0px rgba(121,219,220,0)',
                  '0 0 18px 4px rgba(121,219,220,0.45)',
                  '0 0 0px 0px rgba(121,219,220,0)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-white font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, #79DBDC 0%, #5BBFC0 100%)' }}
            >
              <motion.span
                animate={prefersReducedMotion ? {} : { rotate: [0, -15, 15, -10, 0] }}
                transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.5 }}
              >
                <Zap size={15} fill="white" />
              </motion.span>
              Intervention rapide
            </motion.div>
          </motion.div> */}
        </motion.div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Image */}
          <motion.div
            className="rounded-xl overflow-hidden shadow-md"
            variants={prefersReducedMotion ? {} : imageVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <img
              src="/Van-alliéjc.jpg"
              alt="Zone d'intervention - Van Alli JC"
              className="w-full h-56 object-cover"
            />
          </motion.div>

          {/* Contenu */}
          <motion.div
            variants={prefersReducedMotion ? {} : contentVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <p className="text-gray-600 text-sm leading-relaxed mb-5">
              Intervention rapide sur tout le secteur du Doubs et une partie du Jura.
              Idéal pour les frontaliers suisses et les particuliers de la région.
            </p>

            {/* Chips zones */}
            <motion.div
              className="flex flex-wrap gap-2"
              variants={prefersReducedMotion ? {} : stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {zones.map((zone) => (
                <motion.span
                  key={zone}
                  variants={prefersReducedMotion ? {} : chipVariant}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.07, borderColor: '#79DBDC', color: '#5BBFC0' }}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-700 cursor-default"
                  style={{ transition: 'color 0.2s, border-color 0.2s' }}
                >
                  {zone}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}