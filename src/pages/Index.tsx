import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { URLShortenerForm } from '@/components/URLShortenerForm';
import { URLResultsList } from '@/components/URLResultsList';
import { URLRecord } from '../types/url';
import { getAllURLRecords } from '../utils/urlStorage';

const Index = () => {
  const [records, setRecords] = useState<URLRecord[]>([]);

  useEffect(() => {
    const loadRecords = () => {
      const allRecords = getAllURLRecords();
      // Show only active URLs that haven't expired
      const activeRecords = allRecords.filter(record => new Date() < record.expiryDate);
      setRecords(activeRecords.slice(-5)); // Show last 5 active records
    };

    loadRecords();
    
    // Refresh every minute to update expiry status
    const interval = setInterval(loadRecords, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleURLCreated = (newRecord: URLRecord) => {
    setRecords(prevRecords => {
      const updated = [...prevRecords, newRecord];
      return updated.slice(-5); // Keep only last 5
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <URLShortenerForm 
          onURLCreated={handleURLCreated}
          existingCount={records.length}
        />
        <URLResultsList records={records} />
      </div>
    </Layout>
  );
};

export default Index;
