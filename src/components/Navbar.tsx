import { FileText, Phone, Mail, User, LogOut, Settings, UserCircle, X } from 'lucide-react';
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
    { href: "#sec-contact", label: "Contact" },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-[#1d5265]/95 backdrop-blur-xl shadow-lg' 
            : 'bg-[#1d5265]/90 backdrop-blur-md'
        } border-b border-[#D2B093]/15`}
        style={{ fontFamily: 'var(--font-roboto)' }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">

            {/* Logo - responsive */}
            <div
              className="flex items-center cursor-pointer group flex-shrink-0"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img
                src="/alliéjc-logo-3.png"
                alt="Allié JC"
                className="w-[100px] xs:w-[120px] sm:w-[140px] md:w-[170px] lg:w-[200px] xl:w-[220px] object-contain py-0.5 sm:py-1"
              />
            </div>

            {/* Navigation Desktop - MENUS REINTEGRES */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8 2xl:gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="group relative text-sm xl:text-base font-medium text-white hover:text-[#D2B093] transition-colors duration-200 whitespace-nowrap"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D2B093] transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            {/* Boutons Desktop */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              <a
                href="tel:0607979074"
                className="flex items-center gap-1.5 xl:gap-2 px-3 xl:px-4 py-1.5 xl:py-2 text-white hover:text-[#D2B093] transition-colors rounded-lg hover:bg-white/10"
              >
                <Phone size={15} className="flex-shrink-0" />
                <span className="text-xs xl:text-sm font-medium hidden 2xl:inline">06 07 97 90 74</span>
                <span className="text-xs xl:text-sm font-medium 2xl:hidden">Appeler</span>
              </a>

              <button
                onClick={onDevisClick}
                className="flex items-center gap-2 px-4 xl:px-6 py-2 xl:py-2.5 rounded-xl text-xs xl:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                style={{
                  backgroundColor: '#C4A882',
                  color: '#FFFFFF',
                }}
              >
                <FileText size={15} color="#FFFFFF" className="flex-shrink-0" />
                <span>Devis gratuit</span>
              </button>
            </div>

            {/* Boutons Tablette (md à lg) */}
            <div className="hidden md:flex lg:hidden items-center gap-2">
              <a
                href="tel:0607979074"
                className="p-2 text-white hover:text-[#D2B093] transition-colors rounded-lg hover:bg-white/10"
                aria-label="Appeler"
              >
                <Phone size={18} />
              </a>
              <button
                onClick={onDevisClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                style={{
                  backgroundColor: '#C4A882',
                  color: '#FFFFFF',
                }}
              >
                <FileText size={14} color="#FFFFFF" />
                <span>Devis</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors focus:outline-none flex-shrink-0"
                aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              >
                <div className="relative w-5 h-4">
                  <motion.span
                    animate={mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 top-0 w-5 h-0.5 bg-white rounded-full"
                  />
                  <motion.span
                    animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 top-2 w-5 h-0.5 bg-white rounded-full"
                  />
                  <motion.span
                    animate={mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 top-4 w-5 h-0.5 bg-white rounded-full"
                  />
                </div>
              </button>
            </div>

            {/* Boutons Mobile (sm) */}
            <div className="sm:hidden flex items-center gap-2">
              <button
                onClick={onDevisClick}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                style={{
                  backgroundColor: '#C4A882',
                  color: '#FFFFFF',
                }}
              >
                <FileText size={12} color="#FFFFFF" />
                <span>Devis</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative w-8 h-8 flex items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors focus:outline-none flex-shrink-0"
                aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              >
                <div className="relative w-4 h-3.5">
                  <motion.span
                    animate={mobileMenuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 top-0 w-4 h-0.5 bg-white rounded-full"
                  />
                  <motion.span
                    animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 top-1.5 w-4 h-0.5 bg-white rounded-full"
                  />
                  <motion.span
                    animate={mobileMenuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 top-3 w-4 h-0.5 bg-white rounded-full"
                  />
                </div>
              </button>
            </div>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Menu Mobile - Panneau latéral */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-50 overflow-y-auto"
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

            <div className="p-4 space-y-4">
              {/* Navigation links */}
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="flex items-center gap-3 py-3 px-4 text-base font-medium text-[#4A5B5E] hover:text-[#237395] hover:bg-[#237395]/5 rounded-xl transition-all duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="pt-4 space-y-4 border-t border-gray-100">
                {/* Téléphone et Email dans le menu mobile */}
                <div className="space-y-2">
                  <a
                    href="tel:0607979074"
                    className="flex items-center gap-3 py-3 px-4 text-[#4A5B5E] hover:text-[#237395] hover:bg-[#237395]/5 rounded-xl transition-colors"
                  >
                    <Phone size={18} className="text-[#237395] flex-shrink-0" />
                    <span className="font-medium text-sm">06 07 97 90 74</span>
                  </a>

                  <a
                    href="mailto:jeancharlesbiernat@yahoo.com"
                    className="flex items-center gap-3 py-3 px-4 text-[#4A5B5E] hover:text-[#237395] hover:bg-[#237395]/5 rounded-xl transition-colors"
                  >
                    <Mail size={18} className="text-[#237395] flex-shrink-0" />
                    <span className="text-sm break-all">jeancharlesbiernat@yahoo.com</span>
                  </a>
                </div>

                {/* Utilisateur mobile */}
                {user.isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#237395] to-[#1a5a78] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={handleProfile}
                      className="w-full flex items-center gap-3 py-3 px-4 text-[#4A5B5E] hover:text-[#237395] hover:bg-[#237395]/5 rounded-xl transition-colors"
                    >
                      <UserCircle size={18} className="text-[#237395] flex-shrink-0" />
                      <span className="font-medium">Mon profil</span>
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={handleDashboard}
                        className="w-full flex items-center gap-3 py-3 px-4 text-[#4A5B5E] hover:text-[#237395] hover:bg-[#237395]/5 rounded-xl transition-colors"
                      >
                        <Settings size={18} className="text-[#237395] flex-shrink-0" />
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
                    className="w-full flex items-center gap-3 py-3 px-4 text-[#4A5B5E] hover:text-[#237395] hover:bg-[#237395]/5 rounded-xl transition-colors"
                  >
                    <User size={18} className="text-[#237395] flex-shrink-0" />
                    <span className="font-medium">Se connecter</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onDevisClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300"
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
      <div className="h-14 sm:h-16 md:h-20"></div>
    </>
  );
}