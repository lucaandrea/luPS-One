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
        {/* Use a single pre tag with whitespace-pre to maintain line breaks as specified in the guide */}
        <pre 
          className="whitespace-pre text-green-400 font-mono cursor-blink"
          style={{ position: 'relative' }}
        >
{`CODEC TRANSMISSION
SUBJECT: AGENT PROFILE — LUCA COLLINS
CLASSIFICATION: TOP SECRET

LEBANON 1992‑1995
Earliest memories formed against backdrop of conflict.  Fighter‑jet ripples & artillery became nightly lullabies.

KOSOVO 1998‑2000
Teenage growth spurt aligned with Kosovo War.  Family dinner table doubled as war‑room & language lab.

IRAQ 2003‑2005
Identity‑forming years shadowed by Iraq invasion.  Seed of entrepreneurial itch germinated between air‑raid sirens.

TRANSMISSION BEGINS…
> Childhood exposure to conflict zones forged unusual pattern‑recognition.
> Subject exhibits abnormal comfort with chaos & uncertainty.
> Multilingual skill‑tree unlocked as survival perk.
> Analytical bent links early trauma to later product strategy.
> "Sirens make odd lullabies." — AGENT QUOTE

END TRANSMISSION`}
        </pre>

        {/* Add a style tag for the cursor blink animation */}
        <style dangerouslySetInnerHTML={{ __html: `
          .cursor-blink::after {
            content: '_';
            position: absolute;
            animation: blink 1s step-end infinite;
          }
          
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}} />
      </div>
    </SaveModal>
  );
}