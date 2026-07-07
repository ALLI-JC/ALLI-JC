import { useState, useRef, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface QuickReply {
  label: string;
  message: string;
  icon: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const QUICK_REPLIES: QuickReply[] = [
  { icon: "🪟", label: "Nettoyage vitres",       message: "Je voudrais un devis pour le nettoyage de mes vitres / baies vitrées." },
  { icon: "💧", label: "Terrasse HP",             message: "Quel est le tarif pour nettoyer ma terrasse au nettoyeur haute pression ?" },
  { icon: "🌿", label: "Entretien jardin",        message: "Quels sont vos services d'entretien de jardin et espaces verts ?" },
  { icon: "✂️", label: "Tonte de gazon",          message: "Je cherche un devis pour la tonte de ma pelouse, quel est votre tarif au m² ?" },
  { icon: "🧹", label: "Fin de bail / chantier",  message: "J'ai besoin d'un ménage de remise en état pour une fin de bail ou fin de chantier." },
  { icon: "🏢", label: "Locaux commerciaux",      message: "Intervenez-vous pour le nettoyage de locaux commerciaux ou parties communes ?" },
  { icon: "📅", label: "Prendre rendez-vous",     message: "Je souhaite prendre un rendez-vous pour un devis à mon domicile." },
];

const SYSTEM_PROMPT = `Tu es l'assistant virtuel chaleureux et professionnel de "L'allié JC", une entreprise individuelle de multiservices dans l'habitat fondée en juin 2026 par Jean Charles Biernat, artisan basé à La Rivière Drugeon dans le Doubs.

═══ ENTREPRISE ═══
- Nom : L'allié JC
- Fondateur : Jean Charles Biernat
- Adresse : 7 rue de la gare, 25560 La Rivière Drugeon
- Téléphone & WhatsApp : 06 07 97 90 74
- Email : jeancharlesbiernat@yahoo.com
- Zone d'intervention : Doubs (25) et une partie du Jura (39)
- Pas de site web ni réseaux sociaux pour l'instant

═══ SERVICES ═══
1. Nettoyage de vitres et baies vitrées (tarif à la baie)
2. Nettoyage de terrasses au nettoyeur haute pression (tarif au m²)
3. Tonte de gazon (tarif au m²)
4. Entretien de terrasses et jardins
5. Entretien des espaces verts (copropriétés, communes)
6. Bricolage et petits travaux
7. Nettoyage intérieur et extérieur
8. Ménage de remise en état fin de bail
9. Ménage de fin de chantier
10. Nettoyage de locaux commerciaux
11. Nettoyage des parties communes d'immeuble

═══ CLIENTS CIBLES ═══
- Particuliers : frontaliers suisses (30–45 ans), personnes âgées
- Entreprises : agences immobilières, locaux commerciaux
- Professionnels : fins de chantier, gestionnaires de copropriétés

═══ DEVIS & TARIFS ═══
- Forfaits indicatifs disponibles pour : baies vitrées, terrasses HP (au m²), tonte (au m²)
- Tout devis est gratuit et doit être confirmé après évaluation du chantier
- Aucun paiement en ligne — simulation indicative uniquement
- Réservation de créneaux possible (prise de rendez-vous)

═══ INSTRUCTIONS ═══
- Réponds TOUJOURS en français, ton chaleureux, rassurant, professionnel — comme si Jean Charles lui-même répondait
- Sois concis (3–5 phrases max par réponse) mais complet
- Pour tout devis, collecte : type de service, commune, surface approximative si applicable, disponibilités souhaitées
- Si on demande un tarif, donne une fourchette indicative réaliste (ex: terrasse HP entre 3 et 6 €/m² selon état) et précise qu'un devis précis sera établi sur place
- Propose systématiquement de finaliser par téléphone ou WhatsApp : 06 07 97 90 74
- Ne prends jamais de paiement, ne confirme jamais de réservation définitive par chat
- Si la question ne concerne pas les services, redirige avec bienveillance
- Termine chaque échange important avec une invitation à appeler ou écrire sur WhatsApp`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}
function formatTime(date: Date): string {
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 animate-in fade-in duration-200">
      {/* Avatar bot */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
        style={{ background: '#237395' }}
      >
        JC
      </div>
      <div
        className="rounded-2xl rounded-bl-md px-3.5 py-2.5 shadow-sm border"
        style={{ background: 'white', borderColor: 'rgba(35,115,149,0.15)' }}
      >
        <div className="flex gap-1 items-center">
          <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#237395', opacity: 0.7, animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#237395', opacity: 0.7, animationDelay: '180ms' }} />
          <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#237395', opacity: 0.7, animationDelay: '360ms' }} />
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ msg }: { msg: Message }) {
  const isBot = msg.role === "assistant";
  return (
    <div
      className={`flex gap-2 items-end animate-in fade-in slide-in-from-bottom-2 duration-250 ${
        isBot ? "self-start max-w-[88%]" : "self-end flex-row-reverse max-w-[78%]"
      }`}
    >
      {/* Bot avatar */}
      {isBot && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 shadow-sm"
          style={{ background: '#237395' }}
        >
          JC
        </div>
      )}

      <div className={`flex flex-col gap-1 ${!isBot && "items-end"}`}>
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed break-words shadow-sm ${
            isBot
              ? "rounded-bl-md"
              : "rounded-br-md"
          }`}
          style={
            isBot
              ? { background: 'white', color: '#1a2e38', border: '1px solid rgba(35,115,149,0.14)' }
              : { background: '#237395', color: 'white' }
          }
        >
          {msg.content.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </div>
        <span className="text-[10px] px-1" style={{ color: 'rgba(35,115,149,0.45)' }}>
          {formatTime(msg.timestamp)}
        </span>
      </div>
    </div>
  );
}

// Dots animés pour le bouton flottant
function AnimatedDots() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const cycle = (showing: boolean) => {
      timeout = setTimeout(() => {
        setVisible((v) => !v);
        cycle(!showing);
      }, showing ? 10000 : 1000);
    };
    cycle(true);
    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;
  return (
    <span className="flex items-center justify-center gap-0.5" aria-hidden="true">
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce inline-block" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce inline-block" style={{ animationDelay: '200ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce inline-block" style={{ animationDelay: '400ms' }} />
    </span>
  );
}

// ─── WhatsApp SVG ──────────────────────────────────────────────────────────────
const WhatsAppSVG = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.1 1.51 5.823L.057 23.927a.5.5 0 0 0 .609.61l6.213-1.485A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.372l-.36-.213-3.707.886.916-3.61-.234-.37A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
  </svg>
);

const PhoneSVG = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const CloseSVG = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SendSVG = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// ─── Main Chat Component ──────────────────────────────────────────────────────
export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uid(),
      role: "assistant",
      content:
        "Bonjour ! 👋 Je suis l'assistant de L'allié JC, votre partenaire multiservices dans le Doubs et le Jura.\n\nJean Charles intervient chez vous pour le nettoyage, l'entretien extérieur, le jardinage, la remise en état et bien plus encore.\n\nComment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const [isOpen, setIsOpen]       = useState(false);
  const [unread, setUnread]       = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLTextAreaElement>(null);
  const historyRef     = useRef<{ role: string; content: string }[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || loading) return;

      setShowQuick(false);
      setInput("");

      const userMsg: Message = { id: uid(), role: "user", content, timestamp: new Date() };
      setMessages((prev) => [...prev, userMsg]);
      historyRef.current = [...historyRef.current, { role: "user", content }];
      setLoading(true);

      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents: historyRef.current.map((m) => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }],
              })),
            }),
          }
        );
        const data = await res.json();

        let reply: string;
        if (res.status === 429) {
          reply = "⏳ Trop de messages en peu de temps. Patientez quelques secondes avant de réessayer, ou contactez-nous au 06 07 97 90 74.";
        } else if (!res.ok) {
          reply = `❌ Erreur serveur (${res.status}). Appelez-nous au 06 07 97 90 74 ou sur WhatsApp.`;
        } else {
          reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ??
            "Je suis désolé, je n'ai pas pu générer une réponse. Appelez-nous au 06 07 97 90 74.";
        }

        historyRef.current = [...historyRef.current, { role: "assistant", content: reply }];
        const botMsg: Message = { id: uid(), role: "assistant", content: reply, timestamp: new Date() };
        setMessages((prev) => [...prev, botMsg]);
        if (!isOpen) setUnread((u) => u + 1);
      } catch {
        const errMsg: Message = {
          id: uid(),
          role: "assistant",
          content: "🔌 Erreur de connexion. Vérifiez votre réseau ou contactez-nous au 06 07 97 90 74.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [loading, isOpen]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const openChat = () => {
    setIsOpen(true);
    setUnread(0);
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  // ── Floating bubble ──────────────────────────────────────────────────────────
  if (!isOpen) {
    return (
      <div className="fixed bottom-7 right-7 flex flex-col items-center gap-2 z-[1000]">
        <button
          className="relative w-14 h-14 rounded-full border-none cursor-pointer flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ background: '#237395' }}
          onClick={openChat}
          aria-label="Ouvrir le chat L'allié JC"
        >
          <AnimatedDots />
          {unread > 0 && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-[11px] font-semibold flex items-center justify-center border-2 border-white animate-in zoom-in duration-300"
              style={{ background: '#D2B093' }}
            >
              {unread}
            </span>
          )}
        </button>
        <div
          className="text-xs font-medium px-2.5 py-1 rounded-full shadow-sm whitespace-nowrap border"
          style={{ background: 'white', color: '#237395', borderColor: 'rgba(35,115,149,0.18)' }}
        >
          Une question ?
        </div>
      </div>
    );
  }

  // ── Full chat window ──────────────────────────────────────────────────────────
  return (
    <div
      className="fixed bottom-7 right-7 w-[380px] h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[1000] animate-in zoom-in-95 slide-in-from-bottom-5 duration-320 origin-bottom-right max-[440px]:!bottom-0 max-[440px]:!right-0 max-[440px]:!w-screen max-[440px]:!h-dvh max-[440px]:!rounded-none"
      style={{ background: 'white', border: '1px solid rgba(35,115,149,0.15)' }}
      role="dialog"
      aria-label="Chat L'allié JC"
    >
      {/* ── Header ── */}
      <header
        className="px-4 py-3.5 flex items-center gap-3 flex-shrink-0"
        style={{ background: '#237395' }}
      >
        {/* Avatar / Logo */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden border-2"
          style={{ borderColor: 'rgba(210,176,147,0.5)', background: 'rgba(255,255,255,0.12)' }}
        >
          <img src="/1.jpeg" alt="Logo L'allié JC" className="w-full h-full object-cover" />
        </div>

        {/* Nom + statut */}
        <div className="flex-1 min-w-0">
          <strong className="text-[15px] font-semibold text-white block leading-tight">
            L'allié JC
          </strong>
          <span className="text-[11px] flex items-center gap-1.5 mt-0.5" style={{ color: 'rgba(210,176,147,0.9)' }}>
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#D2B093', boxShadow: '0 0 0 2px rgba(210,176,147,0.3)' }}
            />
            En ligne · répond rapidement
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <a
            href="https://wa.me/33607979074"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150"
            style={{ color: 'rgba(255,255,255,0.75)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(210,176,147,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            aria-label="WhatsApp"
            title="Contacter via WhatsApp"
          >
            <WhatsAppSVG />
          </a>
          <a
            href="tel:0607979074"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150"
            style={{ color: 'rgba(255,255,255,0.75)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(210,176,147,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            aria-label="Appeler"
            title="Appeler le 06 07 97 90 74"
          >
            <PhoneSVG />
          </a>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150"
            style={{ color: 'rgba(255,255,255,0.75)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(210,176,147,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            onClick={() => setIsOpen(false)}
            aria-label="Fermer le chat"
          >
            <CloseSVG />
          </button>
        </div>
      </header>

      {/* ── Filet doré sous le header ── */}
      <div className="h-[2px] flex-shrink-0" style={{ background: 'linear-gradient(to right, #D2B093, rgba(210,176,147,0.2))' }} />

      {/* ── Messages ── */}
      <main
        className="flex-1 overflow-y-auto px-3.5 py-4 flex flex-col gap-2.5 scroll-smooth [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full"
        style={{
          background: 'linear-gradient(180deg, #f0f5f8 0%, #f7f9fb 100%)',
        }}
        aria-live="polite"
        aria-label="Messages"
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} msg={msg} />
        ))}

        {/* Quick replies */}
        {showQuick && messages.length === 1 && (
          <div
            className="flex flex-wrap gap-1.5 pt-1 pb-1 pl-9 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150"
            role="group"
            aria-label="Raccourcis de questions"
          >
            {QUICK_REPLIES.map((qr) => (
              <button
                key={qr.label}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium cursor-pointer transition-all duration-150 whitespace-nowrap hover:-translate-y-px active:translate-y-0"
                style={{
                  background: 'rgba(210,176,147,0.12)',
                  border: '1px solid rgba(210,176,147,0.5)',
                  color: '#8a5e3a',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(210,176,147,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(210,176,147,0.12)')}
                onClick={() => sendMessage(qr.message)}
              >
                <span className="text-xs" aria-hidden="true">{qr.icon}</span>
                {qr.label}
              </button>
            ))}
          </div>
        )}

        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </main>

      {/* ── Input ── */}
      <footer
        className="flex-shrink-0 border-t"
        style={{ background: 'white', borderColor: 'rgba(35,115,149,0.1)' }}
      >
        <div className="flex items-end gap-2 px-3 py-2.5">
          <textarea
            ref={inputRef}
            className="flex-1 rounded-xl px-3 py-2 text-sm resize-none outline-none min-h-[38px] max-h-24 leading-relaxed overflow-y-auto placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150"
            style={{
              border: '1.5px solid rgba(35,115,149,0.2)',
              background: '#f4f8fa',
              color: '#1a2e38',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#237395'; e.currentTarget.style.background = 'white'; }}
            onBlur={e =>  { e.currentTarget.style.borderColor = 'rgba(35,115,149,0.2)'; e.currentTarget.style.background = '#f4f8fa'; }}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 96) + "px";
            }}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question…"
            rows={1}
            aria-label="Votre message"
            disabled={loading}
          />
          <button
            className="w-9 h-9 rounded-full border-none cursor-pointer flex items-center justify-center flex-shrink-0 transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#237395', color: 'white' }}
            onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#1a5870'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#237395'; }}
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            aria-label="Envoyer"
          >
            <SendSVG />
          </button>
        </div>

        {/* Liens de contact */}
        <div
          className="flex items-center gap-2 px-3.5 pb-2.5 pt-0 text-[10.5px]"
          style={{ color: 'rgba(35,115,149,0.45)' }}
        >
          <a
            href="tel:0607979074"
            className="transition-colors duration-150 hover:opacity-100"
            style={{ color: '#D2B093' }}
          >
            06 07 97 90 74
          </a>
          <span>·</span>
          <a
            href="mailto:jeancharlesbiernat@yahoo.com"
            className="transition-colors duration-150 hover:opacity-100"
            style={{ color: '#D2B093' }}
          >
            Email
          </a>
          <span>·</span>
          <span>Doubs &amp; Jura</span>
        </div>
      </footer>
    </div>
  );
}