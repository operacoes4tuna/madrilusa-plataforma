import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <Button 
              variant="rectangular" 
              size="rectangular"
              onClick={() => handleNavClick("#registrar")}
              className="bg-primary text-primary-foreground hover:bg-primary-glow"
            >
              Inscreva-se
            </Button>
            <Button 
              variant="secondary" 
              size="rectangular"
              onClick={() => window.location.href = 'mailto:madrilusa@adritem.pt?subject=Informações%20Login'}
            >
              Login
            </Button>
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
                <Button 
                  variant="rectangular" 
                  size="rectangular" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary-glow"
                  onClick={() => handleNavClick("#registrar")}
                >
                  Inscreva-se
                </Button>
                <Button 
                  variant="secondary" 
                  size="rectangular" 
                  className="w-full"
                  onClick={() => window.location.href = 'mailto:madrilusa@adritem.pt?subject=Informações%20Login'}
                >
                  Login
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;