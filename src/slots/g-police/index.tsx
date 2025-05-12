import { SaveModal } from '@/components/SaveModal/SaveModal';

interface GPolicySlotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GPolicySlotData = {
  title1: "G-Police",
  title2: "War-Zone Years",
  thumbnailSrc: "/assets/slots/g-police.png",
  appId: "g-police",
};

export function GPolicySlot({ isOpen, onClose }: GPolicySlotProps) {
  return (
    <SaveModal
      title1={GPolicySlotData.title1}
      title2={GPolicySlotData.title2}
      isOpen={isOpen}
      onClose={onClose}
      appId={GPolicySlotData.appId as any}
    >
      <div className="flex flex-col gap-8">
        {/* Photo Gallery with news reel overlay */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative overflow-hidden rounded-lg">
            <img 
              src="/assets/slots/g-police/photo-1.jpg" 
              alt="Childhood photo" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute bottom-2 left-2 right-2 text-xs">
              <span className="bg-red-600 text-white px-1">LIVE</span>
              <span className="text-white ml-2">Beirut, 1992</span>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-lg">
            <img 
              src="/assets/slots/g-police/photo-2.jpg" 
              alt="Teenage years" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute bottom-2 left-2 right-2 text-xs">
              <span className="bg-red-600 text-white px-1">REPORT</span>
              <span className="text-white ml-2">Kosovo, 1999</span>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-lg">
            <img 
              src="/assets/slots/g-police/photo-3.jpg" 
              alt="Young adult" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute bottom-2 left-2 right-2 text-xs">
              <span className="bg-red-600 text-white px-1">UPDATE</span>
              <span className="text-white ml-2">Iraq, 2005</span>
            </div>
          </div>
        </div>
        
        {/* Timeline */}
        <div className="relative mt-4 pt-8">
          <div className="absolute top-0 left-0 right-0 h-2 bg-ps-red"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/50 p-4 rounded">
              <h3 className="text-ps-red font-bold mb-2">1992-1995</h3>
              <p className="text-sm text-gray-300">
                Earliest memories formed against backdrop of Lebanon conflict. 
                The constant sounds of fighter jets and artillery created unusual 
                soundscape of childhood.
              </p>
            </div>
            
            <div className="bg-black/50 p-4 rounded">
              <h3 className="text-ps-amber font-bold mb-2">1998-2000</h3>
              <p className="text-sm text-gray-300">
                Teenage years coincided with Kosovo War. Exposed to international 
                news coverage and humanitarian relief discussions at family dinner table.
              </p>
            </div>
            
            <div className="bg-black/50 p-4 rounded">
              <h3 className="text-ps-cyan font-bold mb-2">2003-2005</h3>
              <p className="text-sm text-gray-300">
                Iraq War during critical identity-forming years. Became increasingly 
                interested in global politics and business impacts of international 
                conflicts.
              </p>
            </div>
          </div>
        </div>
        
        {/* Quote */}
        <div className="mt-6 border-l-4 border-ps-amber p-4 bg-black/50">
          <p className="text-xl italic text-ps-amber">
            "Sirens make odd lullabies."
          </p>
        </div>
      </div>
    </SaveModal>
  );
}