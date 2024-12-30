import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';



const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const MuseScoreDownloader = () => {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('pdf');
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, format }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Download failed');
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `score.${format}`;

      // Convert response to blob and trigger download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formats = ['pdf', 'midi', 'mp3'];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <Card className="w-full max-w-2xl bg-black border-2 border-white">
        <CardHeader className="text-center border-b-2 border-white">
          <CardTitle className="text-2xl font-mono text-white uppercase tracking-wider">
            MuseScore Downloader
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8 p-8">
          <div className="space-y-3">
            <Label htmlFor="url" className="text-lg font-mono text-white uppercase">
              URL
            </Label>
            <Input
              id="url"
              placeholder="Paste MuseScore link here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-4 bg-black border-2 border-white text-white font-mono placeholder:text-white/50 focus:ring-0 focus:border-white"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-mono text-white uppercase">Format</Label>
            <div className="flex flex-col space-y-3">
              {formats.map((value) => (
                <button
                  key={value}
                  onClick={() => setFormat(value)}
                  className={`flex items-center space-x-3 p-3 border-2 border-white transition-colors w-full text-left ${
                    format === value 
                      ? 'bg-white text-black' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <div className={`w-4 h-4 border-2 flex items-center justify-center ${
                    format === value ? 'border-black' : 'border-white'
                  }`}>
                    {format === value && <div className="w-2 h-2 bg-black" />}
                  </div>
                  <span className="font-mono uppercase">
                    {value}
                  </span>
                </button>
              ))}
            </div>
          </div>


          <Button 
            onClick={handleDownload}
            disabled={!url || isLoading}
            className="w-full p-4 text-lg bg-white text-black font-mono uppercase hover:bg-black hover:text-white border-2 border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '[ Processing... ]' : '[ Download ]'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MuseScoreDownloader;
