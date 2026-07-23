import { motion, useReducedMotion } from 'framer-motion';
import { Phone, MapPin, ExternalLink } from 'lucide-react';

// ─── Logo placeholder ────────────────────────────────────────────────────────
// Remplacez ce composant par votre vrai logo : <img src="/logo.svg" alt="L'Allié JC" />
function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Slot image logo — remplacer par <img src="/logo.svg" … /> */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-white/20"
        style={{ background: 'rgba(255,255,255,0.10)' }}
        aria-label="Logo L'Allié JC"
      >
        {/* Initiales de fallback */}
        <span className="font-serif text-[15px] font-bold text-white leading-none select-none">JC</span>
      </div>
      <div>
        <div className="font-serif text-[19px] text-white leading-tight">L'Allié JC</div>
        <div className="text-[11px] text-[#D2B093] tracking-wide">Multiservices · Doubs &amp; Jura</div>
      </div>
    </div>
  );
}

const services = [
  'Nettoyage haute pression',
  'Jardinage & espaces verts',
  'Nettoyage de vitres',
  'Nettoyage intérieur',
  
];

const contact = [
  { icon: Phone, label: '06 07 97 90 74', href: 'tel:0607979074' },
  { icon: MapPin, label: 'La Rivière-Drugeon', href: null },
  { icon: MapPin, label: 'Doubs & Jura', href: null },
];

// ─── Variants ────────────────────────────────────────────────────────────────
const colVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.48, ease: 'easeOut', delay: i * 0.1 },
  }),
};

const listStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const listItem = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

const dividerVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.7, ease: 'easeOut', delay: 0.3 } },
};

export default function Footer() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {/* ── Bande de copyright — au-dessus du footer, en sable et texte blanc ── */}
      <div className="relative">
        <div
          className="text-center py-3.5 text-[11px] relative z-10 border-b border-white/15"
          style={{ backgroundColor: '#D2B093', color: '#ffffff', fontFamily: 'var(--font-roboto)' }}
        >
          © 2026 L'Allié JC · Tous droits réservés ·{' '}
          <a
            href="/mentions-legales"
            className="transition-colors duration-150 hover:text-[#0e2b38]"
          >
            Mentions légales
          </a>
        </div>
      </div>

      <footer
        className="relative overflow-hidden"
        style={{ backgroundColor: '#0e2b38', fontFamily: 'var(--font-roboto)' }}
      >
        {/* Blob décoratif discret */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'rgba(210,176,147,0.07)', filter: 'blur(48px)' }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.04)', filter: 'blur(40px)' }}
        />

        <div className="relative container mx-auto px-8 pt-14 pb-10 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">

            {/* ── Col 1 — Logo + présentation ── */}
            <motion.div
              custom={0}
              variants={prefersReducedMotion ? {} : colVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="realtive mb-5">
                {/* <Logo /> */}
                <img src="/alliéjc-logo-4.png" alt="L'Allié JC" className="absolute left-0 top-10 h-[320px] w-auto" />
              </div>
              <p className="text-[12.5px] leading-[1.8]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Entreprise individuelle fondée en juin 2026 par Jean Charles Biernat. Interventions
                soignées pour particuliers, copropriétés et professionnels dans le Haut-Doubs et le Jura.
              </p>

              {/* Ligne dorée signature */}
              <motion.div
                className="mt-6 h-[2px] w-12 rounded-full origin-left"
                style={{ background: '#D2B093' }}
                variants={prefersReducedMotion ? {} : dividerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              />
            </motion.div>

            {/* ── Col 2 — Services ── */}
            <motion.div
              custom={1}
              variants={prefersReducedMotion ? {} : colVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h4
                className="text-[11px] font-semibold uppercase tracking-widest mb-4"
                style={{ color: '#D2B093' }}
              >
                Services
              </h4>
              <motion.ul
                className="space-y-2"
                variants={prefersReducedMotion ? {} : listStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {services.map((s) => (
                  <motion.li
                    key={s}
                    variants={prefersReducedMotion ? {} : listItem}
                    className="flex items-center gap-2 text-[12.5px]"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    <span style={{ color: '#D2B093', fontSize: '10px' }}>—</span>
                    {s}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* ── Col 3 — Contact ── */}
            <motion.div
              custom={2}
              variants={prefersReducedMotion ? {} : colVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h4
                className="text-[11px] font-semibold uppercase tracking-widest mb-4"
                style={{ color: '#D2B093' }}
              >
                Contact
              </h4>

              <motion.ul
                className="space-y-3 mb-6"
                variants={prefersReducedMotion ? {} : listStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {contact.map(({ icon: Icon, label, href }) => (
                  <motion.li
                    key={label}
                    variants={prefersReducedMotion ? {} : listItem}
                    className="flex items-center gap-2.5 text-[12.5px]"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    <Icon size={13} style={{ color: '#D2B093', flexShrink: 0 }} />
                    {href ? (
                      <a
                        href={href}
                        className="transition-colors duration-200 hover:text-white"
                      >
                        {label}
                      </a>
                    ) : (
                      <span>{label}</span>
                    )}
                  </motion.li>
                ))}
              </motion.ul>

              {/* CTA devis */}
              <motion.a
                href="#sec-devis"
                className="inline-flex items-center gap-2 text-[12px] font-semibold px-4 py-2.5 rounded-lg border"
                style={{
                  color: '#D2B093',
                  borderColor: 'rgba(210,176,147,0.4)',
                  backgroundColor: 'rgba(210,176,147,0.07)',
                }}
                whileHover={prefersReducedMotion ? {} : {
                  backgroundColor: 'rgba(210,176,147,0.18)',
                  borderColor: 'rgba(210,176,147,0.7)',
                }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                transition={{ duration: 0.18 }}
              >
                <ExternalLink size={12} />
                Devis gratuit
              </motion.a>
            </motion.div>
          </div>
        </div>
      </footer>

    </>
  );
}