import { FileText, Menu, X, Phone, Mail, User, LogOut, Settings, UserCircle, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    navigate('/'); // Redirection vers la page d'accueil
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
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img
                src="/alliéjc-logo-3.png"
                alt="Allié JC"
                className="h-full md:h-12 w-[150px] object-cover"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a 
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="group relative text-xl font-black text-white hover:text-lagon transition-colors duration-200"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <a 
                href="tel:0607979074"
                className="flex items-center gap-2 px-3 py-2 text-white hover:text-lagon transition-colors rounded-lg hover:bg-lagon/10"
              >
                <Phone size={16} />
                <span className="text-sm font-medium">06 07 97 90 74</span>
              </a>

              {/* Boutons utilisateur / admin */}
              <div className="relative user-menu-container">
                {user.isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 text-white hover:text-lagon transition-colors rounded-lg hover:bg-lagon/10"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lagon to-[#5BBFC0] flex items-center justify-center text-white text-sm font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </button>

                    {/* Menu utilisateur déroulant */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          {user.role === 'admin' && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-[#237395]/10 text-[#237395] text-xs font-medium">
                              <Shield size={10} />
                              Administrateur
                            </span>
                          )}
                        </div>
                        
                        <div className="py-1">
                          <button
                            onClick={handleProfile}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <UserCircle size={16} className="text-lagon" />
                            Mon profil
                          </button>
                          
                          {user.role === 'admin' && (
                            <button
                              onClick={handleDashboard}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Settings size={16} className="text-lagon" />
                              Administration
                            </button>
                          )}
                          
                          <hr className="my-1 border-gray-100" />
                          
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={16} />
                            Se déconnecter
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="flex items-center gap-2 px-4 py-2 text-white hover:text-lagon transition-colors rounded-lg hover:bg-lagon/10 border border-white/20"
                  >
                    <User size={16} />
                    <span className="text-sm font-medium">Connexion</span>
                  </button>
                )}
              </div>

              <button
                onClick={onDevisClick}
                className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-glow transition-all duration-300"
              >
                <FileText size={16} />
                Devis gratuit
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg text-white hover:bg-beige/20 transition-colors"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed top-16 left-0 right-0 bg-white shadow-hard border-t border-beige/20 transition-all duration-300 ease-in-out z-40 max-h-[calc(100vh-4rem)] overflow-y-auto ${
            mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
          }`}
        >
          <div className="px-5 py-6 space-y-4">
            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="block py-3 text-base font-medium text-[#4A5B5E] hover:text-lagon hover:bg-lagon/5 rounded-lg px-3 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-4 space-y-4 border-t border-beige/20">
              {/* Utilisateur mobile */}
              {user.isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lagon to-[#5BBFC0] flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleProfile}
                    className="w-full flex items-center gap-3 py-3 text-[#4A5B5E] hover:text-lagon hover:bg-lagon/5 rounded-lg px-3 transition-colors"
                  >
                    <UserCircle size={18} className="text-lagon" />
                    <span className="font-medium">Mon profil</span>
                  </button>
                  
                  {user.role === 'admin' && (
                    <button
                      onClick={handleDashboard}
                      className="w-full flex items-center gap-3 py-3 text-[#4A5B5E] hover:text-lagon hover:bg-lagon/5 rounded-lg px-3 transition-colors"
                    >
                      <Settings size={18} className="text-lagon" />
                      <span className="font-medium">Administration</span>
                    </button>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 py-3 text-red-600 hover:bg-red-50 rounded-lg px-3 transition-colors"
                  >
                    <LogOut size={18} />
                    <span className="font-medium">Se déconnecter</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 py-3 text-[#4A5B5E] hover:text-lagon hover:bg-lagon/5 rounded-lg px-3 transition-colors"
                >
                  <User size={18} className="text-lagon" />
                  <span className="font-medium">Se connecter</span>
                </button>
              )}

              <a 
                href="tel:0607979074"
                className="flex items-center gap-3 py-3 text-[#4A5B5E] hover:text-lagon hover:bg-lagon/5 rounded-lg px-3 transition-colors"
              >
                <Phone size={18} className="text-lagon" />
                <span className="font-medium">06 07 97 90 74</span>
              </a>
              
              <a 
                href="mailto:jeancharlesbiernat@yahoo.com"
                className="flex items-center gap-3 py-3 text-[#4A5B5E] hover:text-lagon hover:bg-lagon/5 rounded-lg px-3 transition-colors"
              >
                <Mail size={18} className="text-lagon" />
                <span className="text-sm break-all">jeancharlesbiernat@yahoo.com</span>
              </a>

              <button
                onClick={() => {
                  onDevisClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full btn-primary flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold mt-6 shadow-md hover:shadow-glow transition-all duration-300"
              >
                <FileText size={16} />
                Demander un devis gratuit
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer pour la navbar fixe */}
      <div className="h-16 md:h-20"></div>
    </>
  );
} 