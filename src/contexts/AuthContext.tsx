import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, accessCode: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  userEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função para gerar device fingerprint simples
const getDeviceFingerprint = (): string => {
  const navigator = window.navigator;
  const screen = window.screen;
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
  ].join('|');
  
  return btoa(fingerprint);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se há token salvo no localStorage
    const savedToken = localStorage.getItem('vip_access_token');
    if (savedToken) {
      try {
        const tokenData = JSON.parse(savedToken);
        const now = new Date().getTime();
        
        if (tokenData.expiresAt > now) {
          setIsAuthenticated(true);
          setUserEmail(tokenData.email);
        } else {
          // Token expirado, remover
          localStorage.removeItem('vip_access_token');
        }
      } catch (e) {
        localStorage.removeItem('vip_access_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, accessCode: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const normalizedCode = accessCode.toUpperCase().trim();

      // ============================================
      // CÓDIGO DE TESTE - REMOVER EM PRODUÇÃO
      // ============================================
      const TEST_CREDENTIALS = [
        { email: 'teste@teste.com', code: 'TESTE123' },
        { email: 'demo@demo.com', code: 'DEMO2024' },
        { email: 'admin@admin.com', code: 'ADMIN123' },
      ];
      
      const isTestUser = TEST_CREDENTIALS.find(
        cred => cred.email === normalizedEmail && cred.code === normalizedCode
      );
      
      if (isTestUser) {
        const expiresAt = new Date().getTime() + (30 * 24 * 60 * 60 * 1000); // 30 dias
        const tokenData = {
          email: normalizedEmail,
          accessCode: normalizedCode,
          expiresAt,
          loginTime: new Date().toISOString(),
          isTestUser: true,
        };
        
        localStorage.setItem('vip_access_token', JSON.stringify(tokenData));
        setIsAuthenticated(true);
        setUserEmail(normalizedEmail);
        
        return { success: true };
      }
      // ============================================

      // Buscar código no banco
      const { data: codeData, error: fetchError } = await supabase
        .from('vip_access_codes')
        .select('*')
        .eq('email', normalizedEmail)
        .eq('code', normalizedCode)
        .single();

      if (fetchError || !codeData) {
        return { 
          success: false, 
          error: 'Código de acesso inválido ou e-mail não corresponde.' 
        };
      }

      // Verificar se o código está bloqueado
      if (codeData.blocked) {
        return { 
          success: false, 
          error: 'Este código foi bloqueado por motivos de segurança. Entre em contato com o suporte.' 
        };
      }

      const deviceFingerprint = getDeviceFingerprint();
      const userIP = 'browser'; // Não podemos obter IP real do cliente no frontend

      // Se é o primeiro acesso, registrar dispositivo
      if (!codeData.first_access_at) {
        const { error: updateError } = await supabase
          .from('vip_access_codes')
          .update({
            device_fingerprint: deviceFingerprint,
            ip_address: userIP,
            first_access_at: new Date().toISOString(),
          })
          .eq('id', codeData.id);

        if (updateError) {
          console.error('Erro ao registrar primeiro acesso:', updateError);
        }
      } else {
        // Verificar se é o mesmo dispositivo
        if (codeData.device_fingerprint && codeData.device_fingerprint !== deviceFingerprint) {
          // Bloquear código automaticamente
          await supabase
            .from('vip_access_codes')
            .update({ blocked: true })
            .eq('id', codeData.id);

          return { 
            success: false, 
            error: 'Detectamos acesso de um dispositivo diferente. Por segurança, este código foi bloqueado automaticamente. Entre em contato com o suporte.' 
          };
        }
      }

      // Autenticação bem-sucedida
      const expiresAt = new Date().getTime() + (30 * 24 * 60 * 60 * 1000); // 30 dias
      const tokenData = {
        email: normalizedEmail,
        accessCode: normalizedCode,
        expiresAt,
        loginTime: new Date().toISOString(),
      };
      
      localStorage.setItem('vip_access_token', JSON.stringify(tokenData));
      setIsAuthenticated(true);
      setUserEmail(normalizedEmail);
      
      return { success: true };
    } catch (error: any) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        error: 'Erro ao processar login. Tente novamente.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('vip_access_token');
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading, userEmail }}>
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
