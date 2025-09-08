import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getURLByShortCode, addClickToURL } from '../utils/urlStorage';
import { URLRecord, ClickRecord } from '../types/url';
import { ExternalLink, Clock, AlertTriangle, Home } from 'lucide-react';

export const Redirect = () => {
  const { shortCode } = useParams();
  const [record, setRecord] = useState<URLRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!shortCode) {
      setError('Invalid short code');
      setLoading(false);
      return;
    }

    const urlRecord = getURLByShortCode(shortCode);
    
    if (!urlRecord) {
      setError('Short URL not found');
      setLoading(false);
      return;
    }

    // Check if expired
    if (new Date() > urlRecord.expiryDate) {
      setError('This short URL has expired');
      setLoading(false);
      return;
    }

    setRecord(urlRecord);
    setLoading(false);

    // Track the click
    const clickData: ClickRecord = {
      timestamp: new Date(),
      source: document.referrer || 'Direct',
      location: 'Client-side' // In a real app, you'd get geolocation
    };

    addClickToURL(shortCode, clickData);

    // Auto-redirect after a brief delay
    const timer = setTimeout(() => {
      handleRedirect(urlRecord.originalUrl);
    }, 2000);

    return () => clearTimeout(timer);
  }, [shortCode]);

  const handleRedirect = (url: string) => {
    setRedirecting(true);
    window.location.href = url;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center material-elevation-2">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-foreground">Loading...</p>
          </Card>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center material-elevation-2 max-w-md">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-muted-foreground mb-6">
              {error}
            </p>
            <Button asChild>
              <a href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </a>
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!record) {
    return null;
  }

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center material-elevation-2 max-w-md">
          {redirecting ? (
            <>
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Redirecting...
              </h2>
              <p className="text-muted-foreground">
                Taking you to your destination
              </p>
            </>
          ) : (
            <>
              <ExternalLink className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Redirecting to your link
              </h2>
              <p className="text-muted-foreground mb-6">
                You will be redirected automatically in a moment, or you can click the button below.
              </p>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => handleRedirect(record.originalUrl)}
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Go to {new URL(record.originalUrl).hostname}
                </Button>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="flex items-center justify-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Expires: {record.expiryDate.toLocaleDateString()} at {record.expiryDate.toLocaleTimeString()}
                  </p>
                  <p>Clicks: {record.clicks.length + 1}</p>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
};