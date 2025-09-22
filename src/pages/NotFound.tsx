import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, RefreshCw } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [chinookImage, setChinookImage] = useState("/chinook.png");

  // Array de imagens do Chinook para variar
  const chinookImages = [
    "/chinook.png",
    "/Acenando.png", 
    "/TendoIdeia.png",
    "/d27976b5-58d9-4be0-8d47-22700dc69cb0.png"
  ];

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // Escolher uma imagem aleatória do Chinook
    const randomImage = chinookImages[Math.floor(Math.random() * chinookImages.length)];
    setChinookImage(randomImage);
  }, [location.pathname]);

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-pattern opacity-30" />
      
      <Card className="w-full max-w-2xl relative backdrop-blur-sm bg-white/95 border-red-200/50 shadow-2xl">
        <CardContent className="p-8 text-center space-y-6">
          {/* Logo MapleBear */}
          <div className="flex justify-center mb-6">
            <img 
              src="/logo-maplebear.png" 
              alt="Maple Bear Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>

          {/* Chinook com animação */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img 
                src={chinookImage}
                alt="Chinook - Mascote MapleBear" 
                className="w-32 h-32 object-contain animate-bounce"
              />
              {/* Efeito de brilho */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-full"></div>
            </div>
          </div>

          {/* Título do erro */}
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-red-600 mb-2">404</h1>
            <h2 className="text-2xl font-bold text-red-800">Oops! Página não encontrada</h2>
          </div>

          {/* Mensagem amigável */}
          <div className="space-y-3 text-gray-600">
            <p className="text-lg">
              O Chinook procurou por toda a escola, mas não conseguiu encontrar esta página!
            </p>
            <p className="text-sm">
              A página que você está procurando pode ter sido movida, removida ou não existe.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              <strong>URL tentada:</strong> <code className="bg-red-100 px-2 py-1 rounded">{location.pathname}</code>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button 
              onClick={handleGoHome}
              className="bg-red-600 hover:bg-red-700 text-white gap-2"
              size="lg"
            >
              <Home className="w-4 h-4" />
              Ir para o Dashboard
            </Button>
            
            <Button 
              onClick={handleGoBack}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 gap-2"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <Button 
              onClick={handleRefresh}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 gap-2"
              size="lg"
            >
              <RefreshCw className="w-4 h-4" />
              Recarregar
            </Button>
          </div>

          {/* Links úteis */}
          <div className="pt-6 border-t border-red-200">
            <p className="text-sm text-gray-500 mb-3">Páginas mais acessadas:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="text-red-600 hover:bg-red-50"
              >
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/dashboard/canva")}
                className="text-red-600 hover:bg-red-50"
              >
                Canva
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/dashboard/vouchers")}
                className="text-red-600 hover:bg-red-50"
              >
                Vouchers
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/tickets")}
                className="text-red-600 hover:bg-red-50"
              >
                Tickets
              </Button>
            </div>
          </div>

          {/* Mensagem do Chinook */}
          <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-lg p-4 border border-red-200">
            <p className="text-sm text-red-700 italic">
              💭 <strong>Chinook diz:</strong> "Não se preocupe! Vamos encontrar o que você está procurando. 
              Use os botões acima para navegar de volta ao portal SAF!"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;

