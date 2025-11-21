import { useEffect, useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { TicketPlus, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { useAuth } from '../services/auth-service';
import type { User } from '../App';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [success, setSuccess] = useState('');
  const googleButtonRef = useRef<HTMLDivElement>(null);
  
  // Usa o hook customizado de autenticação
  const { 
    initializeGoogle, 
    validateToken, 
    isLoading, 
    error, 
    isInitialized,
    authService 
  } = useAuth();

  /**
   * Inicializa Google Sign-In ao montar o componente
   */
  useEffect(() => {
    const init = async () => {
      await initializeGoogle();
    };

    // Pequeno delay para garantir que o DOM está pronto
    const timer = setTimeout(init, 500);
    return () => clearTimeout(timer);
  }, [initializeGoogle]);

  /**
   * Renderiza o botão do Google após inicialização
   */
  useEffect(() => {
    if (isInitialized && googleButtonRef.current) {
      try {
        authService.renderLoginButton('google-signin-button', 'filled_blue');
      } catch (err) {
        console.error('Erro ao renderizar botão:', err);
      }
    }
  }, [isInitialized, authService]);

  /**
   * Escuta evento de login bem-sucedido do Google
   */
  useEffect(() => {
    const handleGoogleSignIn = async (event: Event) => {
      const customEvent = event as CustomEvent<{ credential: string }>;
      
      if (customEvent.detail?.credential) {
        try {
          const response = await validateToken(customEvent.detail.credential);

          if (response.success && response.user) {
            setSuccess('✓ Autenticação bem-sucedida!');
            
            // Aguarda um pouco antes de fazer login
            setTimeout(() => {
              onLogin(response.user!);
            }, 1000);
          } else {
            // Error já está no estado do hook
            console.error('Validação falhou:', response.message);
          }
        } catch (err) {
          console.error('Erro ao processar login:', err);
        }
      }
    };

    window.addEventListener('googleSignInSuccess', handleGoogleSignIn);
    return () => window.removeEventListener('googleSignInSuccess', handleGoogleSignIn);
  }, [validateToken, onLogin]);

  // Obtem configurações para debug
  const config = authService.getConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl mb-4">
            <TicketPlus className="size-8 text-white" />
          </div>
          <h1 className="text-slate-900 text-2xl font-bold mb-2">
            Sistema de Helpdesk
          </h1>
          <p className="text-slate-600">Grupo LGH</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Bem-vindo</CardTitle>
            <CardDescription>
              Faça login com sua conta corporativa do Google Workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Mensagem de Sucesso */}
            {success && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="size-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Mensagem de Erro */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Estado de Carregamento */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin mb-4">
                  <div className="border-4 border-blue-200 border-t-blue-600 rounded-full w-10 h-10" />
                </div>
                <p className="text-slate-600 text-center">
                  Carregando Google Sign-In...
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Por favor aguarde
                </p>
              </div>
            )}

            {/* Botão de Login do Google */}
            {!isLoading && isInitialized && (
              <>
                <div
                  ref={googleButtonRef}
                  id="google-signin-button"
                  className="w-full flex justify-center"
                />
                
                {/* Informações */}
                <Alert className="bg-blue-50 border-blue-200 mt-4">
                  <Info className="size-4 text-blue-600" />
                  <AlertDescription className="text-blue-900 text-sm">
                    Use seu email corporativo com domínio{' '}
                    <span className="font-semibold">@grupolgh.com.br</span>
                  </AlertDescription>
                </Alert>
              </>
            )}

            {/* Fallback se não inicializar */}
            {!isLoading && !isInitialized && !error && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="size-4 text-amber-600" />
                <AlertDescription className="text-amber-900">
                  Aguarde o carregamento do sistema de autenticação...
                </AlertDescription>
              </Alert>
            )}

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-900 text-sm font-semibold mb-2">
                ✓ Requisitos:
              </p>
              <ul className="text-blue-900 text-sm space-y-1 list-disc list-inside">
                <li>Email corporativo @grupolgh.com.br</li>
                <li>Conta Google Workspace ativa</li>
                <li>Acesso ao domínio grupolgh.com.br</li>
              </ul>
            </div>

            {/* Debug Info (apenas em desenvolvimento) */}
            {import.meta.env.MODE === 'development' && (
              <details className="mt-4 p-3 bg-slate-100 rounded text-xs cursor-pointer">
                <summary className="font-mono font-semibold text-slate-700 cursor-pointer">
                  🔍 Informações de Debug
                </summary>
                <div className="mt-2 font-mono text-slate-600 space-y-1">
                  <p>
                    <span className="font-semibold">Client ID:</span>{' '}
                    {config.clientId}
                  </p>
                  <p>
                    <span className="font-semibold">Domínio:</span>{' '}
                    {config.domain}
                  </p>
                  <p>
                    <span className="font-semibold">Ambiente:</span>{' '}
                    {config.environment}
                  </p>
                  <p>
                    <span className="font-semibold">Google SDK:</span>{' '}
                    {authService.isGoogleLoaded() ? '✓ Carregado' : '✗ Não carregado'}
                  </p>
                </div>
              </details>
            )}

            {/* Setup Instructions (apenas se houver erro de config) */}
            {error && error.includes('não configurado') && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-900 text-sm font-semibold mb-2">
                  ⚙️ Como configurar:
                </p>
                <ol className="text-amber-900 text-sm space-y-2 list-decimal list-inside">
                  <li>
                    Crie um app no{' '}
                    <a
                      href="https://console.cloud.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold underline"
                    >
                      Google Cloud Console
                    </a>
                  </li>
                  <li>Configure OAuth 2.0</li>
                  <li>
                    Crie arquivo <span className="font-mono bg-amber-100 px-1 rounded">.env.local</span> na raiz do projeto
                  </li>
                  <li>
                    Adicione:
                    <pre className="mt-1 p-2 bg-amber-100 rounded text-xs overflow-x-auto whitespace-pre-wrap break-words">
                      VITE_GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
                      VITE_GOOGLE_WORKSPACE_DOMAIN=@grupolgh.com.br
                    </pre>
                  </li>
                  <li>Reinicie o servidor: <span className="font-mono">npm run dev</span></li>
                </ol>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-slate-600 mt-6 text-sm">
          Acesso restrito a colaboradores do Grupo LGH com domínio{' '}
          <span className="font-semibold">@grupolgh.com.br</span>
        </p>
      </div>
    </div>
  );
}