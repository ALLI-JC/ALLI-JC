  import { BadgePercent, FileText, MapPin, Zap } from 'lucide-react';
  import { motion } from 'framer-motion';

  const PILLARS = [
    {
      title: 'Devis gratuit & transparent',
      description: 'Un diagnostic clair, sans surprise, pour une décision simple et sereine.',
      icon: FileText,
    },
    {
      title: 'Intervention rapide',
      description: 'Une réactivité concrète pour préserver votre confort au quotidien.',
      icon: Zap,
    },
    {
      title: 'Doubs & Jura uniquement',
      description: 'Une zone d’intervention maîtrisée, connue et parfaitement maîtrisée.',
      icon: MapPin,
    },
    {
      title: 'Éligible au crédit d’impôt immédiat',
      description: 'Un service pensé pour mieux accompagner votre budget et vos projets.',
      icon: BadgePercent,
    },
  ];

  export default function ReassurancePillars() {
    return (
      <section className="relative overflow-hidden border-t border-[#e7ddd2]/80 bg-[linear-gradient(135deg,#f8f4ee_0%,#fcfaf7_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(35,115,149,0.08),transparent_45%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-12 lg:py-16">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#237395]">
                4 piliers de réassurance
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#0e2b38] sm:text-3xl">
                Des garanties simples, claires et rassurantes
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[#4a6b78] sm:text-[15px]">
              Chaque intervention est pensée pour vous offrir un service fiable, transparent et adapté à votre habitat.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {PILLARS.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="group rounded-[1.5rem] border border-[#e5d8ca] bg-white/95 p-6 shadow-[0_12px_36px_rgba(35,115,149,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(35,115,149,0.12)]"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#237395]/10 text-[#237395] transition-all group-hover:scale-105">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0e2b38]">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4a6b78]">{pillar.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
