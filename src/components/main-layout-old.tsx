import { useState } from 'react';
import { TicketsPage } from './tickets-page';
import { SettingsPage } from './settings-page';
import { ReportsPage } from './reports-page';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'; 
//import { DropdownMenu } from "radix-ui";
import { TicketPlus, Ticket, Settings, BarChart3, LogOut, User } from 'lucide-react';
import type { User as UserType } from '../App';

interface MainLayoutProps {
  user: UserType;
  onLogout: () => void;
}

type Page = 'tickets' | 'settings' | 'reports';

export function MainLayout({ user, onLogout }: MainLayoutProps) {
  const [currentPage, setCurrentPage] = useState<Page>('tickets');

  const navigation = [
    { id: 'tickets' as Page, label: 'Chamados', icon: Ticket },
    { id: 'reports' as Page, label: 'Relatórios', icon: BarChart3 },
    { id: 'settings' as Page, label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <TicketPlus className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-slate-900">Helpdesk</h1>
                <p className="text-slate-600">Grupo LGH</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? 'default' : 'ghost'}
                    onClick={() => setCurrentPage(item.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button /*variant="ghost"*/ className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarImage src={user.picture} alt={user.name} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{user.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p>{user.name}</p>
                    <p className="text-slate-600">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCurrentPage('settings')}>
                  <Settings className="size-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="size-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden flex items-center gap-2 pb-3 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'default' : 'ghost'}
                  onClick={() => setCurrentPage(item.id)}
                  size="sm"
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <Icon className="size-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentPage === 'tickets' && <TicketsPage user={user} />}
        {currentPage === 'settings' && <SettingsPage user={user} />}
        {currentPage === 'reports' && <ReportsPage />}
      </main>
    </div>
  );
}
