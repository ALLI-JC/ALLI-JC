import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Plus, Pencil, FileText } from 'lucide-react'

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

  useEffect(() => {
    fetchPricingRows()
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
      setStatus(data?.length ? `Chargement de ${data.length} tarif(s) depuis Supabase.` : 'Aucun tarif enregistré.')
    } catch (error) {
      console.error(error)
      setStatus('La table calculator_pricing n’existe pas encore. Veuillez créer la table avec la requête SQL fournie.')
    } finally {
      setLoading(false)
    }
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
        <p className="text-gray-500 mt-1">Ajoutez et modifiez les tarifs du calculateur de devis depuis cette page dédiée.</p>
      </div>

      {status && (
        <div className="rounded-2xl border border-[#237395]/20 bg-[#f6feff] px-4 py-3 text-sm text-[#237395]">
          {status}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-[#237395]" />
              <h2 className="text-lg font-semibold text-gray-900">Liste des tarifs</h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setDraftPricing(emptyPricingDraft())
                setEditingPricingId(null)
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#237395] px-3 py-2 text-sm font-semibold text-white"
            >
              <Plus size={15} />
              Ajouter
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {loading ? (
              <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                Chargement des tarifs…
              </div>
            ) : pricingRows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                Aucune ligne de tarif enregistrée.
              </div>
            ) : (
              pricingRows.map((row) => (
                <div key={row.id || row.key} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{row.label}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{row.category}</p>
                      <p className="mt-1 text-sm text-gray-700">{row.value} {row.unit}</p>
                      {row.description && <p className="mt-1 text-xs text-gray-500">{row.description}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => startEditPricing(row)}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-[#237395]"
                    >
                      <Pencil size={14} />
                      Modifier
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingPricingId ? 'Modifier un tarif' : 'Ajouter un tarif'}
            </h2>
            {(editingPricingId || draftPricing.key || draftPricing.label) && (
              <button type="button" onClick={cancelPricingDraft} className="text-sm font-semibold text-gray-500">
                Annuler
              </button>
            )}
          </div>

          <div className="mt-4 space-y-3">
            <label className="block text-sm text-gray-700">
              Clé de référence
              <input
                value={draftPricing.key}
                onChange={(e) => setDraftPricing((prev) => ({ ...prev, key: e.target.value }))}
                placeholder="ex: hedgeSmallRate"
                className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-[#237395] focus:outline-none"
              />
            </label>
            <label className="block text-sm text-gray-700">
              Libellé
              <input
                value={draftPricing.label}
                onChange={(e) => setDraftPricing((prev) => ({ ...prev, label: e.target.value }))}
                placeholder="ex: Haie petite"
                className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-[#237395] focus:outline-none"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm text-gray-700">
                Valeur
                <input
                  type="number"
                  step="0.1"
                  value={draftPricing.value}
                  onChange={(e) => setDraftPricing((prev) => ({ ...prev, value: Number(e.target.value) || 0 }))}
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-[#237395] focus:outline-none"
                />
              </label>
              <label className="block text-sm text-gray-700">
                Unité
                <input
                  value={draftPricing.unit}
                  onChange={(e) => setDraftPricing((prev) => ({ ...prev, unit: e.target.value }))}
                  placeholder="€/m²"
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-[#237395] focus:outline-none"
                />
              </label>
            </div>
            <label className="block text-sm text-gray-700">
              Catégorie
              <input
                value={draftPricing.category}
                onChange={(e) => setDraftPricing((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="jardinage"
                className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-[#237395] focus:outline-none"
              />
            </label>
            <label className="block text-sm text-gray-700">
              Description
              <textarea
                value={draftPricing.description ?? ''}
                onChange={(e) => setDraftPricing((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-[#237395] focus:outline-none"
              />
            </label>
            <button
              type="button"
              onClick={savePricingRow}
              className="w-full rounded-2xl bg-[#237395] px-4 py-3 text-sm font-semibold text-white"
            >
              {editingPricingId ? 'Enregistrer les modifications' : 'Ajouter au calculateur'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

