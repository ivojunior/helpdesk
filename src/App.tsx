import { useState } from 'react';
import { LoginPage } from './components/login-page';
import { MainLayout } from './components/main-layout';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  requesterName: string;
  requesterEmail: string;
  assignedTo?: string;
}

export interface User {
  email: string;
  name: string;
  picture?: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <MainLayout user={user} onLogout={handleLogout} />;
}
