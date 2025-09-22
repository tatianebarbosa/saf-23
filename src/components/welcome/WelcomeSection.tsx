import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Palette } from "lucide-react";
import ChinookWelcome from "@/components/chinook/ChinookWelcome";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";

interface WelcomeSectionProps {
  onNavigate: (section: string) => void;
}
const WelcomeSection = ({ onNavigate }: WelcomeSectionProps) => {
  const { currentUser } = useAuthStore();
  const userName = currentUser?.name || "Usuário";
  const [showChinook, setShowChinook] = useState(true);

  return (
    <div className="space-y-6">
      {/* Chinook Welcome */}
      {showChinook && (
        <ChinookWelcome onClose={() => setShowChinook(false)} />
      )}
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative grid md:grid-cols-2 gap-8 p-8 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">
                Bem-vindo, {userName}!
              </h1>
              <p className="text-red-100 text-lg">
                Portal SAF Maple Bear - Sistema de Gestão de Licenças Canva
              </p>
            </div>
            
            <p className="text-red-50 leading-relaxed">
              Gerencie licenças Canva, monitore o uso das ferramentas educacionais 
              e acompanhe o desempenho das escolas da rede Maple Bear de forma 
              centralizada e eficiente.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => onNavigate('school-units')}
                className="bg-white text-red-600 hover:bg-red-50 gap-2"
              >
                <Users className="w-4 h-4" />
                Gerenciar Escolas
                <ArrowRight className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => onNavigate('analytics')}
                className="border-white text-white hover:bg-white/10 gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Ver Relatórios
              </Button>
            </div>
          </div>
          
          <div className="hidden md:block">
            <img 
              src="/meninas-desenhando.png" 
              alt="Estudantes da Maple Bear desenhando" 
              className="w-full h-auto rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-red-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Users className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-red-800">Escolas Ativas</CardTitle>
                <CardDescription>Unidades cadastradas</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">127</div>
            <p className="text-sm text-gray-600 mt-1">+5 este mês</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Palette className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-orange-800">Licenças Canva</CardTitle>
                <CardDescription>Em uso atualmente</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">1,847</div>
            <p className="text-sm text-gray-600 mt-1">89% de utilização</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-green-800">Projetos Criados</CardTitle>
                <CardDescription>Este mês</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">3,241</div>
            <p className="text-sm text-gray-600 mt-1">+12% vs mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Image */}
      <div className="md:hidden">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <img 
              src="/meninas-desenhando.png" 
              alt="Estudantes da Maple Bear desenhando" 
              className="w-full h-auto"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeSection;

