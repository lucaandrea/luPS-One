import { SaveModal } from '@/components/SaveModal/SaveModal';
import { useSound, Sounds } from '@/hooks/useSound';

interface NeedForSpeedSlotProps {
  isOpen: boolean;
  onClose: () => void;
  openDemoDisc?: () => void; // Function to open demo disc slot
}

// Define slot data separately from component
const slotData = {
  title1: "Need for Speed",
  title2: "Prototype Garage",
  thumbnailSrc: "/assets/slots/need-for-speed.png",
  appId: "need-for-speed",
};

// Export it separately for better compatibility with Fast Refresh
export const NeedForSpeedSlotData = slotData;

export function NeedForSpeedSlot({ isOpen, onClose, openDemoDisc }: NeedForSpeedSlotProps) {
  const { play: playButton } = useSound(Sounds.BUTTON_CLICK, 0.4);
  
  const handleOpenDemoDisc = () => {
    if (openDemoDisc) {
      playButton();
      onClose(); // Close this modal first
      
      // Open the demo disc with a small delay for better UX
      setTimeout(() => {
        openDemoDisc();
      }, 300);
    }
  };
  
  return (
    <SaveModal
      title1={NeedForSpeedSlotData.title1}
      title2={NeedForSpeedSlotData.title2}
      isOpen={isOpen}
      onClose={onClose}
      appId={NeedForSpeedSlotData.appId as any}
    >
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-ps-red via-ps-amber to-ps-green p-0.5 rounded-xl">
          <div className="bg-gray-900 p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-white mb-6">Prototype Gallery</h2>
            
            <p className="text-xl text-gray-300 mb-8">
              Explore Luca's prototype projects and experimental builds in the
              <span className="text-ps-cyan font-bold mx-1">Demo Disc</span> gallery.
            </p>
            
            <div className="grid grid-cols-3 gap-8 mb-8">
              <div className="aspect-square bg-black/40 rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src="/assets/slots/demos/crewai.gif" 
                  alt="CrewAI Tester"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              <div className="aspect-square bg-black/40 rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src="/assets/slots/demos/notesgpt.gif" 
                  alt="NotesGPT"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              <div className="aspect-square bg-black/40 rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src="/assets/slots/demos/prompt-bible.gif" 
                  alt="Prompt Bible"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            
            <button
              onClick={handleOpenDemoDisc}
              disabled={!openDemoDisc}
              className={`
                px-8 py-4 rounded-lg text-lg font-bold shadow-lg
                ${openDemoDisc 
                  ? 'bg-gradient-to-r from-ps-red to-ps-amber text-white cursor-pointer hover:shadow-xl hover:scale-105 transition-transform'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
              `}
            >
              Open Demo Disc
            </button>
            
            {!openDemoDisc && (
              <p className="text-gray-500 mt-4 text-sm">
                (Demo disc navigation is not available in this session)
              </p>
            )}
          </div>
        </div>
      </div>
    </SaveModal>
  );
}