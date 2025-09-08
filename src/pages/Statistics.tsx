import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { URLRecord } from '../types/url';
import { getAllURLRecords } from '../utils/urlStorage';
import { BarChart3, MousePointerClick, Calendar, Clock, ExternalLink, Globe } from 'lucide-react';

export const Statistics = () => {
  const [records, setRecords] = useState<URLRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<URLRecord | null>(null);

  useEffect(() => {
    const loadRecords = () => {
      const allRecords = getAllURLRecords();
      setRecords(allRecords);
    };

    loadRecords();
    
    // Refresh every 30 seconds to show updated click counts
    const interval = setInterval(loadRecords, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalClicks = records.reduce((sum, record) => sum + record.clicks.length, 0);
  const activeUrls = records.filter(record => new Date() < record.expiryDate).length;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">URL Statistics</h1>
          <p className="text-muted-foreground">
            Track and analyze your shortened URLs performance
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 material-elevation-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary text-primary-foreground rounded-lg">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{records.length}</p>
                <p className="text-muted-foreground">Total URLs</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 material-elevation-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-success text-success-foreground rounded-lg">
                <MousePointerClick className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalClicks}</p>
                <p className="text-muted-foreground">Total Clicks</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 material-elevation-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-warning text-warning-foreground rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeUrls}</p>
                <p className="text-muted-foreground">Active URLs</p>
              </div>
            </div>
          </Card>
        </div>

        {records.length === 0 ? (
          <Card className="p-12 text-center material-elevation-1">
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Statistics Available
            </h3>
            <p className="text-muted-foreground">
              Start shortening URLs to see analytics and statistics here.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* URL List */}
            <Card className="p-6 material-elevation-2">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                All Shortened URLs
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {records.map((record) => {
                  const isExpired = new Date() > record.expiryDate;
                  const shortUrl = `${window.location.origin}/${record.shortCode}`;
                  
                  return (
                    <div
                      key={record.id}
                      className={`p-4 border border-border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                        selectedRecord?.id === record.id ? 'bg-accent' : ''
                      } ${isExpired ? 'opacity-60' : ''}`}
                      onClick={() => setSelectedRecord(record)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-medium text-foreground truncate">
                              {shortUrl}
                            </p>
                            {isExpired && (
                              <span className="px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded-full">
                                Expired
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {record.originalUrl}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <MousePointerClick className="w-3 h-3 mr-1" />
                              {record.clicks.length} clicks
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {record.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Detailed Statistics */}
            <Card className="p-6 material-elevation-2">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Detailed Analytics
              </h3>
              
              {!selectedRecord ? (
                <div className="text-center py-8">
                  <MousePointerClick className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">
                    Select a URL from the list to view detailed analytics
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">URL Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Short URL:</span>
                        <span className="font-medium text-foreground">
                          {window.location.origin}/{selectedRecord.shortCode}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Created:</span>
                        <span className="font-medium text-foreground">
                          {formatDate(selectedRecord.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Expires:</span>
                        <span className="font-medium text-foreground">
                          {formatDate(selectedRecord.expiryDate)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Total Clicks:</span>
                        <span className="font-medium text-foreground">
                          {selectedRecord.clicks.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedRecord.clicks.length > 0 && (
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Recent Clicks</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {selectedRecord.clicks.slice(-10).reverse().map((click, index) => (
                          <div key={index} className="flex items-center justify-between py-2 px-3 bg-muted rounded-lg text-sm">
                            <div className="flex items-center space-x-2">
                              <Globe className="w-4 h-4 text-muted-foreground" />
                              <span className="text-foreground">
                                {click.source || 'Direct'}
                              </span>
                            </div>
                            <span className="text-muted-foreground">
                              {formatDate(click.timestamp)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border">
                    <a
                      href={selectedRecord.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:text-primary-hover text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Original URL
                    </a>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};