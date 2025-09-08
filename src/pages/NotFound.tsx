import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center material-elevation-2 max-w-md">
          <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
          <h2 className="text-xl font-semibold text-foreground mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <Button asChild>
            <a href="/">
              <Home className="w-4 h-4 mr-2" />
              Return to Home
            </a>
          </Button>
        </Card>
      </div>
    </Layout>
  );
};

export default NotFound;
