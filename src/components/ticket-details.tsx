import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { 
  X, 
  Calendar, 
  User, 
  Mail, 
  Tag, 
  Flag, 
  Clock,
  Trash2,
  UserCheck
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import type { Ticket } from '../App';

interface TicketDetailsProps {
  ticket: Ticket;
  onUpdateTicket: (ticket: Ticket) => void;
  onDeleteTicket: (ticketId: string) => void;
  onClose: () => void;
}

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente',
};

const statusLabels = {
  open: 'Aberto',
  in_progress: 'Em Andamento',
  resolved: 'Resolvido',
  closed: 'Fechado',
};

export function TicketDetails({ ticket, onUpdateTicket, onDeleteTicket, onClose }: TicketDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTicket, setEditedTicket] = useState(ticket);

  const handleSave = () => {
    onUpdateTicket(editedTicket);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTicket(ticket);
    setIsEditing(false);
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>Detalhes do Chamado</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-slate-600">
            <Tag className="size-4" />
            <span>Título</span>
          </div>
          <p className="text-slate-900">{ticket.title}</p>
        </div>

        <Separator />

        <div>
          <div className="flex items-center gap-2 mb-2 text-slate-600">
            <span>Descrição</span>
          </div>
          <p className="text-slate-700">{ticket.description}</p>
        </div>

        <Separator />

        <div className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={editedTicket.status} 
                  onValueChange={(value: any) => setEditedTicket({ ...editedTicket, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Aberto</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="resolved">Resolvido</SelectItem>
                    <SelectItem value="closed">Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select 
                  value={editedTicket.priority} 
                  onValueChange={(value: any) => setEditedTicket({ ...editedTicket, priority: value })}
                >
                  <SelectTrigger>
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

              <div className="space-y-2">
                <Label>Atribuído a</Label>
                <Input
                  value={editedTicket.assignedTo || ''}
                  onChange={(e) => setEditedTicket({ ...editedTicket, assignedTo: e.target.value })}
                  placeholder="Nome do responsável"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <Flag className="size-4" />
                  <span>Status</span>
                </div>
                <Badge variant="outline">{statusLabels[ticket.status]}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <Flag className="size-4" />
                  <span>Prioridade</span>
                </div>
                <Badge variant="outline">{priorityLabels[ticket.priority]}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <Tag className="size-4" />
                  <span>Categoria</span>
                </div>
                <Badge variant="outline">{ticket.category}</Badge>
              </div>

              {ticket.assignedTo && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <UserCheck className="size-4" />
                    <span>Atribuído a</span>
                  </div>
                  <span className="text-slate-900">{ticket.assignedTo}</span>
                </div>
              )}
            </>
          )}
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-600">
            <User className="size-4" />
            <span>Solicitante</span>
          </div>
          <div className="pl-6 space-y-1">
            <p className="text-slate-900">{ticket.requesterName}</p>
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="size-3" />
              <span>{ticket.requesterEmail}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <span>Criado em</span>
            </div>
            <span>{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>Atualizado em</span>
            </div>
            <span>{new Date(ticket.updatedAt).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          {isEditing ? (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                Salvar
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex-1">
                Cancelar
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="w-full">
              Editar Chamado
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="size-4 mr-2" />
                Excluir Chamado
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este chamado? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDeleteTicket(ticket.id)}>
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
