export interface URLRecord {
  id: string;
  originalUrl: string;
  shortCode: string;
  customShortCode?: string;
  validityMinutes: number;
  createdAt: Date;
  expiryDate: Date;
  clicks: ClickRecord[];
}

export interface ClickRecord {
  timestamp: Date;
  source: string;
  location: string;
}

export interface URLFormData {
  url: string;
  validity: number;
  customShortCode?: string;
}