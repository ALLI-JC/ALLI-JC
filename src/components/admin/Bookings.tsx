// pages/admin/Messages.tsx - Version adaptée à votre table
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { 
  Search, User, Mail, Trash2, 
  MessageSquare, Send, Eye, Clock,
  RefreshCw, AlertCircle, CheckCircle
} from 'lucide-react'

interface Message {
  id: string
  name: string
  email: string
  message: string
  status: 'read' | 'unread' | 'replied'
  created_at: string
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showNotification, setShowNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur Supabase:', error)
        showMessage('error', `Erreur: ${error.message}`)
        setMessages([])
      } else {
        console.log(`${data?.length || 0} messages chargés`)
        setMessages(data || [])
      }
    } catch (err) {
      console.error('Exception:', err)
      showMessage('error', 'Erreur de connexion à la base de données')
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  async function updateMessageStatus(id: string, status: 'read' | 'unread' | 'replied') {
    const { error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', id)

    if (!error) {
      setMessages(prev => prev.map(msg => 
        msg.id === id ? { ...msg, status } : msg
      ))
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(prev => prev ? { ...prev, status } : null)
      }
      showMessage('success', `Message marqué comme ${getStatusText(status)}`)
    } else {
      showMessage('error', 'Erreur lors de la mise à jour')
    }
  }

  function getStatusText(status: string): string {
    switch(status) {
      case 'read': return 'lu'
      case 'unread': return 'non lu'
  
      default: return status
    }
  }

  async function deleteMessage(id: string) {
    if (confirm('Supprimer définitivement ce message ?')) {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)

      if (!error) {
        setMessages(prev => prev.filter(msg => msg.id !== id))
        if (selectedMessage?.id === id) {
          setSelectedMessage(null)
        }
        showMessage('success', 'Message supprimé')
      } else {
        showMessage('error', 'Erreur lors de la suppression')
      }
    }
  }

  function showMessage(type: 'success' | 'error', message: string) {
    setShowNotification({ type, message })
    setTimeout(() => setShowNotification(null), 3000)
  }

  const filteredMessages = messages.filter(message => {
    if (filter !== 'all' && message.status !== filter) return false
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return (
        (message.name?.toLowerCase() || '').includes(search) ||
        (message.email?.toLowerCase() || '').includes(search) ||
        (message.message?.toLowerCase() || '').includes(search)
      )
    }
    return true
  })

  const stats = {
    total: messages.length,
    unread: messages.filter(m => m.status === 'unread').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string, text: string, label: string, icon: any }> = {
      unread: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Non lu', icon: Clock },
      read: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Lu', icon: Eye },

    }
    const c = config[status] || config.read
    const Icon = c.icon
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        <Icon size={12} />
        {c.label}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date inconnue'
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const days = Math.floor(diff / (1000 * 3600 * 24))
      
      if (days === 0) {
        return `Aujourd'hui à ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
      }
      if (days === 1) return 'Hier'
      if (days < 7) return `Il y a ${days} jours`
      return date.toLocaleDateString('fr-FR')
    } catch {
      return 'Date invalide'
    }
  }

  return (
    <div className="p-4 md:p-6">
      {/* Notification toast */}
      {showNotification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-right ${
          showNotification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {showNotification.message}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800"> Messages de contact</h1>
          <p className="text-gray-500 text-sm mt-1">{stats.total} messages reçus</p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Actualiser
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
          <p className="text-xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-400">Total</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center border border-blue-100 bg-blue-50/30 shadow-sm">
          <p className="text-xl font-bold text-blue-600">{stats.unread}</p>
          <p className="text-xs text-blue-500">Non lus</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center border border-gray-100 bg-gray-50/30 shadow-sm">
          <p className="text-xl font-bold text-gray-600">{stats.read}</p>
          <p className="text-xs text-gray-500">Lus</p>
        </div>
   
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'all', label: 'Tous', count: stats.total },
            { id: 'unread', label: 'Non lus', count: stats.unread },
            { id: 'read', label: 'Lus', count: stats.read },
        
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f.id 
                  ? 'bg-[#79DBDC] text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-full sm:w-80 focus:outline-none focus:border-[#79DBDC] focus:ring-1 focus:ring-[#79DBDC]"
          />
        </div>
      </div>

      {/* Liste des messages */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#79DBDC] mx-auto"></div>
            <p className="mt-4 text-gray-500">Chargement...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            {messages.length === 0 ? (
              <>
                <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-400">Aucun message reçu</p>
                <p className="text-sm text-gray-300 mt-1">Les messages apparaîtront ici</p>
              </>
            ) : (
              <>
                <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-400">Aucun résultat</p>
              </>
            )}
          </div>
        ) : (
          filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition cursor-pointer ${
                message.status === 'unread' ? 'border-l-4 border-l-blue-500' : 'border-gray-100'
              }`}
              onClick={() => setSelectedMessage(message)}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#79DBDC] to-[#5BBFC0] rounded-xl flex items-center justify-center text-white shrink-0">
                  <User size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-gray-800">{message.name}</p>
                    {message.status === 'unread' && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
                        Nouveau
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{message.email}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{message.message}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400">{formatDate(message.created_at)}</span>
                  {getStatusBadge(message.status)}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteMessage(message.id) }}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedMessage(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Message de {selectedMessage.name}</h2>
                <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Expéditeur</h3>
                <p><span className="font-medium">Nom:</span> {selectedMessage.name}</p>
                <p className="mt-2"><span className="font-medium">Email:</span> {selectedMessage.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Message</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Reçu le {new Date(selectedMessage.created_at).toLocaleString('fr-FR')}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {selectedMessage.status === 'unread' && (
                  <button
                    onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                    className="px-4 py-2 bg-gray-500 text-white rounded-xl text-sm font-medium hover:bg-gray-600"
                  >
                    Marquer comme lu
                  </button>
                )}
        
            
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}