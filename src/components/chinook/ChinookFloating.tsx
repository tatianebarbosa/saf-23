import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, HelpCircle, Home, Users, FileText, Bot, Send, Sparkles, Brain } from "lucide-react";

const ChinookFloating = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");

  // Não mostrar o botão flutuante na tela de login
  if (location.pathname === "/" || location.pathname === "/login") {
    return null;
  }

  const tips = [
    {
      title: "Assistente IA Chinook",
      text: "Olá! Sou seu assistente inteligente. Posso ajudar com tickets, relatórios e dúvidas do SAF!",
      image: "/chinook.png"
    },
    {
      title: "Navegação Rápida",
      text: "Use os botões no topo para acessar rapidamente Canva, Vouchers e Tickets!",
      image: "/TendoIdeia.png"
    },
    {
      title: "Dashboard Principal",
      text: "No dashboard você encontra um resumo de todas as atividades importantes.",
      image: "/Escrevendo.png"
    },
    {
      title: "Segurança",
      text: "Seu login é protegido! Apenas emails corporativos têm acesso ao sistema.",
      image: "/chinook.png"
    }
  ];

  const quickActions = [
    { icon: Home, label: "Dashboard", action: () => window.location.href = "/dashboard" },
    { icon: Users, label: "Canva", action: () => window.location.href = "/dashboard/canva-licenses" },
    { icon: FileText, label: "Tickets", action: () => window.location.href = "/tickets" }
  ];

  const aiQuestions = [
    "Como abrir um ticket?",
    "Status das escolas",
    "Relatórios SAF",
    "Ajuda com Canva"
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // Simulate AI response
    alert(`Chinook IA: Entendi sua pergunta "${message}". Em breve terei uma resposta inteligente para você!`);
    setMessage("");
  };

  return (
    <>
      {/* Botão flutuante */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl animate-pulse"
          size="lg"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative">
              <Bot className="w-6 h-6 text-white" />
              <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1" />
            </div>
          )}
        </Button>
      </div>

      {/* Painel de ajuda */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <Card className="w-80 bg-white border-blue-200 shadow-2xl">
            <CardContent className="p-4">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <img 
                    src="/chinook.png"
                    alt="Chinook IA"
                    className="w-12 h-12 object-contain rounded-full border-2 border-blue-200"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-blue-800 flex items-center gap-1">
                    Chinook IA
                    <Brain className="w-4 h-4 text-purple-500" />
                  </h3>
                  <p className="text-xs text-gray-600">Assistente Inteligente SAF</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChat(!showChat)}
                  className="ml-auto"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>

              {showChat ? (
                /* Chat Interface */
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
                    <p className="text-sm text-blue-800 mb-2">
                      💡 Pergunte-me qualquer coisa sobre o SAF!
                    </p>
                    <div className="grid grid-cols-2 gap-1 mb-3">
                      {aiQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setMessage(question)}
                          className="text-xs h-8 border-blue-200 hover:bg-blue-50"
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Digite sua pergunta..."
                        className="text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button
                        onClick={handleSendMessage}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Tips Interface */
                <>
                  {/* Dica atual */}
                  <div className="mb-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <img 
                          src={tips[currentTip].image}
                          alt="Chinook"
                          className="w-8 h-8 object-contain flex-shrink-0 mt-1"
                        />
                        <div>
                          <h4 className="font-medium text-blue-800 text-sm mb-1 flex items-center gap-1">
                            {tips[currentTip].title}
                            {currentTip === 0 && <Sparkles className="w-3 h-3 text-purple-500" />}
                          </h4>
                          <p className="text-xs text-blue-700">
                            {tips[currentTip].text}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Navegação das dicas */}
                    <div className="flex gap-1 justify-center">
                      {tips.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentTip(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentTip ? 'bg-blue-500' : 'bg-blue-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Ações rápidas */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" />
                      Ações Rápidas
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={action.action}
                          className="flex flex-col items-center gap-1 h-auto p-2 text-xs border-blue-200 hover:bg-blue-50"
                        >
                          <action.icon className="w-3 h-3" />
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Mensagem motivacional */}
              <div className="mt-4 p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded text-center">
                <p className="text-xs text-blue-700 italic flex items-center justify-center gap-1">
                  <Brain className="w-3 h-3" />
                  "Inteligência artificial a seu serviço! 🤖"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChinookFloating;

