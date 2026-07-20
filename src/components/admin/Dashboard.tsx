// pages/admin/Dashboard.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { 
  Users, Calendar, Clock, CheckCircle, 
  MessageSquare, DollarSign, TrendingUp, ArrowRight
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalBookings: number
  pendingBookings: number
  todayBookings: number
  totalMessages: number
  unreadMessages: number
  monthlyRevenue: number
}

interface RecentMessage {
  id: string
  name: string
  email: string
  message: string
  status: string
  created_at: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    todayBookings: 0,
    totalMessages: 0,
    unreadMessages: 0,
    monthlyRevenue: 12580
  })
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    setLoading(true)

    try {
      // 1. Compter les messages totaux
      const { count: totalMessages } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })

      // 2. Compter les messages non lus
      const { count: unreadMessages } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread')

      // 3. Compter les réservations (si la table existe)
      let totalBookings = 0
      let pendingBookings = 0
      let todayBookings = 0

      try {
        const { count: bookings } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
        totalBookings = bookings || 0

        const { count: pending } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')
        pendingBookings = pending || 0

        const today = new Date().toISOString().split('T')[0]
        const { count: todayCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('date', today)
        todayBookings = todayCount || 0
      } catch (error) {
        console.log('Table bookings non existante ou erreur:', error)
      }

      // 4. Compter les utilisateurs (si la table profiles existe)
      let totalUsers = 0
      try {
        const { count: users } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
        totalUsers = users || 0
      } catch (error) {
        console.log('Table profiles non existante:', error)
        // Alternative: compter via auth.users (nécessite droits admin)
        try {
          const { data: { users } } = await supabase.auth.admin.listUsers()
          totalUsers = users?.length || 0
        } catch {
          totalUsers = 1 // Au moins l'admin connecté
        }
      }

      // 5. Récupérer les derniers messages
      const { data: messagesData } = await supabase
        .from('contact_messages')
        .select('id, name, email, message, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        totalUsers,
        totalBookings,
        pendingBookings,
        todayBookings,
        totalMessages: totalMessages || 0,
        unreadMessages: unreadMessages || 0,
        monthlyRevenue: 12580 // Valeur fixe ou à calculer
      })
      setRecentMessages(messagesData || [])
    } catch (error) {
      console.error('Erreur chargement dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { 
      title: 'Utilisateurs', 
      value: stats.totalUsers, 
      icon: Users, 
      color: '#237395',
      bgColor: '#23739510',
      change: '+12%',
      trend: 'up'
    },
  
   
 
    { 
      title: 'Messages', 
      value: stats.totalMessages, 
      icon: MessageSquare, 
      color: '#237395',
      bgColor: '#23739510',
      change: `${stats.unreadMessages} non lus`,
      trend: stats.unreadMessages > 0 ? 'warning' : 'neutral'
    },
    
  ]

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date inconnue'
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 3600 * 24))
    
    if (days === 0) return `Aujourd'hui à ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    if (days === 1) return 'Hier'
    if (days < 7) return `Il y a ${days} jours`
    return date.toLocaleDateString('fr-FR')
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      unread: 'bg-blue-100 text-blue-800',
      read: 'bg-gray-100 text-gray-600',
      replied: 'bg-green-100 text-green-800'
    }
    const labels: Record<string, string> = {
      unread: 'Non lu',
      read: 'Lu',
      replied: 'Répondu'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status] || badges.unread}`}>
        {labels[status] || status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#237395] mx-auto"></div>
          <p className="mt-4 text-gray-500">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* En-tête avec bienvenue */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Bienvenue dans votre espace d'administration</p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-300 border border-gray-100 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {card.trend === 'up' && <TrendingUp size={12} className="text-green-500" />}
                    <p className={`text-xs ${
                      card.trend === 'up' ? 'text-green-500' : 
                      card.trend === 'warning' ? 'text-orange-500' : 'text-gray-400'
                    }`}>
                      {card.change}
                    </p>
                  </div>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: card.bgColor }}
                >
                  <Icon size={18} style={{ color: card.color }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Section principale avec 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Derniers messages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-[#237395]" />
                <h2 className="text-lg font-semibold text-gray-800">Derniers messages</h2>
              </div>
              <button 
                onClick={() => window.location.href = '/admin/messages'}
                className="flex items-center gap-1 text-xs text-[#237395] hover:underline"
              >
                Voir tout
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {recentMessages.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-400">Aucun message reçu</p>
                <p className="text-xs text-gray-300 mt-1">Les messages apparaîtront ici</p>
              </div>
            ) : (
              recentMessages.map((message) => (
                <div key={message.id} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-gray-800">{message.name}</p>
                        {message.status === 'unread' && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
                            Nouveau
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{message.email}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{message.message}</p>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-xs text-gray-400">{formatDate(message.created_at)}</p>
                      {getStatusBadge(message.status)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activité récente / Résumé */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-[#237395]" />
              <h2 className="text-lg font-semibold text-gray-800">Activité récente</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-700">Messages non lus</p>
                <p className="text-xs text-gray-400">À traiter</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{stats.unreadMessages}</p>
                <button 
                  onClick={() => window.location.href = '/admin/messages'}
                  className="text-xs text-[#237395] hover:underline"
                >
                  Consulter
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-700">Réservations en attente</p>
                <p className="text-xs text-gray-400">À confirmer</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</p>
                <button 
                  onClick={() => window.location.href = '/admin/bookings'}
                  className="text-xs text-[#237395] hover:underline"
                >
                  Gérer
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#23739510] to-transparent rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-700">Réservations aujourd'hui</p>
                <p className="text-xs text-gray-400">Interventions prévues</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#237395]">{stats.todayBookings}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Actions rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => window.location.href = '/admin/messages'}
            className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-gray-200 text-gray-700 hover:border-[#237395] hover:text-[#237395] hover:shadow-md transition-all duration-200"
          >
            <MessageSquare size={16} />
            <span className="text-sm font-medium">Voir messages</span>
          </button>
         
          <button
            onClick={() => window.location.href = '/admin/gallery'}
            className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-gray-200 text-gray-700 hover:border-[#237395] hover:text-[#237395] hover:shadow-md transition-all duration-200"
          >
            <Calendar size={16} />
            <span className="text-sm font-medium">Galerie</span>
          </button>
        </div>
      </div>

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
