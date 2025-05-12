import React, { useEffect, useRef } from 'react';
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
    renderer.setClearColor(0x000000);
    rendererRef.current = renderer;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    
    // Create logo placeholders
    let sceLogoMesh: THREE.Mesh | null = null;
    let psLogoMesh: THREE.Mesh | THREE.Group | null = null;
    
    // Texture loader for SCE logo
    const textureLoader = new THREE.TextureLoader();
    
    // Create a simple plane for SCE logo
    const scePlaneGeometry = new THREE.PlaneGeometry(2.5, 2.5);
    const scePlaneMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000, // Red color for SCE
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    sceLogoMesh = new THREE.Mesh(scePlaneGeometry, scePlaneMaterial);
    sceLogoMesh.visible = false;
    scene.add(sceLogoMesh);

    // PS logo as a simple colored plane until GLB is loaded
    const psPlaneGeometry = new THREE.PlaneGeometry(2, 2);
    const psPlaneMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000ff, // Blue color for PS
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    psLogoMesh = new THREE.Mesh(psPlaneGeometry, psPlaneMaterial);
    psLogoMesh.visible = false;
    scene.add(psLogoMesh);

    // Both meshes are now ready
    startBootSequence();
    
    // Animation timeline
    function startBootSequence() {
      if (!sceLogoMesh || !psLogoMesh || !sceTextContainerRef.current || !psTextContainerRef.current) return;
      
      const timeline = gsap.timeline();
      
      // --- Screen 1: SCE ---
      timeline
        // 0ms→500ms: fade from black → #808080 (12% grey)
        .to(renderer.getClearColor(), { 
          r: 0.5, g: 0.5, b: 0.5, 
          duration: 0.5, 
          ease: "power1.inOut",
          onUpdate: () => {
            if (rendererRef.current) {
              rendererRef.current.setClearColor(renderer.getClearColor());
            }
          }
        })
        
        // 500ms: SCE diamond scale-in
        .call(() => {
          if (sceLogoMesh) {
            sceLogoMesh.visible = true;
            sceTextContainerRef.current!.style.opacity = '1';
          }
        }, null, "0.5")
        
        // SCE logo fade-in
        .to(sceLogoMesh.material, { opacity: 1, duration: 0.5, ease: "power1.out" }, "<")
        
        // 600ms: SCE text group fade-in
        .to(".sce-text", { opacity: 1, duration: 0.5, stagger: 0.1 }, "0.6")
        
        // 2300ms: all SCE elements fade-out
        .to([sceLogoMesh.material, ".sce-text"], { 
          opacity: 0, 
          duration: 0.5, 
          ease: "power1.in" 
        }, "2.3")
        
        .call(() => {
          if (sceLogoMesh) {
            sceLogoMesh.visible = false;
            sceTextContainerRef.current!.style.opacity = '0';
          }
        }, null, ">")
        
        // 2700ms: background back to black
        .to(renderer.getClearColor(), { 
          r: 0, g: 0, b: 0, 
          duration: 0.4, 
          ease: "power1.inOut",
          onUpdate: () => {
            if (rendererRef.current) {
              rendererRef.current.setClearColor(renderer.getClearColor());
            }
          }
        }, "2.7")
        
        // 3000ms: PS logo fade-in AND trigger boot sound
        .call(() => {
          if (psLogoMesh) {
            psLogoMesh.visible = true;
            psTextContainerRef.current!.style.opacity = '1';
            // Trigger audio
            onAudioTrigger();
          }
        }, null, "3.0")
        
        // PS logo fade-in
        .to(psLogoMesh instanceof THREE.Mesh ? psLogoMesh.material : psLogoMesh.children, { 
          opacity: 1, 
          duration: 0.8, 
          ease: "power1.out"
        }, "<")
        
        // Add rotation animation for 3D model
        .to(psLogoMesh.rotation, { 
          y: Math.PI * 2, 
          duration: 6, 
          ease: "none", 
          repeat: -1 
        }, "<")
        
        // 3200ms: PlayStation text fade-in
        .to(".ps-text", { opacity: 1, duration: 0.5, stagger: 0.1 }, "3.2")
        
        // Hold until 6000ms, then prepare for cleanup
        .to({}, { duration: 3.0 });
      
      // Start animation loop
      animate();
    }
    
    // Animation loop
    function animate() {
      animationRef.current = requestAnimationFrame(animate);
      
      // Rotate PS logo if it exists and is a 3D model
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
        <div id="scea-text-line2" className="ps-text absolute text-sm text-[#ccc] opacity-0" style={{ top: '85%' }}>
          SCEA<span className="text-xs align-super">TM</span>
        </div>
      </div>
    </div>
  );
}

export default PS1BootAnimation;