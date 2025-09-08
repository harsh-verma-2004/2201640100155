import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { URLRecord } from '../types/url';
import { Copy, ExternalLink, Clock, Calendar, MousePointerClick } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface URLResultsListProps {
  records: URLRecord[];
}

export const URLResultsList = ({ records }: URLResultsListProps) => {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = async (shortCode: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast({
        title: "Copied!",
        description: "Short URL copied to clipboard",
      });
    } catch {
      toast({
        title: "Copy Failed",
        description: "Could not copy URL to clipboard",
        variant: "destructive"
      });
    }
  };

  const openShortUrl = (shortCode: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    window.open(shortUrl, '_blank');
  };

  const isExpired = (expiryDate: Date) => {
    return currentTime > expiryDate;
  };

  const getTimeRemaining = (expiryDate: Date) => {
    const diff = expiryDate.getTime() - currentTime.getTime();
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  if (records.length === 0) {
    return (
      <Card className="p-8 text-center material-elevation-1">
        <div className="text-muted-foreground">
          <MousePointerClick className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No URLs shortened yet</p>
          <p className="text-sm">
            Enter a URL above to create your first short link
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Recent Short URLs ({records.length}/5)
        </h3>
      </div>

      {records.map((record) => {
        const shortUrl = `${window.location.origin}/${record.shortCode}`;
        const expired = isExpired(record.expiryDate);
        
        return (
          <Card key={record.id} className={`p-6 material-elevation-1 ${expired ? 'opacity-60' : ''}`}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-foreground truncate">
                      {shortUrl}
                    </h4>
                    {expired && (
                      <span className="px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded-full">
                        Expired
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {record.originalUrl}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(record.shortCode)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openShortUrl(record.shortCode)}
                    disabled={expired}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    Created {record.createdAt.toLocaleDateString()} at{' '}
                    {record.createdAt.toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>
                    Expires in {getTimeRemaining(record.expiryDate)}
                  </span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <MousePointerClick className="w-4 h-4 mr-2" />
                  <span>{record.clicks.length} clicks</span>
                </div>
              </div>

              {record.customShortCode && (
                <div className="text-xs text-accent-foreground bg-accent px-2 py-1 rounded inline-block">
                  Custom shortcode: {record.customShortCode}
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};