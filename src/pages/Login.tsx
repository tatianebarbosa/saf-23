import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Shield, Moon, Sun, Palette } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [backgroundStyle, setBackgroundStyle] = useState("gradient");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, currentUser } = useAuthStore();

  // Verificar se já está autenticado
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const user = login(username, password);

    if (user) {
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a), ${user.name}`,
      });
      
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 100);
    } else {
      toast({
        title: "Erro de autenticação",
        description: "Usuário ou senha incorretos",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const getBackgroundClass = () => {
    const base = isDarkMode ? "dark" : "";
    
    switch (backgroundStyle) {
      case "study":
        return `${base} min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4`;
      case "gradient":
        return `${base} min-h-screen ${isDarkMode 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
          : "bg-gradient-to-br from-red-50 via-white to-red-100"} flex items-center justify-center p-4`;
      default:
        return `${base} min-h-screen ${isDarkMode 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
          : "bg-gradient-to-br from-red-50 via-white to-red-100"} flex items-center justify-center p-4`;
    }
  };

  const getCardClass = () => {
    return `w-full max-w-md relative backdrop-blur-sm ${isDarkMode 
      ? "bg-gray-800/95 border-gray-700/50 text-white" 
      : "bg-white/95 border-red-200/50"} shadow-2xl`;
  };

  return (
    <div 
      className={getBackgroundClass()}
      style={backgroundStyle === "study" ? {
        backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23f0f9ff;stop-opacity:1" /><stop offset="100%" style="stop-color:%23dbeafe;stop-opacity:1" /></linearGradient></defs><rect width="1000" height="1000" fill="url(%23bg)"/><g opacity="0.1"><circle cx="200" cy="200" r="100" fill="%23ef4444"/><circle cx="800" cy="300" r="80" fill="%23f59e0b"/><circle cx="300" cy="700" r="120" fill="%2310b981"/><circle cx="700" cy="800" r="90" fill="%233b82f6"/></g></svg>')`
      } : {}}
    >
      <div className="absolute inset-0 bg-gradient-pattern opacity-30" />
      
      {/* Controles de personalização */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`${isDarkMode ? "bg-gray-800 border-gray-600 text-white hover:bg-gray-700" : ""}`}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setBackgroundStyle(backgroundStyle === "gradient" ? "study" : "gradient")}
          className={`${isDarkMode ? "bg-gray-800 border-gray-600 text-white hover:bg-gray-700" : ""}`}
        >
          <Palette className="w-4 h-4" />
        </Button>
      </div>
      
      <Card className={getCardClass()}>
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center mb-6">
            <div className={`${isDarkMode ? "bg-gray-700" : "bg-white"} rounded-full p-4 shadow-lg`}>
              <img 
                src="/logo-maplebear.png" 
                alt="Maple Bear Logo" 
                className="w-24 h-24 object-contain"
              />
            </div>
          </div>
          <CardTitle className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-red-800"}`}>
            Maple Bear SAF
          </CardTitle>
          <CardDescription className={`${isDarkMode ? "text-gray-300" : "text-red-600"}`}>
            Sistema de Atendimento e Franquias
          </CardDescription>
          
          {/* Indicador de segurança */}
          <div className={`flex items-center justify-center gap-2 text-sm ${isDarkMode 
            ? "text-green-400 bg-green-900/30" 
            : "text-green-600 bg-green-50"} px-3 py-2 rounded-lg`}>
            <Shield className="w-4 h-4" />
            <span>Conexão Segura</span>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                Usuário
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={`w-full ${isDarkMode 
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-400" 
                  : "border-red-200 focus:border-red-400"} focus:ring-red-400`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full pr-10 ${isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-400" 
                    : "border-red-200 focus:border-red-400"} focus:ring-red-400`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode 
                    ? "text-gray-400 hover:text-gray-200" 
                    : "text-gray-400 hover:text-gray-600"} transition-colors`}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

