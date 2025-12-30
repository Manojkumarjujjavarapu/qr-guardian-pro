import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QRScannerProps {
  onScan: (data: string) => void;
  isActive: boolean;
  onToggle: () => void;
}

export function QRScanner({ onScan, isActive, onToggle }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  useEffect(() => {
    const startScanner = async () => {
      if (!isActive) {
        if (scannerRef.current) {
          try {
            await scannerRef.current.stop();
          } catch (err) {
            console.error('Error stopping scanner:', err);
          }
        }
        return;
      }

      setIsInitializing(true);
      setError(null);

      try {
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode('qr-reader');
        }

        await scannerRef.current.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          },
          (decodedText) => {
            onScan(decodedText);
          },
          () => {
            // Ignore scan failures
          }
        );
      } catch (err) {
        console.error('Error starting scanner:', err);
        setError('Unable to access camera. Please ensure camera permissions are granted.');
      } finally {
        setIsInitializing(false);
      }
    };

    startScanner();
  }, [isActive, onScan]);

  return (
    <div className="relative">
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border-2 transition-all duration-300',
          isActive ? 'border-primary glow-primary' : 'border-border',
          'bg-card'
        )}
      >
        <div id="qr-reader" className="w-full aspect-square relative">
          {!isActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50">
              <Camera className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-sm">Camera is off</p>
            </div>
          )}
          {isInitializing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground text-sm">Initializing camera...</p>
            </div>
          )}
          {isActive && !isInitializing && (
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute inset-0 scan-line" />
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary" />
            </div>
          )}
        </div>

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 backdrop-blur-sm">
            <p className="text-destructive text-sm text-center px-4">{error}</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <Button
          onClick={onToggle}
          variant={isActive ? 'destructive' : 'default'}
          size="lg"
          className="gap-2"
          disabled={isInitializing}
        >
          {isActive ? (
            <>
              <CameraOff className="w-5 h-5" />
              Stop Scanner
            </>
          ) : (
            <>
              <Camera className="w-5 h-5" />
              Start Scanner
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
