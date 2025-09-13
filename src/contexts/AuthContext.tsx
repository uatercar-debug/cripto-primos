import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (accessCode: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Códigos de acesso válidos (em produção, isso viria de uma API)
const VALID_ACCESS_CODES = [
  'CRIPTO2024',
  'VIP2024',
  'COPYTRADE2024',
  'PRIMOS2024'
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há token salvo no localStorage
    const savedToken = localStorage.getItem('vip_access_token');
    if (savedToken) {
      // Validar se o token ainda é válido
      const tokenData = JSON.parse(savedToken);
      const now = new Date().getTime();
      
      if (tokenData.expiresAt > now) {
        setIsAuthenticated(true);
      } else {
        // Token expirado, remover
        localStorage.removeItem('vip_access_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (accessCode: string): boolean => {
    const isValidCode = VALID_ACCESS_CODES.includes(accessCode.toUpperCase());
    
    if (isValidCode) {
      // Gerar token com expiração de 30 dias
      const expiresAt = new Date().getTime() + (30 * 24 * 60 * 60 * 1000);
      const tokenData = {
        accessCode: accessCode.toUpperCase(),
        expiresAt,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('vip_access_token', JSON.stringify(tokenData));
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem('vip_access_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
