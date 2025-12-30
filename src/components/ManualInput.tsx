import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ManualInputProps {
  onAnalyze: (url: string) => void;
}

export function ManualInput({ onAnalyze }: ManualInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
      setUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Enter URL to analyze..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 font-mono text-sm"
      />
      <Button type="submit" disabled={!url.trim()}>
        <Search className="w-4 h-4 mr-2" />
        Analyze
      </Button>
    </form>
  );
}
