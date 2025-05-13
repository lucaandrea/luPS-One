import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useSound, Sounds, preloadSounds } from "@/hooks/useSound";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
  const { play } = useSound(Sounds.BOOT, 0.8);
  const [step, setStep] = useState(0);
  const [bgColor, setBgColor] = useState("black");
  const [sceDiamondScale, setSceDiamondScale] = useState(0.5);
  const prefersReducedMotion = useReducedMotion();
  const audioPreloaded = useRef(false);

  // Preload audio to ensure it plays at the exact time needed
  useEffect(() => {
    if (!audioPreloaded.current) {
      preloadSounds([Sounds.BOOT]);
      audioPreloaded.current = true;
    }
  }, []);

  useEffect(() => {
    let timers: number[] = [];

    if (isOpen) {
      // For users who prefer reduced motion, skip animation and go straight to completion
      if (prefersReducedMotion) {
        localStorage.setItem('lupsOneBootSeen', 'true');
        onBootComplete?.();
        onOpenChange(false);
        return;
      }

      // Grey flash starts at 200ms
      timers.push(window.setTimeout(() => {
        setBgColor("#303030"); // Start grey transition
      }, 200));

      // Grey reaches #808080 by 500ms
      timers.push(window.setTimeout(() => {
        setBgColor("#808080");
        setStep(1); // Show SCE diamond
      }, 500));

      // SCE diamond scales from 50% to 100% between 500-1000ms
      const scaleDuration = 500; // 500ms for scaling
      const scaleStartTime = 500;
      const scaleFrames = 20; // Number of frames for smooth animation
      const scaleIncrement = 0.5 / scaleFrames; // From 0.5 to 1.0

      for (let i = 1; i <= scaleFrames; i++) {
        const timePoint = scaleStartTime + (i * (scaleDuration / scaleFrames));
        timers.push(window.setTimeout(() => {
          setSceDiamondScale(0.5 + (i * scaleIncrement));
        }, timePoint));
      }

      // At exactly 3000ms, PlayStation logo and sound
      timers.push(window.setTimeout(() => {
        play(); // Play PS1 startup sound
        setStep(2); // Show PlayStation logo
      }, 3000));

      // Briefly flash white after PS logo appears
      timers.push(window.setTimeout(() => {
        setBgColor("white");

        // Quickly back to black
        timers.push(window.setTimeout(() => {
          setBgColor("black");
        }, 80));
      }, 3100));

      // At 6500ms (total boot sequence length), fade to home screen
      timers.push(window.setTimeout(() => {
        // Store boot flag in localStorage
        localStorage.setItem('lupsOneBootSeen', 'true');

        // Complete boot sequence
        onBootComplete?.();
        onOpenChange(false);
      }, 6500));
    }

    return () => {
      timers.forEach(timer => window.clearTimeout(timer));
    };
  }, [isOpen, play, onBootComplete, onOpenChange, prefersReducedMotion]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-[75] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: bgColor,
            transition: bgColor === "white" ? "none" : "background-color 300ms ease-out"
          }}
        />
        <DialogContent
          className="bg-transparent w-full h-full border-none max-w-none z-[80] outline-none"
          style={{ position: 'fixed', zIndex: 80 }}
          aria-describedby="ps1-boot-description"
        >
          <VisuallyHidden>
            <DialogTitle>PlayStation Boot Screen</DialogTitle>
            <div id="ps1-boot-description">PlayStation 1 boot animation in progress</div>
          </VisuallyHidden>
          <div className="flex flex-col items-center justify-center w-full h-full">
            {/* SCE Diamond - only visible in step 1+ */}
            {step >= 1 && (
              <div
                className="relative transform transition-transform"
                style={{
                  transform: `scale(${sceDiamondScale})`,
                  transition: 'transform 50ms ease-out'
                }}
                aria-hidden="true"
              >
                <div className="w-48 h-48 relative flex items-center justify-center">
                  <div className="absolute w-32 h-32 bg-white transform rotate-45"></div>
                  <span className="relative z-10 text-black font-bold text-2xl">SCE™</span>
                </div>
              </div>
            )}

            {/* PlayStation Logo - only visible in step 2+ */}
            {step >= 2 && (
              <div
                className="mt-8 transition-opacity duration-300 opacity-100"
                aria-hidden="true"
              >
                <h1 className="text-[72px] text-ps-plastic font-bold tracking-wider">
                  LUCA
                </h1>
                <div className="relative w-80 h-16 mx-auto mt-2">
                  {/* Recreate the PS swoosh with divs */}
                  <div className="absolute w-full h-4 bg-ps-red rounded-full transform -rotate-45"></div>
                  <div className="absolute w-full h-4 bg-ps-amber rounded-full transform rotate-[15deg] translate-y-2"></div>
                  <div className="absolute w-full h-4 bg-ps-cyan rounded-full transform rotate-[30deg] translate-y-4"></div>
                  <div className="absolute w-full h-4 bg-ps-green rounded-full transform rotate-[45deg] translate-y-6"></div>
                </div>
              </div>
            )}

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