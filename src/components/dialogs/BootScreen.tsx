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
  title = "System Boot",
}: BootScreenProps) {
  const { play } = useSound(Sounds.BOOT, 0.5);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timers: number[] = [];

    if (isOpen) {
      // Initial state (step 0) - only "LUCA" logo visible

      // At 800ms, show PS swoosh (step 1)
      timers.push(window.setTimeout(() => {
        setStep(1);
      }, 800));

      // At 1200ms, play boot chime and flash screen white (step 2)
      timers.push(window.setTimeout(() => {
        play();
        setStep(2);

        // Briefly flash white, then back to normal
        timers.push(window.setTimeout(() => {
          setStep(3);
        }, 80));
      }, 1200));

      // At 2500ms, fade to home screen
      timers.push(window.setTimeout(() => {
        // Store boot flag in localStorage
        localStorage.setItem('lupsOneBootSeen', 'true');

        // Complete boot sequence
        onBootComplete?.();
        onOpenChange(false);
      }, 2500));
    }

    return () => {
      timers.forEach(timer => window.clearTimeout(timer));
    };
  }, [isOpen, play, onBootComplete, onOpenChange]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={`fixed inset-0 z-[75] bg-black ${step === 2 ? 'bg-white' : 'bg-black'} data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <DialogContent
          className="bg-transparent w-full h-full border-none max-w-none z-[80] outline-none"
          style={{ position: 'fixed', zIndex: 80 }}
        >
          <VisuallyHidden>
            <DialogTitle>PlayStation Boot Screen</DialogTitle>
          </VisuallyHidden>
          <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="text-[72px] text-ps-plastic">LUCA</h1>

            {/* PS Swoosh - only visible in step 1+ */}
            <div
              className={`mt-4 transition-opacity duration-300 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}
              aria-hidden="true"
            >
              <div className="relative w-72 h-16">
                {/* Recreate the PS swoosh with divs */}
                <div className="absolute w-full h-4 bg-ps-red rounded-full transform -rotate-45"></div>
                <div className="absolute w-full h-4 bg-ps-amber rounded-full transform rotate-[15deg] translate-y-2"></div>
                <div className="absolute w-full h-4 bg-ps-cyan rounded-full transform rotate-[30deg] translate-y-4"></div>
                <div className="absolute w-full h-4 bg-ps-green rounded-full transform rotate-[45deg] translate-y-6"></div>
              </div>
            </div>

            {/* Skip animation link for a11y */}
            <button
              className="sr-only focus:not-sr-only mt-8 text-white underline"
              onClick={() => {
                localStorage.setItem('lupsOneBootSeen', 'true');
                onBootComplete?.();
                onOpenChange(false);
              }}
            >
              Skip Animation
            </button>
          </div>
        </DialogContent>
      </DialogPrimitive.Portal>
    </Dialog>
  );
} 