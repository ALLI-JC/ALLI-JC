import { ShieldCheck, Clock, Star, Map } from 'lucide-react';

const items = [
  { icon: ShieldCheck, label: 'Entreprise individuelle assurée' },
  { icon: Clock, label: 'Intervention rapide' },
  { icon: Star, label: 'Crédit d’impôt de 50 % pour les particuliers' },
  { icon: Map, label: 'Doubs & Jura uniquement' },
];

export default function TrustBar() {
  return (
    <div className="bg-white flex justify-center gap-10 px-8 py-3.5 flex-wrap">
      {items.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-2 text-[13px] text-[#237395]">
          <Icon size={16} className="text-[#237395]" />
          {label}
        </div>
      ))}
    </div>
  );
}
