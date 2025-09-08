import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link2, BarChart3 } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card material-elevation-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Link2 className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-semibold text-foreground">URL Shortener</h1>
            </div>
            
            <nav className="flex space-x-1">
              <Button 
                variant={location.pathname === '/' ? 'default' : 'ghost'}
                asChild
              >
                <Link to="/">
                  <Link2 className="w-4 h-4 mr-2" />
                  Shorten
                </Link>
              </Button>
              <Button 
                variant={location.pathname === '/statistics' ? 'default' : 'ghost'}
                asChild
              >
                <Link to="/statistics">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Statistics
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};