import { useEffect } from 'react';
import { SaveModal } from '@/components/SaveModal/SaveModal';
import { useSound } from '@/hooks/useSound';

interface FifaSlotProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define slot data separately from component
const slotData = {
  title1: "FIFA '98",
  title2: "Pitch & Play",
  thumbnailSrc: "/assets/slots/fifa.png",
  appId: "fifa",
};

// Export it separately for better compatibility with Fast Refresh
export const FifaSlotData = slotData;

export function FifaSlot({ isOpen, onClose }: FifaSlotProps) {
  // Use the correct sound file path as specified in the guide
  const { play: playChant } = useSound("/sounds/stadium-chant.ogg", 0.8);
  
  useEffect(() => {
    // Preload the sound when modal opens but don't auto-play
    // Let the user press the button to play the sound
  }, [isOpen]);
  
  return (
    <SaveModal
      title1={FifaSlotData.title1}
      title2={FifaSlotData.title2}
      isOpen={isOpen}
      onClose={onClose}
      appId={FifaSlotData.appId as any}
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Bio Section - Updated per guide */}
        <div className="flex-1">
          <h2 className="text-ps-plastic text-xl mb-4">Player Bio</h2>
          
          <ul className="space-y-3 list-disc list-inside">
            <li>Born 1990 — Broni, Province of Pavia, Italy</li>
            <li>Grew up in Palestine, Sarajevo, Beirut, Zagreb, Doha, Toronto, California</li>
            <li>Position: Playmaking "10" → AI Product & Strategy</li>
            <li>Current Club: ArkiFi FC (2024—)</li>
            <li>Former Clubs: Biscotti Calcio (CEO), Tutti United (CEO), Zipply Tech Athletic (Founder)</li>
          </ul>
          
          <div className="mt-6 text-sm text-ps-amber">
            <p>
              Press the button below to hear the stadium atmosphere.
            </p>
            <button
              onClick={playChant}
              className="mt-2 bg-ps-amber text-black px-4 py-2 rounded flex items-center"
              aria-label="Play crowd chant sound effect"
            >
              🔊 Crowd Chant
            </button>
          </div>
        </div>
        
        {/* Language Skills Chart - Using the percentages from guide */}
        <div className="flex-1 bg-ps-crt-glass p-4 rounded-lg">
          <h3 className="text-ps-plastic text-lg mb-4">Language Skills</h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span>Italian (native)</span>
                <span>100%</span>
              </div>
              <div className="h-4 bg-gray-700 rounded-sm">
                <div className="h-full bg-ps-red rounded-sm" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>English (native-level)</span>
                <span>100%</span>
              </div>
              <div className="h-4 bg-gray-700 rounded-sm">
                <div className="h-full bg-ps-green rounded-sm" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>French (full prof.)</span>
                <span>95%</span>
              </div>
              <div className="h-4 bg-gray-700 rounded-sm">
                <div className="h-full bg-ps-cyan rounded-sm" style={{ width: '95%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Spanish (full prof.)</span>
                <span>90%</span>
              </div>
              <div className="h-4 bg-gray-700 rounded-sm">
                <div className="h-full bg-ps-amber rounded-sm" style={{ width: '90%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Serbian (full prof.)</span>
                <span>85%</span>
              </div>
              <div className="h-4 bg-gray-700 rounded-sm">
                <div className="h-full bg-yellow-400 rounded-sm" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Arabic (limited)</span>
                <span>40%</span>
              </div>
              <div className="h-4 bg-gray-700 rounded-sm">
                <div className="h-full bg-gray-400 rounded-sm" style={{ width: '40%' }}></div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-600">
              <div className="flex justify-between mb-1">
                <span>JavaScript</span>
                <span>92%</span>
              </div>
              <div className="h-4 bg-gray-700 rounded-sm">
                <div className="h-full bg-ps-green rounded-sm" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Python</span>
                <span>85%</span>
              </div>
              <div className="h-4 bg-gray-700 rounded-sm">
                <div className="h-full bg-ps-cyan rounded-sm" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SaveModal>
  );
}