import { useState, useEffect } from 'react';
import { SaveModal } from '@/components/SaveModal/SaveModal';

interface DriverSlotProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define slot data separately from component
const slotData = {
  title1: "Driver",
  title2: "Zipply Alpha",
  thumbnailSrc: "/assets/slots/driver.png",
  appId: "driver",
};

// Export it separately for better compatibility with Fast Refresh
export const DriverSlotData = slotData;

export function DriverSlot({ isOpen, onClose }: DriverSlotProps) {
  const [rpm, setRpm] = useState(0);
  const [starCount, setStarCount] = useState(0);
  
  // Simulate fetching GitHub star count
  useEffect(() => {
    if (isOpen) {
      // In a real app, this would be a fetch to GitHub API
      // For demo, we'll simulate with random number between 50-200
      const fakeStarCount = Math.floor(Math.random() * 150) + 50;
      
      // Map star count to RPM range (0-9000)
      const mappedRpm = Math.floor((fakeStarCount / 200) * 9000);
      
      // Animate RPM gauge
      let currentRpm = 0;
      const interval = setInterval(() => {
        currentRpm += Math.floor(Math.random() * 400) + 200;
        if (currentRpm >= mappedRpm) {
          currentRpm = mappedRpm;
          clearInterval(interval);
        }
        setRpm(currentRpm);
      }, 100);
      
      setStarCount(fakeStarCount);
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);
  
  return (
    <SaveModal
      title1={DriverSlotData.title1}
      title2={DriverSlotData.title2}
      isOpen={isOpen}
      onClose={onClose}
      appId={DriverSlotData.appId as any}
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Tachometer */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-ps-plastic text-xl mb-4">Alpha Drive Status</h2>
          
          <div className="relative w-64 h-64">
            {/* Tachometer background */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-700 bg-black"></div>
            
            {/* RPM markers */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute h-4 w-1 bg-white"
                  style={{ 
                    transform: `rotate(${-120 + i * 24}deg) translateY(-110px)`,
                    transformOrigin: 'center bottom'
                  }}
                />
              ))}
              
              {/* RPM numbers */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div 
                  key={num} 
                  className="absolute text-white text-xs font-bold"
                  style={{ 
                    transform: `rotate(${-120 + num * 24}deg) translateY(-95px) rotate(${120 - num * 24}deg)`,
                    transformOrigin: 'center bottom'
                  }}
                >
                  {num}
                </div>
              ))}
            </div>
            
            {/* RPM needle */}
            <div
              className="absolute bottom-[32px] left-1/2 w-1 h-[120px] bg-ps-red transition-transform duration-100 origin-bottom"
              style={{
                transform: `translateX(-50%) rotate(${-120 + (rpm / 9000) * 240}deg)`
              }}
            >
              <div className="absolute -left-1 -top-1 w-3 h-3 rounded-full bg-ps-red"></div>
            </div>
            
            {/* Center cap */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                <span className="text-ps-amber font-bold">RPM</span>
              </div>
            </div>
            
            {/* Current RPM display */}
            <div className="absolute top-3/4 left-0 right-0 text-center">
              <div className="inline-block bg-black/50 px-2 py-1 rounded">
                <span className="text-ps-green font-mono text-sm">{rpm.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Stars indicator */}
            <div className="absolute top-1/4 left-0 right-0 text-center">
              <div className="inline-block bg-black/50 px-2 py-1 rounded">
                <span className="text-yellow-300 font-mono text-xs">★ {starCount}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Roadmap */}
        <div className="flex-1 bg-ps-crt-glass p-4 rounded-lg">
          <h3 className="text-ps-plastic text-lg mb-4">Project Roadmap</h3>
          
          <div className="space-y-4">
            <div className="border-l-2 border-ps-amber pl-4">
              <h4 className="text-ps-amber font-bold mb-1">Q3-2025 Beta Launch</h4>
              <p className="text-sm text-gray-300">
                Public beta access with expanded diagnostics capabilities and 
                expanded vehicle compatibility (VAG, BMW, Toyota).
              </p>
            </div>
            
            <div className="border-l-2 border-ps-cyan pl-4">
              <h4 className="text-ps-cyan font-bold mb-1">OBD Live Tests</h4>
              <p className="text-sm text-gray-300">
                Real-time OBD-II data streaming with customizable gauge displays
                and performance metric tracking across multiple sessions.
              </p>
            </div>
            
            <div className="border-l-2 border-ps-green pl-4">
              <h4 className="text-ps-green font-bold mb-1">Cross-Platform Mobile UI</h4>
              <p className="text-sm text-gray-300">
                iOS and Android companion apps for real-time vehicle monitoring
                and diagnostics on the go. Bluetooth and Wi-Fi connectivity.
              </p>
            </div>
            
            <div className="mt-8 p-3 bg-black/30 rounded">
              <h4 className="text-white font-bold flex items-center">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Alpha Status
              </h4>
              <p className="text-sm text-gray-300 mt-2">
                Currently in private alpha with limited vehicle support and diagnostic
                capabilities. Early testers reporting positive feedback on UI/UX.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SaveModal>
  );
}