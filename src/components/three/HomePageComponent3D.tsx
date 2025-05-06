
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ComponentViewer from './ComponentViewer';

interface HomePageComponent3DProps {
  className?: string;
}

const HomePageComponent3D = ({ className = '' }: HomePageComponent3DProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeComponent, setActiveComponent] = useState<'resistor' | 'capacitor' | 'ic' | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Create a circuit board
    const boardGeometry = new THREE.PlaneGeometry(10, 10);
    const boardTexture = new THREE.TextureLoader().load('/circuit-texture.jpg');
    boardTexture.wrapS = THREE.RepeatWrapping;
    boardTexture.wrapT = THREE.RepeatWrapping;
    boardTexture.repeat.set(2, 2);
    
    const boardMaterial = new THREE.MeshStandardMaterial({
      map: boardTexture,
      roughness: 0.8,
      metalness: 0.2,
      color: 0x006633
    });
    
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    scene.add(board);
    
    // Add electronic components
    const componentsGroup = new THREE.Group();
    scene.add(componentsGroup);
    
    // Resistor
    const resistorGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 32);
    const resistorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xbf9f73,
      roughness: 0.7,
      metalness: 0.2
    });
    const resistor = new THREE.Mesh(resistorGeometry, resistorMaterial);
    resistor.position.set(-2.5, 0.5, 0);
    resistor.rotation.x = Math.PI / 2;
    
    // Add resistor bands
    const bandMaterial1 = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const bandMaterial2 = new THREE.MeshBasicMaterial({ color: 0x964B00 });
    const bandMaterial3 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const bandGeometry = new THREE.TorusGeometry(0.31, 0.05, 16, 100);
    
    const band1 = new THREE.Mesh(bandGeometry, bandMaterial1);
    band1.position.z = 0.4;
    resistor.add(band1);
    
    const band2 = new THREE.Mesh(bandGeometry, bandMaterial2);
    band2.position.z = 0.2;
    resistor.add(band2);
    
    const band3 = new THREE.Mesh(bandGeometry, bandMaterial3);
    band3.position.z = 0;
    resistor.add(band3);
    
    componentsGroup.add(resistor);
    
    // Capacitor
    const capacitorBaseGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1, 32);
    const capacitorMaterial = new THREE.MeshStandardMaterial({
      color: 0x3366cc,
      roughness: 0.5,
      metalness: 0.7
    });
    const capacitor = new THREE.Mesh(capacitorBaseGeometry, capacitorMaterial);
    capacitor.position.set(0, 0.5, 0);
    
    const topGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
    const topMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.2,
      metalness: 0.8
    });
    const topCap = new THREE.Mesh(topGeometry, topMaterial);
    topCap.position.y = 0.55;
    capacitor.add(topCap);
    
    componentsGroup.add(capacitor);
    
    // IC Chip
    const icGeometry = new THREE.BoxGeometry(1.5, 0.3, 0.8);
    const icMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.6,
      metalness: 0.4
    });
    const ic = new THREE.Mesh(icGeometry, icMaterial);
    ic.position.set(2.5, 0.15, 0);
    
    // Add IC pins
    const pinGeometry = new THREE.BoxGeometry(0.05, 0.2, 0.05);
    const pinMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.2,
      metalness: 0.9
    });
    
    for (let i = 0; i < 6; i++) {
      const leftPin = new THREE.Mesh(pinGeometry, pinMaterial);
      leftPin.position.set(-0.6 + i * 0.25, -0.25, 0.3);
      ic.add(leftPin);
      
      const rightPin = new THREE.Mesh(pinGeometry, pinMaterial);
      rightPin.position.set(-0.6 + i * 0.25, -0.25, -0.3);
      ic.add(rightPin);
    }
    
    componentsGroup.add(ic);
    
    // Add connection traces
    const traceGeometry = new THREE.PlaneGeometry(5, 0.05);
    const traceMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.2,
      metalness: 0.8,
      side: THREE.DoubleSide
    });
    
    const horizontalTrace1 = new THREE.Mesh(traceGeometry, traceMaterial);
    horizontalTrace1.position.set(0, 0.01, 0);
    horizontalTrace1.rotation.x = Math.PI / 2;
    scene.add(horizontalTrace1);
    
    const horizontalTrace2 = new THREE.Mesh(traceGeometry, traceMaterial);
    horizontalTrace2.position.set(0, 0.01, 1);
    horizontalTrace2.rotation.x = Math.PI / 2;
    scene.add(horizontalTrace2);
    
    const horizontalTrace3 = new THREE.Mesh(traceGeometry, traceMaterial);
    horizontalTrace3.position.set(0, 0.01, -1);
    horizontalTrace3.rotation.x = Math.PI / 2;
    scene.add(horizontalTrace3);
    
    const verticalTraceGeom = new THREE.PlaneGeometry(0.05, 5);
    
    const verticalTrace1 = new THREE.Mesh(verticalTraceGeom, traceMaterial);
    verticalTrace1.position.set(-1, 0.01, 0);
    verticalTrace1.rotation.x = Math.PI / 2;
    scene.add(verticalTrace1);
    
    const verticalTrace2 = new THREE.Mesh(verticalTraceGeom, traceMaterial);
    verticalTrace2.position.set(1, 0.01, 0);
    verticalTrace2.rotation.x = Math.PI / 2;
    scene.add(verticalTrace2);
    
    // Position camera
    camera.position.set(0, 5, 5);
    camera.lookAt(0, 0, 0);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // Handle click events for component selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const onClick = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);
      
      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(componentsGroup.children, true);
      
      if (intersects.length > 0) {
        const object = intersects[0].object;
        
        // Determine which component was clicked
        if (object === resistor || resistor.children.includes(object)) {
          setActiveComponent('resistor');
        } else if (object === capacitor || capacitor.children.includes(object)) {
          setActiveComponent('capacitor');
        } else if (object === ic || ic.children.includes(object)) {
          setActiveComponent('ic');
        }
      }
    };
    
    renderer.domElement.addEventListener('click', onClick);
    
    // Animation loop
    let frame = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Gently rotate the components
      componentsGroup.rotation.y = Math.sin(frame / 200) * 0.1;
      
      // Update controls
      controls.update();
      
      frame++;
      renderer.render(scene, camera);
    };
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
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
      renderer.domElement.removeEventListener('click', onClick);
      
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of geometries and materials
      [boardGeometry, resistorGeometry, bandGeometry, 
       capacitorBaseGeometry, topGeometry, icGeometry, 
       pinGeometry, traceGeometry, verticalTraceGeom].forEach(geo => geo.dispose());
       
      [boardMaterial, resistorMaterial, bandMaterial1, bandMaterial2, bandMaterial3,
       capacitorMaterial, topMaterial, icMaterial, pinMaterial, traceMaterial].forEach(mat => mat.dispose());
       
      renderer.dispose();
      controls.dispose();
    };
  }, []);
  
  return (
    <div className="relative">
      <div 
        ref={mountRef} 
        className={`w-full h-[400px] rounded-lg overflow-hidden ${className}`}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          Loading 3D scene...
        </div>
      )}
      
      {activeComponent && (
        <div className="absolute bottom-4 right-4 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg w-64">
          <h3 className="text-lg font-semibold mb-2">
            {activeComponent === 'resistor' ? 'Resistor' : 
             activeComponent === 'capacitor' ? 'Capacitor' : 'Integrated Circuit'}
          </h3>
          <div className="h-[120px]">
            <ComponentViewer componentType={activeComponent} />
          </div>
          <button 
            onClick={() => setActiveComponent(null)} 
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 w-full"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePageComponent3D;
