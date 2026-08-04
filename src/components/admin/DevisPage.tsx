import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Plus, Pencil, FileText, Mail, Phone, User, Trash2 } from 'lucide-react'

interface PricingRow {
  id?: string
  key: string
  label: string
  value: number
  unit: string
  category: string
  description?: string | null
  created_at?: string
  updated_at?: string
}

interface QuoteRequest {
  id: string
  name: string
  email: string
  message: string
  status: string
  created_at: string
}

const emptyPricingDraft = (): PricingRow => ({
  key: '',
  label: '',
  value: 0,
  unit: '€',
  category: 'général',
  description: '',
})

export default function DevisPage() {
  const [pricingRows, setPricingRows] = useState<PricingRow[]>([])
  const [draftPricing, setDraftPricing] = useState<PricingRow>(emptyPricingDraft())
  const [editingPricingId, setEditingPricingId] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([])
  const [quotesLoading, setQuotesLoading] = useState(true)

  useEffect(() => {
    fetchPricingRows()
    fetchQuoteRequests()
  }, [])

  async function fetchPricingRows() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('calculator_pricing')
        .select('*')
        .order('category', { ascending: true })
        .order('label', { ascending: true })

      if (error) {
        throw error
      }

      setPricingRows(data || [])
    } catch (error) {
      console.error(error)
      setStatus('La table calculator_pricing n’existe pas encore. Veuillez créer la table avec la requête SQL fournie.')
    } finally {
      setLoading(false)
    }
  }

  async function fetchQuoteRequests() {
    setQuotesLoading(true)
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('id, name, email, message, status, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error

      setQuoteRequests((data || []).filter((message) =>
        message.message?.startsWith('Nouvelle demande issue du simulateur de devis.'),
      ))
    } catch (error) {
      console.error('Impossible de charger les demandes de devis :', error)
    } finally {
      setQuotesLoading(false)
    }
  }

  const formatDate = (date: string) => new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))

  async function deleteQuoteRequest(quote: QuoteRequest) {
    if (!window.confirm(`Supprimer définitivement la demande de devis de ${quote.name} ?`)) return

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', quote.id)

    if (error) {
      console.error('Impossible de supprimer la demande de devis :', error)
      setStatus('La suppression a échoué. Vérifiez vos permissions Supabase.')
      return
    }

    setQuoteRequests((current) => current.filter((request) => request.id !== quote.id))
  }

  async function savePricingRow() {
    if (!draftPricing.key.trim() || !draftPricing.label.trim()) {
      setStatus('Le libellé et la clé sont obligatoires.')
      return
    }

    const payload = {
      key: draftPricing.key.trim(),
      label: draftPricing.label.trim(),
      value: Number(draftPricing.value) || 0,
      unit: draftPricing.unit.trim() || '€',
      category: draftPricing.category.trim() || 'général',
      description: draftPricing.description?.trim() || null,
      updated_at: new Date().toISOString(),
    }

    try {
      if (editingPricingId) {
        const { error } = await supabase
          .from('calculator_pricing')
          .update(payload)
          .eq('id', editingPricingId)
        if (error) throw error
        setStatus('Tarif mis à jour avec succès.')
      } else {
        const { error } = await supabase
          .from('calculator_pricing')
          .insert([{ ...payload, created_at: new Date().toISOString() }])
        if (error) throw error
        setStatus('Nouveau tarif ajouté avec succès.')
      }

      await fetchPricingRows()
      setDraftPricing(emptyPricingDraft())
      setEditingPricingId(null)
    } catch (error) {
      console.error(error)
      setStatus('Échec de l’enregistrement. Vérifiez la table Supabase et les permissions.')
    }
  }

  const startEditPricing = (row: PricingRow) => {
    setEditingPricingId(row.id ?? null)
    setDraftPricing({
      key: row.key,
      label: row.label,
      value: row.value,
      unit: row.unit,
      category: row.category,
      description: row.description ?? '',
    })
  }

  const cancelPricingDraft = () => {
    setDraftPricing(emptyPricingDraft())
    setEditingPricingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestion des devis</h1>
      </div>

      {status && (
        <div className="rounded-2xl border border-[var(--primary)]/20 bg-[#f6feff] px-4 py-3 text-sm text-[var(--primary)]">
          {status}
        </div>
      )}

      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[var(--primary)]" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Estimations envoyées par les clients</h2>
              <p className="text-sm text-gray-500">Demandes reçues depuis le simulateur de devis.</p>
            </div>
          </div>
          <button type="button" onClick={fetchQuoteRequests} className="rounded-full border border-gray-200 px-3 py-2 text-sm font-semibold text-[var(--primary)]">
            Actualiser
          </button>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {quotesLoading ? (
            <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 xl:col-span-2">Chargement des demandes…</div>
          ) : quoteRequests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 xl:col-span-2">Aucune estimation client reçue pour le moment.</div>
          ) : quoteRequests.map((quote) => {
            const lines = quote.message.split('\n')
            const phone = lines.find((line) => line.startsWith('Téléphone :'))?.replace('Téléphone :', '').trim()
            const estimateLines = lines.filter((line) => !line.startsWith('Nouvelle demande') && !line.startsWith('Téléphone :'))

            return (
              <article key={quote.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 font-semibold text-gray-900"><User size={15} />{quote.name}</p>
                    <p className="mt-1 text-xs text-gray-500">{formatDate(quote.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">{quote.status === 'unread' ? 'Nouveau' : 'Lu'}</span>
                    <button
                      type="button"
                      onClick={() => deleteQuoteRequest(quote)}
                      aria-label={`Supprimer la demande de ${quote.name}`}
                      title="Supprimer"
                      className="rounded-full p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 space-y-1 text-sm text-gray-700">
                  <p className="flex items-center gap-2"><Mail size={14} />{quote.email}</p>
                  {phone && <p className="flex items-center gap-2"><Phone size={14} />{phone}</p>}
                </div>
                <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-700">
                  {estimateLines.map((line) => (
                    <p key={line} className={line.startsWith('Total estimé :') ? 'mt-2 border-t border-gray-100 pt-2 font-bold text-[var(--primary)]' : ''}>{line}</p>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </div>

    </div>
  )
}


