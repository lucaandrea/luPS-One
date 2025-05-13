import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useSound, preloadSounds } from '@/hooks/useSound';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

// Dynamically import Three.js boot component only if needed
const PS1BootAnimation = lazy(() => import('./PS1BootAnimation'));

interface PS1BootScreenProps {
  isOpen: boolean;
  onClose: () => void;
  reducedMotion?: boolean;
}

export function PS1BootScreen({ isOpen, onClose, reducedMotion = false }: PS1BootScreenProps) {
  const [audioPlayed, setAudioPlayed] = useState(false);
  // Use PS1_Startup.mp3 at 0dB (full volume) as specified in guide
  const { play } = useSound("/sounds/PS1_Startup.mp3", 1.0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioPreloadedRef = useRef(false);

  // Preload the boot sound for more reliable playback
  useEffect(() => {
    if (!audioPreloadedRef.current) {
      preloadSounds(["/sounds/PS1_Startup.mp3"]); 
      audioPreloadedRef.current = true;
    }
  }, []);

  // Handle boot audio and timing
  const handleAudioPlay = () => {
    if (!audioPlayed) {
      // Play immediately without setTimeout as per guide part 3
      play();
      setAudioPlayed(true);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      // If reduced motion is enabled, skip directly to end
      if (reducedMotion) {
        timeoutRef.current = setTimeout(() => {
          localStorage.setItem('lupsOneBootSeen', 'true');
          onClose();
        }, 100);
      } else {
        // Set timeout for auto-close after boot sequence (6 seconds)
        timeoutRef.current = setTimeout(() => {
          localStorage.setItem('lupsOneBootSeen', 'true');
          onClose();
        }, 6000); // Match the exact 6000ms timing from the guide
      }
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, onClose, reducedMotion]);
  
  // If not open or using reduced motion, return null
  if (!isOpen) return null;
  if (reducedMotion) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <VisuallyHidden>
          <p>PlayStation boot animation skipped due to reduced motion preference</p>
        </VisuallyHidden>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <Suspense fallback={<div className="w-full h-full bg-black" />}>
        <PS1BootAnimation onAudioTrigger={handleAudioPlay} />
      </Suspense>
      
      {/* Konami re-play feature is kept via this skip button */}
      <button 
        className="sr-only focus:not-sr-only absolute bottom-4 left-4 text-white underline p-2 bg-black/50 rounded"
        onClick={() => {
          localStorage.setItem('lupsOneBootSeen', 'true');
          onClose();
        }}
        aria-label="Skip PlayStation boot animation"
      >
        Skip Animation
      </button>
    </div>
  );
}

export default PS1BootScreen;