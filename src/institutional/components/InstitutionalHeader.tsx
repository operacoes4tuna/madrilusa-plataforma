import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { AuthModal } from "@/modules/auth/components/AuthModal";
import { useAuth } from "@/modules/auth/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const { user, isAuthenticated, logout } = useAuth();

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

  const openAuthModal = (mode: 'register' | 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

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
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Olá, <span className="font-medium text-foreground">{user?.nomeCompleto}</span>
                </span>
                <Button 
                  variant="secondary" 
                  size="rectangular"
                  onClick={logout}
                >
                  Sair
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="rectangular" 
                  size="rectangular"
                  onClick={() => openAuthModal('register')}
                  className="bg-primary text-primary-foreground hover:bg-primary-glow"
                >
                  Inscreva-se
                </Button>
                <Button 
                  variant="secondary" 
                  size="rectangular"
                  onClick={() => openAuthModal('login')}
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
                    <p className="text-sm text-muted-foreground px-2">
                      Olá, <span className="font-medium text-foreground">{user?.nomeCompleto}</span>
                    </p>
                    <Button 
                      variant="secondary" 
                      size="rectangular" 
                      className="w-full"
                      onClick={logout}
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
                      onClick={() => openAuthModal('register')}
                    >
                      Inscreva-se
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="rectangular" 
                      className="w-full"
                      onClick={() => openAuthModal('login')}
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
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </header>
  );
};

export default Header;