import { FileText, Menu, X, Phone, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavbarProps {
  onDevisClick: () => void;
}

export default function Navbar({ onDevisClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "#sec-services", label: "Services" },
    { href: "#sec-gallery", label: "Galerie" },
    { href: "#sec-devis", label: "Tarifs" },
    { href: "#sec-contact", label: "FAQ" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#237395]`}
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
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg text-[#4A5B5E] hover:bg-beige/20 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-primary rounded-lg opacity-0 hover:opacity-10 transition-opacity"></div>
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