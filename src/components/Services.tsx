import {
    Droplets, Waves, Leaf, Building2, Home, Wrench, Store, Sparkles,
    ArrowRight, CheckCircle, Star, Shield, FileEdit, Zap
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Catégories affichées (ordre + titre + cible)
const categories = [
  { title: 'Entretien Extérieur & Espaces Verts', target: 'Particuliers' },
  { title: 'Services Professionnels & Copropriétés', target: 'Entreprises & Syndics' },
  { title: 'Nettoyages spécifiques', target: 'Transitions immobilières' },
];

const services = [
  {
    icon: Droplets,
    name: 'Nettoyage de vitres',
    desc: 'Baies vitrées, fenêtres, vérandas',
    mention: 'Intervention en hauteur jusqu\'au R+2',
    features: ['Hauteur jusqu\'au R+2', 'Matériel professionnel', 'Sans traces'],
      category: 'Entretien Extérieur & Espaces Verts'
  },
  {
    icon: Waves,
    name: 'Nettoyage haute pression',
    desc: 'Terrasses, allées, façades',
    mention: 'Résultat immédiat, traitement anti-mousse inclus',
    features: ['Nettoyage écologique', 'Résultat immédiat', 'Prévention mousses'],
      category: 'Entretien Extérieur & Espaces Verts'
  },
  {
    icon: Leaf,
    name: 'Jardinage & espaces verts',
    desc: 'Tonte, taille, entretien communs',
    mention: 'Collecte et évacuation des déchets verts',
    features: ['Dératisation', 'Élagage', 'Collecte déchets verts'],
      category: 'Entretien Extérieur & Espaces Verts'
  },
  {
    icon: Sparkles,
    name: 'Nettoyage intérieur',
    desc: 'Entretien courant, ménage régulier',
    mention: 'Produits écologiques, linge de maison inclus',
    features: ['Linge de maison', 'Aération', 'Produits écologiques'],
      category: 'Entretien Extérieur & Espaces Verts'
  },
  {
    icon: Building2,
    name: 'Ménage fin de bail',
    desc: 'Remise en état, états des lieux',
    mention: 'Conforme aux normes — satisfaction garantie',
    features: ['Conforme aux normes', 'Rapidité', 'Garantie satisfait'],
    category: 'Nettoyages spécifiques'
  },
  {
    icon: Home,
    name: 'Fin de chantier',
    desc: 'Nettoyage après travaux',
    mention: 'Dépoussiérage complet et évacuation des gravats',
    features: ['Dépoussiérage', 'Lavage sols', 'Évacuation gravats'],
    category: 'Nettoyages spécifiques'
  },
  {
    icon: Wrench,
    name: 'Petits bricolages',
    desc: 'Montage, fixation, petites réparations',
    mention: 'Matériel fourni, déplacement inclus',
    features: ['Matériel fourni', 'Déplacement inclus', 'Rapidité'],
    category: 'Nettoyages spécifiques'
  },
  {
    icon: Store,
    name: 'Locaux commerciaux',
    desc: 'Nettoyage bureaux, parties communes',
    mention: 'Horaires flexibles, intervention discrète',
    features: ['Horaires flexibles', 'Discrétion', 'Produits professionnels'],
    category: 'Services Professionnels & Copropriétés'
  },
];

// Variants Framer Motion
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
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
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, delay: i * 0.07, ease: 'easeOut' as any },
  }),
};

const featuresVariant: any = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' as any } },
  exit:   { opacity: 0, height: 0,    transition: { duration: 0.2, ease: 'easeIn' as any } },
};

const linkVariant = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
  exit:   { opacity: 0, x: -8, transition: { duration: 0.15 } },
};

interface ServiceCardProps {
  icon: React.ElementType;
  name: string;
  desc: string;
  mention: string;
  features: string[];
  index: number;
}

function ServiceCard({ icon: Icon, name, desc, mention, features, index }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      custom={index}
      variants={cardVariant}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.10)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group relative bg-white rounded-2xl p-6 border border-gray-100 overflow-hidden cursor-pointer"
    >
      {/* Background gradient au hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#79DBDC]/5 to-transparent pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Icône */}
      <div className="relative mb-4">
        <motion.div
          className="absolute inset-0 bg-[#79DBDC]/20 rounded-xl blur-xl pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
        <motion.div
          className="relative w-12 h-12 bg-gradient-to-br from-[#79DBDC] to-[#5BBFC0] rounded-xl flex items-center justify-center shadow-md"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Icon size={20} className="text-white" />
        </motion.div>
      </div>

      {/* Titre */}
      <motion.h3
        className="text-lg font-bold mb-2"
        animate={{ color: isHovered ? '#79DBDC' : '#1f2937' }}
        transition={{ duration: 0.25 }}
        style={{ fontFamily: 'var(--font-roboto)' }}
      >
        {name}
      </motion.h3>

      {/* Description */}
      <p className="text-sm text-gray-500 mb-3 leading-relaxed">
        {desc}
      </p>

      {/* Mention div du service */}
      <div className="flex items-start gap-1.5 px-3 py-2 rounded-lg bg-[#79DBDC]/8 border border-[#79DBDC]/20 mb-3">
        <Shield size={12} className="text-[#5BBFC0] flex-shrink-0 mt-0.5" />
        <span className="text-xs text-[#3a9a9b] leading-snug font-medium">
          {mention}
        </span>
      </div>

      {/* Features — AnimatePresence pour entrée/sortie fluide */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="space-y-1.5 overflow-hidden mt-3"
            variants={featuresVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-1.5 text-xs text-gray-600"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.2 }}
              >
                <CheckCircle size={12} className="text-[#79DBDC] flex-shrink-0" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lien — AnimatePresence pour entrée/sortie */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="flex items-center gap-1 mt-4 text-xs font-medium text-[#79DBDC]"
            variants={linkVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <span>En savoir plus</span>
            <motion.span
              animate={{ x: isHovered ? 3 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <ArrowRight size={12} />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-[#eef5f7]" id="sec-services">

      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#79DBDC] to-transparent opacity-30" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#79DBDC]/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#F5DEB3]/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* En-tête */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
          style={{ fontFamily: 'var(--font-palatino)' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2
            custom={0}
            variants={fadeInUp}
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Nos services
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#79DBDC] to-[#5BBFC0]">
              pour votre habitat
            </span>
          </motion.h2>

          <motion.p custom={1} variants={fadeInUp} className="text-base md:text-lg text-gray-500 mb-6">
            Des prestations adaptées à tous vos besoins, pour les particuliers et professionnels
          </motion.p>

          {/* Mention div du titre */}
          <motion.div
            custom={2}
            variants={fadeInUp}
            className="inline-flex flex-wrap items-center justify-center gap-4 px-6 py-3 rounded-2xl border border-gray-100 bg-white shadow-sm text-sm text-gray-500"
          >
            {/*<span className="flex items-center gap-1.5">*/}
            {/*  <CheckCircle size={14} className="text-[#79DBDC]" />*/}
            {/*  Devis gratuit*/}
            {/*</span>*/}

              <span className="flex items-center gap-1.5">
                  <FileEdit size={14} className="text-[#79DBDC]"/>
                  Devis gratuit
              </span>
            <span className="w-px h-4 bg-gray-200" />
            <span className="flex items-center gap-1.5">
              <Shield size={14} className="text-[#79DBDC]" />
              Entreprise assurée
            </span>
            <span className="w-px h-4 bg-gray-200" />
            {/*<span className="flex items-center gap-1.5">*/}
            {/*  <Clock size={14} className="text-[#79DBDC]" />*/}
            {/*  Intervention rapide*/}
            {/*</span>*/}
              <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-[#79DBDC]"/>
              Intervention rapide
            </span>
            <span className="w-px h-4 bg-gray-200" />
            <span className="flex items-center gap-1.5">
              <Star size={14} className="text-[#79DBDC]" />
              Satisfaction garantie
            </span>
          </motion.div>
        </motion.div>

        {/* Grille des services regroupée par catégorie */}
        <div className="space-y-12 md:space-y-16">
          {categories.map((category, catIndex) => {
            const items = services.filter((s) => s.category === category.title);
            if (items.length === 0) return null;

            // Index global continu pour conserver un stagger fluide entre les sections
            const offset = categories
              .slice(0, catIndex)
              .reduce((acc, c) => acc + services.filter((s) => s.category === c.title).length, 0);

            return (
              <div key={category.title}>
                {/* En-tête de catégorie + badge cible */}
                <motion.div
                  className="mb-6 flex flex-wrap items-center justify-center gap-3 text-center"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3
                    className="text-xl md:text-2xl font-bold text-[#3a9a9b]"
                    style={{ fontFamily: 'var(--font-roboto)' }}
                  >
                    {category.title}
                  </h3>
                  <span className="inline-flex items-center rounded-full bg-[#79DBDC]/10 border border-[#79DBDC]/20 px-3 py-1 text-xs font-medium text-[#3a9a9b]">
                    Pour {category.target}
                  </span>
                </motion.div>

                {/* Cartes de la catégorie — flex centré, largeurs = grille 4 colonnes */}
                <motion.div
                  className="flex flex-wrap justify-center gap-5 md:gap-6"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={staggerContainer}
                >
                  {items.map((service, i) => (
                    <div
                      key={service.name}
                      className="w-full sm:w-[calc(50%-0.625rem)] md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
                    >
                      <ServiceCard {...service} index={offset + i} />
                    </div>
                  ))}
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Mention div globale bas de section */}
        <motion.div
          className="flex items-center justify-center gap-3 mt-10 px-6 py-4 border border-gray-100 rounded-2xl bg-gray-50/60 text-sm text-gray-500 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CheckCircle size={16} className="text-[#79DBDC] flex-shrink-0" />
          <span>
            Tous nos services sont réalisés avec des produits professionnels éco-responsables, par des intervenants qualifiés et assurés.
          </span>
        </motion.div>

      </div>
    </section>
  );
}
