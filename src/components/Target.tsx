import { motion } from "framer-motion";

const Target = () => {
  return (
    <section id="para-quem" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 flex-shrink-0"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-card-custom max-w-md mx-auto lg:mx-0">
              <img
                src="https://static.wixstatic.com/media/bd849e_f1786b4734a1476599c8e37df83d6897~mv2.webp/v1/fill/w_398,h_390,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/jovens_porto_azulejos.webp"
                alt="Jovens no Porto com azulejos"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent"></div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 flex-shrink-0"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
              A quem se destina?
            </h2>
            
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                A IIES Madrilusa tem como missão promover a integração de jovens imigrantes 
                através do desenvolvimento das suas competências socioemocionais e sociocognitivas, 
                de forma a que possam ser acolhidos e valorizados pelas comunidades onde se inserem.
              </p>
              
              <p>
                O público-alvo da iniciativa são <strong className="text-primary">jovens imigrantes 
                com menos de 30 anos</strong>, residentes em qualquer território nacional ou internacional.
              </p>
              
              <p>
                O projeto propõe-se a alcançar cerca de <strong className="text-primary">2.400 jovens 
                ao longo de 36 meses</strong>.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Target;