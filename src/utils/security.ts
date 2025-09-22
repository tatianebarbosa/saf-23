// Utilitários de segurança para o sistema MapleBear

// Configurações de segurança
export const SECURITY_CONFIG = {
  SESSION_TIMEOUT: 7 * 24 * 60 * 60 * 1000, // 7 dias em millisegundos
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos
  PASSWORD_MIN_LENGTH: 8,
  ALLOWED_DOMAINS: ['@mbcentral.com.br', '@seb.com.br', '@sebsa.com.br']
};

// Interface para tentativas de login
interface LoginAttempt {
  email: string;
  timestamp: number;
  success: boolean;
}

// Classe para gerenciar segurança de autenticação
export class AuthSecurity {
  private static readonly STORAGE_KEY = 'auth_security_data';
  
  // Obter dados de segurança do localStorage
  private static getSecurityData(): { attempts: LoginAttempt[], blockedUsers: Record<string, number> } {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : { attempts: [], blockedUsers: {} };
    } catch {
      return { attempts: [], blockedUsers: {} };
    }
  }
  
  // Salvar dados de segurança no localStorage
  private static saveSecurityData(data: { attempts: LoginAttempt[], blockedUsers: Record<string, number> }): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar dados de segurança:', error);
    }
  }
  
  // Verificar se o email está em domínio permitido
  static isAllowedDomain(email: string): boolean {
    const normalizedEmail = email.toLowerCase().trim();
    return SECURITY_CONFIG.ALLOWED_DOMAINS.some(domain => 
      normalizedEmail.includes(domain)
    );
  }
  
  // Verificar se o usuário está bloqueado
  static isUserBlocked(email: string): boolean {
    const data = this.getSecurityData();
    const blockTime = data.blockedUsers[email.toLowerCase()];
    
    if (!blockTime) return false;
    
    const now = Date.now();
    if (now - blockTime > SECURITY_CONFIG.LOCKOUT_DURATION) {
      // Remover bloqueio expirado
      delete data.blockedUsers[email.toLowerCase()];
      this.saveSecurityData(data);
      return false;
    }
    
    return true;
  }
  
  // Registrar tentativa de login
  static recordLoginAttempt(email: string, success: boolean): void {
    const data = this.getSecurityData();
    const normalizedEmail = email.toLowerCase();
    
    // Adicionar nova tentativa
    data.attempts.push({
      email: normalizedEmail,
      timestamp: Date.now(),
      success
    });
    
    // Limpar tentativas antigas (mais de 1 hora)
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    data.attempts = data.attempts.filter(attempt => attempt.timestamp > oneHourAgo);
    
    // Se login falhou, verificar se deve bloquear usuário
    if (!success) {
      const recentFailures = data.attempts.filter(
        attempt => 
          attempt.email === normalizedEmail && 
          !attempt.success &&
          attempt.timestamp > Date.now() - (15 * 60 * 1000) // últimos 15 minutos
      );
      
      if (recentFailures.length >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
        data.blockedUsers[normalizedEmail] = Date.now();
      }
    } else {
      // Login bem-sucedido, remover bloqueio se existir
      delete data.blockedUsers[normalizedEmail];
    }
    
    this.saveSecurityData(data);
  }
  
  // Obter tempo restante de bloqueio
  static getBlockTimeRemaining(email: string): number {
    const data = this.getSecurityData();
    const blockTime = data.blockedUsers[email.toLowerCase()];
    
    if (!blockTime) return 0;
    
    const remaining = SECURITY_CONFIG.LOCKOUT_DURATION - (Date.now() - blockTime);
    return Math.max(0, remaining);
  }
  
  // Validar força da senha
  static validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
      errors.push(`Senha deve ter pelo menos ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} caracteres`);
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Senha deve conter pelo menos um número');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // Limpar dados de segurança (para administradores)
  static clearSecurityData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// Utilitários para sanitização de dados
export class DataSanitizer {
  // Sanitizar entrada de texto
  static sanitizeText(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remover caracteres potencialmente perigosos
      .substring(0, 1000); // Limitar tamanho
  }
  
  // Sanitizar email
  static sanitizeEmail(email: string): string {
    return email
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9@._-]/g, ''); // Manter apenas caracteres válidos para email
  }
  
  // Validar formato de email
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Utilitários para gerenciamento de sessão
export class SessionManager {
  private static readonly SESSION_KEY = 'user_session';
  
  // Criar sessão segura
  static createSession(user: any): void {
    const sessionData = {
      user,
      createdAt: Date.now(),
      expiresAt: Date.now() + SECURITY_CONFIG.SESSION_TIMEOUT,
      lastActivity: Date.now()
    };
    
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('userEmail', user.email);
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
    }
  }
  
  // Verificar se sessão é válida
  static isSessionValid(): boolean {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return false;
      
      const session = JSON.parse(sessionData);
      const now = Date.now();
      
      // Verificar se sessão expirou
      if (now > session.expiresAt) {
        this.clearSession();
        return false;
      }
      
      // Atualizar última atividade
      session.lastActivity = now;
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      
      return true;
    } catch {
      this.clearSession();
      return false;
    }
  }
  
  // Limpar sessão
  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem('authenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('saf_current_user');
    localStorage.removeItem('sessionExpiry');
  }
  
  // Obter dados da sessão
  static getSessionData(): any {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch {
      return null;
    }
  }
}

// Headers de segurança para requisições
export const SECURITY_HEADERS = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

// Função para configurar headers de segurança em requisições
export function addSecurityHeaders(headers: Record<string, string> = {}): Record<string, string> {
  return {
    ...SECURITY_HEADERS,
    ...headers
  };
}

