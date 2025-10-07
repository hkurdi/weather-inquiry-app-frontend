import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Settings, Cloud } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Weather Knowledge Base</h1>
          </div>

          <nav className="flex gap-2">
            <Link to="/">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                className="gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Chat
              </Button>
            </Link>
            <Link to="/admin">
              <Button
                variant={isActive('/admin') ? 'default' : 'ghost'}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Admin
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>

      {/* Footer */}
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Weather Knowledge Base RAG System
        </div>
      </footer>
    </div>
  );
}