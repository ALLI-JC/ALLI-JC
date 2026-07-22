import {
  Droplets, Waves, Leaf, Building2, Home, Wrench, Store, Sparkles,
  ArrowRight, CheckCircle, Star, Shield, FileEdit, Zap, Calculator,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Catégories affichées (ordre + titre + cible)
const categories = [
  { title: 'Entretien Extérieur & Espaces Verts', target: 'Pour les particuliers', icon: Leaf },
];

// Liens vers le simulateur de devis sur la page d'accueil
const getSimulatorLink = (): string => {
  return '/#sec-devis';
};

const services = [
  {
    icon: Waves,
    name: 'Nettoyage haute pression',
    desc: 'Terrasses, allées, façades',
    mention: 'Résultat immédiat avec traitement anti-mousse inclus',
    features: ['Nettoyage écologique', 'Résultat immédiat', 'Prévention des mousses'],
    category: 'Entretien Extérieur & Espaces Verts',
    color: 'from-[#237395] to-[#237395]' // Changé en bleu lagon
  },
  {
    icon: Leaf,
    name: 'Jardinage & espaces verts',
    desc: 'Tonte, taille, entretien des espaces communs',
    mention: 'Collecte et évacuation complète des déchets verts',
    features: ['Élagage et taille', 'Entretien régulier', 'Collecte déchets verts'],
    category: 'Entretien Extérieur & Espaces Verts',
    color: 'from-[#237395] to-[#237395]' // Changé en bleu lagon
  },
  {
    icon: Droplets,
    name: 'Nettoyage de vitres',
    desc: 'Baies vitrées, fenêtres, vérandas',
    mention: 'Intervention en hauteur jusqu\'au R+2 avec matériel professionnel',
    features: ['Hauteur jusqu\'au R+2', 'Matériel professionnel', 'Sans traces'],
    category: 'Entretien Extérieur & Espaces Verts',
    color: 'from-[#237395] to-[#237395]' // Changé en bleu lagon
  },
  {
    icon: Sparkles,
    name: 'Nettoyage intérieur',
    desc: 'Entretien courant et ménage régulier',
    mention: 'Produits écologiques et linge de maison inclus',
    features: ['Linge de maison fourni', 'Aération des pièces', 'Produits écologiques'],
    category: 'Entretien Extérieur & Espaces Verts',
    color: 'from-[#237395] to-[#237395]' // Changé en bleu lagon
  },
  {
    icon: Building2,
    name: 'Ménage fin de bail',
    desc: 'Remise en état complète pour les états des lieux',
    mention: 'Conforme aux normes en vigueur — satisfaction garantie',
    features: ['Conforme aux normes', 'Rapidité d\'exécution', 'Garantie satisfait'],
    category: 'Nettoyages Spécifiques & Remise en État',
    color: 'from-[#237395] to-[#237395]' // Changé en bleu lagon
  },
  {
    icon: Home,
    name: 'Nettoyage fin de chantier',
    desc: 'Nettoyage complet après travaux de construction ou rénovation',
    mention: 'Dépoussiérage complet et évacuation des gravats',
    features: ['Dépoussiérage intensif', 'Lavage des sols', 'Évacuation gravats'],
    category: 'Nettoyages Spécifiques & Remise en État',
    color: 'from-[#237395] to-[#237395]' // Changé en bleu lagon
  },
  {
    icon: Wrench,
    name: 'Petits bricolages',
    desc: 'Montage de meubles, fixations, petites réparations',
    mention: 'Matériel fourni et déplacement inclus',
    features: ['Matériel fourni', 'Déplacement inclus', 'Rapidité d\'intervention'],
    category: 'Nettoyages Spécifiques & Remise en État',
    color: 'from-[#237395] to-[#237395]' // Changé en bleu lagon
  },
  {
    icon: Store,
    name: 'Locaux commerciaux',
    desc: 'Nettoyage de bureaux, commerces et parties communes',
    mention: 'Horaires flexibles et intervention discrète',
    features: ['Horaires flexibles', 'Intervention discrète', 'Produits professionnels'],
    category: 'Services Professionnels & Copropriétés',
    color: 'from-[#237395] to-[#237395]' // Changé en bleu lagon
  },
];

// Variants Framer Motion
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeInUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05, ease: 'easeOut' as any },
  }),
};

const cardVariant: any = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] as any },
  }),
};

const featuresVariant: any = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' as any } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: 'easeIn' as any } },
};

const linkVariant: any = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as any } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.2, ease: 'easeIn' as any } },
};

interface ServiceCardProps {
  icon: React.ElementType;
  name: string;
  desc: string;
  mention: string;
  features: string[];
  index: number;
  color?: string;
}

function ServiceCard({ icon: Icon, name, desc, mention, features, index, color = 'from-[#237395] to-[#237395]' }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const simulatorLink = getSimulatorLink();

  return (
    <motion.div
      custom={index}
      variants={cardVariant}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, boxShadow: '0 25px 50px rgba(0,0,0,0.12)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group relative bg-white rounded-3xl p-6 border border-gray-100/80 overflow-hidden flex flex-col h-full"
    >
      {/* Background gradient animé au hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#237395]/5 via-transparent to-transparent pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Bande décorative en haut */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#237395] to-[#237395]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ transformOrigin: 'left' }}
      />

      {/* Icône avec effet de glow */}
      <div className="relative mb-4">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#237395]/20 to-[#237395]/20 rounded-2xl blur-2xl pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1.2 : 0.8
          }}
          transition={{ duration: 0.4 }}
        />
        <motion.div
          className={`relative w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shadow-lg`}
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? [0, -5, 5, 0] : 0
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Icon size={22} className="text-white" />
        </motion.div>
      </div>

      {/* Titre */}
      <motion.h3
        className="text-lg font-bold mb-2 tracking-tight"
        animate={{ color: isHovered ? '#0e2b38' : '#1f2937' }}
        transition={{ duration: 0.25 }}
        style={{ fontFamily: 'var(--font-roboto)' }}
      >
        {name}
      </motion.h3>

      {/* Description */}
      <p className="text-sm text-gray-500 mb-3 leading-relaxed flex-grow">
        {desc}
      </p>

      {/* Mention principale */}
      <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#237395]/10 to-[#237395]/5 border border-[#237395]/15 mb-3">
        <Shield size={13} className="text-[#237395] flex-shrink-0 mt-0.5" />
        <span className="text-xs text-[#237395] leading-snug font-medium">
          {mention}
        </span>
      </div>

      {/* Caractéristiques au survol */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="space-y-1.5 overflow-hidden mt-2"
            variants={featuresVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 text-xs text-gray-600"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.25 }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#237395] to-[#237395] flex-shrink-0" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boutons CTA au survol */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100/80"
            variants={linkVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.a
              href={simulatorLink}
              className="group/link flex items-center gap-1.5 text-sm font-medium text-[#0e2b38] hover:text-[#C4A882] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <span>En savoir plus</span>
              <motion.span
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <ArrowRight size={14} />
              </motion.span>
            </motion.a>

            <span className="w-px h-5 bg-gray-200" />

            <motion.a
              href={simulatorLink}
              className="group/link flex items-center gap-1.5 text-sm font-medium text-[#C4A882] hover:text-[#D4B896] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Calculator size={14} />
              <span>Estimer</span>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-[#eef5f7] to-white" id="sec-services">

      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#237395] to-transparent opacity-30" />

      {/* Cercles décoratifs flous */}
      <div className="absolute -top-60 -right-60 w-96 h-96 bg-[#237395]/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-60 -left-60 w-96 h-96 bg-[#F5DEB3]/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#237395]/3 rounded-full blur-3xl pointer-events-none" />

      {/* Petits points décoratifs */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-[#237395]/30 rounded-full hidden lg:block" />
      <div className="absolute bottom-20 left-20 w-3 h-3 bg-[#237395]/20 rounded-full hidden lg:block" />
      <div className="absolute top-1/2 right-10 w-1.5 h-1.5 bg-[#237395]/20 rounded-full hidden lg:block" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* En-tête */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-14 md:mb-20"
          style={{ fontFamily: 'var(--font-palatino)' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.div
            custom={0}
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#237395]/10 border border-[#237395]/20 text-xs font-medium text-[#237395] tracking-wider uppercase mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#237395]" />
            Nos prestations
          </motion.div>

          <motion.h2
            custom={1}
            variants={fadeInUp}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight"
          >
            Des services sur mesure
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#237395] to-[#237395]">
              pour votre habitat
            </span>
          </motion.h2>

          <motion.p custom={2} variants={fadeInUp} className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
            Des prestations adaptées à tous vos besoins, pour les particuliers comme pour les professionnels.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeInUp}
            className="mt-6 flex flex-col items-center justify-center gap-3"
          >
            <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-[#237395]/20 bg-[#237395]/10 px-4 py-2 text-sm font-semibold text-[#237395] shadow-sm">
              <Shield size={16} className="text-[#237395]" />
              Crédit d’impôt de 50 % pour les particuliers
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
              Les prestations de service à la personne peuvent bénéficier de cette réduction, ce qui rend nos interventions plus accessibles.
            </p>
          </motion.div>

          {/* Badges de qualité */}
          <motion.div
            custom={3}
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center gap-3 mt-6"
          >
            {[
              { icon: FileEdit, label: 'Devis gratuit' },
              { icon: Shield, label: 'Entreprise assurée' },
              { icon: Zap, label: 'Intervention rapide' },
              { icon: Star, label: 'Satisfaction garantie' },
            ].map((badge, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-100/80 text-xs font-medium text-gray-600 shadow-sm hover:shadow-md transition-shadow"
              >
                <badge.icon size={14} className="text-[#237395]" />
                {badge.label}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Grille des services regroupée par catégorie */}
        <div className="space-y-16 md:space-y-20">
          {categories.map((category, catIndex) => {
            const items = services.filter((s) => s.category === category.title);
            if (items.length === 0) return null;

            const offset = categories
              .slice(0, catIndex)
              .reduce((acc, c) => acc + services.filter((s) => s.category === c.title).length, 0);

            return (
              <div key={category.title}>
                {/* En-tête de catégorie */}
                <motion.div
                  className="mb-8 flex flex-wrap items-center justify-center gap-4 text-center"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#237395]/10">
                      <category.icon size={20} className="text-[#237395]" />
                    </div>
                    <h3
                      className="text-xl md:text-2xl font-bold text-gray-800"
                      style={{ fontFamily: 'var(--font-roboto)' }}
                    >
                      {category.title}
                    </h3>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-white border border-[#237395]/20 px-3.5 py-1.5 text-xs font-medium text-[#237395] shadow-sm">
                    {category.target}
                  </span>
                </motion.div>

                {/* Grille des cartes */}
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={staggerContainer}
                >
                  {items.map((service, i) => (
                    <ServiceCard key={service.name} {...service} index={offset + i} />
                  ))}
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* CTA final */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <a
            href="/#sec-devis"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#C4A882] text-white font-medium shadow-lg shadow-[#C4A882]/25 hover:shadow-xl hover:shadow-[#C4A882]/30 transition-all hover:scale-105 hover:bg-[#D4B896]"
          >
            <span>Obtenir un devis personnalisé</span>
            <ChevronRight size={18} />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
