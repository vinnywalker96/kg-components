
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface CircuitAnimationProps {
  className?: string;
}

const CircuitAnimation = ({ className }: CircuitAnimationProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;
    setMounted(true);
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create circuit board material
    const circuitTexture = new THREE.TextureLoader().load('/circuit-texture.jpg');
    const material = new THREE.MeshStandardMaterial({
      map: circuitTexture,
      roughness: 0.7,
      metalness: 0.3,
    });
    
    // Create circuit board shape (a thin box)
    const geometry = new THREE.BoxGeometry(5, 5, 0.2);
    const circuit = new THREE.Mesh(geometry, material);
    scene.add(circuit);
    
    // Add small component geometries
    const componentColors = [0x3498db, 0x2ecc71, 0xe74c3c, 0xf39c12];
    const components = [];
    
    for (let i = 0; i < 20; i++) {
      // Create random small shapes to represent electronic components
      let componentGeom;
      const type = Math.floor(Math.random() * 3);
      
      if (type === 0) {
        // Chip-like component
        componentGeom = new THREE.BoxGeometry(0.4, 0.4, 0.2);
      } else if (type === 1) {
        // Cylindrical component (like capacitor)
        componentGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16);
      } else {
        // Small square component
        componentGeom = new THREE.BoxGeometry(0.2, 0.2, 0.1);
      }
      
      const componentMat = new THREE.MeshStandardMaterial({
        color: componentColors[Math.floor(Math.random() * componentColors.length)],
        roughness: 0.5,
        metalness: 0.7
      });
      
      const component = new THREE.Mesh(componentGeom, componentMat);
      
      // Position component on the circuit board
      component.position.x = (Math.random() - 0.5) * 4;
      component.position.y = (Math.random() - 0.5) * 4;
      component.position.z = 0.2; // Just above the circuit board
      
      scene.add(component);
      components.push(component);
    }
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Position camera
    camera.position.z = 5;
    
    // Animation function
    let frame = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate circuit board slightly
      circuit.rotation.x = Math.sin(frame / 100) * 0.2;
      circuit.rotation.y = Math.sin(frame / 120) * 0.3;
      
      // Animate components as if they're pulsing
      components.forEach((comp, i) => {
        comp.position.z = 0.2 + Math.sin((frame + i * 10) / 50) * 0.05;
      });
      
      frame++;
      renderer.render(scene, camera);
    };
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of geometries and materials
      geometry.dispose();
      material.dispose();
      components.forEach(comp => {
        comp.geometry.dispose();
        comp.material.dispose();
      });
    };
  }, []);
  
  return (
    <div 
      ref={mountRef} 
      className={`absolute inset-0 z-0 opacity-50 ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default CircuitAnimation;
