import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';

interface PS1BootAnimationProps {
  onAudioTrigger: () => void;
}

function PS1BootAnimation({ onAudioTrigger }: PS1BootAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  // References for text containers
  const sceTextContainerRef = useRef<HTMLDivElement>(null);
  const psTextContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    // Setup Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 1); // Add opacity parameter (1)
    rendererRef.current = renderer;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    
    // Create logo placeholders
    let sceLogoMesh: THREE.Mesh | null = null;
    let psLogoMesh: THREE.Mesh | THREE.Group | null = null;

    // Initialize loading flags
    let sceLogoLoaded = false;
    let psLogoLoaded = false;

    // Texture loader for SCE logo
    const textureLoader = new THREE.TextureLoader();

    // Load SCE logo texture
    textureLoader.load(
      '/boot/sce_logo.png', // Updated path per guide
      (texture) => {
        const geometry = new THREE.PlaneGeometry(2.5, 2.5);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide
        });
        sceLogoMesh = new THREE.Mesh(geometry, material);
        sceLogoMesh.visible = false;
        sceLogoMesh.scale.set(0.5, 0.5, 0.5); // Start at 50% scale for animation
        scene.add(sceLogoMesh);

        sceLogoLoaded = true;
        if (psLogoLoaded) {
          startBootSequence();
        }
      },
      undefined,
      (error) => {
        console.warn('Error loading SCE logo texture:', error);
        // Fallback to colored plane
        const geometry = new THREE.PlaneGeometry(2.5, 2.5);
        const material = new THREE.MeshBasicMaterial({
          color: 0xff0000, // Red color for SCE fallback
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide
        });
        sceLogoMesh = new THREE.Mesh(geometry, material);
        sceLogoMesh.visible = false;
        sceLogoMesh.scale.set(0.5, 0.5, 0.5); // Start at 50% scale for animation
        scene.add(sceLogoMesh);

        sceLogoLoaded = true;
        if (psLogoLoaded) {
          startBootSequence();
        }
      }
    );

    // Load PlayStation 3D model (GLB)
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/boot/ps_logo.glb', // Updated path per guide
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.5, 1.5, 1.5); // Adjust scale as needed

        // Apply properties to all child meshes
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.material) {
              child.material.transparent = true;
              child.material.opacity = 0;
              child.material.side = THREE.DoubleSide;
            }
          }
        });

        model.visible = false;
        scene.add(model);
        psLogoMesh = model;

        psLogoLoaded = true;
        if (sceLogoLoaded) {
          startBootSequence();
        }
      },
      undefined,
      (error) => {
        console.warn('Error loading PS logo GLB:', error);

        // Fallback to using a plane with texture
        textureLoader.load(
          '/boot/ps_logo.png', // Updated path per guide
          (texture) => {
            const aspectRatio = texture.image ? texture.image.width / texture.image.height : 1;
            const geometry = new THREE.PlaneGeometry(2 * aspectRatio, 2);
            const material = new THREE.MeshBasicMaterial({
              map: texture,
              transparent: true,
              opacity: 0,
              side: THREE.DoubleSide
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.visible = false;
            scene.add(mesh);
            psLogoMesh = mesh;

            psLogoLoaded = true;
            if (sceLogoLoaded) {
              startBootSequence();
            }
          },
          undefined,
          (texError) => {
            console.warn('Error loading PS logo texture:', texError);
            // Final fallback to colored plane
            const geometry = new THREE.PlaneGeometry(2, 2);
            const material = new THREE.MeshBasicMaterial({
              color: 0x0000ff, // Blue color for PS fallback
              transparent: true,
              opacity: 0,
              side: THREE.DoubleSide
            });
            psLogoMesh = new THREE.Mesh(geometry, material);
            psLogoMesh.visible = false;
            scene.add(psLogoMesh);

            psLogoLoaded = true;
            if (sceLogoLoaded) {
              startBootSequence();
            }
          }
        );
      }
    );
    
    // Animation timeline with exact PS1 NTSC timings
    function startBootSequence() {
      if (!sceLogoMesh || !psLogoMesh || !sceTextContainerRef.current || !psTextContainerRef.current) return;
      
      const timeline = gsap.timeline();
      
      // --- Screen 1: SCE ---
      timeline
        // 0ms→500ms: fade from black → #808080 (12% grey)
        .to(renderer.getClearColor(new THREE.Color()), { // Add temp color object
          r: 0.5, g: 0.5, b: 0.5, // #808080 exactly as specified
          duration: 0.5, 
          ease: "power1.inOut",
          onUpdate: () => {
            if (rendererRef.current) {
              const color = renderer.getClearColor(new THREE.Color()); // Add temp color object
              rendererRef.current.setClearColor(color, 1); // Add opacity parameter (1)
            }
          }
        })
        
        // 500ms: SCE diamond scale-in, full opacity by 1000ms
        .call(() => {
          if (sceLogoMesh) {
            sceLogoMesh.visible = true;
          }
        }, [], "0.5")
        
        // SCE logo fade-in and scale from 0.5 to 1.0 over 500ms
        .to(sceLogoMesh.scale, { 
          x: 1.0, y: 1.0, z: 1.0, 
          duration: 0.5, 
          ease: "power1.out" 
        }, "0.5")
        .to(sceLogoMesh.material, { 
          opacity: 1, 
          duration: 0.5, 
          ease: "power1.out" 
        }, "0.5")
        
        // 600ms: SCE text group fade-in
        .call(() => {
          sceTextContainerRef.current!.style.opacity = '1';
        }, [], "0.6")
        .to(".sce-text", { 
          opacity: 1, 
          duration: 0.4, 
          stagger: 0.1 
        }, "0.6")
        
        // 2300ms: all SCE elements fade-out
        .to([sceLogoMesh.material, ".sce-text"], { 
          opacity: 0, 
          duration: 0.4, 
          ease: "power1.in" 
        }, "2.3")
        
        .call(() => {
          if (sceLogoMesh) {
            sceLogoMesh.visible = false;
            sceTextContainerRef.current!.style.opacity = '0';
          }
        }, [], ">")
        
        // 2700ms: background back to black
        .to(renderer.getClearColor(new THREE.Color()), { // Add temp color object
          r: 0, g: 0, b: 0, 
          duration: 0.3, 
          ease: "power1.inOut",
          onUpdate: () => {
            if (rendererRef.current) {
              const color = renderer.getClearColor(new THREE.Color()); // Add temp color object
              rendererRef.current.setClearColor(color, 1); // Add opacity parameter (1)
            }
          }
        }, "2.7")
        
        // 3000ms: PS logo fade-in AND trigger boot sound
        .call(() => {
          if (psLogoMesh) {
            psLogoMesh.visible = true;
            // Trigger audio exactly at 3000ms "boom" moment
            onAudioTrigger();
          }
        }, [], "3.0")
        
        // PS logo fade-in
        .to(psLogoMesh instanceof THREE.Mesh ? psLogoMesh.material : psLogoMesh.children, { 
          opacity: 1, 
          duration: 0.8, 
          ease: "power1.out"
        }, "<")
        
        // 3200ms: PS text fade-in
        .call(() => {
          psTextContainerRef.current!.style.opacity = '1';
        }, [], "3.2")
        .to(".ps-text", { 
          opacity: 1, 
          duration: 0.5, 
          stagger: 0.1 
        }, "3.2")
        
        // Hold until 6000ms, then prepare for cleanup
        .to({}, { duration: 2.8 });
      
      // Start animation loop
      animate();
    }
    
    // Animation loop
    function animate() {
      animationRef.current = requestAnimationFrame(animate);
      
      // Subtle rotation animation for PS logo if it's a 3D model
      if (psLogoMesh instanceof THREE.Group) {
        psLogoMesh.rotation.y += 0.01;
      }
      
      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }
    
    // Handle window resize
    function handleResize() {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    }
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      // Clear the scene
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, [onAudioTrigger]);
  
  return (
    <div ref={containerRef} className="relative w-full h-full bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />
      
      {/* Text Overlays */}
      <div 
        ref={sceTextContainerRef} 
        className="absolute inset-0 flex flex-col justify-center items-center opacity-0 z-20 pointer-events-none"
      >
        <div id="sony-text" className="sce-text absolute text-2xl font-bold text-[#000033] opacity-0" style={{ top: '35%' }}>
          SONY
        </div>
        <div id="computer-text" className="sce-text absolute text-base font-bold text-[#000033] opacity-0 text-center" style={{ top: '60%' }}>
          COMPUTER<br />ENTERTAINMENT
        </div>
        <div id="sce-tm" className="sce-text absolute text-xs text-[#000033] opacity-0" style={{ top: '57%', left: '60%' }}>
          TM
        </div>
      </div>
      
      <div 
        ref={psTextContainerRef} 
        className="absolute inset-0 flex flex-col justify-center items-center opacity-0 z-20 pointer-events-none"
      >
        <div id="playstation-text" className="ps-text absolute text-xl font-bold text-[#ccc] opacity-0" style={{ top: '65%' }}>
          PlayStation<span className="text-xs align-super">TM</span>
        </div>
        <div id="licensed-text" className="ps-text absolute text-sm text-[#ccc] opacity-0" style={{ top: '75%' }}>
          Licensed by
        </div>
        <div id="scea-text-line1" className="ps-text absolute text-sm text-[#ccc] opacity-0" style={{ top: '78%' }}>
          Sony Computer Entertainment America
        </div>
      </div>
    </div>
  );
}

export default PS1BootAnimation;