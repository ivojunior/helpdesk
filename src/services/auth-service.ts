// src/services/auth-service.tsx
// Serviço para gerenciar autenticação com Google Workspace

import React from 'react';
import type { User } from '../App';

declare global {
  interface Window {
    google: any;
  }
}

// Variáveis de ambiente
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_WORKSPACE_DOMAIN = import.meta.env.VITE_GOOGLE_WORKSPACE_DOMAIN || '@grupolgh.com.br';
const ALLOWED_DOMAIN = GOOGLE_WORKSPACE_DOMAIN.startsWith('@') 
  ? GOOGLE_WORKSPACE_DOMAIN 
  : `@${GOOGLE_WORKSPACE_DOMAIN}`;

/**
 * Interface para a resposta de validação
 */
export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  message?: string;
}

/**
 * Serviço de autenticação com Google Workspace
 * Usa padrão Singleton para garantir apenas uma instância
 */
export class AuthService {
  private static instance: AuthService;
  private googleAuth: any;
  private tokenCallback: ((token: string) => void) | null = null;

  private constructor() {}

  /**
   * Obtém a instância única do serviço
   */
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Valida se as variáveis de ambiente estão configuradas
   */
  static validateEnvironment(): { valid: boolean; error?: string } {
    if (!GOOGLE_CLIENT_ID) {
      return {
        valid: false,
        error: 'VITE_GOOGLE_CLIENT_ID não configurado em .env',
      };
    }

    if (!ALLOWED_DOMAIN) {
      return {
        valid: false,
        error: 'VITE_GOOGLE_WORKSPACE_DOMAIN não configurado em .env',
      };
    }

    return { valid: true };
  }

  /**
   * Inicializa o Google Sign-In
   * Carrega a biblioteca do Google e configura o cliente OAuth
   */
  async initializeGoogle(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Valida ambiente primeiro
      const envCheck = AuthService.validateEnvironment();
      if (!envCheck.valid) {
        reject(new Error(envCheck.error));
        return;
      }

      // Verifica se Google SDK já está carregado
      if (window.google) {
        try {
          this.setupGoogleClient();
          resolve();
        } catch (error) {
          reject(error);
        }
        return;
      }

      // Carrega a biblioteca do Google
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        try {
          if (!window.google) {
            throw new Error('Google SDK não carregou corretamente');
          }
          this.setupGoogleClient();
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      script.onerror = () => {
        reject(new Error('Falha ao carregar Google SDK'));
      };

      // Adiciona tratamento de timeout
      const timeoutId = setTimeout(() => {
        reject(new Error('Timeout ao carregar Google SDK'));
        script.remove();
      }, 10000);

      script.onload = () => {
        clearTimeout(timeoutId);
        try {
          if (!window.google) {
            throw new Error('Google SDK não carregou corretamente');
          }
          this.setupGoogleClient();
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Configura o cliente Google com as credenciais
   */
  private setupGoogleClient(): void {
    if (!window.google) {
      throw new Error('Google SDK não está disponível');
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      itp_support: true,
      ux_mode: 'popup', // Usa popup ao invés de redirect
    });
  }

  /**
   * Renderiza o botão de login do Google
   * @param elementId - ID do elemento onde renderizar o botão
   * @param theme - Tema do botão (outline, filled_blue, filled_black)
   */
  renderLoginButton(
    elementId: string,
    theme: 'outline' | 'filled_blue' | 'filled_black' = 'filled_blue'
  ): void {
    if (!window.google) {
      console.error('Google SDK não está carregado');
      return;
    }

    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Elemento com ID "${elementId}" não encontrado`);
      return;
    }

    try {
      window.google.accounts.id.renderButton(element, {
        theme,
        size: 'large',
        text: 'signin_with',
        locale: 'pt-BR',
        logo_alignment: 'left',
        width: '100%',
        click_listener: () => {
          console.log('Botão Google clicado');
        },
      });
    } catch (error) {
      console.error('Erro ao renderizar botão Google:', error);
    }
  }

  /**
   * Processa a resposta de credencial do Google
   * Chamado automaticamente quando o usuário faz login
   */
  private handleCredentialResponse(response: any): void {
    if (response.credential) {
      // Dispara evento customizado com o token
      const event = new CustomEvent('googleSignInSuccess', {
        detail: { credential: response.credential },
      });
      window.dispatchEvent(event);
    }
  }

  /**
   * Valida o token JWT do Google
   * Decodifica e verifica domínio, email verificado, etc.
   * 
   * @param token - Token JWT do Google
   * @returns User data se válido, null se inválido
   */
  async validateToken(token: string): Promise<User | null> {
    try {
      if (!token) {
        throw new Error('Token não fornecido');
      }

      // Decodifica o JWT
      const payload = this.decodeJwt(token);

      if (!payload) {
        throw new Error('Payload do token inválido');
      }

      // Valida domínio do email
      if (!payload.email) {
        throw new Error('Email não encontrado no token');
      }

      if (!payload.email.endsWith(ALLOWED_DOMAIN)) {
        throw new Error(
          `Email deve terminar com ${ALLOWED_DOMAIN} (recebido: ${payload.email})`
        );
      }

      // Valida se o email foi verificado pelo Google
      if (!payload.email_verified) {
        throw new Error('Email não foi verificado pelo Google');
      }

      // Valida issuer (não obrigatório no frontend, mas é uma boa prática)
      const validIssuers = [
        'https://accounts.google.com',
        'accounts.google.com',
      ];
      
      if (payload.iss && !validIssuers.includes(payload.iss)) {
        console.warn('Issuer não é um issuer conhecido do Google, mas continuando...');
      }

      // Retorna dados do usuário
      return {
        email: payload.email,
        name: payload.name || payload.email.split('@')[0],
        picture: payload.picture || undefined,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao validar token';
      console.error('Erro ao validar token:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Decodifica JWT sem validar assinatura
   * IMPORTANTE: Em produção, valide a assinatura no backend
   * 
   * @param token - Token JWT
   * @returns Payload decodificado
   */
  private decodeJwt(token: string): any {
    try {
      // JWT tem 3 partes separadas por pontos: header.payload.signature
      const parts = token.split('.');

      if (parts.length !== 3) {
        throw new Error('Formato de token inválido');
      }

      // A segunda parte é o payload (Base64 URL encoded)
      const payload = parts[1];

      // Decodifica Base64 URL
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));

      // Converte para JSON
      const parsed = JSON.parse(decoded);

      return parsed;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao decodificar token';
      throw new Error(`Token inválido: ${errorMessage}`);
    }
  }

  /**
   * Faz logout do usuário
   * Remove autoselect e limpa dados do Google
   */
  logout(): void {
    try {
      if (window.google) {
        // Desabilita auto select para evitar relogar automaticamente
        window.google.accounts.id.disableAutoSelect();

        console.log('Logout realizado com sucesso');
      }

      // Limpa token callback
      this.tokenCallback = null;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  /**
   * Define callback para quando um token for recebido
   * @param callback - Função a chamar com o token
   */
  setTokenCallback(callback: (token: string) => void): void {
    this.tokenCallback = callback;
  }

  /**
   * Obtém informações de configuração (para debug)
   */
  getConfig() {
    return {
      clientId: GOOGLE_CLIENT_ID ? '***configurado***' : 'NÃO CONFIGURADO',
      domain: ALLOWED_DOMAIN,
      domainEnv: GOOGLE_WORKSPACE_DOMAIN,
      environment: import.meta.env.MODE,
    };
  }

  /**
   * Verifica se o Google SDK está carregado
   */
  isGoogleLoaded(): boolean {
    return typeof window !== 'undefined' && !!window.google;
  }
}

/**
 * Instância singleton do serviço
 */
export const authService = AuthService.getInstance();

/**
 * Hook customizado para usar o serviço de autenticação
 * Simplifica a integração com componentes React
 */
export function useAuth() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);

  /**
   * Inicializa o Google Sign-In
   */
  const initializeGoogle = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Valida ambiente
      const envCheck = AuthService.validateEnvironment();
      if (!envCheck.valid) {
        setError(envCheck.error || 'Configuração incompleta');
        setIsLoading(false);
        return;
      }

      // Inicializa Google
      await authService.initializeGoogle();
      setIsInitialized(true);
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao inicializar autenticação';
      setError(errorMessage);
      setIsLoading(false);
    }
  }, []);

  /**
   * Valida um token JWT
   */
  const validateToken = React.useCallback(
    async (token: string): Promise<AuthResponse> => {
      try {
        const user = await authService.validateToken(token);

        if (user) {
          return { success: true, user };
        }

        return {
          success: false,
          error: 'Validação falhou',
          message: 'Não foi possível validar o token',
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao validar token';
        return {
          success: false,
          error: 'Validação falhou',
          message: errorMessage,
        };
      }
    },
    []
  );

  /**
   * Faz logout
   */
  const logout = React.useCallback(() => {
    authService.logout();
  }, []);

  return {
    initializeGoogle,
    validateToken,
    logout,
    isLoading,
    error,
    isInitialized,
    authService,
  };
}