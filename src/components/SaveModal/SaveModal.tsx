import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useSound, Sounds } from "@/hooks/useSound";
import { AppId } from '@/config/appIds';

interface SaveModalProps {
  title1: string;
  title2: string;
  isOpen: boolean;
  onClose: () => void;
  appId: AppId;
  children: React.ReactNode;
}

export function SaveModal({ title1, title2, isOpen, onClose, appId: _appId, children }: SaveModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { play: playOpen } = useSound(Sounds.WINDOW_OPEN);
  const { play: playClose } = useSound(Sounds.WINDOW_CLOSE);
  
  // Play sound effect when opened
  useEffect(() => {
    if (isOpen) {
      playOpen();
      setIsAnimating(true);
      
      // Reset animation state after animation completes
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match this to the animation duration
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, playOpen]);
  
  // Handle key navigation and close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Back keys: Escape, Square symbol, Backspace, C key
      if (e.key === "Escape" ||
          e.key === "□" ||
          e.key === "Backspace" ||
          e.key === "c" ||
          e.key === "C" ||
          e.key === "[") { // Square symbol on US keyboard
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  
  const handleClose = () => {
    playClose();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        aria-describedby="modal-description"
        className={`
        p-0 rounded-lg border-2 border-ps-plastic
        bg-ps-crt-glass max-w-4xl w-[95%] h-[80vh]
        overflow-hidden shadow-[0_0_4px_#000]
        ${isAnimating ? 'animate-in zoom-in-90 duration-300' : ''}
      `}
        style={{
          backgroundImage: `url('/assets/ui/mcard_plastic.png')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px'
        }}
      >
        {/* Memory Card Frame */}
        <div className="relative flex flex-col h-full overflow-hidden">
          {/* Title Bar with card plastic texture */}
          <div className="bg-[#bdbdbd] py-2 px-4 flex items-center justify-between border-b border-gray-700">
            <DialogTitle className="text-black font-bold flex items-center">
              {/* Two embossed screws */}
              <div className="w-4 h-4 rounded-full bg-[#a0a0a0] border border-[#909090] shadow-inner mr-3"></div>
              
              {title1} <span className="text-sm uppercase ml-1">{title2}</span>
              
              {/* Second screw */}
              <div className="w-4 h-4 rounded-full bg-[#a0a0a0] border border-[#909090] shadow-inner ml-3"></div>
            </DialogTitle>
            
            <button 
              onClick={handleClose}
              className="flex items-center justify-center w-8 h-8 rounded-sm border border-gray-700 hover:bg-gray-400"
              aria-label="Close"
            >
              <span className="text-black">□</span>
            </button>
          </div>
          
          {/* Memory Card LED Indicators (3-block grid) */}
          <div className="bg-[#bdbdbd] px-4 py-2 flex space-x-2 border-b border-gray-700">
            <div className="w-6 h-3 bg-[#8d8d8d] rounded-sm"></div>
            <div className="w-6 h-3 bg-[#8d8d8d] rounded-sm"></div>
            <div className="w-6 h-3 bg-[#8d8d8d] rounded-sm"></div>
          </div>
          
          {/* Modal Content */}
          <div id="modal-description" className="flex-1 bg-gradient-to-b from-gray-800 to-black p-6 overflow-auto text-white">
            {children}
          </div>
          
          {/* Controls Bar with PS1 style */}
          <div className="bg-[#bdbdbd] py-2 px-4 flex items-center justify-end gap-4">
            <span className="text-xs text-black bg-[#a0a0a0] px-2 py-1 rounded">
              <span className="border border-black px-1">▲▼◀▶</span> Navigate
            </span>
            <span className="text-xs text-black bg-[#a0a0a0] px-2 py-1 rounded">
              <span className="border border-black px-1">X</span> Select
            </span>
            <span className="text-xs text-black bg-[#a0a0a0] px-2 py-1 rounded">
              <span className="border border-black px-1">□</span> Back
            </span>
          </div>
          
          {/* CRT Overlay Effect */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20"></div>
          <div className="pointer-events-none absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 2px)',
            backgroundSize: '100% 2px'
          }}></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}