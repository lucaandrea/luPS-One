import { SaveModal } from '@/components/SaveModal/SaveModal';

interface MetalGearSlotProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define slot data separately from component
const slotData = {
  title1: "Metal Gear",
  title2: "Ops Archive",
  thumbnailSrc: "/assets/slots/metal-gear.png",
  appId: "metal-gear",
};

// Export it separately for better compatibility with Fast Refresh
export const MetalGearSlotData = slotData;

export function MetalGearSlot({ isOpen, onClose }: MetalGearSlotProps) {
  return (
    <SaveModal
      title1={MetalGearSlotData.title1}
      title2={MetalGearSlotData.title2}
      isOpen={isOpen}
      onClose={onClose}
      appId={MetalGearSlotData.appId as any}
    >
      <div className="bg-black text-green-400 font-mono p-4 rounded-md">
        <div className="border border-green-400 p-4 mb-4">
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 bg-green-400 mr-2"></div>
            <h3 className="text-xl font-bold">CODEC TRANSMISSION</h3>
          </div>
          <div className="text-xs mb-2">SUBJECT: AGENT PROFILE - LUCA COLLINS</div>
          <div className="text-xs mb-4">CLASSIFICATION: TOP SECRET</div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l-2 border-green-400 pl-4">
              <h4 className="text-green-400 font-bold mb-2">LEBANON 1992-1995</h4>
              <p className="text-sm text-green-300">
                Earliest memories formed against backdrop of conflict. 
                The constant sounds of fighter jets and artillery created unusual 
                soundscape of childhood. Reports indicate subject developed 
                advanced pattern recognition at young age.
              </p>
            </div>
            
            <div className="border-l-2 border-green-400 pl-4">
              <h4 className="text-green-400 font-bold mb-2">KOSOVO 1998-2000</h4>
              <p className="text-sm text-green-300">
                Teenage years coincided with Kosovo War. Exposed to international 
                news coverage and humanitarian relief discussions. Developed 
                interest in global politics and language acquisition.
              </p>
            </div>
            
            <div className="border-l-2 border-green-400 pl-4">
              <h4 className="text-green-400 font-bold mb-2">IRAQ 2003-2005</h4>
              <p className="text-sm text-green-300">
                Iraq War during critical identity-forming years. Subject became 
                increasingly interested in global politics and business impacts 
                of international conflicts. Early signs of entrepreneurial tendencies.
              </p>
            </div>
          </div>
        </div>
          
        <div className="text-xs text-green-200 mb-4">
          TRANSMISSION BEGINS...
        </div>
        
        {/* Typewriter effect simulation */}
        <div className="font-mono text-sm leading-relaxed">
          <p className="mb-2">&gt; Childhood exposure to conflict zones shaped unique perspective.</p>
          <p className="mb-2">&gt; Subject demonstrates unusual comfort with chaos and uncertainty.</p>
          <p className="mb-2">&gt; Multilingual capabilities developed as survival mechanism.</p>
          <p className="mb-2">&gt; Analytical patterns suggest connection between early experiences and later entrepreneurial ventures.</p>
          <p className="mb-2 blink-cursor">&gt; "Sirens make odd lullabies." - AGENT QUOTE</p>
        </div>
        
        <div className="text-xs text-green-200 mt-4">
          END TRANSMISSION
        </div>
      </div>
      
      {/* Static CSS for Metal Gear screen */}
      <style jsx>{`
        .blink-cursor::after {
          content: '_';
          animation: blink 1s step-end infinite;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </SaveModal>
  );
}