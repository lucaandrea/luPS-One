import { useState, useEffect, useRef } from 'react';
import { SaveModal } from '@/components/SaveModal/SaveModal';
import gsap from 'gsap';

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

// GitHub API
const GITHUB_REPO_URL = 'https://api.github.com/repos/lucaandreacollins/zipply-alpha';
const CACHE_KEY = 'zipply-alpha-stars';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

export function DriverSlot({ isOpen, onClose }: DriverSlotProps) {
  const [rpm, setRpm] = useState(0);
  const [targetRpm, setTargetRpm] = useState(0);
  const [starCount, setStarCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isHighRpm, setIsHighRpm] = useState(false);
  
  const rpmRef = useRef({ value: 0 });
  
  // Fetch GitHub star count when the component opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetchStarCount();
    }
  }, [isOpen]);
  
  // Check if we're in high RPM mode (> 7200 RPM)
  useEffect(() => {
    setIsHighRpm(rpm > 7200);
  }, [rpm]);
  
  // Fetch star count from GitHub API or cache
  const fetchStarCount = async () => {
    try {
      // Check if we have cached data
      const cachedData = localStorage.getItem(CACHE_KEY);
      
      if (cachedData) {
        const { stars, timestamp } = JSON.parse(cachedData);
        const isExpired = Date.now() - timestamp > CACHE_TTL;
        
        if (!isExpired) {
          // Use cached data if not expired
          setStarCount(stars);
          animateToRpm(mapStarsToRpm(stars));
          setIsLoading(false);
          return;
        }
      }
      
      // If no cache or expired, fetch from GitHub API
      const response = await fetch(GITHUB_REPO_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch GitHub data: ${response.status}`);
      }
      
      const data = await response.json();
      const stars = data.stargazers_count || Math.floor(Math.random() * 200) + 50; // Fallback to random if API fails
      
      // Save to cache
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          stars,
          timestamp: Date.now(),
        })
      );
      
      // Update state
      setStarCount(stars);
      animateToRpm(mapStarsToRpm(stars));
    } catch (error) {
      console.error('Error fetching GitHub stars:', error);
      
      // Fallback to random number
      const randomStars = Math.floor(Math.random() * 200) + 50;
      setStarCount(randomStars);
      animateToRpm(mapStarsToRpm(randomStars));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Map star count to RPM range (0-9000)
  const mapStarsToRpm = (stars: number) => {
    return Math.floor((stars / 200) * 9000);
  };
  
  // Animate the RPM gauge using GSAP
  const animateToRpm = (targetValue: number) => {
    // Set target RPM for reference
    setTargetRpm(targetValue);
    
    // Display target RPM in console for debugging purposes
    console.log(`Animating tachometer to ${targetValue} RPM (${Math.round((targetValue / 9000) * 100)}%)`);
    
    // Use GSAP to animate the RPM value
    gsap.to(rpmRef.current, {
      value: targetValue,
      duration: 1.2,
      ease: "power3.out",
      onUpdate: () => {
        setRpm(Math.floor(rpmRef.current.value));
      }
    });
  };
  
  return (
    <SaveModal
      title1={DriverSlotData.title1}
      title2={DriverSlotData.title2}
      isOpen={isOpen}
      onClose={onClose}
      appId={DriverSlotData.appId as any}
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Tachometer showing alpha RPM linked to GitHub stars */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-ps-plastic text-xl mb-4">Alpha Drive Status</h2>
          
          <div className="relative w-64 h-64">
            {/* Tachometer background */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-700 bg-black"></div>
            
            {/* RPM markers - 270° sweep (-135° to +135°) */}
            <div className="absolute inset-0">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute left-1/2 top-1/2 h-4 w-1 bg-white origin-bottom"
                  style={{ 
                    transform: `rotate(${-135 + i * 30}deg) translateY(-110px)`,
                  }}
                />
              ))}
              
              {/* RPM numbers */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div 
                  key={num} 
                  className="absolute left-1/2 top-1/2 text-white text-xs font-bold"
                  style={{ 
                    transform: `rotate(${-135 + num * 30}deg) translateY(-92px) rotate(${135 - num * 30}deg)`,
                  }}
                >
                  {num}
                </div>
              ))}
            </div>
            
            {/* RPM needle container for proper centering */}
            <div 
              className="absolute left-1/2 top-1/2 w-0 h-0"
              style={{
                transform: `rotate(${-135 + (rpm / 9000) * 270}deg)`,
                transformOrigin: 'center',
                transition: 'transform 100ms ease-out'
              }}
            >
              {/* Needle with proper transform origin */}
              <div
                className="absolute bg-ps-red w-1 h-[120px] origin-bottom"
                style={{
                  transform: 'translateX(-50%) translateY(-100%)'
                }}
              >
                <div className={`absolute -left-1 -top-1 w-3 h-3 rounded-full bg-ps-red ${isHighRpm ? 'animate-pulse shadow-md shadow-ps-red' : ''}`}></div>
              </div>
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
                <span className={`font-mono text-sm ${isHighRpm ? 'text-ps-red animate-pulse' : 'text-ps-green'}`}>
                  {isLoading ? "Loading..." : rpm.toLocaleString()}
                </span>
                {!isLoading && targetRpm > rpm && (
                  <span className="text-ps-amber font-mono text-xs ml-2">
                    → {targetRpm.toLocaleString()}
                  </span>
                )}
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
        
        {/* Roadmap with the items specified in the guide */}
        <div className="flex-1 bg-ps-crt-glass p-4 rounded-lg">
          <h3 className="text-ps-plastic text-lg mb-4">Project Roadmap</h3>
          
          <div className="space-y-4">
            <div className="border-l-2 border-ps-amber pl-4">
              <h4 className="text-ps-amber font-bold mb-1">Q3-2025 Beta</h4>
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