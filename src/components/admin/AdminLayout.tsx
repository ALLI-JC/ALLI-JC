// components/admin/AdminLayout.tsx - Version avec titre à gauche sans icône
import { useState, useEffect, useRef } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Image, 
  Users, 
  LogOut, 
  Menu, 
  X,
  Bell,
  User,
  Home,
  ChevronDown,
  Settings
} from 'lucide-react'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const profileRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    getUser()
    
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      // Sur desktop, la sidebar est toujours ouverte
      if (!mobile) {
        setSidebarOpen(true)
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email) {
      setUserEmail(user.email)
      const name = user.user_metadata?.full_name || user.email.split('@')[0]
      setUserName(name)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/admin/gallery', icon: Image, label: 'Galerie' },
    /*{ path: '/admin/users', icon: Users, label: 'Utilisateurs' },*/
  ]

  const isActive = (path: string) => {
    return location.pathname === path
  }

  // Obtenir le titre de la page active
  const getPageTitle = () => {
    const activeItem = menuItems.find(item => isActive(item.path))
    return activeItem?.label || 'Administration'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Bouton menu mobile - visible seulement sur mobile ET quand sidebar est fermée */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2.5 bg-gradient-to-br from-[#79DBDC] to-[#5BBFC0] text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          aria-label="Menu"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sidebar - toujours visible sur desktop, toggle sur mobile */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 bg-gradient-to-br from-[#79DBDC] via-[#6BCFD0] to-[#5BBFC0] shadow-2xl transition-transform duration-300 ease-in-out w-72 ${
          isMobile 
            ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
            : 'translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-5 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md overflow-hidden shrink-0">
                  <img 
                    src="/1.jpeg" 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.innerHTML = '<span class="text-[#79DBDC] font-bold text-lg">JC</span>';
                      }
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-bold text-white truncate">L'Allié JC</h1>
                  <p className="text-xs text-white/70 truncate">Administration</p>
                </div>
              </div>
              
              {/* Bouton X pour fermer - visible seulement sur mobile */}
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-all"
                  aria-label="Fermer"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (isMobile) setSidebarOpen(false)
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-white transition-all duration-200 ${
                    active 
                      ? 'bg-white/25 shadow-md backdrop-blur-sm' 
                      : 'hover:bg-white/15'
                  }`}
                >
                  <Icon size={18} className={`transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                  {active && (
                    <div className="w-1 h-5 bg-white rounded-full ml-auto"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer Section */}
          <div className="p-4 border-t border-white/20 mt-auto">
            <div className="flex items-center gap-3 mb-3 p-2.5 bg-white/15 rounded-xl">
              <div className="w-9 h-9 bg-white/25 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {userName ? userName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{userName || 'Admin'}</p>
                <p className="text-xs text-white/70 truncate">{userEmail}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 w-full text-white rounded-xl hover:bg-red-500/30 transition-all duration-200 text-sm"
            >
              <LogOut size={16} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay pour mobile seulement */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className={`transition-all duration-300 ${!isMobile ? 'lg:ml-72' : ''}`}>
        {/* Header - Titre à gauche sans icône */}
        <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Titre à GAUCHE - sans icône */}
            <div className="flex items-center">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                {getPageTitle()}
              </h1>
            </div>

            {/* Actions à DROITE */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 transition rounded-lg hover:bg-gray-100">
                <Bell size={18} />
                {notifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {/* Séparateur */}
              <div className="w-px h-6 bg-gray-200"></div>

              {/* Profile dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-all group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#79DBDC] to-[#5BBFC0] rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:scale-105 transition-transform">
                    {userName ? userName.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-800">
                      {userName || 'Administrateur'}
                    </p>
                    <p className="text-xs text-gray-500">{userEmail}</p>
                  </div>
                  <ChevronDown size={14} className={`hidden md:block text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-slideDown z-50">
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#FFFBF5] to-[#F5DEB3]">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#79DBDC] to-[#5BBFC0] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {userName ? userName.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">{userName || 'Administrateur'}</p>
                          <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                          <div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 bg-[#79DBDC]/20 rounded-full">
                            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-[#79DBDC] font-medium">Admin</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        to="/"
                        target="_blank"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                      >
                        <Home size={16} className="text-gray-400" />
                        <span>Voir le site</span>
                      </Link>
                      
                      <Link
                        to="/admin/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                      >
                        <Settings size={16} className="text-gray-400" />
                        <span>Paramètres</span>
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false)
                          handleLogout()
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 w-full text-red-600 hover:bg-red-50 transition-colors text-sm"
                      >
                        <LogOut size={16} />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  )
}