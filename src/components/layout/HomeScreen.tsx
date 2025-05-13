import { useState, useEffect, useCallback } from "react";
import { BaseApp } from "@/apps/base/types";
import { AppId } from "@/config/appIds";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
    title1: "Metal Gear",
    title2: "Ops Archive",
    thumbnailSrc: "/assets/slots/metal-gear.png",
    appId: "metal-gear" as AppId,
  },
  {
    id: "slot-4",
    title1: "Need for Speed",
    title2: "Prototype Garage",
    thumbnailSrc: "/assets/slots/need-for-speed.png",
    appId: "need-for-speed" as AppId,
  },
  {
    id: "slot-5",
    title1: "Parappa",
    title2: "Cannabis ERP Rap",
    thumbnailSrc: "/assets/slots/parappa.png",
    appId: "need-for-speed" as AppId, // Redirect to Need for Speed until implemented
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
    title1: "PS Chat Disc",
    title2: "Ask Luca AI",
    thumbnailSrc: "/assets/slots/chat-disc.png",
    appId: "chat-disc" as AppId,
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

export function HomeScreen({ apps: _apps, onSelectSlot }: HomeScreenProps) {
  const [focusedSlotIndex, setFocusedSlotIndex] = useState(0);
  const [isKonamiActive, setIsKonamiActive] = useState(false);
  const [konamiTimeout, setKonamiTimeout] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReducedMotion);
  }, []);
  
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
      case "Backspace":
      case "Escape":
      case "c":
      case "C":
      case "[": // Square symbol on US keyboard
        // Back action - could be used for navigation to another screen
        console.log("Back action triggered");
        break;
      default:
        break;
    }
  }, [focusedSlotIndex, onSelectSlot]);
  
  // Konami code sequence handling
  const [_konamiSequence, setKonamiSequence] = useState<string[]>([]);
  
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
              className={`ps-memory-card w-48 h-60 p-4 flex flex-col items-center cursor-pointer transition ${
                focusedSlotIndex === index ? 'transform -translate-y-2 scale-105' : ''
              } ${slot.isDisabled ? 'opacity-60 cursor-not-allowed animate-pulse' : ''}`}
              style={{
                backgroundImage: 'url(/assets/ui/mcard_plastic.png)',
                backgroundSize: 'cover',
                boxShadow: '0 0 4px #000',
              }}
              onClick={() => {
                if (!slot.isDisabled) {
                  setFocusedSlotIndex(index);
                  onSelectSlot(slot.appId);
                }
              }}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === "x" || e.key === "X") && !slot.isDisabled) {
                  onSelectSlot(slot.appId);
                }
              }}
              tabIndex={slot.isDisabled ? -1 : 0}
              role="button"
              aria-label={`Slot ${index + 1} - ${slot.title1} - ${slot.title2}`}
            >
              {/* Memory card screws */}
              <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gray-600 border border-gray-700"></div>
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gray-600 border border-gray-700"></div>

              {/* Thumbnail */}
              <img
                src={slot.thumbnailSrc}
                alt={slot.title1}
                className="w-24 h-24 mb-2 object-contain"
                loading="lazy"
              />

              {/* Title */}
              <h2 className="text-center text-sm font-bold mb-1 text-gray-800">{slot.title1}</h2>
              <p className="text-center text-xs text-gray-700 uppercase">{slot.title2}</p>

              {/* LED blocks */}
              <div className="mt-4 flex gap-1">
                <div className="w-3 h-3 bg-gray-600 rounded-sm"></div>
                <div className="w-3 h-3 bg-gray-600 rounded-sm"></div>
                <div className="w-3 h-3 bg-gray-600 rounded-sm"></div>
              </div>

              {/* Focus glow effect */}
              {focusedSlotIndex === index && (
                <div className={`absolute inset-0 rounded ${reducedMotion ? 'border-2 border-white' : 'ps-glow'}`} />
              )}
            </div>
          ))}
        </div>
        
        {/* Navigation help */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-ps-plastic">
          <span className="bg-ps-plastic/20 text-ps-plastic rounded px-2 py-1">▲</span>
          <span className="bg-ps-plastic/20 text-ps-plastic rounded px-2 py-1">▼</span>
          <span className="bg-ps-plastic/20 text-ps-plastic rounded px-2 py-1">◀</span>
          <span className="bg-ps-plastic/20 text-ps-plastic rounded px-2 py-1">▶</span>
          <span className="ml-4 flex items-center">
            <span className="bg-ps-plastic/20 text-ps-plastic rounded px-2 py-1 mx-1">X</span>
            <span className="text-white">Select</span>
          </span>
          <span className="flex items-center">
            <span className="bg-ps-plastic/20 text-ps-plastic rounded px-2 py-1 mx-1">□</span>
            <span className="text-white">Back</span>
          </span>
        </div>
      </div>
      
      {/* Dreamcast mode styles */}
      {isKonamiActive && (
        <style>
          {`
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
          `}
        </style>
      )}
    </div>
  );
}

function MemoryCardSlot({ 
  slot, 
  isActive, 
  isFocused,
  onClick 
}: { 
  slot: MemoryCardSlot, 
  isActive: boolean, 
  isFocused: boolean,
  onClick: () => void 
}) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div
      className={`
        relative flex flex-col items-center justify-center 
        w-32 h-40 rounded-lg p-2 transition-all
        ${isActive ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}
        ${isFocused ? 'scale-105 -translate-y-0.5' : ''}
      `}
      tabIndex={isActive ? 0 : -1}
      onClick={isActive ? onClick : undefined}
      onKeyDown={(e) => {
        if (isActive && (e.key === 'Enter' || e.key === 'x' || e.key === 'X')) {
          onClick();
        }
      }}
      aria-label={`Slot ${slot.id.split('-')[1]} – ${slot.title1} – ${slot.title2}`}
      style={{
        backgroundImage: "url('/assets/ui/mcard_plastic.png')",
        backgroundColor: "#bdbdbd",
        backgroundSize: "cover",
        boxShadow: "0 0 4px #000"
      }}
    >
      {/* Two embossed screws at the top */}
      <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-[#a0a0a0] border border-[#909090] shadow-inner"></div>
      <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#a0a0a0] border border-[#909090] shadow-inner"></div>
      
      {/* Thumbnail */}
      <div className="w-24 h-24 mb-1 bg-black/30 overflow-hidden rounded">
        <img
          src={slot.thumbnailSrc}
          alt={`${slot.title1} ${slot.title2}`}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
      
      {/* LED indicator grid */}
      <div className="w-full px-2 flex space-x-1 mb-1">
        <div className="w-4 h-2 bg-[#8d8d8d] rounded-sm"></div>
        <div className="w-4 h-2 bg-[#8d8d8d] rounded-sm"></div>
        <div className="w-4 h-2 bg-[#8d8d8d] rounded-sm"></div>
      </div>
      
      {/* Title */}
      <div className="text-center">
        <p className="text-black text-xs font-bold leading-tight">{slot.title1}</p>
        <p className="text-black text-[10px] leading-tight">{slot.title2}</p>
      </div>
      
      {/* Focus effect */}
      {isFocused && (
        <div 
          className={`absolute inset-0 rounded-lg pointer-events-none ${prefersReducedMotion ? 'border-2 border-white' : 'ps-glow'}`}
        ></div>
      )}
    </div>
  );
}