import { useState, useEffect, type ElementType } from 'react';
import { Send, TrendingUp, Info, CheckCircle, Home, Waves, Leaf, Building2 } from 'lucide-react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import ReassurancePillars from './ReassurancePillars';
import { supabase } from '../lib/supabaseClient';

type ServiceType = 'jardinage' | 'terrasse' | 'fin-de-bail' | 'fin-de-chantier';
type HedgeHeight = 'small' | 'large';
type TerraceLevel = 'low' | 'high';
type FinishOption = 'none' | 'bois' | 'imperm' | 'wet';
type CleanLevel = 'standard' | 'intensif';
type OvenState = 'none' | 'standard' | 'sale';
type FridgeState = 'none' | 'standard' | 'sale';
type WindowKey = 'standard' | 'salleBain' | 'baies' | 'porte1' | 'porte2' | 'velux';

interface CalculatorPricing {
  jardinageLowSurface: number;
  jardinageMediumRate: number;
  jardinageHighRate: number;
  hedgeSmallRate: number;
  hedgeLargeRate: number;
  greenWasteRate: number;
  terrasseLowSmall: number;
  terrasseLowMedium: number;
  terrasseLowLarge: number;
  terrasseHighSmall: number;
  terrasseHighMedium: number;
  terrasseHighLarge: number;
  terrasseLowRate: number;
  terrasseHighRate: number;
  finishWoodRate: number;
  finishImpermRate: number;
  finishWetRate: number;
  terrasseDiscountOver100: number;
  terrasseDiscountOver200: number;
  cleaningStandardRate: number;
  cleaningIntensiveRate: number;
  ovenStandard: number;
  ovenDirty: number;
  microwaveRate: number;
  fridgeStandard: number;
  fridgeDirty: number;
  doubleFridgeRate: number;
  sanitaryStandard: number;
  sanitaryDirty: number;
  windowRates: Record<WindowKey, number>;
  windowRatesFinDeBail: Record<WindowKey, number>;
  stageWindowRate: number;
}

interface PricingRow {
  key: string;
  value: number;
}

const buildPricingFromRows = (rows: PricingRow[]): CalculatorPricing => {
  const merged: CalculatorPricing = {
    ...defaultPricing,
    windowRates: { ...defaultPricing.windowRates },
    windowRatesFinDeBail: { ...defaultPricing.windowRatesFinDeBail },
  }

  rows.forEach((row) => {
    const key = row.key?.trim()
    if (!key) return

    const value = Number(row.value)
    if (!Number.isFinite(value)) return

    const parts = key.split('.')
    if (parts.length === 2) {
      const [group, subKey] = parts
      if (group === 'windowRates' && subKey in merged.windowRates) {
        merged.windowRates[subKey as WindowKey] = value
        return
      }
      if (group === 'windowRatesFinDeBail' && subKey in merged.windowRatesFinDeBail) {
        merged.windowRatesFinDeBail[subKey as WindowKey] = value
        return
      }
    }

    if (key in merged) {
      const target = merged as unknown as Record<string, unknown>
      target[key] = value
    }
  })

  return merged
}

const defaultPricing: CalculatorPricing = {
  jardinageLowSurface: 50,
  jardinageMediumRate: 0.7,
  jardinageHighRate: 0.4,
  hedgeSmallRate: 6,
  hedgeLargeRate: 13,
  greenWasteRate: 30,
  terrasseLowSmall: 150,
  terrasseLowMedium: 190,
  terrasseLowLarge: 230,
  terrasseHighSmall: 220,
  terrasseHighMedium: 330,
  terrasseHighLarge: 380,
  terrasseLowRate: 6.5,
  terrasseHighRate: 12.5,
  finishWoodRate: 3.5,
  finishImpermRate: 3.5,
  finishWetRate: 6,
  terrasseDiscountOver100: 0.1,
  terrasseDiscountOver200: 0.15,
  cleaningStandardRate: 4.5,
  cleaningIntensiveRate: 6,
  ovenStandard: 40,
  ovenDirty: 90,
  microwaveRate: 15,
  fridgeStandard: 30,
  fridgeDirty: 60,
  doubleFridgeRate: 90,
  sanitaryStandard: 60,
  sanitaryDirty: 130,
  windowRates: {
    standard: 12,
    salleBain: 10,
    baies: 25,
    porte1: 18,
    porte2: 25,
    velux: 18,
  },
  windowRatesFinDeBail: {
    standard: 10,
    salleBain: 8,
    baies: 20,
    porte1: 15,
    porte2: 20,
    velux: 18,
  },
  stageWindowRate: 2,
};

const serviceTypes: Array<{
  key: ServiceType;
  label: string;
  icon: ElementType;
  description: string;
  unit: string;
  min: number;
  max: number;
}> = [
    {
      key: 'jardinage',
      label: 'Jardinage & espaces verts',
      icon: Leaf,
      description: 'Tonte, taille de haies et évacuation de déchets verts',
      unit: 'm²',
      min: 20,
      max: 1000,
    },
    {
      key: 'terrasse',
      label: 'Terrasses & extérieurs',
      icon: Waves,
      description: 'Nettoyage haute pression et finitions spéciales',
      unit: 'm²',
      min: 5,
      max: 400,
    },
    {
      key: 'fin-de-bail',
      label: 'Fin de bail',
      icon: Home,
      description: 'Nettoyage locatif avant état des lieux',
      unit: 'm²',
      min: 20,
      max: 300,
    },
    {
      key: 'fin-de-chantier',
      label: 'Fin de chantier',
      icon: Building2,
      description: 'Nettoyage après travaux',
      unit: 'm²',
      min: 20,
      max: 300,
    },
  ];

const surfaceConfig: Record<ServiceType, { label: string; unit: string; min: number; max: number }> = {
  jardinage: { label: 'Surface de tonte', unit: 'm²', min: 20, max: 1000 },
  terrasse: { label: 'Surface de terrasse', unit: 'm²', min: 5, max: 400 },
  'fin-de-bail': { label: 'Surface du logement', unit: 'm²', min: 20, max: 300 },
  'fin-de-chantier': { label: 'Surface du chantier', unit: 'm²', min: 20, max: 300 },
};

interface DevisSimulatorProps {
  onConfirm: () => void;
}

const sectionVariants: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUpVariants: any = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const cardVariants: any = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const badgeVariants: any = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: 'easeOut', delay: i * 0.1 },
  }),
};

const priceVariants: any = {
  initial: { opacity: 0, y: -10, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } },
};

const detailLineVariants: any = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto', transition: { duration: 0.22 } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.18 } },
};

export default function DevisSimulator({ onConfirm }: DevisSimulatorProps) {
  const prefersReducedMotion = useReducedMotion();

  const [serviceType, setServiceType] = useState<ServiceType>('jardinage');
  const [surface, setSurface] = useState<number>(100);
  const [hasTonteSurface, setHasTonteSurface] = useState<boolean>(false);
  const [hasHedgeSurface, setHasHedgeSurface] = useState<boolean>(false);
  const [hedgeHeight, setHedgeHeight] = useState<HedgeHeight>('small');
  const [hedgeMeters, setHedgeMeters] = useState<number>(10);
  const [greenWaste, setGreenWaste] = useState<boolean>(false);
  const [greenWasteVolume, setGreenWasteVolume] = useState<number>(1);
  const [terraceLevel, setTerraceLevel] = useState<TerraceLevel>('low');
  const [finish, setFinish] = useState<FinishOption>('none');
  const [cleanLevel, setCleanLevel] = useState<CleanLevel>('standard');
  const [ovenState, setOvenState] = useState<OvenState>('none');
  const [microwave, setMicrowave] = useState<boolean>(false);
  const [fridgeState, setFridgeState] = useState<FridgeState>('none');
  const [doubleFridge, setDoubleFridge] = useState<boolean>(false);
  const [sanitaryState, setSanitaryState] = useState<'none' | 'standard' | 'sale'>('none');
  const [windowCounts, setWindowCounts] = useState<Record<WindowKey, number>>({
    standard: 0,
    salleBain: 0,
    baies: 0,
    porte1: 0,
    porte2: 0,
    velux: 0,
  });
  const [stageWindows, setStageWindows] = useState<boolean>(false);
  const [pricing, setPricing] = useState<CalculatorPricing>(() => {
    if (typeof window === 'undefined') return defaultPricing;

    try {
      const raw = window.localStorage.getItem('alli-jc-devis-pricing');
      if (!raw) return defaultPricing;

      const parsed = JSON.parse(raw) as Partial<CalculatorPricing>;
      return {
        ...defaultPricing,
        ...parsed,
        windowRates: {
          ...defaultPricing.windowRates,
          ...(parsed.windowRates ?? {}),
        },
        windowRatesFinDeBail: {
          ...defaultPricing.windowRatesFinDeBail,
          ...(parsed.windowRatesFinDeBail ?? {}),
        },
      };
    } catch {
      return defaultPricing;
    }
  });

  useEffect(() => {
    let isMounted = true

    const loadPricingFromSupabase = async () => {
      if (typeof window === 'undefined') return

      try {
        const { data, error } = await supabase
          .from('calculator_pricing')
          .select('key, value')
          .order('category', { ascending: true })
          .order('label', { ascending: true })

        if (error) throw error

        if (!isMounted) return

        if (data?.length) {
          const merged = buildPricingFromRows(data as PricingRow[])
          setPricing(merged)
          window.localStorage.setItem('alli-jc-devis-pricing', JSON.stringify(merged))
        } else {
          setPricing(defaultPricing)
          window.localStorage.setItem('alli-jc-devis-pricing', JSON.stringify(defaultPricing))
        }
      } catch (error) {
        console.warn('Impossible de charger les tarifs depuis Supabase, utilisation du fallback local.', error)
      }
    }

    void loadPricingFromSupabase()

    const channel = supabase.channel('calculator-pricing-updates')
    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calculator_pricing' }, () => {
        void loadPricingFromSupabase()
      })
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('alli-jc-devis-pricing', JSON.stringify(pricing));
    }
  }, [pricing]);

  const surfaceMeta = surfaceConfig[serviceType];

  useEffect(() => {
    setSurface((current) => Math.min(Math.max(current, surfaceMeta.min), surfaceMeta.max));
  }, [serviceType, surfaceMeta.min, surfaceMeta.max]);

  useEffect(() => {
    if (serviceType !== 'jardinage') {
      setHasTonteSurface(false);
      setHasHedgeSurface(false);
    }
  }, [serviceType]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);

  const round = (value: number) => Math.round(value * 100) / 100;

  const getJardinageBase = () => {
    if (surface < 100) return pricing.jardinageLowSurface;
    if (surface <= 400) return round(surface * pricing.jardinageMediumRate);
    return round(surface * pricing.jardinageHighRate);
  };

  const getHedgePrice = () => hedgeMeters * (hedgeHeight === 'small' ? pricing.hedgeSmallRate : pricing.hedgeLargeRate);
  const getGreenWastePrice = () => (greenWaste ? round(greenWasteVolume * pricing.greenWasteRate) : 0);

  const getTerrasseBase = () => {
    if (surface < 30) {
      if (terraceLevel === 'low') {
        if (surface <= 10) return pricing.terrasseLowSmall;
        if (surface <= 20) return pricing.terrasseLowMedium;
        return pricing.terrasseLowLarge;
      }
      if (surface <= 10) return pricing.terrasseHighSmall;
      if (surface <= 20) return pricing.terrasseHighMedium;
      return pricing.terrasseHighLarge;
    }
    return round(surface * (terraceLevel === 'low' ? pricing.terrasseLowRate : pricing.terrasseHighRate));
  };

  const getFinishRate = () => {
    if (finish === 'bois') return pricing.finishWoodRate;
    if (finish === 'imperm') return pricing.finishImpermRate;
    if (finish === 'wet') return pricing.finishWetRate;
    return 0;
  };

  const getTerrasseFinish = () => round(surface * getFinishRate());
  const getTerrasseDiscount = () => {
    if (surface > 200) return pricing.terrasseDiscountOver200;
    if (surface > 100) return pricing.terrasseDiscountOver100;
    return 0;
  };

  const getCleaningBase = () => round(surface * (cleanLevel === 'standard' ? pricing.cleaningStandardRate : pricing.cleaningIntensiveRate));
  const getOvenPrice = () => (ovenState === 'standard' ? pricing.ovenStandard : ovenState === 'sale' ? pricing.ovenDirty : 0);
  const getMicrowavePrice = () => (microwave ? pricing.microwaveRate : 0);
  const getFridgePrice = () => (fridgeState === 'standard' ? pricing.fridgeStandard : fridgeState === 'sale' ? pricing.fridgeDirty : 0);
  const getDoubleFridgePrice = () => (doubleFridge ? pricing.doubleFridgeRate : 0);
  const getSanitaryPrice = () => (sanitaryState === 'standard' ? pricing.sanitaryStandard : sanitaryState === 'sale' ? pricing.sanitaryDirty : 0);

  const getWindowRate = (key: WindowKey) => {
    if (serviceType === 'fin-de-bail') {
      return pricing.windowRatesFinDeBail[key];
    }
    return pricing.windowRates[key];
  };

  const getWindowTotal = () => {
    const base = (Object.entries(windowCounts) as Array<[WindowKey, number]>).reduce(
      (sum, [key, count]) => sum + count * getWindowRate(key),
      0,
    );
    const stageExtra = stageWindows
      ? (Object.values(windowCounts).reduce((sum, count) => sum + count, 0) * pricing.stageWindowRate)
      : 0;
    return base + stageExtra;
  };

  const baseTotal = (() => {
    if (serviceType === 'jardinage') return getJardinageBase();
    if (serviceType === 'terrasse') return getTerrasseBase();
    return getCleaningBase();
  })();

  const extraTotal = (() => {
    if (serviceType === 'jardinage') {
      return getHedgePrice() + getGreenWastePrice();
    }
    if (serviceType === 'terrasse') {
      return getTerrasseFinish();
    }
    return (
      getOvenPrice()
      + getMicrowavePrice()
      + getFridgePrice()
      + getDoubleFridgePrice()
      + getSanitaryPrice()
      + getWindowTotal()
    );
  })();

  const discountAmount = serviceType === 'terrasse'
    ? round((baseTotal + extraTotal) * getTerrasseDiscount())
    : 0;

  const totalPrice = round(baseTotal + extraTotal - discountAmount);

  const detailLines: Array<{ label: string; price: number }> = [];

  if (serviceType === 'jardinage') {
    detailLines.push({ label: 'Tonte de pelouse', price: getJardinageBase() });
    detailLines.push({ label: `Haies ${hedgeHeight === 'small' ? '6 €/m' : '13 €/m'}`, price: getHedgePrice() });
    detailLines.push({ label: 'Évacuation déchets verts', price: getGreenWastePrice() });
  }

  if (serviceType === 'terrasse') {
    detailLines.push({ label: `Base ${terraceLevel === 'low' ? 'Niveau faible' : 'Niveau élevé'}`, price: getTerrasseBase() });
    if (finish !== 'none') {
      const finishLabel = finish === 'bois' ? 'Bois' :
        finish === 'imperm' ? 'Imperméabilisant' :
          'Effet mouillé';
      detailLines.push({ label: `Finition ${finishLabel}`, price: getTerrasseFinish() });
    }
    if (discountAmount > 0) {
      detailLines.push({ label: 'Réduction volume', price: -discountAmount });
    }
  }

  if (serviceType === 'fin-de-bail' || serviceType === 'fin-de-chantier') {
    detailLines.push({ label: `Base ${cleanLevel === 'standard' ? 'Standard' : 'Intensif'}`, price: getCleaningBase() });
    if (getOvenPrice() > 0) detailLines.push({ label: `Four (${ovenState === 'sale' ? 'Très sale' : 'Standard'})`, price: getOvenPrice() });
    if (getMicrowavePrice() > 0) detailLines.push({ label: 'Micro-ondes', price: getMicrowavePrice() });
    if (getFridgePrice() > 0) detailLines.push({ label: 'Réfrigérateur', price: getFridgePrice() });
    if (getDoubleFridgePrice() > 0) detailLines.push({ label: 'Frigo double porte', price: getDoubleFridgePrice() });
    if (getSanitaryPrice() > 0) detailLines.push({ label: 'Sanitaires / salle de bain', price: getSanitaryPrice() });
    if (getWindowTotal() > 0) detailLines.push({ label: 'Vitres et baies vitrées', price: getWindowTotal() });
  }

  const windowFields = [
    { key: 'standard' as WindowKey, label: 'Vitres 2 battants' },
    { key: 'salleBain' as WindowKey, label: 'Vitres salle de bain' },
    { key: 'baies' as WindowKey, label: 'Baies vitrées' },
    { key: 'porte1' as WindowKey, label: 'Porte fenêtre 1 vantail' },
    { key: 'porte2' as WindowKey, label: 'Porte fenêtre 2 vantaux' },
    { key: 'velux' as WindowKey, label: 'Velux de toit' },
  ];

  return (
    <section
      className=""
      id="sec-devis"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#237395]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F5DEB3]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#237395] to-[#237395]">
              pour votre prestation
            </span>
          </motion.h2>

          <motion.p
            className="text-gray-500"
            variants={prefersReducedMotion ? {} : fadeUpVariants}
          >
            Calculez rapidement votre tarif selon la prestation choisie, la surface et les options.
          </motion.p>
        </motion.div>

        <motion.div
          className="max-w-5xl mx-auto"
          variants={prefersReducedMotion ? {} : sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6">
            <motion.div
              className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
              variants={prefersReducedMotion ? {} : cardVariants}
            >
              <div className="bg-gradient-to-r from-[#237395] to-[#237395] px-6 py-6 text-white">
                <h3 className="text-xl font-bold">Simulateur de devis</h3>
                <p className="text-white/85 text-sm mt-1">
                  Choisissez votre prestation, ajustez la surface et activez les options.
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-[0.24em] mb-3">
                    Type de prestation
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {serviceTypes.map((item) => (
                      <motion.button
                        key={item.key}
                        type="button"
                        onClick={() => setServiceType(item.key)}
                        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                        whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                        className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 ${serviceType === item.key
                          ? 'border-[#237395] bg-[#237395]/10 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-[#237395] hover:bg-gray-50'
                          }`}
                      >
                        <item.icon size={18} className={serviceType === item.key ? 'text-[#237395]' : 'text-gray-500'} />
                        <div>
                          <span className={`block font-semibold ${serviceType === item.key ? 'text-[#0e2b38]' : 'text-gray-700'}`}>
                            {item.label}
                          </span>
                          <span className="text-xs text-gray-500">{item.description}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {serviceType === 'jardinage' ? (
                  <div className="space-y-4">
                    <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.24em] text-gray-500 mb-3">Avez-vous une surface de tonte ?</p>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setHasTonteSurface(true)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${hasTonteSurface ? 'bg-[#C4A882] text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200'}`}
                        >
                          Oui
                        </button>
                        <button
                          type="button"
                          onClick={() => setHasTonteSurface(false)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${!hasTonteSurface ? 'bg-[#C4A882] text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200'}`}
                        >
                          Non
                        </button>
                      </div>
                    </div>

                    {hasTonteSurface && (
                      <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5 shadow-sm">
                        <div className="flex flex-wrap gap-4 items-center justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-gray-500">{surfaceMeta.label}</p>
                            <h4 className="mt-2 text-lg font-semibold text-gray-900">{surface} {surfaceMeta.unit}</h4>
                          </div>
                          <span className="rounded-full bg-[#237395]/10 px-3 py-1 text-xs font-semibold text-[#237395]">
                            {surfaceMeta.unit}
                          </span>
                        </div>

                        <div className="mt-4 space-y-3">
                          <input
                            type="range"
                            min={surfaceMeta.min}
                            max={surfaceMeta.max}
                            step={5}
                            value={surface}
                            onChange={(e) => setSurface(Number(e.target.value))}
                            className="w-full h-2 rounded-full accent-[#237395] bg-gray-200"
                          />
                          <div className="grid grid-cols-3 text-xs text-gray-500">
                            <span>{surfaceMeta.min} {surfaceMeta.unit}</span>
                            <span className="text-center font-semibold text-gray-800">{surface} {surfaceMeta.unit}</span>
                            <span className="text-right">{surfaceMeta.max} {surfaceMeta.unit}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="rounded-3xl border border-gray-100 bg-white p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Avez-vous une surface de haies ?</p>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setHasHedgeSurface(true)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${hasHedgeSurface ? 'bg-[#C4A882] text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200'}`}
                          >
                            Oui
                          </button>
                          <button
                            type="button"
                            onClick={() => setHasHedgeSurface(false)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${!hasHedgeSurface ? 'bg-[#C4A882] text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200'}`}
                          >
                            Non
                          </button>
                        </div>
                      </div>

                      {hasHedgeSurface && (
                        <div className="mt-5 space-y-5">
                          <div className="rounded-2xl border border-[#E8DCCB] bg-[#F9F2E8] p-4 shadow-sm">
                            <div className="flex flex-wrap gap-4 items-center justify-between">
                              <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Longueur de haies</p>
                                <h4 className="mt-2 text-lg font-semibold text-gray-900">{hedgeMeters} m</h4>
                              </div>
                              <span className="rounded-full bg-[#C4A882]/15 px-3 py-1 text-xs font-semibold text-[#9A7442]">
                                m lin.
                              </span>
                            </div>

                            <div className="mt-4 space-y-3">
                              <input
                                type="range"
                                min={0}
                                max={200}
                                step={1}
                                value={hedgeMeters}
                                onChange={(e) => setHedgeMeters(Number(e.target.value))}
                                className="w-full h-2 rounded-full accent-[#C4A882] bg-gray-200"
                              />
                              <div className="grid grid-cols-3 text-xs text-gray-500">
                                <span>0 m</span>
                                <span className="text-center font-semibold text-gray-800">{hedgeMeters} m</span>
                                <span className="text-right">200 m</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-gray-500 mb-3">Taille de haies / arbustes</p>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {[
                                { value: 'small' as HedgeHeight, label: 'Hauteur < 2 m' },
                                { value: 'large' as HedgeHeight, label: 'Hauteur > 2 m' },
                              ].map((option) => (
                                <label
                                  key={option.value}
                                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 ${hedgeHeight === option.value ? 'border-[#237395] bg-[#237395]/10' : 'border-gray-200 bg-white'
                                    }`}
                                >
                                  <div>
                                    <div className="text-sm font-semibold text-gray-900">{option.label}</div>
                                  </div>
                                  <input
                                    type="radio"
                                    name="hedgeHeight"
                                    value={option.value}
                                    checked={hedgeHeight === option.value}
                                    onChange={() => setHedgeHeight(option.value)}
                                    className="h-4 w-4 accent-[#237395]"
                                  />
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <label className="space-y-2 text-sm text-gray-700">
                              Mètres linéaires de haies
                              <input
                                type="number"
                                value={hedgeMeters}
                                min={0}
                                max={200}
                                onChange={(e) => setHedgeMeters(Number(e.target.value))}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-[#237395] focus:outline-none"
                              />
                            </label>
                            <label className="space-y-2 text-sm text-gray-700">
                              Évacuation déchets verts
                              <select
                                value={greenWaste ? 'yes' : 'no'}
                                onChange={(e) => setGreenWaste(e.target.value === 'yes')}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-[#237395] focus:outline-none"
                              >
                                <option value="no">Non — déchets laissés sur place</option>
                                <option value="yes">Oui — évacuation des déchets verts</option>
                              </select>
                            </label>
                          </div>
                          {greenWaste && (
                            <label className="space-y-2 text-sm text-gray-700">
                              Volume déchets verts (m³)
                              <input
                                type="number"
                                value={greenWasteVolume}
                                min={0}
                                step={0.5}
                                onChange={(e) => setGreenWasteVolume(Number(e.target.value))}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-[#237395] focus:outline-none"
                              />
                            </label>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5 shadow-sm">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-gray-500">{surfaceMeta.label}</p>
                        <h4 className="mt-2 text-lg font-semibold text-gray-900">{surface} {surfaceMeta.unit}</h4>
                      </div>
                      <span className="rounded-full bg-[#237395]/10 px-3 py-1 text-xs font-semibold text-[#237395]">
                        {surfaceMeta.unit}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <input
                        type="range"
                        min={surfaceMeta.min}
                        max={surfaceMeta.max}
                        step={5}
                        value={surface}
                        onChange={(e) => setSurface(Number(e.target.value))}
                        className="w-full h-2 rounded-full accent-[#237395] bg-gray-200"
                      />
                      <div className="grid grid-cols-3 text-xs text-gray-500">
                        <span>{surfaceMeta.min} {surfaceMeta.unit}</span>
                        <span className="text-center font-semibold text-gray-800">{surface} {surfaceMeta.unit}</span>
                        <span className="text-right">{surfaceMeta.max} {surfaceMeta.unit}</span>
                      </div>
                    </div>
                  </div>
                )}

                {serviceType === 'terrasse' && (
                  <div className="space-y-5 rounded-3xl border border-gray-100 bg-white p-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-gray-500 mb-3">Niveau de saleté</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          { value: 'low' as TerraceLevel, label: 'Niveau faible' },
                          { value: 'high' as TerraceLevel, label: 'Niveau élevé' },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 ${terraceLevel === option.value ? 'border-[#237395] bg-[#237395]/10' : 'border-gray-200 bg-white'
                              }`}
                          >
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{option.label}</div>
                            </div>
                            <input
                              type="radio"
                              name="terraceLevel"
                              value={option.value}
                              checked={terraceLevel === option.value}
                              onChange={() => setTerraceLevel(option.value)}
                              className="h-4 w-4 accent-[#237395]"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-gray-500 mb-3">Finition</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          { value: 'none' as FinishOption, title: 'Aucune', description: 'Sans finition' },
                          { value: 'bois' as FinishOption, title: 'Terrasse en bois', description: 'Finition bois' },
                          { value: 'imperm' as FinishOption, title: 'Imperméabilisant', description: 'Finition imperméabilisante' },
                          { value: 'wet' as FinishOption, title: 'Effet mouillé', description: 'Finition spéciale' },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className={`flex cursor-pointer flex-col gap-2 rounded-2xl border p-4 ${finish === option.value ? 'border-[#237395] bg-[#237395]/10' : 'border-gray-200 bg-white'
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-900">{option.title}</span>
                              <input
                                type="radio"
                                name="finish"
                                value={option.value}
                                checked={finish === option.value}
                                onChange={() => setFinish(option.value)}
                                className="h-4 w-4 accent-[#237395]"
                              />
                            </div>
                            <span className="text-xs text-gray-500">{option.description}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200 text-sm text-gray-600">
                      <p className="font-semibold text-gray-900">Surface réduite</p>
                      <p className="mt-2 text-xs leading-5 text-gray-500">
                        Pour les petites surfaces {'<30 m²'}, un forfait adapté est appliqué selon le niveau de saleté.
                      </p>
                    </div>
                  </div>
                )}

                {(serviceType === 'fin-de-bail' || serviceType === 'fin-de-chantier') && (
                  <div className="space-y-5 rounded-3xl border border-gray-100 bg-white p-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-gray-500 mb-3">Niveau de saleté</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          { value: 'standard' as CleanLevel, label: 'Standard' },
                          { value: 'intensif' as CleanLevel, label: 'Intensif' },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 ${cleanLevel === option.value ? 'border-[#237395] bg-[#237395]/10' : 'border-gray-200 bg-white'
                              }`}
                          >
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{option.label}</div>
                            </div>
                            <input
                              type="radio"
                              name="cleanLevel"
                              value={option.value}
                              checked={cleanLevel === option.value}
                              onChange={() => setCleanLevel(option.value)}
                              className="h-4 w-4 accent-[#237395]"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    {serviceType === 'fin-de-bail' && (
                      <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200 text-sm text-gray-600 space-y-4">
                        <p className="font-semibold text-gray-900">Électroménager</p>

                        <label className="space-y-2 text-sm text-gray-700">
                          Four
                          <select
                            value={ovenState}
                            onChange={(e) => setOvenState(e.target.value as OvenState)}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-[#237395] focus:outline-none"
                          >
                            <option value="none">Aucun</option>
                            <option value="standard">Standard — 40 €</option>
                            <option value="sale">Très sale — 90 €</option>
                          </select>
                        </label>

                      </div>
                    )}


                    <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200 text-sm text-gray-600">
                      <p className="font-semibold text-gray-900">Vitres & baies</p>
                      <div className="grid gap-3 mt-3 sm:grid-cols-2">
                        {windowFields.map((field) => (
                          <label key={field.key} className="space-y-2 text-sm text-gray-700">
                            {field.label}
                            <input
                              type="number"
                              value={windowCounts[field.key]}
                              min={0}
                              onChange={(e) => setWindowCounts({ ...windowCounts, [field.key]: Number(e.target.value) })}
                              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-[#237395] focus:outline-none"
                            />
                          </label>
                        ))}
                      </div>
                      <label className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={stageWindows}
                          onChange={(e) => setStageWindows(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-[#237395]"
                        />
                        À l'étage (+2 €/vitre)
                      </label>
                    </div>

                    <div className="rounded-2xl bg-yellow-50 p-4 border border-yellow-200 text-sm text-yellow-800">
                      <p className="font-semibold">Attention</p>
                      <p className="mt-2 text-xs leading-5">
                        Lessivage murs et plafonds non inclus, tarification sur visite technique uniquement.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-[#237395] to-[#1a5a78] rounded-3xl shadow-xl overflow-hidden"
              variants={prefersReducedMotion ? {} : cardVariants}
            >
              <div className="p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-white" />
                  <h3 className="font-semibold">Votre estimation</h3>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-white/80">
                    <span>Base de calcul</span>
                    <span>{formatPrice(baseTotal)}</span>
                  </div>

                  {detailLines.map((line) => (
                    <AnimatePresence key={line.label} mode="wait">
                      {line.price !== 0 && (
                        <motion.div
                          className="flex justify-between text-sm text-white/80 overflow-hidden"
                          variants={prefersReducedMotion ? {} : detailLineVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <span>{line.label}</span>
                          <span>{formatPrice(line.price)}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  ))}

                  <div className="border-t border-white/30 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total TTC</span>
                      <div className="text-right">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={totalPrice}
                            className="text-3xl font-bold text-white inline-block"
                            variants={prefersReducedMotion ? {} : priceVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                          >
                            {formatPrice(totalPrice)}
                          </motion.span>
                        </AnimatePresence>
                        <p className="text-xs text-white/60">Estimation indicative, devis final sur place</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/20 rounded-2xl p-4 mb-5">
                  <div className="flex items-start gap-2">
                    <Info size={14} className="text-white flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-white/90 leading-relaxed">
                      Estimation indicative. Le devis définitif est gratuit et établi après visite technique.
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={onConfirm}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.03, boxShadow: '0 8px 30px rgba(196,168,130,0.35)' }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#C4A882] to-[#D4B896] text-white py-3.5 rounded-2xl text-sm font-semibold hover:shadow-lg transition-all"
                >
                  <Send size={16} />
                  Confirmer et recevoir un devis
                </motion.button>

                <p className="text-center text-xs text-white/60 mt-4">
                  Réponse sous 24h · Devis gratuit
                </p>
              </div>
            </motion.div>
          </div>

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
                <CheckCircle size={16} className="text-[#237395]" />
                <span>{text}</span>
              </motion.div>
            ))}
          </div>
          <ReassurancePillars />
        </motion.div>
      </div>
    </section>
  );
}