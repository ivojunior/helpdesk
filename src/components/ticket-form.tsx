import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';
import type { Ticket } from '../App';
import type { User } from '../App';

interface TicketFormProps {
  onSubmit: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  user: User;
}

export function TicketForm({ onSubmit, user }: TicketFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    requesterName: user.name,
    requesterEmail: user.email,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      requesterName: user.name,
      requesterEmail: user.email,
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const isFormValid = formData.title && formData.description && formData.category && formData.requesterName && formData.requesterEmail;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Abrir Novo Chamado</CardTitle>
        <CardDescription>
          Preencha os dados abaixo para abrir um chamado de suporte
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitted && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="size-5 text-green-600" />
            <p className="text-green-800">Chamado criado com sucesso!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requesterName">Seu Nome *</Label>
              <Input
                id="requesterName"
                value={formData.requesterName}
                onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                placeholder="Digite seu nome completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requesterEmail">Seu Email *</Label>
              <Input
                id="requesterEmail"
                type="email"
                value={formData.requesterEmail}
                onChange={(e) => setFormData({ ...formData, requesterEmail: e.target.value })}
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título do Chamado *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Descreva brevemente o problema"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição Detalhada *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o problema com o máximo de detalhes possível"
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hardware">Hardware</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                  <SelectItem value="Rede">Rede</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Acesso">Acesso e Permissões</SelectItem>
                  <SelectItem value="Telefonia">Telefonia</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade *</Label>
              <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="size-5 text-blue-600 flex-shrink-0" />
            <p className="text-blue-800">
              Você receberá atualizações sobre seu chamado no email informado
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={!isFormValid}>
            Abrir Chamado
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}