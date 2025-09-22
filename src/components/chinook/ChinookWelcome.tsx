import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, MessageCircle } from "lucide-react";

interface ChinookWelcomeProps {
  onClose?: () => void;
}

const ChinookWelcome = ({ onClose }: ChinookWelcomeProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    {
      text: "Olá! Eu sou o Chinook, mascote da Maple Bear! 🐻",
      image: "/Acenando.png"
    },
    {
      text: "Bem-vindo ao Portal SAF! Estou aqui para ajudar você! 📚",
      image: "/TendoIdeia.png"
    },
    {
      text: "Se precisar de ajuda, é só me chamar! 🎓",
      image: "/chinook.png"
    }
  ];

  useEffect(() => {
    // Mostrar o Chinook após 2 segundos
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible && currentMessage < messages.length - 1) {
      const timer = setTimeout(() => {
        setCurrentMessage(prev => prev + 1);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, currentMessage, messages.length]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-500">
      <Card className="w-80 bg-white border-red-200 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Imagem do Chinook */}
            <div className="flex-shrink-0">
              <img 
                src={messages[currentMessage].image}
                alt="Chinook"
                className="w-16 h-16 object-contain animate-bounce"
              />
            </div>
            
            {/* Mensagem */}
            <div className="flex-1">
              <div className="bg-red-50 rounded-lg p-3 relative">
                {/* Balão de fala */}
                <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-red-50 border-b-8 border-b-transparent"></div>
                
                <p className="text-sm text-red-800 font-medium">
                  {messages[currentMessage].text}
                </p>
              </div>
              
              {/* Indicadores de mensagem */}
              <div className="flex gap-1 mt-2 justify-center">
                {messages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentMessage ? 'bg-red-500' : 'bg-red-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Botão fechar */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Botões de ação */}
          {currentMessage === messages.length - 1 && (
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-1"
                onClick={handleClose}
              >
                <MessageCircle className="w-3 h-3" />
                Entendi!
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChinookWelcome;

