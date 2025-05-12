import { useEffect } from 'react';
import { SaveModal } from '@/components/SaveModal/SaveModal';
import { useSound } from '@/hooks/useSound';

interface FifaSlotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FifaSlotData = {
  title1: "FIFA '98",
  title2: "Pitch & Play",
  thumbnailSrc: "/assets/slots/fifa.png",
  appId: "fifa",
};

export function FifaSlot({ isOpen, onClose }: FifaSlotProps) {
  const { play: playChant } = useSound("/sounds/stadium-chant.ogg", 0.4);
  
  useEffect(() => {
    // Play stadium chant sound effect when modal opens
    if (isOpen) {
      playChant();
    }
  }, [isOpen, playChant]);
  
  return (
    <SaveModal
      title1={FifaSlotData.title1}
      title2={FifaSlotData.title2}
      isOpen={isOpen}
      onClose={onClose}
      appId={FifaSlotData.appId as any}
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Bio Section */}
        <div className="flex-1">
          <h2 className="text-ps-plastic text-xl mb-4">Player Bio</h2>
          
          <ul className="space-y-4 list-disc list-inside">
            <li>Born 1990, Toronto, Canada</li>
            <li>Speaks English / Italian</li>
            <li>Position: AI Product Strategy</li>
            <li>Team: ArkiFi FC</li>
            <li>Previous Teams: Cannabis ERP United, ZipplyTech Athletic</li>
          </ul>
          
          <div className="mt-6 text-sm text-ps-amber">
            <p>
              Press the Stadium button to hear the home crowd chant again.
            </p>
            <button
              onClick={playChant}
              className="mt-2 bg-ps-amber text-black px-4 py-2 rounded"
            >
              🔊 Stadium
            </button>
          </div>
        </div>
        
        {/* Language Skills Chart */}
        <div className="flex-1 bg-ps-crt-glass p-4 rounded-lg">
          <h3 className="text-ps-plastic text-lg mb-4">Language Skills</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>English</span>
                <span>100%</span>
              </div>
              <div className="h-4 bg-gray-700 rounded-sm">
                <div className="h-full bg-ps-green rounded-sm" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>Italian</span>
                <span>85%</span>
              </div>
              <div className="h-4 bg-gray-700 rounded-sm">
                <div className="h-full bg-ps-red rounded-sm" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>French</span>
                <span>40%</span>
              </div>
              <div className="h-4 bg-gray-700 rounded-sm">
                <div className="h-full bg-ps-amber rounded-sm" style={{ width: '40%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>JavaScript</span>
                <span>90%</span>
              </div>
              <div className="h-4 bg-gray-700 rounded-sm">
                <div className="h-full bg-ps-cyan rounded-sm" style={{ width: '90%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>Python</span>
                <span>75%</span>
              </div>
              <div className="h-4 bg-gray-700 rounded-sm">
                <div className="h-full bg-yellow-400 rounded-sm" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SaveModal>
  );
}