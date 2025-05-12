import { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "./components/ui/sonner";
import { HomeScreen } from "./components/layout/HomeScreen";
import { GranTurismoSlot } from "./slots/gran-turismo";
import { FifaSlot } from "./slots/fifa";
import { MetalGearSlot } from "./slots/metal-gear";
import { NeedForSpeedSlot } from "./slots/need-for-speed";
import { DriverSlot } from "./slots/driver";
import { DemoDiscSlot } from "./slots/demo-disc";
import { AppId } from "./config/appIds";

// Dynamically import the PS1 Boot Screen to reduce initial bundle size
const PS1BootScreen = lazy(() => import("./components/ps1-boot/PS1BootScreen"));

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

    // Always show boot screen on first visit (respect reduced motion setting)
    if (!hasSeenBoot) {
      setShowBootScreen(true);
      // Set the flag to prevent showing on subsequent loads
      localStorage.setItem('lupsOneBootSeen', 'true');
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
      case 'metal-gear':
        return <MetalGearSlot isOpen={true} onClose={() => setActiveSlot(null)} />;
      case 'need-for-speed':
        return <NeedForSpeedSlot isOpen={true} onClose={() => setActiveSlot(null)} openDemoDisc={() => setActiveSlot('demo-disc')} />;
      case 'driver':
        return <DriverSlot isOpen={true} onClose={() => setActiveSlot(null)} />;
      case 'demo-disc':
        return <DemoDiscSlot isOpen={true} onClose={() => setActiveSlot(null)} />;
      default:
        return null;
    }
  };

  return (
    <>
      {showBootScreen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black z-50" />}>
          <PS1BootScreen
            isOpen={true}
            onClose={() => setShowBootScreen(false)}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      )}

      <CRTOverlay disabled={reducedMotion} />
      <HomeScreen apps={[]} onSelectSlot={handleSelectSlot} />
      {renderSlotContent()}
      <Toaster position="bottom-left" offset={`calc(env(safe-area-inset-bottom, 0px) + 32px)`} />
    </>
  );
}

export default App;
