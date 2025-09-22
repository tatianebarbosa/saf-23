import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Minimize2, X, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// Base de conhecimento das escolas
const knowledgeBase = {
  escolas: [
    { id: 10, nome: "Maple Bear Camaçari - Busca Vida I", cidade: "Camaçari", estado: "BA", codigo_voucher: "MBBA2026204", qtd_vouchers: 8, consultor_saf: "Tatiane Barbosa" },
    { id: 100, nome: "Maple Bear Paulínia - Morumbi I", cidade: "Paulínia", estado: "SP", codigo_voucher: "MBSP2026181", qtd_vouchers: 11, consultor_saf: "Tatiane Barbosa" },
    { id: 101, nome: "Maple Bear Piracicaba - Vila Rezende I e II", cidade: "Piracicaba", estado: "SP", codigo_voucher: "MBSP2026133", qtd_vouchers: 17, consultor_saf: "Tatiane Barbosa" },
    { id: 102, nome: "Maple Bear Praia Grande - Canto Do Forte I", cidade: "Praia Grande", estado: "SP", codigo_voucher: "MBSP2026199", qtd_vouchers: 9, consultor_saf: "Tatiane Barbosa" },
    { id: 793, nome: "Maple Bear Arcoverde", cidade: "Arcoverde", estado: "PE", telefone: "8198992050", email: "MAPLEBEAR.ARCOVERDE@GMAIL.COM", consultor_saf: "Tatiane Barbosa" },
    { id: 790, nome: "Maple Bear Pindamonhangaba", cidade: "Pindamonhangaba", estado: "SP", telefone: "1141233344", email: "LEGALIZACAO@SCLEMPRESARIAL.COM.BR", consultor_saf: "Tatiane Barbosa" },
    { id: 802, nome: "Maple Bear Balsas", cidade: "Balsas", estado: "MA", telefone: "9991560600", email: "AUGUSTOSCONTABILIDADE@GMAIL.COM", consultor_saf: "Tatiane Barbosa" },
    { id: 679, nome: "Maple Bear Paracatu - Centro I", cidade: "Paracatu", estado: "MG", telefone: "3897543390", email: "NP.CONTABIL@OUTLOOK.COM", consultor_saf: "Tatiane Barbosa" },
    { id: 742, nome: "Maple Bear Conselheiro Lafaiete - Areal I", cidade: "Conselheiro Lafaiete", estado: "MG", telefone: "3188661010", email: "WANDERSONCOOPVEST@YAHOO.COM.BR", consultor_saf: "Tatiane Barbosa" }
  ]
};

const FloatingAIChat = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Olá! Sou a Chinook IA, seu assistente inteligente. Posso ajudar com tickets, relatórios e dúvidas do SAF!',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Não mostrar o chat flutuante na tela de login
  if (location.pathname === "/" || location.pathname === "/login") {
    return null;
  }

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await processUserQuery(currentInput);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Erro ao processar mensagem:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const processUserQuery = async (input: string): Promise<string> => {
    // Simula delay de processamento
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const lowerInput = input.toLowerCase();
    
    // Busca por escola específica
    if (lowerInput.includes('escola') || lowerInput.includes('unidade') || lowerInput.includes('maple bear')) {
      const escola = knowledgeBase.escolas.find(e => 
        lowerInput.includes(e.nome.toLowerCase()) || 
        lowerInput.includes(e.cidade.toLowerCase()) ||
        lowerInput.includes(e.estado.toLowerCase())
      );
      
      if (escola) {
        let info = `📍 **${escola.nome}**\n\n`;
        info += `🏙️ **Localização:** ${escola.cidade}, ${escola.estado}\n`;
        if (escola.telefone) info += `📞 **Telefone:** ${escola.telefone}\n`;
        if (escola.email) info += `📧 **E-mail:** ${escola.email}\n`;
        if (escola.codigo_voucher) info += `🎫 **Código Voucher:** ${escola.codigo_voucher}\n`;
        if (escola.qtd_vouchers) info += `📊 **Quantidade de Vouchers:** ${escola.qtd_vouchers}\n`;
        info += `👤 **Consultor SAF:** ${escola.consultor_saf}`;
        return info;
      } else {
        return `Posso ajudar com informações sobre escolas! Temos dados de ${knowledgeBase.escolas.length} unidades no sistema. Você pode perguntar sobre uma escola específica mencionando o nome da cidade ou da unidade.`;
      }
    }
    
    // Busca por voucher
    if (lowerInput.includes('voucher') || lowerInput.includes('código')) {
      const codigoMatch = input.match(/[A-Z]{2,4}\d{7}/);
      if (codigoMatch) {
        const codigo = codigoMatch[0];
        const escola = knowledgeBase.escolas.find(e => e.codigo_voucher === codigo);
        if (escola) {
          return `🎫 **Voucher ${codigo}** encontrado!\n\n📍 **Escola:** ${escola.nome}\n🏙️ **Localização:** ${escola.cidade}, ${escola.estado}\n📊 **Quantidade:** ${escola.qtd_vouchers} vouchers\n👤 **Consultor SAF:** ${escola.consultor_saf}`;
        }
      }
      
      const totalVouchers = knowledgeBase.escolas.reduce((sum, escola) => sum + (escola.qtd_vouchers || 0), 0);
      return `🎫 **Informações sobre Vouchers:**\n\nTemos ${totalVouchers} vouchers distribuídos entre ${knowledgeBase.escolas.filter(e => e.qtd_vouchers).length} escolas. Para consultar um voucher específico, informe o código (ex: MBSP2026181).`;
    }
    
    // Busca por consultor
    if (lowerInput.includes('consultor') || lowerInput.includes('tatiane')) {
      const escolasTatiane = knowledgeBase.escolas.filter(e => e.consultor_saf.includes('Tatiane'));
      return `👤 **Consultor SAF: Tatiane Barbosa**\n\n📊 **Escolas atendidas:** ${escolasTatiane.length} unidades\n\nAlgumas das principais unidades:\n${escolasTatiane.slice(0, 3).map(e => `• ${e.nome} (${e.cidade}/${e.estado})`).join('\n')}`;
    }
    
    // Tickets
    if (lowerInput.includes('ticket') || lowerInput.includes('chamado')) {
      return `🎫 **Sistema de Tickets SAF**\n\nNo momento temos ${Math.floor(Math.random() * 15 + 5)} tickets pendentes. Os mais críticos são aqueles com mais de 15 dias.\n\n📋 **Posso ajudar com:**\n• Consultar status de tickets\n• Criar novos chamados\n• Priorizar atendimentos urgentes\n\nQual ticket específico você gostaria de consultar?`;
    }
    
    // Relatórios
    if (lowerInput.includes('relatório') || lowerInput.includes('dashboard') || lowerInput.includes('dados')) {
      return `📊 **Relatórios e Dashboards SAF**\n\n**Dados disponíveis:**\n• ${knowledgeBase.escolas.length} escolas cadastradas\n• ${knowledgeBase.escolas.reduce((sum, e) => sum + (e.qtd_vouchers || 0), 0)} vouchers ativos\n• Cobertura em ${new Set(knowledgeBase.escolas.map(e => e.estado)).size} estados\n\n**Posso gerar relatórios sobre:**\n• Performance por região\n• Status de vouchers\n• Contatos das unidades\n\nQue tipo de relatório você precisa?`;
    }
    
    // Resposta padrão
    return `Olá! Sou a **Chinook IA**, seu assistente inteligente do SAF. 🤖\n\n**Posso ajudar com:**\n\n🏫 **Informações de Escolas** - Endereços, contatos, consultores\n🎫 **Vouchers** - Códigos, quantidades, status\n📋 **Tickets** - Consultas e criação de chamados\n📊 **Relatórios** - Dados e métricas do sistema\n\n**Como posso ajudá-lo hoje?**\n\n*Exemplo: "Qual o endereço da escola de Camaçari?" ou "Quantos vouchers tem a escola MBSP2026181?"*`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
        >
          <img 
            src="/chinook.png"
            alt="Chinook IA"
            className="h-8 w-8 object-contain"
          />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-2xl transition-all duration-300 ${isMinimized ? 'h-14' : 'h-96'}`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-2">
            <img 
              src="/chinook.png"
              alt="Chinook IA"
              className="h-5 w-5 object-contain"
            />
            <CardTitle className="text-sm">Chinook IA – Assistente Inteligente SAF</CardTitle>
            <Badge variant="default" className="text-xs bg-primary">
              Ativo
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="flex flex-col h-80 p-4 pt-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua pergunta..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default FloatingAIChat;