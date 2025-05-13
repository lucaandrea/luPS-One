import { useEffect } from 'react';
import { SaveModal } from '@/components/SaveModal/SaveModal';
import { useSound, Sounds } from '@/hooks/useSound';

interface DemoDiscSlotProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define slot data separately from component
const slotData = {
  title1: "Demo Disc",
  title2: "Prototype Gallery",
  thumbnailSrc: "/assets/slots/demo-disc.png",
  appId: "demo-disc",
};

// Define the prototypes to show in the gallery
const prototypes = [
  {
    title: "CrewAI Tester",
    description: "Multi-agent prompt experimentation platform for orchestrating AI agent workflows.",
    thumbnailSrc: "/assets/slots/demos/crewai.gif",
    url: "https://github.com/lucaandreacollins/CrewAI-Tester",
    color: "ps-red"
  },
  {
    title: "NotesGPT",
    description: "Voice-powered note-taking with real-time transcription and AI summarization.",
    thumbnailSrc: "/assets/slots/demos/notesgpt.gif",
    url: "https://github.com/lucaandreacollins/NotesGPT",
    color: "ps-amber"
  },
  {
    title: "Prompt Bible",
    description: "100+ markdown prompt patterns organized by use case with version control.",
    thumbnailSrc: "/assets/slots/demos/prompt-bible.gif",
    url: "https://github.com/lucaandreacollins/PromptBible",
    color: "ps-cyan"
  }
];

// Export it separately for better compatibility with Fast Refresh
export const DemoDiscSlotData = slotData;

export function DemoDiscSlot({ isOpen, onClose }: DemoDiscSlotProps) {
  // Use a valid sound from the Sounds constant
  const { play: playUISound } = useSound(Sounds.BUTTON_CLICK, 0.3);
  
  // Play UI sound when opened
  useEffect(() => {
    if (isOpen) {
      playUISound();
    }
  }, [isOpen, playUISound]);
  
  const handleOpenExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <SaveModal
      title1={DemoDiscSlotData.title1}
      title2={DemoDiscSlotData.title2}
      isOpen={isOpen}
      onClose={onClose}
      appId={DemoDiscSlotData.appId as any}
    >
      <div className="flex flex-col">
        <h2 className="text-ps-plastic text-xl mb-6 font-bold">Luca's Prototype Gallery</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {prototypes.map((proto, index) => (
            <div 
              key={index}
              className="bg-black/40 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform hover:scale-105 cursor-pointer"
              onClick={() => handleOpenExternal(proto.url)}
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={proto.thumbnailSrc} 
                  alt={proto.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              <div className="p-4">
                <h3 className={`text-${proto.color} font-bold mb-2`}>{proto.title}</h3>
                <p className="text-gray-300 text-sm">{proto.description}</p>
                
                <div className="mt-4 flex justify-end">
                  <span className="text-xs bg-gray-800 py-1 px-2 rounded text-gray-400 flex items-center">
                    <span className="mr-1">︎↗</span> Open
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-ps-plastic/10 rounded text-center">
          <p className="text-white">
            These prototypes represent experimental projects that may not be maintained.
            <br />
            Each opens in a new tab to the external repository.
          </p>
        </div>
      </div>
    </SaveModal>
  );
}