import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Sobre", href: "#sobre" },
    { label: "Objetivos", href: "#objetivos" },
    { label: "Atividades", href: "#atividades" },
    { label: "Para quem", href: "#para-quem" },
    { label: "FAQ", href: "#faq" },
    { label: "Contactos", href: "#contactos" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-card-custom">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Official */}
          <div className="flex items-center space-x-3">
            <img
              src="/logo_madrilusa/logo madrilusa.png"
              alt="Madrilusa"
              className="h-10 w-auto"
            />
            <div className="flex flex-col">
              <span className="text-xs text-secondary font-medium">
                Inclusão com identidade
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="rectangular" size="rectangular">
              Inscreva-se
            </Button>
            <Button variant="secondary" size="rectangular">
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
                <a
                  key={item.label}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="rectangular" size="rectangular" className="w-full">
                  Inscreva-se
                </Button>
                <Button variant="secondary" size="rectangular" className="w-full">
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