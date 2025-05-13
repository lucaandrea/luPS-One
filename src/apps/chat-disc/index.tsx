import { BaseApp } from '../base/types';
import { ChatDiscSlot } from '../../slots/chat-disc';

interface ChatDiscAppProps {
  onClose: () => void;
}

function ChatDiscAppComponent({ onClose }: ChatDiscAppProps) {
  // Just render the slot component
  return (
    <ChatDiscSlot
      isOpen={true}
      onClose={onClose}
    />
  );
}

export const ChatDiscApp: BaseApp = {
  id: 'chat-disc',
  name: 'PS Chat Disc',
  component: ChatDiscAppComponent,
  icon: {
    type: 'image',
    src: '/assets/slots/chat-disc.png',
  },
  description: 'Chat with an AI assistant based on Luca Collins',
  metadata: {
    name: 'PS Chat Disc',
    version: '1.0.0',
    creator: {
      name: 'Luca Collins',
      url: 'https://github.com/lucaandreacollins',
    },
    github: 'https://github.com/lucaandreacollins/luPS-One',
    icon: 'chat-disc',
  },
}; 