import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-hero"></div>
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Inovação e empreendedorismo social para{" "}
              <span className="text-primary-glow">jovens imigrantes</span>
            </h1>
            
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Jovens imigrantes em início de vida, famílias com espaço no coração 
              e empresas que abrem portas
            </p>
            
            <Button 
              variant="hero" 
              size="xl"
              className="font-semibold"
              onClick={() => document.getElementById('registrar')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Juntem-se a nós
            </Button>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-glow">
              <img
                src={heroImage}
                alt="Grupo de jovens diversos sorrindo"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;