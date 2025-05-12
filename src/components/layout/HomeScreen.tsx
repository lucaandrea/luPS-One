import { useState, useEffect, useCallback } from "react";
import { BaseApp } from "@/apps/base/types";
import { AppId } from "@/config/appIds";

interface HomeScreenProps {
  apps: BaseApp[];
  onSelectSlot: (appId: AppId) => void;
}

// Memory card slot data as specified in the guide
interface MemoryCardSlot {
  id: string;
  title1: string;
  title2: string;
  thumbnailSrc: string;
  isDisabled?: boolean;
  appId: AppId;
}

const MEMORY_CARD_SLOTS: MemoryCardSlot[] = [
  {
    id: "slot-1",
    title1: "Gran Turismo",
    title2: "My Garage",
    thumbnailSrc: "/assets/slots/gran-turismo.png",
    appId: "gran-turismo" as AppId,
  },
  {
    id: "slot-2",
    title1: "FIFA '98",
    title2: "Pitch & Play",
    thumbnailSrc: "/assets/slots/fifa.png",
    appId: "fifa" as AppId,
  },
  {
    id: "slot-3",
    title1: "G-Police",
    title2: "War-Zone Years",
    thumbnailSrc: "/assets/slots/g-police.png",
    appId: "g-police" as AppId,
  },
  {
    id: "slot-4",
    title1: "Parappa",
    title2: "Cannabis ERP Rap",
    thumbnailSrc: "/assets/slots/parappa.png",
    appId: "parappa" as AppId,
  },
  {
    id: "slot-5",
    title1: "Metal Gear",
    title2: "ArkiFi Ops",
    thumbnailSrc: "/assets/slots/metal-gear.png",
    appId: "metal-gear" as AppId,
  },
  {
    id: "slot-6",
    title1: "Driver",
    title2: "Zipply Alpha",
    thumbnailSrc: "/assets/slots/driver.png",
    appId: "driver" as AppId,
  },
  {
    id: "slot-7",
    title1: "Demo Disc",
    title2: "Prototype Gallery",
    thumbnailSrc: "/assets/slots/demo-disc.png",
    appId: "demo-disc" as AppId,
  },
  {
    id: "slot-8",
    title1: "Empty slot",
    title2: "Insert Card",
    thumbnailSrc: "/assets/slots/empty-slot.png",
    isDisabled: true,
    appId: "empty" as AppId,
  },
];

export function HomeScreen({ apps, onSelectSlot }: HomeScreenProps) {
  const [focusedSlotIndex, setFocusedSlotIndex] = useState(0);
  const [isKonamiActive, setIsKonamiActive] = useState(false);
  const [konamiTimeout, setKonamiTimeout] = useState<number | null>(null);
  
  // Handles keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
        setFocusedSlotIndex(prev => (prev >= 4) ? prev - 4 : prev);
        break;
      case "ArrowDown":
        setFocusedSlotIndex(prev => (prev < 4) ? prev + 4 : prev);
        break;
      case "ArrowLeft":
        setFocusedSlotIndex(prev => (prev % 4 === 0) ? prev : prev - 1);
        break;
      case "ArrowRight":
        setFocusedSlotIndex(prev => (prev % 4 === 3) ? prev : prev + 1);
        break;
      case "Enter":
      case "x":
      case "X":
        // Trigger select action if not disabled
        const slot = MEMORY_CARD_SLOTS[focusedSlotIndex];
        if (!slot.isDisabled) {
          onSelectSlot(slot.appId);
        }
        break;
      default:
        break;
    }
  }, [focusedSlotIndex, onSelectSlot]);
  
  // Konami code sequence handling
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  
  const checkKonamiCode = useCallback((key: string) => {
    const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    
    setKonamiSequence(prev => {
      const newSequence = [...prev, key].slice(-konamiCode.length);
      
      // Check if the sequence matches the Konami code
      if (newSequence.join(",") === konamiCode.join(",")) {
        // Activate Dreamcast mode for 15 seconds
        setIsKonamiActive(true);
        
        // Clear existing timeout if there is one
        if (konamiTimeout) {
          window.clearTimeout(konamiTimeout);
        }
        
        // Set a new timeout to deactivate after 15 seconds
        const timeout = window.setTimeout(() => {
          setIsKonamiActive(false);
        }, 15000);
        
        setKonamiTimeout(timeout);
        
        // Reset sequence after successful activation
        return [];
      }
      
      return newSequence;
    });
  }, [konamiTimeout]);
  
  useEffect(() => {
    // Check all key presses for Konami code
    const handleKeyPress = (e: KeyboardEvent) => {
      checkKonamiCode(e.key);
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keydown", handleKeyPress);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keydown", handleKeyPress);
      if (konamiTimeout) {
        window.clearTimeout(konamiTimeout);
      }
    };
  }, [handleKeyDown, checkKonamiCode, konamiTimeout]);
  
  return (
    <div className="ps-crt absolute inset-0 flex items-center justify-center bg-black">
      <div className="ps-noise" aria-hidden="true"></div>
      
      <div className={`relative flex flex-col items-center z-10 ${isKonamiActive ? 'dreamcast-mode' : ''}`}>
        {/* Title */}
        <h1 className="text-4xl text-ps-plastic mb-8">MEMORY CARD</h1>
        
        {/* Slots grid */}
        <div className="grid grid-cols-4 gap-4 max-w-4xl">
          {MEMORY_CARD_SLOTS.map((slot, index) => (
            <div 
              key={slot.id}
              className={`ps-memory-card w-48 h-48 p-4 flex flex-col items-center cursor-pointer transition ${
                focusedSlotIndex === index ? 'ps-glow' : ''
              } ${slot.isDisabled ? 'opacity-60 cursor-not-allowed animate-pulse' : ''}`}
              onClick={() => {
                if (!slot.isDisabled) {
                  setFocusedSlotIndex(index);
                  onSelectSlot(slot.appId);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !slot.isDisabled) {
                  onSelectSlot(slot.appId);
                }
              }}
              tabIndex={slot.isDisabled ? -1 : 0}
              role="button"
              aria-label={`Open Slot ${index + 1} - ${slot.title1}`}
            >
              <img 
                src={slot.thumbnailSrc} 
                alt={slot.title1} 
                className="w-24 h-24 mb-2 object-contain"
              />
              <h2 className="text-center text-sm font-bold mb-1">{slot.title1}</h2>
              <p className="text-center text-xs text-gray-700 uppercase">{slot.title2}</p>
            </div>
          ))}
        </div>
        
        {/* Navigation help */}
        <div className="mt-8 flex items-center gap-4 text-ps-plastic">
          <span className="border border-ps-plastic px-2">▲</span>
          <span className="border border-ps-plastic px-2">▼</span>
          <span className="border border-ps-plastic px-2">◀</span>
          <span className="border border-ps-plastic px-2">▶</span>
          <span className="ml-4">
            <span className="border border-ps-plastic px-2 mx-1">X</span> 
            Select
          </span>
          <span>
            <span className="border border-ps-plastic px-2 mx-1">□</span> 
            Back
          </span>
        </div>
      </div>
      
      {/* Dreamcast mode styles */}
      {isKonamiActive && (
        <style jsx global>{`
          .dreamcast-mode .ps-memory-card {
            background-color: #0080ff !important;
          }
          .dreamcast-mode .ps-glow {
            animation: dreamcast-glow 2s ease-in-out infinite alternate;
          }
          @keyframes dreamcast-glow {
            0% {
              box-shadow: 0 0 5px #0080ff;
            }
            50% {
              box-shadow: 0 0 8px #ff8000;
            }
            100% {
              box-shadow: 0 0 5px #0080ff;
            }
          }
        `}</style>
      )}
    </div>
  );
}