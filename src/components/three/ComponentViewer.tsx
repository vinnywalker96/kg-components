
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface ComponentViewerProps {
  componentType?: 'resistor' | 'capacitor' | 'ic' | 'generic';
  className?: string;
  color?: string;
}

const ComponentViewer = ({ componentType = 'generic', className = '', color = '#3498db' }: ComponentViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(300, 300);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
    backLight.position.set(-5, 5, -5);
    scene.add(backLight);
    
    // Create component based on type
    let componentMesh;
    
    switch(componentType) {
      case 'resistor':
        const resistorGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
        const resistorMaterial = new THREE.MeshStandardMaterial({ 
          color: color || 0xbf9f73,
          roughness: 0.7,
          metalness: 0.2
        });
        componentMesh = new THREE.Mesh(resistorGeometry, resistorMaterial);
        
        // Add resistor bands
        const bandMaterial1 = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const bandMaterial2 = new THREE.MeshBasicMaterial({ color: 0x964B00 });
        const bandMaterial3 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const bandGeometry = new THREE.TorusGeometry(0.51, 0.1, 16, 100);
        
        const band1 = new THREE.Mesh(bandGeometry, bandMaterial1);
        band1.rotation.x = Math.PI / 2;
        band1.position.y = 0.6;
        componentMesh.add(band1);
        
        const band2 = new THREE.Mesh(bandGeometry, bandMaterial2);
        band2.rotation.x = Math.PI / 2;
        band2.position.y = 0.2;
        componentMesh.add(band2);
        
        const band3 = new THREE.Mesh(bandGeometry, bandMaterial3);
        band3.rotation.x = Math.PI / 2;
        band3.position.y = -0.2;
        componentMesh.add(band3);
        break;
        
      case 'capacitor':
        const capacitorBaseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.2, 32);
        const capacitorMaterial = new THREE.MeshStandardMaterial({
          color: color || 0x3366cc,
          roughness: 0.5,
          metalness: 0.7
        });
        componentMesh = new THREE.Mesh(capacitorBaseGeometry, capacitorMaterial);
        
        // Add capacitor details
        const topGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
        const topMaterial = new THREE.MeshStandardMaterial({
          color: 0xcccccc,
          roughness: 0.2,
          metalness: 0.8
        });
        const topCap = new THREE.Mesh(topGeometry, topMaterial);
        topCap.position.y = 0.7;
        componentMesh.add(topCap);
        
        // Add polarity markings
        const markingGeometry = new THREE.PlaneGeometry(0.4, 0.6);
        const markingMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide
        });
        const marking = new THREE.Mesh(markingGeometry, markingMaterial);
        marking.rotation.x = Math.PI / 2;
        marking.rotation.y = Math.PI / 2;
        marking.position.x = 0.51;
        marking.position.y = 0.2;
        componentMesh.add(marking);
        break;
        
      case 'ic':
        const icGeometry = new THREE.BoxGeometry(2, 0.4, 1);
        const icMaterial = new THREE.MeshStandardMaterial({
          color: color || 0x333333,
          roughness: 0.6,
          metalness: 0.4
        });
        componentMesh = new THREE.Mesh(icGeometry, icMaterial);
        
        // Add IC pins on sides
        const pinGeometry = new THREE.BoxGeometry(0.08, 0.3, 0.08);
        const pinMaterial = new THREE.MeshStandardMaterial({
          color: 0xcccccc,
          roughness: 0.2,
          metalness: 0.9
        });
        
        // Add IC pins on both sides
        for (let i = 0; i < 8; i++) {
          const leftPin = new THREE.Mesh(pinGeometry, pinMaterial);
          leftPin.position.set(-0.9 + i * 0.25, -0.3, 0.4);
          componentMesh.add(leftPin);
          
          const rightPin = new THREE.Mesh(pinGeometry, pinMaterial);
          rightPin.position.set(-0.9 + i * 0.25, -0.3, -0.4);
          componentMesh.add(rightPin);
        }
        
        // Add IC notch (orientation marker)
        const notchGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 32);
        const notchMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const notch = new THREE.Mesh(notchGeometry, notchMaterial);
        notch.rotation.x = Math.PI / 2;
        notch.position.set(-0.9, 0.21, 0);
        componentMesh.add(notch);
        break;
        
      default:
        // Generic electronic component
        const geometry = new THREE.BoxGeometry(2, 0.5, 1.5);
        const material = new THREE.MeshStandardMaterial({
          color: color || 0x44aa88,
          roughness: 0.6,
          metalness: 0.4
        });
        componentMesh = new THREE.Mesh(geometry, material);
        
        // Add some details to make it look like a component
        const topDetail = new THREE.Mesh(
          new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16),
          new THREE.MeshStandardMaterial({ color: 0x333333 })
        );
        topDetail.position.y = 0.35;
        componentMesh.add(topDetail);
    }
    
    scene.add(componentMesh);
    
    // Add circuit board base
    const boardGeometry = new THREE.BoxGeometry(4, 0.2, 4);
    const boardMaterial = new THREE.MeshStandardMaterial({
      color: 0x006633,
      roughness: 0.8,
      metalness: 0.2
    });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.y = -0.7; 
    scene.add(board);
    
    // Add circuit traces
    const traceGeometry = new THREE.BoxGeometry(0.1, 0.01, 3);
    const traceMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.2,
      metalness: 0.9
    });
    
    for (let i = 0; i < 5; i++) {
      const trace = new THREE.Mesh(traceGeometry, traceMaterial);
      trace.position.y = -0.59;
      trace.position.x = -0.8 + i * 0.4;
      scene.add(trace);
      
      const crossTrace = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.01, 0.1),
        traceMaterial
      );
      crossTrace.position.y = -0.58;
      crossTrace.position.z = -0.8 + i * 0.4;
      scene.add(crossTrace);
    }
    
    // Position camera
    camera.position.z = 5;
    camera.position.y = 1;
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;
    
    // Animation loop
    let frame = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update controls
      controls.update();
      
      // Rotate the component gently
      if (componentMesh) {
        componentMesh.rotation.y = Math.sin(frame / 100) * 0.1; // Subtle wobble
      }
      
      frame++;
      renderer.render(scene, camera);
    };
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = width; // Square aspect ratio
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Start animation
    animate();
    setIsLoaded(true);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of geometries and materials to prevent memory leaks
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
      
      renderer.dispose();
      controls.dispose();
    };
  }, [componentType, color]);
  
  return (
    <div className={`relative w-full aspect-square ${className}`}>
      <div 
        ref={mountRef} 
        className="w-full h-full rounded-lg overflow-hidden cursor-grab"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          Loading 3D model...
        </div>
      )}
    </div>
  );
};

export default ComponentViewer;
