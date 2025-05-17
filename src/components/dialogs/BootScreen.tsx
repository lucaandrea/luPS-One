import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useSound, Sounds } from "@/hooks/useSound";

interface BootScreenProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBootComplete?: () => void;
  title?: string;
}

export function BootScreen({
  isOpen,
  onOpenChange,
  onBootComplete,
  title = "System Restoring...",
}: BootScreenProps) {
  const { play } = useSound(Sounds.BOOT, 0.5);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let interval: number;
    let timer: number;
    let soundTimer: number;
    
    if (isOpen) {
      // Play boot sound with a delay
      soundTimer = window.setTimeout(() => {
        play();
      }, 100);
      
      // Simulate boot progress
      interval = window.setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 100);
      
      // Close after boot completes (2 seconds)
      timer = window.setTimeout(() => {
        window.clearInterval(interval);
        setProgress(100);
        
        // Wait a moment at 100% before completing
        const completeTimer = window.setTimeout(() => {
          onBootComplete?.();
          onOpenChange(false);
        }, 500);
        
        return () => window.clearTimeout(completeTimer);
      }, 2000);
    } else {
      setProgress(0);
    }
    
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
      window.clearTimeout(soundTimer);
    };
  }, [isOpen, play, onBootComplete, onOpenChange]);
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-[75] bg-black data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <DialogContent
          className="bg-black p-0 w-[calc(100%-24px)] border-none shadow-none max-w-md z-[80] outline-none"
          style={{ position: 'fixed', zIndex: 80 }}
        >
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
          </VisuallyHidden>
          <div className="flex flex-col items-center justify-center p-8 min-h-[300px] w-full text-white">
            <img src="/assets/ps1-logo.svg" alt="PlayStation" className="w-48 h-24" />
            <h2 className="text-[16px] font-neuebit mt-8 mb-2">{title}</h2>
            <div className="w-[50%] h-2 border border-neutral-700 rounded-sm overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </DialogContent>
      </DialogPrimitive.Portal>
    </Dialog>
  );
} 