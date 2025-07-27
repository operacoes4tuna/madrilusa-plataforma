import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import OpenAI from "openai";

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

  // Inicializar OpenAI
  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true
  });

  // Contexto completo sobre o site Madrilusa
  const madrilusaContext = `
  SOBRE O PROJETO MADRILUSA:
  O Madrilusa é um projeto de Inovação e Empreendedorismo Social (IIES) promovido pela ADRITEM, em parceria com a Federação Minha Terra, CoraNE e ADRACES.

  OBJETIVOS PRINCIPAIS:
  - Promover a integração social de jovens imigrantes
  - Valorizar competências e talentos dos jovens
  - Combater a exclusão social
  - Criar redes de apoio para acolhimento
  - Revitalização territorial através da fixação de jovens em territórios rurais

  PÚBLICO-ALVO:
  - Jovens imigrantes com menos de 30 anos residentes em qualquer território nacional ou internacional
  - Meta: alcançar 2.400 jovens em 36 meses
  - Famílias de acolhimento interessadas em apoiar jovens imigrantes
  - Empresas que querem contratar jovens talentos
  - Municípios interessados em revitalização territorial
  - Instituições académicas para parcerias educacionais

  ATIVIDADES E PROGRAMAS:
  1. Desenvolvimento de competências para o mercado de trabalho (Programa +Futuro)
  2. Criação da Luso Academia para educação e capacitação
  3. Rede de Apoio ao Acolhimento e Integração
  4. Estágios de verão e trabalhos temporários
  5. Campanhas de sensibilização sobre imigração
  6. Formação em competências digitais e profissionais
  7. Apoio psicológico e social
  8. Networking entre jovens, empresas e instituições

  COMO PARTICIPAR:
  Existem 5 categorias de registro disponíveis:
  1. IMIGRANTE: Para jovens imigrantes interessados no programa
  2. EMPRESA: Para empresas que querem contratar ou oferecer estágios
  3. MUNICÍPIO: Para câmaras municipais interessadas em parcerias
  4. ACADEMIA: Para instituições educacionais
  5. FAMÍLIA: Para famílias interessadas em acolhimento

  BENEFÍCIOS:
  - Participação completamente gratuita
  - Acesso a formação profissional
  - Oportunidades de emprego e estágio
  - Rede de contactos profissionais
  - Apoio na integração social
  - Desenvolvimento pessoal e profissional

  CONTACTO E INFORMAÇÕES:
  - Email: madrilusa@adritem.pt
  - Projeto focado especialmente em territórios rurais de Portugal
  - Duração: 36 meses
  - Financiamento: Iniciativa de inovação social das entidades promotoras

  PERGUNTAS FREQUENTES:
  - O projeto é gratuito? Sim, totalmente gratuito
  - Posso participar se não for português? Sim, é direcionado para imigrantes
  - Há limite de idade? Sim, até 30 anos para jovens imigrantes
  - Onde posso participar? Em todo território português, foco em áreas rurais
  - Como me registro? Através dos formulários no site para cada categoria
  `;

  const systemPrompt = `
  És o assistente virtual oficial do projeto Madrilusa, um chatbot inteligente e prestativo. 
  
  INSTRUÇÕES IMPORTANTES:
  1. Responde APENAS sobre o projeto Madrilusa usando as informações fornecidas no contexto
  2. Se a pergunta não for sobre o Madrilusa, responde educadamente que só podes ajudar com informações sobre o projeto
  3. Sê conversacional, amigável e usa linguagem natural em português
  4. Fornece respostas detalhadas e úteis baseadas no contexto
  5. Incentiva a participação no projeto quando apropriado
  6. Se não souberes algo específico, direciona para o email de contacto

  CONTEXTO DO PROJETO:
  ${madrilusaContext}
  `;

  const getBotResponse = async (userMessage: string): Promise<string> => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-2025-04-14",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      return response || "Desculpe, não consegui processar sua pergunta. Pode tentar novamente?";
    } catch (error) {
      console.error("Erro ao conectar com OpenAI:", error);
      return "Desculpe, estou com dificuldades técnicas no momento. Pode contactar-nos diretamente através do email madrilusa@adritem.pt.";
    }
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
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full shadow-glow bg-primary hover:bg-primary-glow transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-96 md:w-96 md:h-[500px] opacity-100 transform-none">
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
                    <div
                      key={message.id}
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
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
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
                    </div>
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
        </div>
      )}
    </>
  );
};

export default Chatbot;