import { Compass, Users, FileSearch, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PILLARS = [
  {
    title: 'Résilience',
    description: 'Nous nous adaptons aux exigences de votre habitat, aux défis logistiques et climatiques.',
    icon: Compass,
  },
  {
    title: 'Proximité',
    description: 'Une entreprise locale ancrée exclusivement dans le Haut Doubs et le Jura, pour une grande réactivité et une relation humaine privilégiée.',
    icon: Users,
  },
  {
    title: 'Transparence',
    description: 'Des tarifs clairs et sans surprise. Un simulateur de devis pour une première estimation, validé par un devis définitif gratuit après étude personnalisée de votre projet.',
    icon: FileSearch,
  },
];

export default function ReassurancePillars() {
  return (
    <section className="relative overflow-hidden border-t border-[#e7ddd2]/80 bg-[linear-gradient(135deg,#f8f4ee_0%,#fcfaf7_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(35,115,149,0.08),transparent_45%)]" />
      
      {/* Éléments décoratifs */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#79DBDC]/5 rounded-full blur-3xl" />
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#F5DEB3]/10 rounded-full blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
        {/* En-tête */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#237395]/10 border border-[#237395]/15 text-xs font-medium text-[#237395] tracking-wider uppercase mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#237395]" />
            Nos valeurs
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-3xl font-semibold text-[#0e2b38] sm:text-4xl"
            style={{ fontFamily: 'var(--font-palatino)' }}
          >
            Les 3 valeurs qui nous animent
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-3 max-w-2xl mx-auto text-sm leading-7 text-[#4a6b78] sm:text-[15px]"
          >
            Des principes solides qui guident chaque intervention et construisent une relation de confiance durable avec nos clients.
          </motion.p>
        </div>

        {/* Grille des valeurs */}
        <div className="grid gap-6 md:grid-cols-3">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative rounded-2xl border border-[#e5d8ca] bg-white/95 p-8 shadow-[0_8px_30px_rgba(35,115,149,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(35,115,149,0.10)]"
              >
                {/* Bande décorative */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#237395] to-[#79DBDC] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Numéro */}
                <div className="absolute top-4 right-4 text-5xl font-bold text-[#237395]/5 group-hover:text-[#237395]/10 transition-colors duration-300 select-none">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Icône */}
                <div className="relative mb-5">
                  <div className="absolute inset-0 bg-[#237395]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#237395] to-[#79DBDC] text-white shadow-lg transition-all group-hover:scale-110 group-hover:shadow-xl">
                    <Icon size={24} />
                  </div>
                </div>

                {/* Titre */}
                <h3 
                  className="text-xl font-bold text-[#0e2b38] mb-3"
                  style={{ fontFamily: 'var(--font-roboto)' }}
                >
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-[#4a6b78]">
                  {pillar.description}
                </p>

                {/* Lien décoratif */}
                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-[#237395] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Notre engagement</span>
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Citation ou mention finale */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="inline-block rounded-2xl bg-white/80 backdrop-blur-sm border border-[#e5d8ca] px-6 py-4 shadow-sm">
            <p className="text-sm text-[#4a6b78]">
              <span className="font-semibold text-[#237395]">Résilience</span>
              <span className="mx-2 text-[#e5d8ca]">•</span>
              <span className="font-semibold text-[#237395]">Proximité</span>
              <span className="mx-2 text-[#e5d8ca]">•</span>
              <span className="font-semibold text-[#237395]">Transparence</span>
              <span className="mx-2 text-[#e5d8ca]">—</span>
              <span>Trois valeurs pour une confiance durable</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}