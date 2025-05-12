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

// Export it separately for better compatibility with Fast Refresh
export const DemoDiscSlotData = slotData;

// Demo project data
const DEMO_PROJECTS = [
  {
    id: 'crewai-tester',
    title: 'CrewAI Prompt Tester',
    description: 'Experiment with multi-agent prompts in a visual playground.',
    thumbnail: '/assets/slots/demos/crewai-tester.gif',
    url: 'https://github.com/example/crewai-tester', // Replace with actual URL
    tags: ['AI', 'Multi-agent', 'Python'],
    color: 'bg-ps-cyan'
  },
  {
    id: 'notesgpt',
    title: 'NotesGPT',
    description: 'Voice-powered note-taking with AI summaries and organization.',
    thumbnail: '/assets/slots/demos/notesgpt.gif',
    url: 'https://github.com/example/notesgpt', // Replace with actual URL
    tags: ['Voice', 'AI', 'Notes'],
    color: 'bg-ps-amber'
  },
  {
    id: 'prompt-bible',
    title: 'Prompt Bible',
    description: '100+ markdown prompt patterns organized by use case.',
    thumbnail: '/assets/slots/demos/prompt-bible.gif',
    url: 'https://github.com/example/prompt-bible', // Replace with actual URL
    tags: ['Prompts', 'Markdown', 'Collection'],
    color: 'bg-ps-red'
  },
  {
    id: 'zipply-dash',
    title: 'Zipply Dashboard',
    description: 'OBD data visualization for vehicle performance metrics.',
    thumbnail: '/assets/slots/demos/zipply-dash.gif',
    url: 'https://github.com/example/zipply-dash', // Replace with actual URL
    tags: ['OBD', 'Dashboard', 'React'],
    color: 'bg-ps-green'
  }
];

export function DemoDiscSlot({ isOpen, onClose }: DemoDiscSlotProps) {
  // Play a short click sound for demo disc
  const { play: playStartup } = useSound(Sounds.BUTTON_CLICK_UP, 0.3);
  
  useEffect(() => {
    if (isOpen) {
      // Play sound with slight delay
      setTimeout(() => {
        playStartup();
      }, 200);
    }
  }, [isOpen, playStartup]);
  
  const handleOpenProject = (url: string) => {
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
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="text-center mb-2">
          <div className="inline-block bg-gray-800 px-4 py-2 rounded-t-lg">
            <h2 className="text-white font-bold text-xl">PROTOTYPE GALLERY</h2>
          </div>
          <div className="w-full h-1 bg-gradient-to-r from-ps-red via-ps-amber to-ps-green"></div>
        </div>
        
        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DEMO_PROJECTS.map((project) => (
            <div 
              key={project.id}
              className="bg-gray-900/70 rounded-lg overflow-hidden shadow-md hover:shadow-lg transform transition-transform hover:scale-[1.02] cursor-pointer"
              onClick={() => handleOpenProject(project.url)}
            >
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={project.thumbnail} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-bold text-lg">{project.title}</h3>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-gray-300 mb-3 text-sm">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className={`${project.color} text-white text-xs px-2 py-1 rounded-sm`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="px-4 py-2 border-t border-gray-700 flex justify-between items-center">
                <span className="text-gray-400 text-xs">Opens in new tab</span>
                <span className="text-ps-cyan text-xs">→ Visit Project</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer note */}
        <div className="mt-4 text-center text-gray-400 text-sm italic">
          Projects load actual external URLs. Each prototype opens in a new browser tab.
        </div>
      </div>
    </SaveModal>
  );
}