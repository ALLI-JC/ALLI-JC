// pages/admin/Gallery.tsx
import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { 
  Plus, Trash2, Edit, Image as ImageIcon, Upload, 
  X, Move, Star, Eye, EyeOff, Loader2, 
  CheckCircle, XCircle, Info, ZoomIn, 
  ChevronLeft, ChevronRight, Grid3x3, List,
  Search, Filter, Download, Copy, Check
} from 'lucide-react'

interface GalleryImage {
  id: string
  title: string
  description: string
  image_url: string
  thumbnail_url: string | null
  category: string
  order: number
  featured: boolean
  created_at: string
  updated_at?: string
}

const categories = [
  { id: 'vitres', label: 'Nettoyage de vitres', icon: '🪟', color: 'from-cyan-500 to-cyan-600', bgColor: 'bg-cyan-50' },
  { id: 'exterieur', label: 'Nettoyage extérieur', icon: '🏠', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
  { id: 'jardin', label: 'Jardin & espaces verts', icon: '🌿', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
  { id: 'interieur', label: 'Nettoyage intérieur', icon: '🏡', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50' },
  { id: 'bricolage', label: 'Bricolage', icon: '🔧', color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-50' },
  { id: 'professionnel', label: 'Professionnel', icon: '🏢', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' },
  { id: 'general', label: 'Général', icon: '📷', color: 'from-gray-500 to-gray-600', bgColor: 'bg-gray-50' }
]

// Toast moderne
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    info: <Info size={20} />
  }

  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white ${colors[type]} animate-slide-up`}>
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-white/80 hover:text-white">
        <X size={16} />
      </button>
    </div>
  )
}

// Modal de prévisualisation moderne
function ImageModal({ image, onClose, onNext, onPrev, hasNext, hasPrev }: { 
  image: GalleryImage; 
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasPrev && onPrev) onPrev()
      if (e.key === 'ArrowRight' && hasNext && onNext) onNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onPrev, onNext, hasPrev, hasNext])

  const category = categories.find(c => c.id === image.category)

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={onClose}>
      {/* Navigation */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev?.() }}
          className="absolute left-4 z-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110 backdrop-blur-sm"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
      )}
      
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext?.() }}
          className="absolute right-4 z-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110 backdrop-blur-sm"
        >
          <ChevronRight size={24} className="text-white" />
        </button>
      )}

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all backdrop-blur-sm"
      >
        <X size={20} className="text-white" />
      </button>

      {/* Image */}
      <div className="max-w-[90vw] max-h-[90vh] relative" onClick={e => e.stopPropagation()}>
        <img
          src={image.image_url}
          alt={image.title}
          className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
        />
        
        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 rounded-b-2xl">
          <div className="flex items-center gap-2 mb-2">
            {category && (
              <span className={`px-2 py-1 ${category.bgColor} text-gray-700 text-xs rounded-full flex items-center gap-1`}>
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </span>
            )}
            {image.featured && (
              <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full flex items-center gap-1">
                <Star size={12} />
                À la une
              </span>
            )}
          </div>
          <h3 className="text-white text-2xl font-bold">{image.title}</h3>
          <p className="text-white/80 mt-2 max-w-2xl">{image.description}</p>
          <p className="text-white/40 text-sm mt-3">
            {new Date(image.created_at).toLocaleDateString('fr-FR', { 
              day: 'numeric', month: 'long', year: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  )
}

// Composant de chargement élégant
function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#79DBDC]/20 rounded-full animate-spin border-t-[#79DBDC]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageIcon size={24} className="text-[#79DBDC] animate-pulse" />
        </div>
      </div>
      <p className="text-gray-400 mt-4">Chargement de la galerie...</p>
    </div>
  )
}

// Carte d'image élégante
function ImageCard({ image, index, onEdit, onDelete, onToggleFeatured, onPreview, onDragStart, onDragOver, onDrop, onDragEnd, isDragging }: {
  image: GalleryImage;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
  onPreview: () => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}) {
  const category = categories.find(c => c.id === image.category)

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={onDragEnd}
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-40 scale-95 ring-2 ring-[#79DBDC]' : 'hover:-translate-y-1'
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={image.image_url}
          alt={image.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="text-white font-semibold text-sm line-clamp-2">{image.title}</h3>
            <p className="text-white/70 text-xs mt-1 line-clamp-2">{image.description}</p>
          </div>
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-2">
          <button
            onClick={onPreview}
            className="p-2.5 bg-white rounded-xl hover:scale-110 transition-all shadow-lg hover:shadow-xl"
            title="Voir en grand"
          >
            <ZoomIn size={18} className="text-gray-700" />
          </button>
          <button
            onClick={onEdit}
            className="p-2.5 bg-white rounded-xl hover:scale-110 transition-all shadow-lg hover:shadow-xl"
            title="Modifier"
          >
            <Edit size={18} className="text-blue-500" />
          </button>
          <button
            onClick={onDelete}
            className="p-2.5 bg-white rounded-xl hover:scale-110 transition-all shadow-lg hover:shadow-xl"
            title="Supprimer"
          >
            <Trash2 size={18} className="text-red-500" />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {image.featured && (
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg animate-pulse">
              <Star size={12} />
              <span className="font-medium">Une</span>
            </div>
          )}
          {category && (
            <div className={`bg-gradient-to-r ${category.color} text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg backdrop-blur-sm`}>
              <span>{category.icon}</span>
              <span className="font-medium hidden sm:inline">{category.label}</span>
            </div>
          )}
        </div>

        {/* Drag Handle */}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-all">
          <Move size={14} className="text-white" />
        </div>

        {/* Order Number */}
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-xs font-mono">
          #{image.order + 1}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 truncate">{image.title}</p>
            <p className="text-[10px] text-gray-400">
              {new Date(image.created_at).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onToggleFeatured}
            className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
              image.featured ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
            }`}
            title={image.featured ? 'Retirer de la une' : 'Mettre à la une'}
          >
            <Star size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Modal d'édition élégant
function EditModal({ image, onClose, onSave, isEditing }: {
  image?: GalleryImage | null;
  onClose: () => void;
  onSave: (data: any, file?: File) => Promise<void>;
  isEditing: boolean;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    featured: false
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (image) {
      setFormData({
        title: image.title,
        description: image.description || '',
        category: image.category,
        featured: image.featured
      })
      setPreviewUrl(image.image_url)
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'general',
        featured: false
      })
      setPreviewUrl(null)
    }
    setSelectedFile(null)
  }, [image])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return
      }
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    if (!isEditing && !selectedFile) return
    
    setUploading(true)
    await onSave(formData, selectedFile || undefined)
    setUploading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#79DBDC] to-[#5BBFC0] px-6 py-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {isEditing ? <Edit size={22} /> : <Plus size={22} />}
            {isEditing ? 'Modifier l\'image' : 'Ajouter une image'}
          </h2>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white transition-all hover:rotate-90"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Upload Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Image {!isEditing && <span className="text-red-500">*</span>}
            </label>
            <div 
              className={`relative rounded-xl border-2 border-dashed transition-all ${
                previewUrl ? 'border-[#79DBDC] bg-[#79DBDC]/5' : 'border-gray-300 hover:border-[#79DBDC] bg-gray-50'
              }`}
            >
              {previewUrl ? (
                <div className="relative group">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-56 w-full object-contain rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 bg-white rounded-full hover:scale-110 transition shadow-lg"
                    >
                      <Upload size={18} className="text-gray-700" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl(image?.image_url || null)
                      }}
                      className="p-2.5 bg-white rounded-full hover:scale-110 transition shadow-lg"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-8 text-center cursor-pointer group"
                >
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#79DBDC]/20 to-[#5BBFC0]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                    <Upload size={32} className="text-[#79DBDC]" />
                  </div>
                  <p className="text-gray-600 font-medium">
                    {isEditing ? 'Changer l\'image' : 'Cliquez pour sélectionner'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP • Max 5MB</p>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#79DBDC] focus:ring-2 focus:ring-[#79DBDC]/20 transition"
              placeholder="Titre de l'image"
              maxLength={100}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#79DBDC] focus:ring-2 focus:ring-[#79DBDC]/20 transition resize-none"
              placeholder="Description de l'image..."
              maxLength={500}
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-400">
                {formData.description.length}/500 caractères
              </span>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Catégorie
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                    formData.category === cat.id
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-md`
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="text-sm">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Toggle */}
          <label className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl cursor-pointer hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star size={18} className="text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Mettre à la une</p>
                <p className="text-xs text-gray-400">Cette image apparaîtra en vedette</p>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#79DBDC] transition-all"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
            </div>
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={uploading || (!isEditing && !selectedFile)}
              className="flex-1 bg-gradient-to-r from-[#79DBDC] to-[#5BBFC0] text-white py-2.5 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {uploading ? (
                <Loader2 size={18} className="animate-spin mx-auto" />
              ) : isEditing ? (
                'Mettre à jour'
              ) : (
                'Ajouter'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function GalleryManagement() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null)
  const [previewIndex, setPreviewIndex] = useState(0)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchImages()
  }, [])

  async function fetchImages() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('order', { ascending: true })
      
      if (error) throw error
      setImages(data || [])
    } catch (err) {
      console.error('Erreur:', err)
      showToast('Impossible de charger les images', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function uploadImage(file: File): Promise<string> {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Le fichier ne doit pas dépasser 5MB')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(fileName)

    return publicUrl
  }

  async function handleSave(formData: any, file?: File) {
    try {
      let imageUrl = editingImage?.image_url || ''
      
      if (file) {
        imageUrl = await uploadImage(file)
      }

      if (editingImage) {
        const updateData: any = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          featured: formData.featured,
          updated_at: new Date().toISOString()
        }
        
        if (file) {
          updateData.image_url = imageUrl
          updateData.thumbnail_url = imageUrl
        }
        
        const { error } = await supabase
          .from('gallery')
          .update(updateData)
          .eq('id', editingImage.id)

        if (error) throw error
        showToast('Image mise à jour avec succès!', 'success')
      } else {
        const maxOrder = images.length > 0 ? Math.max(...images.map(i => i.order)) : -1
        
        const { error } = await supabase
          .from('gallery')
          .insert({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            featured: formData.featured,
            image_url: imageUrl,
            thumbnail_url: imageUrl,
            order: maxOrder + 1
          })

        if (error) throw error
        showToast('Image ajoutée avec succès!', 'success')
      }

      setShowModal(false)
      setEditingImage(null)
      await fetchImages()
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de l\'enregistrement', 'error')
    }
  }

  async function deleteImage(image: GalleryImage) {
    if (!confirm(`Supprimer "${image.title}" ?`)) return

    try {
      const fileName = image.image_url.split('/').pop()?.split('?')[0]
      if (fileName) {
        await supabase.storage.from('gallery').remove([fileName])
      }

      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', image.id)

      if (error) throw error

      await fetchImages()
      showToast('Image supprimée avec succès!', 'success')
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la suppression', 'error')
    }
  }

  async function toggleFeatured(image: GalleryImage) {
    try {
      const { error } = await supabase
        .from('gallery')
        .update({ featured: !image.featured })
        .eq('id', image.id)

      if (error) throw error
      
      await fetchImages()
      showToast(image.featured ? 'Retiré de la une' : 'Mis à la une', 'success')
    } catch (err: any) {
      showToast('Erreur lors du changement', 'error')
    }
  }

  async function updateOrder(orderedImages: GalleryImage[]) {
    try {
      for (let i = 0; i < orderedImages.length; i++) {
        await supabase
          .from('gallery')
          .update({ order: i })
          .eq('id', orderedImages[i].id)
      }
      await fetchImages()
    } catch (err) {
      console.error('Erreur mise à jour ordre:', err)
    }
  }

  function showToast(message: string, type: 'success' | 'error' | 'info') {
    setToast({ message, type })
  }

  // Drag & Drop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = draggedIndex
    if (dragIndex === null || dragIndex === dropIndex) return

    const newImages = [...images]
    const [draggedItem] = newImages.splice(dragIndex, 1)
    newImages.splice(dropIndex, 0, draggedItem)
    
    setImages(newImages)
    updateOrder(newImages)
    setDraggedIndex(null)
  }

  // Filtrage
  const filteredImages = images.filter(img => {
    const matchesSearch = img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         img.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || img.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const openPreview = (image: GalleryImage, index: number) => {
    setPreviewImage(image)
    setPreviewIndex(index)
  }

  const nextPreview = () => {
    const newIndex = (previewIndex + 1) % filteredImages.length
    setPreviewIndex(newIndex)
    setPreviewImage(filteredImages[newIndex])
  }

  const prevPreview = () => {
    const newIndex = (previewIndex - 1 + filteredImages.length) % filteredImages.length
    setPreviewIndex(newIndex)
    setPreviewImage(filteredImages[newIndex])
  }

  const stats = {
    total: images.length,
    featured: images.filter(i => i.featured).length,
    categories: categories.map(cat => ({
      ...cat,
      count: images.filter(i => i.category === cat.id).length
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Preview Modal */}
      {previewImage && (
        <ImageModal
          image={previewImage}
          onClose={() => setPreviewImage(null)}
          onNext={nextPreview}
          onPrev={prevPreview}
          hasNext={previewIndex < filteredImages.length - 1}
          hasPrev={previewIndex > 0}
        />
      )}

      {/* Edit Modal */}
      {showModal && (
        <EditModal
          image={editingImage}
          onClose={() => {
            setShowModal(false)
            setEditingImage(null)
          }}
          onSave={handleSave}
          isEditing={!!editingImage}
        />
      )}

      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#79DBDC] to-[#5BBFC0] bg-clip-text text-transparent">
                Galerie d'images
              </h1>
              <p className="text-gray-500 mt-2">
                {stats.total} image{stats.total > 1 ? 's' : ''} • {stats.featured} à la une
              </p>
            </div>
            
            <button
              onClick={() => {
                setEditingImage(null)
                setShowModal(true)
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-[#79DBDC] to-[#5BBFC0] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              <Plus size={20} />
              Ajouter une image
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {stats.categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
              className={`${cat.bgColor} rounded-xl p-3 text-center transition-all hover:scale-105 ${
                selectedCategory === cat.id ? 'ring-2 ring-[#79DBDC] shadow-md' : ''
              }`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <p className="text-xs font-medium text-gray-700 mt-1 hidden sm:block">{cat.label}</p>
              <p className="text-lg font-bold text-[#79DBDC]">{cat.count}</p>
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par titre ou description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#79DBDC] focus:ring-2 focus:ring-[#79DBDC]/20 transition"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl transition ${
                viewMode === 'grid' ? 'bg-[#79DBDC] text-white shadow-md' : 'bg-white text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-xl transition ${
                viewMode === 'list' ? 'bg-[#79DBDC] text-white shadow-md' : 'bg-white text-gray-400 hover:text-gray-600'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <ImageIcon size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400 text-lg">Aucune image trouvée</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-[#79DBDC] hover:underline"
              >
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredImages.map((image, index) => (
              viewMode === 'grid' ? (
                <ImageCard
                  key={image.id}
                  image={image}
                  index={index}
                  onEdit={() => {
                    setEditingImage(image)
                    setShowModal(true)
                  }}
                  onDelete={() => deleteImage(image)}
                  onToggleFeatured={() => toggleFeatured(image)}
                  onPreview={() => openPreview(image, index)}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={() => setDraggedIndex(null)}
                  isDragging={draggedIndex === index}
                />
              ) : (
                <div key={image.id} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition">
                  {/* Vue liste simplifiée */}
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <img src={image.image_url} alt={image.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{image.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{image.description}</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => toggleFeatured(image)} className="text-xs text-yellow-500">⭐</button>
                        <button onClick={() => {
                          setEditingImage(image)
                          setShowModal(true)
                        }} className="text-xs text-blue-500">✏️</button>
                        <button onClick={() => deleteImage(image)} className="text-xs text-red-500">🗑️</button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {/* Drag & Drop Hint */}
        {images.length > 1 && viewMode === 'grid' && (
          <div className="mt-8 text-center text-xs text-gray-400 bg-white/50 backdrop-blur-sm py-3 rounded-xl">
            💡 Glissez-déposez les images pour réorganiser l'ordre d'affichage
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}