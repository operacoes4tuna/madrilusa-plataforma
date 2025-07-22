import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Sou o assistente virtual do Madrilusa. Como posso ajudá-lo hoje? Posso responder a perguntas sobre o projeto, como participar, objetivos e atividades.",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Contexto base sobre o site Madrilusa
  const madrilusaContext = `
  O Madrilusa é um projeto de Inovação e Empreendedorismo Social (IIES) promovido pela ADRITEM, em parceria com a Federação Minha Terra, CoraNE e ADRACES.

  OBJETIVOS:
  - Promover a integração social de jovens imigrantes
  - Valorizar competências e talentos dos jovens
  - Combater a exclusão social
  - Criar redes de apoio para acolhimento

  PÚBLICO-ALVO:
  - Jovens imigrantes com menos de 30 anos
  - Meta: alcançar 2.400 jovens em 36 meses
  - Famílias de acolhimento
  - Empresas
  - Municípios
  - Instituições académicas

  ATIVIDADES:
  - Desenvolvimento de competências para o mercado de trabalho (Programa +Futuro)
  - Criação da Luso Academia
  - Rede de Apoio ao Acolhimento e Integração
  - Estágios de verão e trabalhos temporários
  - Campanhas de sensibilização

  CONTACTO:
  - Email: madrilusa@adritem.pt
  - Projeto focado em territórios rurais de Portugal
  - Participação gratuita
  `;

  const getBotResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Respostas pré-definidas baseadas no contexto do site
    if (lowerMessage.includes("objetivo") || lowerMessage.includes("meta")) {
      return "Os principais objetivos do Madrilusa são: promover a integração social de jovens imigrantes, valorizar suas competências, combater a exclusão social e criar redes de apoio. Queremos alcançar 2.400 jovens em 36 meses.";
    }
    
    if (lowerMessage.includes("participar") || lowerMessage.includes("registro") || lowerMessage.includes("inscrever")) {
      return "Para participar do Madrilusa, pode registar-se através dos formulários na nossa página. Temos categorias para jovens imigrantes, empresas, municípios, academia e famílias de acolhimento. A participação é totalmente gratuita!";
    }
    
    if (lowerMessage.includes("atividade") || lowerMessage.includes("programa")) {
      return "As atividades incluem: desenvolvimento de competências para o mercado de trabalho (Programa +Futuro), criação da Luso Academia, rede de apoio ao acolhimento, estágios de verão e campanhas de sensibilização.";
    }
    
    if (lowerMessage.includes("idade") || lowerMessage.includes("jovem")) {
      return "O projeto destina-se principalmente a jovens imigrantes com menos de 30 anos, residentes em qualquer território nacional ou internacional.";
    }
    
    if (lowerMessage.includes("contacto") || lowerMessage.includes("email")) {
      return "Pode contactar-nos através do email madrilusa@adritem.pt. Estamos sempre disponíveis para esclarecer dúvidas sobre o projeto!";
    }
    
    if (lowerMessage.includes("custo") || lowerMessage.includes("preço") || lowerMessage.includes("pagar")) {
      return "A participação no projeto Madrilusa é completamente gratuita. É uma iniciativa de inovação social financiada pelas entidades promotoras.";
    }
    
    if (lowerMessage.includes("onde") || lowerMessage.includes("local") || lowerMessage.includes("região")) {
      return "O projeto atua especialmente em territórios rurais de Portugal, promovendo a fixação de jovens imigrantes nessas regiões como estratégia de revitalização territorial.";
    }
    
    if (lowerMessage.includes("parceiro") || lowerMessage.includes("entidade")) {
      return "O Madrilusa é promovido pela ADRITEM em parceria com a Federação Minha Terra, CoraNE e ADRACES.";
    }
    
    if (lowerMessage.includes("duração") || lowerMessage.includes("tempo")) {
      return "O projeto tem duração de 36 meses e propõe-se a alcançar cerca de 2.400 jovens ao longo deste período.";
    }

    // Para perguntas que não estão no contexto do site
    return "Desculpe, só posso responder a perguntas relacionadas com o projeto Madrilusa. Pode perguntar sobre objetivos, como participar, atividades, contactos ou qualquer informação presente no nosso site. Como posso ajudá-lo?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simular delay de resposta
    setTimeout(async () => {
      const botResponse = await getBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Botão flutuante */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full shadow-glow bg-primary hover:bg-primary-glow transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.3 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-80 h-96 md:w-96 md:h-[500px]"
          >
            <Card className="h-full shadow-elegant border-2 border-primary/20">
              <CardHeader className="bg-gradient-primary text-primary-foreground p-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <CardTitle className="text-lg">Assistente Madrilusa</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0 h-full flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.isBot
                              ? "bg-muted text-muted-foreground"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {message.isBot && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                            <p className="text-sm leading-relaxed">{message.text}</p>
                            {!message.isBot && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-muted text-muted-foreground p-3 rounded-lg max-w-[80%]">
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4" />
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Digite sua pergunta..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      size="icon"
                      variant="rectangular"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;