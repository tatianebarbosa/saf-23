import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  BarChart3, 
  Users, 
  TrendingUp, 
  User, 
  LogOut, 
  MessageSquare, 
  Bot, 
  CreditCard, 
  Brain, 
  Calendar,
  Activity,
  Home,
  Menu,
  ArrowLeft,
  Bell,
  Building,
  Settings,
  Palette,
  FileText,
  Ticket
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";
import { useCoordinatorStore } from "@/stores/coordinatorStore";


interface HeaderProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const Header = ({ activeSection, onSectionChange }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { currentUser, logout } = useAuthStore();
  const { getUnreadNotifications } = useCoordinatorStore();
  
  const unreadNotifications = getUnreadNotifications();
  const isCoordinator = currentUser?.role === 'Coordinator';
  const isAdmin = currentUser?.role === 'Admin';

  const handleLogout = () => {
    logout();
    
    toast({
      title: "Logout realizado com sucesso",
      description: "Você foi desconectado com sucesso",
    });
    
    navigate("/login");
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img 
                src="/logo-maplebear.png" 
                alt="Maple Bear SAF" 
                className="w-10 h-10 rounded-full border-2 border-white/20"
              />
              <div>
                <h1 className="text-xl font-bold">Maple Bear SAF</h1>
                <p className="text-xs text-red-100">Sistema de Atendimento e Franquias</p>
              </div>
            </Link>
            
            {/* Left Side Navigation */}
            {/* Só mostra os botões se não estiver na tela inicial */}
            {activeSection !== "saf-control" && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGoBack}
                  className="text-white hover:bg-white/10"
                  title="Voltar"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGoHome}
                  className="text-white hover:bg-white/10"
                  title="Página Inicial"
                >
                  <Home className="h-4 w-4 mr-1" />
                  Início
                </Button>
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Quick Navigation - Desktop */}
            <div className="hidden md:flex items-center space-x-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 gap-2"
                  >
                    <Palette className="w-4 h-4" />
                    Canva
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/dashboard/canva-licenses")}>
                    <Palette className="w-4 h-4 mr-2" />
                    Controle de Licenças
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard/canva-manager")}>
                    <Users className="w-4 h-4 mr-2" />
                    Gerenciar Licenças
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard/canva-insights")}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Insights e Análises
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/canva-ranking")}>
                    <Award className="w-4 h-4 mr-2" />
                    Ranking
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/canva-cost-analysis")}>
                    <FileText className="w-4 h-4 mr-2" />
                    Análise de Custos
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Vouchers
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/dashboard/vouchers")}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Dashboard Vouchers
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard/vouchers-units")}>
                    <Building className="w-4 h-4 mr-2" />
                    Vouchers por Unidade
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard/vouchers-2026")}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Campanha 2026
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/tickets')}
                className="text-white hover:bg-white/10 gap-2"
              >
                <Ticket className="w-4 h-4" />
                Tickets
              </Button>
            </div>

            {/* Notifications */}
            {(isCoordinator || isAdmin) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/coordinator')}
                className="relative text-white hover:bg-white/10"
                title="Notificações"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications.length > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-yellow-400 text-yellow-900"
                  >
                    {unreadNotifications.length}
                  </Badge>
                )}
              </Button>
            )}

            {/* More Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 gap-2">
                  <Menu className="w-4 h-4" />
                  <span className="hidden sm:inline">Mais</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Dashboards</DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Gerenciamento</DropdownMenuLabel>
                {(isCoordinator || isAdmin) && (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/monitoring")}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Monitoria
                    </DropdownMenuItem>
                    {isCoordinator && (
                      <DropdownMenuItem onClick={() => navigate("/audit")}>
                        <FileText className="w-4 h-4 mr-2" />
                        Painel de Auditoria
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => navigate("/calendar")}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Agenda SAF
                    </DropdownMenuItem>
                  </>
                )}
                {isCoordinator && (
                  <DropdownMenuItem onClick={() => navigate('/coordinator')}>
                    <Building className="w-4 h-4 mr-2" />
                    Dashboard Coordenação
                  </DropdownMenuItem>
                )}
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Administração
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-white hover:bg-white/10">
                  <Avatar className="w-8 h-8 border-2 border-white/20">
                    <AvatarFallback className="text-xs bg-white text-red-600 font-bold">
                      {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">{currentUser?.name || 'Usuário'}</p>
                    <p className="text-xs text-red-100">
                      {currentUser?.role === 'Coordinator' ? 'Coordenadora' : 
                       currentUser?.role === 'Admin' ? 'Administrador' : 'Agente'}
                    </p>
                  </div>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuItem className="text-sm">
                  <User className="w-4 h-4 mr-2" />
                  {currentUser?.email || 'Não definido'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                {isCoordinator && (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/coordinator')}>
                      <Building className="mr-2 h-4 w-4" />
                      Dashboard Coordenação
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                
                {isAdmin && (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Painel Admin
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                
                {onSectionChange && (
                  <>
                    <DropdownMenuItem onClick={() => onSectionChange('profile')}>
                      <User className="w-4 h-4 mr-2" />
                      Perfil
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;