import { URLRecord, ClickRecord } from '../types/url';

const STORAGE_KEY = 'url_shortener_data';

export const saveURLRecord = (record: URLRecord): void => {
  const existing = getAllURLRecords();
  const updated = [...existing, record];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getAllURLRecords = (): URLRecord[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const records = JSON.parse(stored).map((record: any) => ({
      ...record,
      createdAt: new Date(record.createdAt),
      expiryDate: new Date(record.expiryDate),
      clicks: record.clicks.map((click: any) => ({
        ...click,
        timestamp: new Date(click.timestamp)
      }))
    }));
    return records;
  } catch {
    return [];
  }
};

export const getURLByShortCode = (shortCode: string): URLRecord | null => {
  const records = getAllURLRecords();
  return records.find(record => record.shortCode === shortCode) || null;
};

export const isShortCodeTaken = (shortCode: string): boolean => {
  return getURLByShortCode(shortCode) !== null;
};

export const addClickToURL = (shortCode: string, clickData: ClickRecord): void => {
  const records = getAllURLRecords();
  const recordIndex = records.findIndex(record => record.shortCode === shortCode);
  
  if (recordIndex !== -1) {
    records[recordIndex].clicks.push(clickData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
};

export const generateShortCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  do {
    result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (isShortCodeTaken(result));
  
  return result;
};

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidShortCode = (shortCode: string): boolean => {
  return /^[a-zA-Z0-9]{3,10}$/.test(shortCode);
};