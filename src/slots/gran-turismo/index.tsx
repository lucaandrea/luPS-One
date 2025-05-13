import { useState } from 'react';
import { SaveModal } from '@/components/SaveModal/SaveModal';

interface GranTurismoSlotProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define slot data separately from component
const slotData = {
  title1: "Gran Turismo",
  title2: "My Garage",
  thumbnailSrc: "/assets/slots/gran-turismo.png",
  appId: "gran-turismo",
};

// Export it separately for better compatibility with Fast Refresh
export const GranTurismoSlotData = slotData;

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
              src={`/assets/slots/f80_${carRotation.toString().padStart(3, '0')}.png`}
              alt="BMW F80 M3"
              className="w-full h-full object-contain"
              loading="lazy"
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
            <h4 className="text-ps-cyan font-bold mb-2">BMW F80 M3 SPEC</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Chassis: 2017 BMW F80 M3</li>
              <li>Engine: S55B30 inline-6 twin-turbo</li>
              <li>Suspension: MCS 3-way remote-reservoir</li>
              <li>Brakes: AP Racing CP9660/372 mm + Ferodo DS2500</li>
              <li>Wheels/Tyres: Forgeline 18" + Eagle F1 SC3 285/30</li>
              <li>Aero: OEM M-Perf carbon caps/diffuser/spoiler</li>
              <li>Interior: Sparco QRT-C carbon bucket</li>
              <li>Exhaust: Armytrix remote-valve</li>
            </ul>

            <details className="mt-4 bg-ps-crt-glass/20 p-2 rounded-md">
              <summary className="text-ps-amber font-bold cursor-pointer">Audi RS4 (B7) Daytona Grey</summary>
              <div className="p-2 mt-2">
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[0, 90, 180, 270].map((angle) => (
                    <img
                      key={angle}
                      src={`/assets/slots/rs4_${angle}.png`}
                      alt={`Audi RS4 B7 at ${angle}°`}
                      className="w-full h-auto object-contain"
                      loading="lazy"
                    />
                  ))}
                </div>
                <ul className="list-disc list-inside space-y-1 text-ps-green">
                  <li>JHM 2.75" X-pipe cat-back</li>
                  <li>GruppeM FRI-0194 intake</li>
                  <li className="text-gray-400 italic mt-2">
                    OEM 4.2 L NA V8 lineage note "shared DNA with Lamborghini Gallardo / Audi R8"
                  </li>
                </ul>
              </div>
            </details>
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