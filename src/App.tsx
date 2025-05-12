import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { BootScreen } from "./components/dialogs/BootScreen";
import { HomeScreen } from "./components/layout/HomeScreen";
import { GranTurismoSlot } from "./slots/gran-turismo";
import { FifaSlot } from "./slots/fifa";
import { GPolicySlot } from "./slots/g-police";
import { AppId } from "./config/appIds";

// CRT overlay component
function CRTOverlay({ disabled = false }) {
  if (disabled) return null;

  return (
    <>
      <div className="ps-crt" aria-hidden="true"></div>
      <div className="ps-noise" aria-hidden="true"></div>
    </>
  );
}

function App() {
  const [showBootScreen, setShowBootScreen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<AppId | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check if it's the first visit
  useEffect(() => {
    const hasSeenBoot = localStorage.getItem('lupsOneBootSeen') === 'true';

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReducedMotion);

    // Only show boot screen on first visit and if not preferring reduced motion
    if (!hasSeenBoot && !prefersReducedMotion) {
      setShowBootScreen(true);
    }
  }, []);

  // Handle Konami code for replaying boot screen
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Reset if the key doesn't match what we're looking for
      if (e.key !== konamiCode[konamiIndex]) {
        konamiIndex = 0;
        return;
      }

      // Move to the next key in the sequence
      konamiIndex++;

      // If the entire code is entered, show boot screen
      if (konamiIndex === konamiCode.length) {
        setShowBootScreen(true);
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handle slot selection
  const handleSelectSlot = (appId: AppId) => {
    setActiveSlot(appId);
  };

  // Render slot content based on active slot
  const renderSlotContent = () => {
    switch (activeSlot) {
      case 'gran-turismo':
        return <GranTurismoSlot isOpen={true} onClose={() => setActiveSlot(null)} />;
      case 'fifa':
        return <FifaSlot isOpen={true} onClose={() => setActiveSlot(null)} />;
      case 'g-police':
        return <GPolicySlot isOpen={true} onClose={() => setActiveSlot(null)} />;
      // Add other slots as they're implemented
      default:
        return null;
    }
  };

  if (showBootScreen) {
    return (
      <BootScreen
        isOpen={true}
        onOpenChange={() => {}}
        onBootComplete={() => {
          setShowBootScreen(false);
        }}
      />
    );
  }

  return (
    <>
      <CRTOverlay disabled={reducedMotion} />
      <HomeScreen apps={[]} onSelectSlot={handleSelectSlot} />
      {renderSlotContent()}
      <Toaster position="bottom-left" offset={`calc(env(safe-area-inset-bottom, 0px) + 32px)`} />
    </>
  );
}

export default App;
