import { motion } from "framer-motion";

const Target = () => {
  return (
    <section id="para-quem" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Image */}
          <div className="w-full lg:w-1/2 flex-shrink-0">
            <div className="relative rounded-2xl overflow-hidden shadow-card-custom max-w-md mx-auto lg:mx-0">
              <img
                src="https://static.wixstatic.com/media/bd849e_f1786b4734a1476599c8e37df83d6897~mv2.webp/v1/fill/w_398,h_390,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/jovens_porto_azulejos.webp"
                alt="Três jovens de diferentes etnias abraçados, sorrindo"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent"></div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 flex-shrink-0">
            <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
              A quem se destina?
            </h2>
            
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                A IIES Madrilusa tem como missão apoiar a integração de jovens imigrantes, 
                ajudando-os a desenvolver competências pessoais e sociais para que sejam 
                bem recebidos e reconhecidos pelas comunidades onde vivem.
              </p>
              
              <div className="bg-primary/10 rounded-lg p-6">
                <p className="text-secondary font-semibold text-lg">
                  A iniciativa é dirigida a <strong className="text-primary">jovens imigrantes 
                  com menos de 30 anos</strong>, em Portugal ou no estrangeiro, e pretende 
                  envolver cerca de <strong className="text-primary">2.400 participantes 
                  ao longo de três anos</strong>.
                </p>
              </div>

              <p>
                Além dos jovens imigrantes, o projecto envolve também <strong>empresas</strong> interessadas 
                em talentos qualificados, <strong>municípios</strong> que procuram revitalização territorial, 
                <strong>instituições académicas</strong> para parcerias formativas e <strong>famílias de acolhimento</strong> 
                que desejam apoiar a integração social.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Target;