import { useState } from 'react';
import { TicketForm } from './ticket-form';
import { TicketList } from './ticket-list';
import { TicketDetails } from './ticket-details';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TicketPlus, List } from 'lucide-react';
import type { Ticket } from '../App';
import type { User } from '../App';

interface TicketsPageProps {
  user: User;
}

export function TicketsPage({ user }: TicketsPageProps) {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '1',
      title: 'Problema com impressora do 3º andar',
      description: 'A impressora não está conectando à rede',
      category: 'Hardware',
      priority: 'medium',
      status: 'open',
      createdAt: new Date('2025-11-19'),
      updatedAt: new Date('2025-11-19'),
      requesterName: 'Maria Silva',
      requesterEmail: 'maria.silva@grupolgh.com.br',
    },
    {
      id: '2',
      title: 'Acesso ao sistema financeiro',
      description: 'Preciso de permissão para acessar o módulo de relatórios',
      category: 'Acesso',
      priority: 'high',
      status: 'in_progress',
      createdAt: new Date('2025-11-18'),
      updatedAt: new Date('2025-11-19'),
      requesterName: 'João Santos',
      requesterEmail: 'joao.santos@grupolgh.com.br',
      assignedTo: 'Suporte TI',
    },
    {
      id: '3',
      title: 'Email não está enviando anexos',
      description: 'Quando tento enviar arquivos maiores que 5MB, o email não envia',
      category: 'Email',
      priority: 'low',
      status: 'resolved',
      createdAt: new Date('2025-11-17'),
      updatedAt: new Date('2025-11-18'),
      requesterName: 'Ana Costa',
      requesterEmail: 'ana.costa@grupolgh.com.br',
      assignedTo: 'Suporte TI',
    },
  ]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const handleCreateTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTickets([newTicket, ...tickets]);
  };

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    setTickets(tickets.map(t => t.id === updatedTicket.id ? { ...updatedTicket, updatedAt: new Date() } : t));
    setSelectedTicket(updatedTicket);
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets(tickets.filter(t => t.id !== ticketId));
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(null);
    }
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-slate-600 mb-1">Total de Chamados</p>
          <p className="text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-slate-600 mb-1">Abertos</p>
          <p className="text-orange-600">{stats.open}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-slate-600 mb-1">Em Andamento</p>
          <p className="text-blue-600">{stats.inProgress}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-slate-600 mb-1">Resolvidos</p>
          <p className="text-green-600">{stats.resolved}</p>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="size-4" />
            Chamados
          </TabsTrigger>
          <TabsTrigger value="new" className="flex items-center gap-2">
            <TicketPlus className="size-4" />
            Novo Chamado
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TicketList 
                tickets={tickets}
                onSelectTicket={setSelectedTicket}
                selectedTicketId={selectedTicket?.id}
              />
            </div>
            <div>
              {selectedTicket ? (
                <TicketDetails 
                  ticket={selectedTicket}
                  onUpdateTicket={handleUpdateTicket}
                  onDeleteTicket={handleDeleteTicket}
                  onClose={() => setSelectedTicket(null)}
                />
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 text-center">
                  <List className="size-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">
                    Selecione um chamado para ver os detalhes
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="new">
          <div className="max-w-2xl mx-auto">
            <TicketForm onSubmit={handleCreateTicket} user={user} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
