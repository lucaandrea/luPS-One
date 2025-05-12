import { useState } from 'react';
import { SaveModal } from '@/components/SaveModal/SaveModal';

interface GranTurismoSlotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GranTurismoSlotData = {
  title1: "Gran Turismo",
  title2: "My Garage",
  thumbnailSrc: "/assets/slots/gran-turismo.png",
  appId: "gran-turismo",
};

export function GranTurismoSlot({ isOpen, onClose }: GranTurismoSlotProps) {
  const [carRotation, setCarRotation] = useState(0);
  
  // Handle car rotation via arrow keys
  const rotateLeft = () => {
    setCarRotation((prev) => (prev - 45) % 360);
  };
  
  const rotateRight = () => {
    setCarRotation((prev) => (prev + 45) % 360);
  };
  
  return (
    <SaveModal
      title1={GranTurismoSlotData.title1}
      title2={GranTurismoSlotData.title2}
      isOpen={isOpen}
      onClose={onClose}
      appId={GranTurismoSlotData.appId as any}
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* 360° Car Turntable */}
        <div className="flex-1 flex flex-col items-center">
          <h2 className="text-ps-plastic text-xl mb-4">BMW F80 M3</h2>
          <div className="relative w-full h-64 bg-gradient-to-b from-gray-900 to-black rounded-lg">
            <img 
              src={`/assets/slots/f80-${carRotation}.png`}
              alt="BMW F80 M3"
              className="w-full h-full object-contain"
              style={{ transform: `rotate(${carRotation}deg)` }}
            />
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <button 
                onClick={rotateLeft}
                className="bg-ps-plastic text-black px-3 py-1 rounded-sm"
              >
                ◀
              </button>
              <button 
                onClick={rotateRight}
                className="bg-ps-plastic text-black px-3 py-1 rounded-sm"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
        
        {/* Spec Sheet */}
        <div className="flex-1 bg-ps-crt-glass p-4 rounded-lg">
          <h3 className="text-ps-plastic text-lg mb-2">Specification Sheet</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Base Model:</span>
              <span className="text-ps-cyan font-mono">BMW M3 F80</span>
            </div>
            <div className="flex justify-between">
              <span>Engine:</span>
              <span className="text-ps-cyan font-mono">S55B30 3.0L Inline-6 Twin-Turbo</span>
            </div>
            <div className="flex justify-between">
              <span>Power:</span>
              <span className="text-ps-amber font-mono">500+ HP / 650+ NM</span>
            </div>
            <div className="flex justify-between">
              <span>0-60 mph:</span>
              <span className="text-ps-amber font-mono">3.2 seconds</span>
            </div>
            
            <h4 className="text-ps-red mt-4 mb-2">Modifications</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>KW Clubsport Coilovers</li>
              <li>GTS Carbon Aero Package</li>
              <li>Akrapovič Evolution Line Titanium</li>
              <li>BBS FI-R Wheels 19"</li>
              <li>Michelin Pilot Sport Cup 2 Tires</li>
              <li>M Performance Carbon Steering Wheel</li>
              <li>Eventuri Carbon Intake System</li>
            </ul>
          </div>
          
          <div className="mt-6 p-2 border-l-4 border-ps-amber bg-black/50">
            <p className="italic text-ps-amber">
              "I tune for grip, not grip-tape."
            </p>
          </div>
        </div>
      </div>
    </SaveModal>
  );
}