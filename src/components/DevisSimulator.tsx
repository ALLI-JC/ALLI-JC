import { useState, useEffect } from 'react';
import { Send, TrendingUp, Info, CheckCircle, Home, Waves, Leaf, Building2 } from 'lucide-react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';

type ServiceKey = 'vitres' | 'terrasse' | 'tonte' | 'menage' | 'bricolage' | 'interieur';

const servicesConfig: Record<ServiceKey, {
  base: number;
  taux: number;
  label: string;
  icon: React.ElementType;
  description: string;
  unit: string;
  min: number;
  max: number;
}> = {
  vitres:    { base: 45, taux: 0.85, label: 'Nettoyage de vitres',     icon: Waves,     description: 'Baies vitrées, fenêtres, vérandas',   unit: 'm²',    min: 10,  max: 200  },
  terrasse:  { base: 30, taux: 0.60, label: 'Nettoyage terrasse',      icon: Home,      description: 'Nettoyage haute pression',             unit: 'm²',    min: 10,  max: 150  },
  tonte:     { base: 20, taux: 0.45, label: 'Tonte de gazon',          icon: Leaf,      description: 'Entretien jardin',                     unit: 'm²',    min: 50,  max: 1000 },
  menage:    { base: 80, taux: 1.20, label: 'Ménage fin de bail',      icon: Building2, description: 'Remise en état complète',              unit: 'm²',    min: 30,  max: 150  },
  bricolage: { base: 35, taux: 0,    label: 'Petits bricolages',       icon: Waves,     description: 'Montage, réparations',                 unit: 'heure', min: 1,   max: 8    },
  interieur: { base: 50, taux: 0.95, label: 'Nettoyage intérieur',     icon: Home,      description: 'Entretien courant',                    unit: 'm²',    min: 40,  max: 200  },
};

interface DevisSimulatorProps {
  onConfirm: () => void;
}

// ─── Variants ──────────────────────────────────────────────────────────────

const sectionVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUpVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const badgeVariants = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: 'easeOut', delay: i * 0.1 },
  }),
};

// Prix — flip animé
const priceVariants = {
  initial: { opacity: 0, y: -10, scale: 0.95 },
  animate: { opacity: 1, y: 0,   scale: 1,    transition: { duration: 0.25, ease: 'easeOut' } },
  exit:    { opacity: 0, y:  10, scale: 0.95, transition: { duration: 0.15 } },
};

// Ligne de détail (entrée conditionnelle)
const detailLineVariants = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto', transition: { duration: 0.22 } },
  exit:    { opacity: 0, height: 0,      transition: { duration: 0.18 } },
};

export default function DevisSimulator({ onConfirm }: DevisSimulatorProps) {
  const prefersReducedMotion = useReducedMotion();

  const [type, setType]           = useState<ServiceKey>('vitres');
  const [surface, setSurface]     = useState(50);
  const [extraServices, setExtraServices] = useState({
    deplacement: true,
    urgence: false,
    materiel: true,
  });

  const service      = servicesConfig[type];
  const basePrice    = Math.round(service.base + surface * service.taux);
  const deplacementCost = extraServices.deplacement ? 15 : 0;
  const urgenceCost  = extraServices.urgence ? 45 : 0;
  const totalPrice   = basePrice + deplacementCost + urgenceCost;

  // reset surface dans les bornes quand le type change
  useEffect(() => {
    setSurface(Math.min(Math.max(surface, service.min), service.max));
  }, [type]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);

  return (
    <section
      className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden"
      id="sec-devis"
    >
      {/* Blobs décoratifs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#79DBDC]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F5DEB3]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── En-tête ── */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-10 md:mb-12"
          variants={prefersReducedMotion ? {} : sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            variants={prefersReducedMotion ? {} : fadeUpVariants}
          >
            Simulateur de devis
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#79DBDC] to-[#5BBFC0]">
              en 3 clics
            </span>
          </motion.h2>

          <motion.p
            className="text-gray-500"
            variants={prefersReducedMotion ? {} : fadeUpVariants}
          >
            Obtenez une estimation immédiate · Devis définitif gratuit après visite
          </motion.p>
        </motion.div>

        {/* ── Grid principal ── */}
        <motion.div
          className="max-w-4xl mx-auto"
          variants={prefersReducedMotion ? {} : sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── FORMULAIRE ── */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              variants={prefersReducedMotion ? {} : cardVariants}
            >
              <div className="bg-gradient-to-r from-[#79DBDC] to-[#5BBFC0] px-6 py-5 text-white">
                <h3 className="text-xl font-bold">Calculer mon tarif</h3>
                <p className="text-white/80 text-sm mt-1">
                  Simulation indicative — devis définitif gratuit sur place
                </p>
              </div>

              <div className="p-6 space-y-5">

                {/* Type de prestation */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Type de prestation
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(servicesConfig) as ServiceKey[]).map((k) => {
                      const Icon = servicesConfig[k].icon;
                      const isSelected = type === k;
                      return (
                        <motion.button
                          key={k}
                          onClick={() => setType(k)}
                          whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                          whileTap={prefersReducedMotion  ? {} : { scale: 0.97 }}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border transition-colors duration-200 ${
                            isSelected
                              ? 'border-[#79DBDC] bg-[#79DBDC]/5 shadow-sm'
                              : 'border-gray-200 hover:border-[#79DBDC] hover:bg-gray-50'
                          }`}
                        >
                          <Icon
                            size={16}
                            className={isSelected ? 'text-[#79DBDC]' : 'text-gray-400'}
                          />
                          <span className={`text-xs font-medium ${isSelected ? 'text-[#79DBDC]' : 'text-gray-700'}`}>
                            {servicesConfig[k].label.split(' ').slice(0, 2).join(' ')}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Description animée au changement de type */}
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={type}
                      className="text-xs text-gray-400 mt-2"
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 4 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                      exit={prefersReducedMotion   ? {} : { opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {service.description}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Surface / Durée */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {service.unit === 'm²' ? 'Surface estimée' : 'Durée estimée'} ({service.unit})
                    </label>
                    <motion.span
                      key={`${type}-${surface}`}
                      className="text-sm font-bold text-[#79DBDC]"
                      initial={prefersReducedMotion ? {} : { scale: 1.25, opacity: 0.6 }}
                      animate={prefersReducedMotion ? {} : { scale: 1,    opacity: 1   }}
                      transition={{ duration: 0.2 }}
                    >
                      {surface} {service.unit}
                    </motion.span>
                  </div>
                  <input
                    type="range"
                    min={service.min}
                    max={service.max}
                    step={service.unit === 'm²' ? 5 : 0.5}
                    value={surface}
                    onChange={(e) => setSurface(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#79DBDC]"
                    style={{
                      background: `linear-gradient(to right, #79DBDC 0%, #79DBDC ${(surface - service.min) / (service.max - service.min) * 100}%, #e5e7eb ${(surface - service.min) / (service.max - service.min) * 100}%, #e5e7eb 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{service.min} {service.unit}</span>
                    <span>{service.max} {service.unit}</span>
                  </div>
                </div>

                {/* Options supplémentaires */}
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Options complémentaires
                  </p>
                  <div className="space-y-2">
                    {[
                      { key: 'deplacement', label: 'Déplacement inclus',       extra: '+15€' },
                      { key: 'urgence',     label: 'Intervention urgente (24h)', extra: '+45€' },
                    ].map(({ key, label, extra }) => (
                      <label key={key} className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={extraServices[key as keyof typeof extraServices]}
                            onChange={(e) =>
                              setExtraServices({ ...extraServices, [key]: e.target.checked })
                            }
                            className="w-4 h-4 rounded border-gray-300 text-[#79DBDC] focus:ring-[#79DBDC]"
                          />
                          <span className="text-sm text-gray-700">{label}</span>
                        </div>
                        <span className="text-xs text-gray-400">{extra}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── RÉSULTAT ── */}
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl overflow-hidden"
              variants={prefersReducedMotion ? {} : cardVariants}
            >
              <div className="p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-[#79DBDC]" />
                  <h3 className="font-semibold">Votre estimation</h3>
                </div>

                {/* Détail des prix */}
                <div className="space-y-3 mb-6">

                  {/* Prestation de base */}
                  <div className="flex justify-between text-sm text-white/70">
                    <span>Prestation de base</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={basePrice}
                        variants={prefersReducedMotion ? {} : priceVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        {formatPrice(basePrice)}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  {/* Déplacement — apparition/disparition fluide */}
                  <AnimatePresence>
                    {extraServices.deplacement && (
                      <motion.div
                        className="flex justify-between text-sm text-white/70 overflow-hidden"
                        variants={prefersReducedMotion ? {} : detailLineVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <span>+ Déplacement</span>
                        <span>{formatPrice(15)}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Urgence */}
                  <AnimatePresence>
                    {extraServices.urgence && (
                      <motion.div
                        className="flex justify-between text-sm text-white/70 overflow-hidden"
                        variants={prefersReducedMotion ? {} : detailLineVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <span>+ Urgence</span>
                        <span>{formatPrice(45)}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Total */}
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total TTC</span>
                      <div className="text-right">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={totalPrice}
                            className="text-3xl font-bold text-[#79DBDC] inline-block"
                            variants={prefersReducedMotion ? {} : priceVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                          >
                            {formatPrice(totalPrice)}
                          </motion.span>
                        </AnimatePresence>
                        <p className="text-xs text-white/50">Hors TVA (non applicable)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Note info */}
                <div className="bg-white/10 rounded-xl p-4 mb-5">
                  <div className="flex items-start gap-2">
                    <Info size={14} className="text-[#79DBDC] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-white/80 leading-relaxed">
                      Cette estimation est indicative. Le devis définitif sera établi
                      après une visite sur place, sans engagement.
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <motion.button
                  onClick={onConfirm}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.03, boxShadow: '0 8px 30px rgba(121,219,220,0.35)' }}
                  whileTap={prefersReducedMotion   ? {} : { scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#79DBDC] to-[#5BBFC0] text-white py-3.5 rounded-xl text-sm font-semibold"
                >
                  <Send size={16} />
                  Confirmer et recevoir un devis
                </motion.button>

                <p className="text-center text-xs text-white/40 mt-4">
                  Réponse sous 24h · Devis gratuit
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── Badges de confiance ── */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 pt-4">
            {['Devis gratuit', 'Sans engagement', 'Réponse sous 24h'].map((text, i) => (
              <motion.div
                key={text}
                className="flex items-center gap-2 text-sm text-gray-500"
                custom={i}
                variants={prefersReducedMotion ? {} : badgeVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <CheckCircle size={16} className="text-[#79DBDC]" />
                <span>{text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}