import { SaveModal } from '@/components/SaveModal/SaveModal';
import { AppId } from '@/config/appIds';

interface NeedForSpeedSlotProps {
  isOpen: boolean;
  onClose: () => void;
  openDemoDisc?: () => void; // Make it optional
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
  const handleOpenDemoDisc = () => {
    onClose();
    if (openDemoDisc) {
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
      <div className="flex flex-col items-center gap-8 p-4">
        <div className="w-full max-w-2xl bg-gradient-to-r from-ps-red/50 via-ps-amber/30 to-ps-red/50 p-6 rounded-lg">
          <h2 className="text-2xl text-white font-bold mb-6 text-center">Prototype Fast Lane</h2>
          
          <p className="text-gray-200 mb-8 text-center">
            A high-speed gateway to Luca's prototype collection. Explore live demos, experiments, 
            and proof-of-concepts across AI, web, and product development.
          </p>
          
          <div className="flex flex-col items-center">
            <button
              onClick={handleOpenDemoDisc}
              className="relative bg-ps-amber hover:bg-ps-amber/90 text-black font-bold py-3 px-8 rounded-sm transform transition-transform hover:scale-105 active:scale-95"
              aria-label="Open Demo Disc prototype gallery"
            >
              <div className="absolute -inset-[2px] border border-white/50 rounded-sm pointer-events-none"></div>
              ENTER PROTOTYPE GALLERY
            </button>
            
            <p className="text-gray-300 mt-6 text-sm">
              Press <span className="bg-ps-plastic/20 text-ps-plastic rounded px-1">X</span> on the Demo Disc slot to access directly
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mt-4">
          <div className="bg-black/50 p-4 rounded-lg">
            <h3 className="text-ps-red font-bold mb-2">CrewAI Tester</h3>
            <p className="text-sm text-gray-300">
              Multi-agent prompt experimentation platform for orchestrating AI agent workflows.
            </p>
          </div>
          
          <div className="bg-black/50 p-4 rounded-lg">
            <h3 className="text-ps-amber font-bold mb-2">NotesGPT</h3>
            <p className="text-sm text-gray-300">
              Voice-powered note-taking with real-time transcription and AI summarization.
            </p>
          </div>
          
          <div className="bg-black/50 p-4 rounded-lg">
            <h3 className="text-ps-cyan font-bold mb-2">Prompt Bible</h3>
            <p className="text-sm text-gray-300">
              100+ markdown prompt patterns organized by use case with version control.
            </p>
          </div>
        </div>
      </div>
    </SaveModal>
  );
}