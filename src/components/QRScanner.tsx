import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, Upload, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface QRScannerProps {
  onScan: (data: string) => void;
  isActive: boolean;
  onToggle: () => void;
}

export function QRScanner({ onScan, isActive, onToggle }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setIsProcessingFile(true);
    setError(null);

    try {
      const html5QrCode = new Html5Qrcode('qr-file-reader');
      const result = await html5QrCode.scanFile(file, true);
      onScan(result);
      html5QrCode.clear();
    } catch (err) {
      console.error('Error scanning file:', err);
      setError('No QR code found in the image. Please try another image.');
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="relative">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="w-4 h-4" />
            Upload Image
          </TabsTrigger>
          <TabsTrigger value="camera" className="gap-2">
            <Camera className="w-4 h-4" />
            Use Camera
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          {/* Hidden div for file scanning */}
          <div id="qr-file-reader" className="hidden" />
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            className={cn(
              'relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer',
              dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
              'bg-card'
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="w-full py-16 flex flex-col items-center justify-center p-8">
              {isProcessingFile ? (
                <>
                  <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-muted-foreground text-sm">Scanning QR code...</p>
                </>
              ) : (
                <>
                  <div className={cn(
                    'p-4 rounded-full mb-4 transition-colors',
                    dragActive ? 'bg-primary/20' : 'bg-muted'
                  )}>
                    <ImageIcon className={cn(
                      'w-10 h-10',
                      dragActive ? 'text-primary' : 'text-muted-foreground'
                    )} />
                  </div>
                  <p className="text-foreground font-medium mb-2">
                    {dragActive ? 'Drop image here' : 'Upload QR Code Image'}
                  </p>
                  <Button variant="outline" size="sm" className="gap-2 mb-3">
                    <Upload className="w-4 h-4" />
                    Browse & Upload
                  </Button>
                  <p className="text-muted-foreground text-xs">
                    Select an image file containing a QR code (JPG, PNG, etc.)
                  </p>
                </>
              )}
            </div>

            {error && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-destructive/10">
                <p className="text-destructive text-sm text-center">{error}</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="camera">
          <div
            className={cn(
              'relative overflow-hidden rounded-xl border-2 transition-all duration-300',
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
