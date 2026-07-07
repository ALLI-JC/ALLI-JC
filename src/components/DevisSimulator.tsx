import { useState } from 'react';
import {
  Send, TrendingUp, Info, CheckCircle,
  Home, Waves, Leaf, Building2, Sparkles, Scissors, Trash2,
} from 'lucide-react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';

// ─── Familles de prestations (ordre = cahier des charges) ────────────────────

type Famille = 'jardinage' | 'terrasse' | 'finBail' | 'finChantier' | 'vitres';

const FAMILLES: {
  key: Famille;
  label: string;   // libellé complet
  short: string;   // libellé bouton
  icon: React.ElementType;
  dispo: boolean;  // implémentée ?
}[] = [
  { key: 'jardinage',   label: 'Jardinage & espaces verts',  short: 'Jardinage',       icon: Leaf,      dispo: true  },
  { key: 'terrasse',    label: 'Terrasses (haute pression)', short: 'Terrasses',       icon: Waves,     dispo: false },
  { key: 'finBail',     label: 'Nettoyage fin de bail',      short: 'Fin de bail',     icon: Building2, dispo: false },
  { key: 'finChantier', label: 'Nettoyage fin de chantier',  short: 'Fin de chantier', icon: Home,      dispo: false },
  { key: 'vitres',      label: 'Vitres (entretien)',         short: 'Vitres',          icon: Sparkles,  dispo: false },
];

// ─── Grille tarifaire (source unique de vérité — cahier des charges) ─────────

const TARIFS = {
  jardinage: {
    // Tonte / débroussaillage : paliers par surface
    tonte: { forfaitPetit: 50, seuilPetit: 100, tauxMoyen: 0.70, seuilMoyen: 400, tauxGrand: 0.40 },
    // Taille de haies : au mètre linéaire, selon hauteur (seuil 2 m)
    haies: { bas: 6, haut: 13 },
    // Évacuation des déchets verts
    evacuation: { tauxM3: 30 },
  },
};

// ─── Types de calcul ─────────────────────────────────────────────────────────

interface Ligne {
  label: string;
  montant: number;
}

// État du formulaire Jardinage
interface JardinageState {
  tonte:      { on: boolean; surface: number };
  haies:      { on: boolean; metres: number; hauteur: 'bas' | 'haut' };
  evacuation: { on: boolean; volume: number };
}

// ─── Moteurs de calcul par famille ───────────────────────────────────────────

function computeJardinage(j: JardinageState): Ligne[] {
  const lines: Ligne[] = [];
  const t = TARIFS.jardinage;

  if (j.tonte.on) {
    const s = j.tonte.surface;
    let montant: number;
    if (s < t.tonte.seuilPetit) montant = t.tonte.forfaitPetit;              // < 100 m² → forfait
    else if (s <= t.tonte.seuilMoyen) montant = s * t.tonte.tauxMoyen;       // 100–400 m² → 0,70 €/m²
    else montant = s * t.tonte.tauxGrand;                                    // > 400 m² → 0,40 €/m²
    lines.push({ label: `Tonte / débroussaillage · ${s} m²`, montant: Math.round(montant) });
  }

  if (j.haies.on) {
    const taux = j.haies.hauteur === 'bas' ? t.haies.bas : t.haies.haut;
    lines.push({
      label: `Taille de haies · ${j.haies.metres} ml (${j.haies.hauteur === 'bas' ? '< 2 m' : '> 2 m'})`,
      montant: Math.round(j.haies.metres * taux),
    });
  }

  if (j.evacuation.on) {
    lines.push({
      label: `Évacuation déchets verts · ${j.evacuation.volume} m³`,
      montant: Math.round(j.evacuation.volume * t.evacuation.tauxM3),
    });
  }

  return lines;
}

// Fond de piste du slider (progression teal)
const sliderBg = (v: number, min: number, max: number) => {
  const pct = ((v - min) / (max - min)) * 100;
  return `linear-gradient(to right, #79DBDC 0%, #79DBDC ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`;
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

  const [famille, setFamille] = useState<Famille>('jardinage');

  const [jardinage, setJardinage] = useState<JardinageState>({
    tonte:      { on: true,  surface: 200 },
    haies:      { on: false, metres: 10, hauteur: 'bas' },
    evacuation: { on: false, volume: 1 },
  });

  // Lignes de détail selon la famille active
  const lines: Ligne[] = famille === 'jardinage' ? computeJardinage(jardinage) : [];
  const totalPrice = lines.reduce((sum, l) => sum + l.montant, 0);

  const familleDispo = FAMILLES.find((f) => f.key === famille)?.dispo ?? false;

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

                {/* Choix de la prestation */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Type de prestation
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {FAMILLES.map((f) => {
                      const Icon = f.icon;
                      const isSelected = famille === f.key;
                      return (
                        <motion.button
                          key={f.key}
                          onClick={() => setFamille(f.key)}
                          whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                          whileTap={prefersReducedMotion  ? {} : { scale: 0.97 }}
                          className={`relative flex items-center gap-2 p-2.5 rounded-xl border transition-colors duration-200 ${
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
                            {f.short}
                          </span>
                          {!f.dispo && (
                            <span className="ml-auto text-[9px] font-semibold text-gray-400 bg-gray-100 rounded px-1 py-0.5">
                              bientôt
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Formulaire dynamique selon la famille ── */}
                <AnimatePresence mode="wait">
                  {famille === 'jardinage' ? (
                    <motion.div
                      key="jardinage"
                      className="space-y-3"
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 6 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                      exit={prefersReducedMotion   ? {} : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Poste : Tonte / débroussaillage */}
                      <div className="rounded-xl border border-gray-200 p-3">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Leaf size={16} className="text-[#5BBFC0]" />
                            Tonte / débroussaillage
                          </span>
                          <input
                            type="checkbox"
                            checked={jardinage.tonte.on}
                            onChange={(e) =>
                              setJardinage((j) => ({ ...j, tonte: { ...j.tonte, on: e.target.checked } }))
                            }
                            className="w-4 h-4 rounded border-gray-300 text-[#79DBDC] focus:ring-[#79DBDC]"
                          />
                        </label>
                        <AnimatePresence>
                          {jardinage.tonte.on && (
                            <motion.div
                              className="overflow-hidden"
                              variants={prefersReducedMotion ? {} : detailLineVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                            >
                              <div className="pt-3">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-gray-400">Surface</span>
                                  <span className="text-sm font-bold text-[#79DBDC]">{jardinage.tonte.surface} m²</span>
                                </div>
                                <input
                                  type="range"
                                  min={10}
                                  max={1000}
                                  step={10}
                                  value={jardinage.tonte.surface}
                                  onChange={(e) =>
                                    setJardinage((j) => ({ ...j, tonte: { ...j.tonte, surface: parseInt(e.target.value) } }))
                                  }
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#79DBDC]"
                                  style={{ background: sliderBg(jardinage.tonte.surface, 10, 1000) }}
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                  <span>10 m²</span>
                                  <span>1000 m²</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Poste : Taille de haies / arbustes */}
                      <div className="rounded-xl border border-gray-200 p-3">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Scissors size={16} className="text-[#5BBFC0]" />
                            Taille de haies / arbustes
                          </span>
                          <input
                            type="checkbox"
                            checked={jardinage.haies.on}
                            onChange={(e) =>
                              setJardinage((j) => ({ ...j, haies: { ...j.haies, on: e.target.checked } }))
                            }
                            className="w-4 h-4 rounded border-gray-300 text-[#79DBDC] focus:ring-[#79DBDC]"
                          />
                        </label>
                        <AnimatePresence>
                          {jardinage.haies.on && (
                            <motion.div
                              className="overflow-hidden"
                              variants={prefersReducedMotion ? {} : detailLineVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                            >
                              <div className="pt-3 space-y-3">
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-gray-400">Longueur</span>
                                    <span className="text-sm font-bold text-[#79DBDC]">{jardinage.haies.metres} ml</span>
                                  </div>
                                  <input
                                    type="range"
                                    min={1}
                                    max={100}
                                    step={1}
                                    value={jardinage.haies.metres}
                                    onChange={(e) =>
                                      setJardinage((j) => ({ ...j, haies: { ...j.haies, metres: parseInt(e.target.value) } }))
                                    }
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#79DBDC]"
                                    style={{ background: sliderBg(jardinage.haies.metres, 1, 100) }}
                                  />
                                </div>
                                <div>
                                  <span className="block text-xs text-gray-400 mb-1.5">Hauteur</span>
                                  <div className="grid grid-cols-2 gap-2">
                                    {([['bas', '< 2 m'], ['haut', '> 2 m']] as const).map(([val, txt]) => {
                                      const active = jardinage.haies.hauteur === val;
                                      return (
                                        <button
                                          key={val}
                                          onClick={() =>
                                            setJardinage((j) => ({ ...j, haies: { ...j.haies, hauteur: val } }))
                                          }
                                          className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                                            active
                                              ? 'border-[#79DBDC] bg-[#79DBDC]/5 text-[#79DBDC]'
                                              : 'border-gray-200 text-gray-600 hover:border-[#79DBDC]'
                                          }`}
                                        >
                                          {txt}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Poste : Évacuation des déchets verts */}
                      <div className="rounded-xl border border-gray-200 p-3">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Trash2 size={16} className="text-[#5BBFC0]" />
                            Évacuation des déchets verts
                          </span>
                          <input
                            type="checkbox"
                            checked={jardinage.evacuation.on}
                            onChange={(e) =>
                              setJardinage((j) => ({ ...j, evacuation: { ...j.evacuation, on: e.target.checked } }))
                            }
                            className="w-4 h-4 rounded border-gray-300 text-[#79DBDC] focus:ring-[#79DBDC]"
                          />
                        </label>
                        <AnimatePresence>
                          {jardinage.evacuation.on && (
                            <motion.div
                              className="overflow-hidden"
                              variants={prefersReducedMotion ? {} : detailLineVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                            >
                              <div className="pt-3">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-gray-400">Volume (30 €/m³)</span>
                                  <span className="text-sm font-bold text-[#79DBDC]">{jardinage.evacuation.volume} m³</span>
                                </div>
                                <input
                                  type="range"
                                  min={0.5}
                                  max={20}
                                  step={0.5}
                                  value={jardinage.evacuation.volume}
                                  onChange={(e) =>
                                    setJardinage((j) => ({ ...j, evacuation: { ...j.evacuation, volume: parseFloat(e.target.value) } }))
                                  }
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#79DBDC]"
                                  style={{ background: sliderBg(jardinage.evacuation.volume, 0.5, 20) }}
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                  <span>0,5 m³</span>
                                  <span>20 m³</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ) : (
                    /* Placeholder pour les familles pas encore intégrées */
                    <motion.div
                      key="placeholder"
                      className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center"
                      initial={prefersReducedMotion ? {} : { opacity: 0 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1 }}
                      exit={prefersReducedMotion   ? {} : { opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-sm text-gray-500">
                        Cette prestation sera bientôt disponible dans le simulateur.
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        En attendant, demandez votre devis gratuit — réponse sous 24h.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
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

                  {/* Lignes dynamiques */}
                  {familleDispo && lines.length === 0 && (
                    <p className="text-sm text-white/50">
                      Sélectionnez au moins un poste pour voir l'estimation.
                    </p>
                  )}
                  {!familleDispo && (
                    <p className="text-sm text-white/50">
                      Estimation à venir pour cette prestation.
                    </p>
                  )}

                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.div
                        key={line.label}
                        className="flex justify-between text-sm text-white/70 overflow-hidden gap-3"
                        variants={prefersReducedMotion ? {} : detailLineVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <span>{line.label}</span>
                        <span className="whitespace-nowrap">{formatPrice(line.montant)}</span>
                      </motion.div>
                    ))}
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
