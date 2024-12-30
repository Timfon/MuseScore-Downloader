import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

const MuseScoreDownloader = () => {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('pdf');
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const command = `npx dl-librescore@latest "${url}" -f ${format}`;
      console.log('Download command:', command);
    } catch (error) {
      console.error('Download failed:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <Card className="w-full max-w-2xl bg-black border-2 border-white [image-rendering:pixelated]">
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
            <RadioGroup
              value={format}
              onValueChange={setFormat}
              className="flex flex-col space-y-3"
            >
              {['pdf', 'midi', 'mp3'].map((value) => (
                <div key={value} className="flex items-center space-x-3 p-3 border-2 border-white hover:bg-white hover:text-black transition-colors">
                  <RadioGroupItem value={value} id={value} className="border-white" />
                  <Label htmlFor={value} className="font-mono uppercase cursor-pointer">
                    {value}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2 text-base text-white font-mono p-4 border-2 border-white">
            <AlertCircle size={20} />
            <span className="uppercase text-sm">Requires Node.js</span>
          </div>

          <Button 
            onClick={handleDownload}
            disabled={!url || isLoading}
            className="w-full p-4 text-lg bg-white text-black font-mono uppercase hover:bg-black hover:text-white border-2 border-white transition-colors"
          >
            {isLoading ? '[ Processing... ]' : '[ Download ]'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MuseScoreDownloader;
