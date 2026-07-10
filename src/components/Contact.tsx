// components/site/Contact.tsx
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.524 5.845L0 24l6.32-1.498A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.813 9.813 0 01-5.001-1.371l-.359-.213-3.721.881.944-3.618-.234-.372A9.791 9.791 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z" />
  </svg>
);

const EMAILJS_CONFIG = {
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

type StatusType = 'idle' | 'sending' | 'success' | 'error';

// ─── Variants ──────────────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: 'easeOut' } },
};

const headerStagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const slideLeft = {
  hidden:  { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.52, ease: 'easeOut' } },
};

const slideRight = {
  hidden:  { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.52, ease: 'easeOut', delay: 0.08 } },
};

const infoRowStagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
};

const infoRowItem = {
  hidden:  { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const fieldStagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const fieldItem = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const statusVariants = {
  initial: { opacity: 0, y: -8, scale: 0.97 },
  animate: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.28, ease: 'easeOut' } },
  exit:    { opacity: 0, y:  8, scale: 0.97, transition: { duration: 0.18 } },
};

export default function Contact() {
  const prefersReducedMotion = useReducedMotion();

  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', service: '', message: '',
  });
  const [status, setStatus]           = useState<StatusType>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status === 'error') setStatus('idle');
  };

  const saveToSupabase = async (formData: FormData) => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          status: 'unread',
          created_at: new Date().toISOString(),
        })
        .select();
      if (error) { console.error('Erreur Supabase:', error); return false; }
      console.log('Message sauvegardé dans Supabase:', data);
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus('error');
      setErrorMessage('Veuillez remplir tous les champs obligatoires');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setStatus('error');
      setErrorMessage('Veuillez entrer un email valide');
      return;
    }
    setStatus('sending');
    setErrorMessage('');

    let emailjsSuccess = false;
    let supabaseSuccess = false;

    try {
      if (EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.templateId) {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        const result = await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          {
            name: form.name, email: form.email,
            phone: form.phone || 'Non renseigné',
            service: form.service || 'Non précisé',
            message: form.message,
            to_email: 'jeancharlesbiernat@yahoo.com',
            reply_to: form.email,
          },
        );
        if (result.status === 200) emailjsSuccess = true;
      }
    } catch (error) { console.error('Erreur EmailJS:', error); }

    supabaseSuccess = await saveToSupabase(form);

    if (emailjsSuccess || supabaseSuccess) {
      setStatus('success');
      setForm({ name: '', email: '', phone: '', service: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } else {
      setStatus('error');
      setErrorMessage('Une erreur est survenue. Veuillez réessayer ou nous contacter directement par téléphone.');
    }
  };

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] text-gray-900 bg-white focus:outline-none focus:border-[#79DBDC] focus:ring-1 focus:ring-[#79DBDC] transition-colors placeholder-gray-400';

  const infoRows = [
    { icon: MapPin, text: '7 rue de la gare, 25560 La Rivière-Drugeon', href: null },
    { icon: Phone,  text: '06 07 97 90 74',                             href: 'tel:0607979074' },
    { icon: Mail,   text: 'jeancharlesbiernat@yahoo.com',               href: 'mailto:jeancharlesbiernat@yahoo.com' },
    { icon: Clock,  text: 'Lun–Sam · 8h–19h',                           href: null },
  ];

  return (
    <section className="px-4 sm:px-8 py-16 md:py-20 bg-[#f7efe6]" id="sec-contact">
      <div className="container mx-auto max-w-6xl">

        {/* ── En-tête ── */}
        <motion.div
          className="text-center mb-10"
          variants={prefersReducedMotion ? {} : headerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.div
            className="text-[11px] font-medium uppercase tracking-widest text-[#79DBDC] mb-2"
            variants={prefersReducedMotion ? {} : fadeUp}
          >
            Parlons de votre projet
          </motion.div>
          <motion.h2
            className="font-serif text-3xl md:text-4xl font-semibold text-gray-900"
            variants={prefersReducedMotion ? {} : fadeUp}
          >
            Contactez-nous
          </motion.h2>
          <motion.p
            className="text-gray-500 mt-2"
            variants={prefersReducedMotion ? {} : fadeUp}
          >
            Une question ? Un devis ? Nous vous répondons sous 24h
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

          {/* ── Colonne gauche — Infos ── */}
          <motion.div
            className="space-y-5"
            variants={prefersReducedMotion ? {} : slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-serif font-semibold text-gray-900 mb-4">L'Allié JC</h3>

              <motion.div
                className="space-y-4"
                variants={prefersReducedMotion ? {} : infoRowStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {infoRows.map(({ icon: Icon, text, href }) => (
                  <motion.div
                    key={text}
                    className="flex items-center gap-3 text-[14px] text-gray-600"
                    variants={prefersReducedMotion ? {} : infoRowItem}
                  >
                    <motion.div
                      className="w-9 h-9 bg-[#79DBDC]/10 rounded-lg flex items-center justify-center text-[#79DBDC] shrink-0"
                      whileHover={prefersReducedMotion ? {} : { scale: 1.12, backgroundColor: 'rgba(121,219,220,0.2)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <Icon size={16} />
                    </motion.div>
                    {href ? (
                      <a href={href} className="hover:text-[#79DBDC] transition-colors">{text}</a>
                    ) : (
                      <span>{text}</span>
                    )}
                  </motion.div>
                ))}
              </motion.div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <motion.a
                  href="https://wa.me/33607979074"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-xl text-sm font-medium shadow-md"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05, backgroundColor: '#20bb5a' }}
                  whileTap={prefersReducedMotion   ? {} : { scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                >
                  <WhatsAppIcon />
                  WhatsApp direct
                </motion.a>
                <p className="text-xs text-gray-400 mt-2">Réponse immédiate sur WhatsApp</p>
              </div>
            </div>

            {/* Bandeau Intervention rapide */}
            <div className="bg-gradient-to-r from-[#79DBDC]/10 to-transparent rounded-xl p-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Intervention rapide</span> — Devis gratuit sous 24h
              </p>
            </div>
          </motion.div>

          {/* ── Colonne droite — Formulaire ── */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8"
            variants={prefersReducedMotion ? {} : slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              variants={prefersReducedMotion ? {} : fieldStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {/* Nom + Email */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                variants={prefersReducedMotion ? {} : fieldItem}
              >
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Nom complet <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="name" value={form.name} onChange={handleChange}
                    placeholder="Jean Charles" className={inputClass}
                    disabled={status === 'sending'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="contact@exemple.fr" className={inputClass}
                    disabled={status === 'sending'}
                  />
                </div>
              </motion.div>

              {/* Téléphone + Service */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                variants={prefersReducedMotion ? {} : fieldItem}
              >
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Téléphone</label>
                  <input
                    name="phone" type="tel" value={form.phone} onChange={handleChange}
                    placeholder="06 07 97 90 74" className={inputClass}
                    disabled={status === 'sending'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Service recherché</label>
                  <select
                    name="service" value={form.service} onChange={handleChange}
                    className={inputClass} disabled={status === 'sending'}
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option>Nettoyage de vitres</option>
                    <option>Nettoyage haute pression</option>
                    <option>Jardinage & espaces verts</option>
                    <option>Ménage fin de bail</option>
                    <option>Nettoyage fin de chantier</option>
                    <option>Petits bricolages</option>
                    <option>Autre</option>
                  </select>
                </div>
              </motion.div>

              {/* Message */}
              <motion.div variants={prefersReducedMotion ? {} : fieldItem}>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="message" value={form.message} onChange={handleChange}
                  placeholder="Décrivez votre projet, la surface approximative, vos disponibilités..."
                  rows={4} className={`${inputClass} resize-none`}
                  disabled={status === 'sending'}
                />
              </motion.div>

              {/* Statut — AnimatePresence pour entrée/sortie fluide */}
              <AnimatePresence mode="wait">
                {status === 'success' && (
                  <motion.div
                    key="success"
                    className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm"
                    variants={prefersReducedMotion ? {} : statusVariants}
                    initial="initial" animate="animate" exit="exit"
                  >
                    <CheckCircle size={16} />
                    <span>Message envoyé ! Je vous réponds dans les meilleurs délais.</span>
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div
                    key="error"
                    className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm"
                    variants={prefersReducedMotion ? {} : statusVariants}
                    initial="initial" animate="animate" exit="exit"
                  >
                    <AlertCircle size={16} />
                    <span>{errorMessage || "Erreur d'envoi. Téléphonez-nous directement au 06 07 97 90 74"}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bouton submit */}
              <motion.div variants={prefersReducedMotion ? {} : fieldItem}>
                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#79DBDC] to-[#5BBFC0] text-white rounded-xl py-3.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={status === 'sending' || prefersReducedMotion
                    ? {}
                    : { scale: 1.02, boxShadow: '0 8px 28px rgba(121,219,220,0.35)' }}
                  whileTap={status === 'sending' || prefersReducedMotion ? {} : { scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Envoyer ma demande
                    </>
                  )}
                </motion.button>
              </motion.div>

              <p className="text-center text-xs text-gray-400 pt-2">
                * Champs obligatoires · Réponse sous 24h
              </p>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}