// Dans AdminLayout.tsx, ajoutez dans navItems
import { LayoutDashboard, Users, Calendar, Settings, Image } from 'lucide-react'

const navItems = [
  { path: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Utilisateurs', icon: Users },
  { path: '/admin/bookings', label: 'Réservations', icon: Calendar },
  { path: '/admin/gallery', label: 'Galerie', icon: Image },  // ← AJOUTER
  { path: '/admin/settings', label: 'Paramètres', icon: Settings },
]