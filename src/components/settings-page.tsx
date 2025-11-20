import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { User, Bell, Shield, Palette, Save, UserPlus, Trash2 } from 'lucide-react';
import type { User as UserType } from '../App';

interface SettingsPageProps {
  user: UserType;
}

export function SettingsPage({ user }: SettingsPageProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [autoAssign, setAutoAssign] = useState(true);
  const [theme, setTheme] = useState('light');

  const [teamMembers] = useState([
    { id: '1', name: 'Carlos Oliveira', email: 'carlos.oliveira@grupolgh.com.br', role: 'Administrador' },
    { id: '2', name: 'Paula Fernandes', email: 'paula.fernandes@grupolgh.com.br', role: 'Técnico' },
    { id: '3', name: 'Roberto Costa', email: 'roberto.costa@grupolgh.com.br', role: 'Técnico' },
  ]);

  const handleSaveProfile = () => {
    // Simulação de salvamento
    alert('Perfil atualizado com sucesso!');
  };

  const handleSaveNotifications = () => {
    alert('Preferências de notificação atualizadas!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-slate-900 mb-2">Configurações</h2>
        <p className="text-slate-600">
          Gerencie suas preferências e configurações do sistema
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="profile">
            <User className="size-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="size-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="team">
            <UserPlus className="size-4 mr-2" />
            Equipe
          </TabsTrigger>
          <TabsTrigger value="system">
            <Shield className="size-4 mr-2" />
            Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="size-20 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-slate-900">{user.name}</p>
                  <p className="text-slate-600">{user.email}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input 
                      id="firstName" 
                      defaultValue={user.name.split(' ')[0]} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input 
                      id="lastName" 
                      defaultValue={user.name.split(' ').slice(1).join(' ')} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={user.email} 
                    disabled 
                  />
                  <p className="text-slate-600">
                    O email não pode ser alterado
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select defaultValue="ti">
                    <SelectTrigger id="department">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ti">Tecnologia da Informação</SelectItem>
                      <SelectItem value="rh">Recursos Humanos</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="operacoes">Operações</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveProfile} className="w-full md:w-auto">
                <Save className="size-4 mr-2" />
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure como você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-slate-900">Notificações por Email</p>
                    <p className="text-slate-600">
                      Receba atualizações de chamados por email
                    </p>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-slate-900">Notificações Push</p>
                    <p className="text-slate-600">
                      Receba notificações no navegador
                    </p>
                  </div>
                  <Switch 
                    checked={pushNotifications} 
                    onCheckedChange={setPushNotifications}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-slate-900">Atribuição Automática</p>
                    <p className="text-slate-600">
                      Receber chamados automaticamente
                    </p>
                  </div>
                  <Switch 
                    checked={autoAssign} 
                    onCheckedChange={setAutoAssign}
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotifications} className="w-full md:w-auto">
                <Save className="size-4 mr-2" />
                Salvar Preferências
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Membros da Equipe</CardTitle>
              <CardDescription>
                Gerencie os membros da equipe de suporte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full md:w-auto">
                <UserPlus className="size-4 mr-2" />
                Adicionar Membro
              </Button>

              <div className="space-y-3">
                {teamMembers.map(member => (
                  <div 
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-slate-900">{member.name}</p>
                        <p className="text-slate-600">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{member.role}</Badge>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>
                Configure preferências gerais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger id="theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="auto">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select defaultValue="pt-br">
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select defaultValue="america-sao-paulo">
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america-sao-paulo">América/São Paulo (UTC-3)</SelectItem>
                      <SelectItem value="america-new-york">América/New York (UTC-5)</SelectItem>
                      <SelectItem value="europe-london">Europa/Londres (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button className="w-full md:w-auto">
                <Save className="size-4 mr-2" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
