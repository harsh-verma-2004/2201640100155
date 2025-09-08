import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { URLRecord, URLFormData } from '../types/url';
import { 
  saveURLRecord, 
  generateShortCode, 
  isValidURL, 
  isValidShortCode, 
  isShortCodeTaken 
} from '../utils/urlStorage';
import { Link2, Clock, Scissors } from 'lucide-react';

interface URLShortenerFormProps {
  onURLCreated: (record: URLRecord) => void;
  existingCount: number;
}

export const URLShortenerForm = ({ onURLCreated, existingCount }: URLShortenerFormProps) => {
  const [formData, setFormData] = useState<URLFormData>({
    url: '',
    validity: 30,
    customShortCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const canAddMore = existingCount < 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canAddMore) {
      toast({
        title: "Limit Reached",
        description: "You can only shorten up to 5 URLs at a time.",
        variant: "destructive"
      });
      return;
    }

    // Client-side validation
    if (!isValidURL(formData.url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (e.g., https://example.com)",
        variant: "destructive"
      });
      return;
    }

    if (formData.validity <= 0 || !Number.isInteger(formData.validity)) {
      toast({
        title: "Invalid Validity",
        description: "Validity period must be a positive integer (minutes).",
        variant: "destructive"
      });
      return;
    }

    if (formData.customShortCode) {
      if (!isValidShortCode(formData.customShortCode)) {
        toast({
          title: "Invalid Shortcode",
          description: "Shortcode must be 3-10 alphanumeric characters.",
          variant: "destructive"
        });
        return;
      }

      if (isShortCodeTaken(formData.customShortCode)) {
        toast({
          title: "Shortcode Taken",
          description: "This shortcode is already in use. Please choose another.",
          variant: "destructive"
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const shortCode = formData.customShortCode || generateShortCode();
      const now = new Date();
      const expiryDate = new Date(now.getTime() + formData.validity * 60 * 1000);

      const record: URLRecord = {
        id: crypto.randomUUID(),
        originalUrl: formData.url,
        shortCode,
        customShortCode: formData.customShortCode,
        validityMinutes: formData.validity,
        createdAt: now,
        expiryDate,
        clicks: []
      };

      saveURLRecord(record);
      onURLCreated(record);

      // Reset form
      setFormData({
        url: '',
        validity: 30,
        customShortCode: ''
      });

      toast({
        title: "URL Shortened!",
        description: `Short URL created successfully: ${shortCode}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to shorten URL. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 material-elevation-2">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <Link2 className="w-12 h-12 text-primary mx-auto mb-3" />
          <h2 className="text-2xl font-semibold text-foreground">
            Shorten Your URLs
          </h2>
          <p className="text-muted-foreground mt-1">
            Create short, manageable links with custom expiry times
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-foreground font-medium flex items-center">
              <Link2 className="w-4 h-4 mr-2" />
              Original URL *
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/very/long/url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              required
              className="h-12 text-base"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="validity" className="text-foreground font-medium flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Validity (minutes)
              </Label>
              <Input
                id="validity"
                type="number"
                min="1"
                placeholder="30"
                value={formData.validity}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  validity: parseInt(e.target.value) || 30 
                }))}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customShortCode" className="text-foreground font-medium flex items-center">
                <Scissors className="w-4 h-4 mr-2" />
                Custom Shortcode (optional)
              </Label>
              <Input
                id="customShortCode"
                placeholder="mylink123"
                value={formData.customShortCode}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  customShortCode: e.target.value 
                }))}
                className="h-12 text-base"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !canAddMore}
          className="w-full h-12 text-base font-medium"
        >
          {isSubmitting ? 'Creating...' : 'Shorten URL'}
        </Button>

        {!canAddMore && (
          <div className="text-center p-3 bg-warning-light rounded-lg">
            <p className="text-warning-foreground text-sm font-medium">
              Maximum of 5 URLs can be shortened at once. 
              Visit Statistics to manage your URLs.
            </p>
          </div>
        )}

        <div className="text-center text-xs text-muted-foreground">
          {existingCount}/5 URLs created
        </div>
      </form>
    </Card>
  );
};