import { FileText, Menu, X, Phone, Mail, User, LogOut, Settings, UserCircle, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onDevisClick: () => void;
}

// Simuler un état d'authentification
const useAuth = () => {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin' | null;
    isAuthenticated: boolean;
  }>({
    id: '',
    name: '',
    email: '',
    role: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          ...parsed,
          isAuthenticated: true,
        });
      } catch (e) {
        console.error('Erreur de parsing user', e);
      }
    }
  }, []);

  const login = (userData: { id: string; name: string; email: string; role: 'user' | 'admin' }) => {
    const newUser = { ...userData, isAuthenticated: true };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser({
      id: '',
      name: '',
      email: '',
      role: null,
      isAuthenticated: false,
    });
  };

  return { user, login, logout };
};

export default function Navbar({ onDevisClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Bloquer le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "#sec-services", label: "Services" },
    { href: "#sec-gallery", label: "Galerie" },
    { href: "#sec-devis", label: "Tarifs" },
    { href: "#sec-contact", label: "Nos contacts" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const handleProfile = () => {
    setUserMenuOpen(false);
    navigate('/profile');
  };

  const handleDashboard = () => {
    setUserMenuOpen(false);
    navigate('/dashboard');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#1d5265]/95 backdrop-blur-xl border-b border-[#D2B093]/15 shadow-glow`}
        style={{ fontFamily: 'var(--font-roboto)' }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20 px-4 sm:px-6 lg:px-8">

            {/* Logo - responsive */}
            <div
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group flex-shrink-0"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img
                src="/alliéjc-logo-3.png"
                alt="Allié JC"
                className="w-[140px] sm:w-[180px] md:w-[200px] lg:w-[240px] object-contain"
              />
            </div>

            {/* Desktop Navigation - Taille intermédiaire corrigée */}
            <div className="hidden md:flex items-center gap-5 lg:gap-7 xl:gap-9">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="group relative text-[15px] lg:text-base font-medium text-white hover:text-lagon transition-colors duration-200 whitespace-nowrap"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            {/* Desktop Buttons - Taille intermédiaire corrigée */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              <a
                href="tel:0607979074"
                className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-1.5 lg:py-2 text-white hover:text-lagon transition-colors rounded-lg hover:bg-lagon/10"
              >
                <Phone size={15} className="flex-shrink-0" />
                <span className="text-[13px] lg:text-sm font-medium hidden xl:inline">06 07 97 90 74</span>
                <span className="text-[13px] lg:text-sm font-medium xl:hidden">Appeler</span>
              </a>

              <button
                onClick={onDevisClick}
                className="flex items-center gap-1.5 lg:gap-2 px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl text-[14px] lg:text-[15px] font-semibold shadow-md hover:shadow-glow transition-all duration-300 whitespace-nowrap"
                style={{
                  backgroundColor: '#C4A882',
                  color: '#FFFFFF',
                }}
              >
                <FileText size={16} color="#FFFFFF" className="flex-shrink-0" />
                <span className="hidden sm:inline">Devis gratuit</span>
                <span className="sm:hidden">Devis</span>
              </button>
            </div>

            {/* Menu Burger - Mobile - FIXE et RESPONSIVE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors focus:outline-none flex-shrink-0 ml-2"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <div className="relative w-6 h-5">
                <motion.span
                  animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 top-0 w-6 h-0.5 bg-white rounded-full"
                />
                <motion.span
                  animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 top-2 w-6 h-0.5 bg-white rounded-full"
                />
                <motion.span
                  animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 top-4 w-6 h-0.5 bg-white rounded-full"
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay pour le menu mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Menu Mobile - Panneau latéral - FIXE et RESPONSIVE */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
          >
            {/* En-tête du menu mobile */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <img
                  src="/alliéjc-logo-3.png"
                  alt="Allié JC"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Fermer le menu"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
              {/* Navigation links */}
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="flex items-center gap-3 py-3 px-4 text-base font-medium text-[#4A5B5E] hover:text-lagon hover:bg-lagon/5 rounded-xl transition-all duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="pt-4 space-y-4 border-t border-gray-100">
                {/* Utilisateur mobile */}
                {user.isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lagon to-[#237395] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={handleProfile}
                      className="w-full flex items-center gap-3 py-3 px-4 text-[#4A5B5E] hover:text-lagon hover:bg-lagon/5 rounded-xl transition-colors"
                    >
                      <UserCircle size={18} className="text-lagon flex-shrink-0" />
                      <span className="font-medium">Mon profil</span>
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={handleDashboard}
                        className="w-full flex items-center gap-3 py-3 px-4 text-[#4A5B5E] hover:text-lagon hover:bg-lagon/5 rounded-xl transition-colors"
                      >
                        <Settings size={18} className="text-lagon flex-shrink-0" />
                        <span className="font-medium">Administration</span>
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 py-3 px-4 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut size={18} className="flex-shrink-0" />
                      <span className="font-medium">Se déconnecter</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      handleLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 py-3 px-4 text-[#4A5B5E] hover:text-lagon hover:bg-lagon/5 rounded-xl transition-colors"
                  >
                    <User size={18} className="text-lagon flex-shrink-0" />
                    <span className="font-medium">Se connecter</span>
                  </button>
                )}

                <div className="space-y-2 pt-2">
                  <a
                    href="tel:0607979074"
                    className="flex items-center gap-3 py-3 px-4 text-[#4A5B5E] hover:text-lagon hover:bg-lagon/5 rounded-xl transition-colors"
                  >
                    <Phone size={18} className="text-lagon flex-shrink-0" />
                    <span className="font-medium text-sm">06 07 97 90 74</span>
                  </a>

                  <a
                    href="mailto:jeancharlesbiernat@yahoo.com"
                    className="flex items-center gap-3 py-3 px-4 text-[#4A5B5E] hover:text-lagon hover:bg-lagon/5 rounded-xl transition-colors"
                  >
                    <Mail size={18} className="text-lagon flex-shrink-0" />
                    <span className="text-sm break-all">jeancharlesbiernat@yahoo.com</span>
                  </a>
                </div>

                <button
                  onClick={() => {
                    onDevisClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl text-sm font-semibold mt-4 shadow-md hover:shadow-glow transition-all duration-300"
                  style={{
                    backgroundColor: '#C4A882',
                    color: '#FFFFFF',
                  }}
                >
                  <FileText size={16} color="#FFFFFF" className="flex-shrink-0" />
                  Demander un devis gratuit
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer pour la navbar fixe */}
      <div className="h-16 md:h-20"></div>
    </>
  );
}
