import { Badge } from './ui/badge';
import { Clock, User, AlertCircle, CheckCircle, XCircle, PlayCircle } from 'lucide-react';
import type { Ticket } from '../App';

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
  isSelected?: boolean;
}

const priorityConfig = {
  low: { label: 'Baixa', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  medium: { label: 'Média', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  high: { label: 'Alta', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  urgent: { label: 'Urgente', color: 'bg-red-100 text-red-700 border-red-200' },
};

const statusConfig = {
  open: { label: 'Aberto', icon: AlertCircle, color: 'text-orange-600' },
  in_progress: { label: 'Em Andamento', icon: PlayCircle, color: 'text-blue-600' },
  resolved: { label: 'Resolvido', icon: CheckCircle, color: 'text-green-600' },
  closed: { label: 'Fechado', icon: XCircle, color: 'text-slate-600' },
};

export function TicketCard({ ticket, onClick, isSelected }: TicketCardProps) {
  const StatusIcon = statusConfig[ticket.status].icon;
  const timeAgo = getTimeAgo(ticket.createdAt);

  return (
    <div
      onClick={onClick}
      className={`bg-white p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-blue-500 shadow-md' : 'border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-slate-900 mb-1 truncate">{ticket.title}</h3>
          <p className="text-slate-600 line-clamp-2">{ticket.description}</p>
        </div>
        <Badge className={priorityConfig[ticket.priority].color}>
          {priorityConfig[ticket.priority].label}
        </Badge>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className={`flex items-center gap-1.5 ${statusConfig[ticket.status].color}`}>
          <StatusIcon className="size-4" />
          <span>{statusConfig[ticket.status].label}</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-600">
          <User className="size-4" />
          <span>{ticket.requesterName}</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-600">
          <Clock className="size-4" />
          <span>{timeAgo}</span>
        </div>

        <Badge variant="outline" className="ml-auto">
          {ticket.category}
        </Badge>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
  } else if (diffInHours > 0) {
    return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  } else if (diffInMinutes > 0) {
    return `há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  } else {
    return 'agora mesmo';
  }
}
