import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { AuthModal } from "@/modules/auth/components/AuthModal";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { getUserPhotoUrl } from "@/lib/userPhotoUtils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Sobre", href: "#sobre" },
    { label: "Para quem", href: "#para-quem" },
    { label: "FAQ", href: "#faq" },
    { label: "Contactos", href: "#contactos" },
  ];

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // ✨ NOVO: Scroll para seção de registration cards
  const handleInscrevaSeClick = () => {
    const registrationSection = document.getElementById('registration-cards');
    if (registrationSection) {
      registrationSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // ✅ Mantido para Login (ainda usa modal)
  const openLoginModal = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/app/dashboard');
    setDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const handleEditProfileClick = () => {
    navigate('/app/profile');
    setDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setIsMenuOpen(false);
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.querySelector('.institutional-user-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-card-custom">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Official */}
          <div className="flex items-center">
            <img
              src="/logo_madrilusa/logo madrilusa.png"
              alt="Madrilusa"
              className="h-10 w-auto cursor-pointer"
              onClick={() => handleNavClick("#home")}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-foreground hover:text-primary transition-colors duration-300 relative group font-medium"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="institutional-user-dropdown relative">
                <div 
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <img
                    className="rounded-full"
                    src={getUserPhotoUrl(user)}
                    alt={user?.nomeCompleto || 'User'}
                    style={{ 
                      width: '40px', 
                      height: '40px',
                      border: user?.foto ? '2px solid #F5A623' : '2px solid #e3ebf0',
                      objectFit: 'cover'
                    }}
                  />
                  <span className="font-medium text-foreground">
                    {user?.nomeCompleto || 'Utilizador'}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={handleProfileClick}
                    >
                      <i className="material-icons mr-2" style={{ fontSize: '20px' }}>dashboard</i>
                      Minha Plataforma
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={handleEditProfileClick}
                    >
                      <i className="material-icons mr-2" style={{ fontSize: '20px' }}>edit</i>
                      Editar Perfil
                    </button>
                    <hr className="my-1" />
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      onClick={handleLogout}
                    >
                      <i className="material-icons text-red-600 mr-2" style={{ fontSize: '20px' }}>exit_to_app</i>
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button 
                  variant="rectangular" 
                  size="rectangular"
                  onClick={handleInscrevaSeClick} 
                  className="bg-primary text-primary-foreground hover:bg-primary-glow"
                >
                  Inscreva-se
                </Button>
                <Button 
                  variant="secondary" 
                  size="rectangular"
                  onClick={openLoginModal}
                  data-login-button
                >
                  Login
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="text-foreground hover:text-primary transition-colors duration-300 py-2 text-left"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 px-2 py-2">
                      <img
                        className="rounded-full"
                        src={getUserPhotoUrl(user)}
                        alt={user?.nomeCompleto || 'User'}
                        style={{ 
                          width: '32px', 
                          height: '32px',
                          border: user?.foto ? '2px solid #F5A623' : '2px solid #e3ebf0',
                          objectFit: 'cover'
                        }}
                      />
                      <span className="font-medium text-foreground">
                        {user?.nomeCompleto || 'Utilizador'}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="rectangular" 
                      className="w-full"
                      onClick={handleProfileClick}
                    >
                      Minha Plataforma
                    </Button>
                    <Button 
                      variant="outline" 
                      size="rectangular" 
                      className="w-full"
                      onClick={handleEditProfileClick}
                    >
                      Editar Perfil
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="rectangular" 
                      className="w-full"
                      onClick={handleLogout}
                    >
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="rectangular" 
                      size="rectangular" 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary-glow"
                      onClick={handleInscrevaSeClick}
                    >
                      Inscreva-se
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="rectangular" 
                      className="w-full"
                      onClick={openLoginModal}
                      data-login-button
                    >
                      Login
                    </Button>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
      
      {/* Auth Modal - Apenas para Login agora */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </header>
  );
};

export default Header;