// pages/admin/Users.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { 
  UserPlus, Trash2, Crown, User, RefreshCw, 
  Loader2, AlertCircle, Mail, Phone, Calendar,
  CheckCircle, XCircle, Edit, Search
} from 'lucide-react'

interface User {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: string
  is_active: boolean
  created_at: string
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({ email: '', full_name: '', phone: '', role: 'user' })
  const [editUser, setEditUser] = useState({ full_name: '', phone: '' })
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      
      setUsers(data || [])
    } catch (error: any) {
      console.error('Erreur:', error)
      setError(error.message)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  async function addUser(e: React.FormEvent) {
    e.preventDefault()
    if (!newUser.email) {
      setToast({ message: 'Email requis', type: 'error' })
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('users')
        .insert([{
          email: newUser.email,
          full_name: newUser.full_name || null,
          phone: newUser.phone || null,
          role: newUser.role,
          is_active: true
        }])

      if (error) throw error

      setToast({ message: 'Utilisateur créé avec succès!', type: 'success' })
      setShowAddModal(false)
      setNewUser({ email: '', full_name: '', phone: '', role: 'user' })
      fetchUsers()
    } catch (error: any) {
      console.error('Erreur insertion:', error)
      setToast({ message: error.message, type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function updateUser(e: React.FormEvent) {
    e.preventDefault()
    if (!showEditModal) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: editUser.full_name || null,
          phone: editUser.phone || null
        })
        .eq('id', showEditModal.id)

      if (error) throw error

      setToast({ message: 'Utilisateur modifié!', type: 'success' })
      setShowEditModal(null)
      fetchUsers()
    } catch (error: any) {
      setToast({ message: error.message, type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function toggleUserRole(user: User) {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', user.id)

      if (error) throw error

      setToast({ message: `${user.email} est maintenant ${newRole === 'admin' ? 'admin' : 'utilisateur'}`, type: 'success' })
      fetchUsers()
    } catch (error: any) {
      setToast({ message: error.message, type: 'error' })
    }
  }

  async function toggleUserStatus(user: User) {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: !user.is_active })
        .eq('id', user.id)

      if (error) throw error

      setToast({ message: `${user.email} ${user.is_active ? 'désactivé' : 'activé'}`, type: 'success' })
      fetchUsers()
    } catch (error: any) {
      setToast({ message: error.message, type: 'error' })
    }
  }

  async function deleteUser(id: string, email: string) {
    if (!confirm(`Supprimer ${email} définitivement ?`)) return
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

      if (error) throw error

      setToast({ message: `Utilisateur ${email} supprimé`, type: 'success' })
      fetchUsers()
    } catch (error: any) {
      setToast({ message: error.message, type: 'error' })
    }
  }

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    usersCount: users.filter(u => u.role === 'user').length,
    active: users.filter(u => u.is_active).length,
    inactive: users.filter(u => !u.is_active).length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 size={40} className="animate-spin text-[#79DBDC]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <p className="text-red-600 mb-4">La table "users" n'existe pas ou n'est pas accessible.</p>
          <p className="text-sm text-gray-500 mb-4">Veuillez exécuter le script SQL dans Supabase.</p>
          <button onClick={fetchUsers} className="px-4 py-2 bg-red-500 text-white rounded-lg">Réessayer</button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-2">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">👥 Utilisateurs</h1>
          <p className="text-gray-500">{stats.total} utilisateur(s)</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-[#79DBDC] to-[#5BBFC0] text-white px-4 py-2 rounded-lg">
          <UserPlus size={16} /> Ajouter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-gray-400">Total</p>
        </div>
        <div className="bg-white rounded-xl p-4 border text-center">
          <p className="text-2xl font-bold text-[#79DBDC]">{stats.admins}</p>
          <p className="text-xs text-gray-400">Admins</p>
        </div>
        <div className="bg-white rounded-xl p-4 border text-center">
          <p className="text-2xl font-bold">{stats.usersCount}</p>
          <p className="text-xs text-gray-400">Users</p>
        </div>
        <div className="bg-white rounded-xl p-4 border text-center">
          <p className="text-2xl font-bold text-green-500">{stats.active}</p>
          <p className="text-xs text-gray-400">Actifs</p>
        </div>
        <div className="bg-white rounded-xl p-4 border text-center">
          <p className="text-2xl font-bold text-red-400">{stats.inactive}</p>
          <p className="text-xs text-gray-400">Inactifs</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#79DBDC]"
          />
        </div>
      </div>

      {/* Liste */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="divide-y">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-400">Aucun utilisateur</div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                    user.role === 'admin' ? 'bg-gradient-to-br from-[#79DBDC] to-[#5BBFC0]' : 'bg-gray-500'
                  }`}>
                    {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{user.full_name || 'Sans nom'}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-[#79DBDC]/20 text-[#5BBFC0]' : 'bg-gray-100'
                      }`}>
                        {user.role === 'admin' ? <Crown size={10} /> : <User size={10} />}
                        {' '}{user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                      <button
                        onClick={() => toggleUserStatus(user)}
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Mail size={12} /> {user.email}
                    </p>
                    {user.phone && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Phone size={10} /> {user.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {
                    setShowEditModal(user)
                    setEditUser({ full_name: user.full_name || '', phone: user.phone || '' })
                  }} className="p-2 text-gray-500 hover:text-green-500 rounded-lg">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => toggleUserRole(user)} className="p-2 text-gray-500 hover:text-[#79DBDC] rounded-lg">
                    <Crown size={16} />
                  </button>
                  <button onClick={() => deleteUser(user.id, user.email)} className="p-2 text-gray-500 hover:text-red-500 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Add */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Ajouter</h2>
            <form onSubmit={addUser}>
              <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full p-2 border rounded-lg mb-3" required />
              <input type="text" placeholder="Nom" value={newUser.full_name} onChange={e => setNewUser({...newUser, full_name: e.target.value})} className="w-full p-2 border rounded-lg mb-3" />
              <input type="tel" placeholder="Téléphone" value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} className="w-full p-2 border rounded-lg mb-3" />
              <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full p-2 border rounded-lg mb-4">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-[#79DBDC] text-white rounded-lg">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowEditModal(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Modifier</h2>
            <form onSubmit={updateUser}>
              <input type="text" placeholder="Nom" value={editUser.full_name} onChange={e => setEditUser({...editUser, full_name: e.target.value})} className="w-full p-2 border rounded-lg mb-3" />
              <input type="tel" placeholder="Téléphone" value={editUser.phone} onChange={e => setEditUser({...editUser, phone: e.target.value})} className="w-full p-2 border rounded-lg mb-4" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowEditModal(null)} className="px-4 py-2 text-gray-600">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-[#79DBDC] text-white rounded-lg">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}