// frontend/src/components/home/HeroSection/Hero3DModel.jsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const Hero3DModel = ({ type = 'cube' }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const meshRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 1);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xec4899, 0.5);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Create geometry based on type
    let geometry;
    const material = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      metalness: 0.7,
      roughness: 0.2,
      wireframe: false,
    });

    switch (type) {
      case 'laptop':
        // Simplified laptop shape using boxes
        const laptopGroup = new THREE.Group();
        
        // Screen
        const screenGeom = new THREE.BoxGeometry(2, 1.5, 0.05);
        const screen = new THREE.Mesh(screenGeom, material);
        screen.position.y = 0.5;
        screen.rotation.x = -0.2;
        laptopGroup.add(screen);
        
        // Base/Keyboard
        const baseGeom = new THREE.BoxGeometry(2, 0.1, 1.5);
        const base = new THREE.Mesh(baseGeom, material);
        base.position.y = -0.3;
        laptopGroup.add(base);
        
        scene.add(laptopGroup);
        meshRef.current = laptopGroup;
        geometry = laptopGroup;
        break;

      case 'sphere':
        geometry = new THREE.Mesh(
          new THREE.SphereGeometry(1.5, 32, 32),
          material
        );
        scene.add(geometry);
        meshRef.current = geometry;
        break;

      case 'cube':
      default:
        geometry = new THREE.Mesh(
          new THREE.BoxGeometry(2, 2, 2),
          material
        );
        
        // Add edges for better visibility
        const edges = new THREE.EdgesGeometry(geometry.geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ 
          color: 0xec4899,
          linewidth: 2 
        });
        const wireframe = new THREE.LineSegments(edges, lineMaterial);
        geometry.add(wireframe);
        
        scene.add(geometry);
        meshRef.current = geometry;
        break;
    }

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.005;
        meshRef.current.rotation.y += 0.01;
      }

      renderer.render(scene, camera);
    };
    animate();

    // GSAP floating animation
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        y: '+=0.5',
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'power1.inOut',
      });
    }

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose of Three.js resources
      if (meshRef.current) {
        if (meshRef.current.geometry) meshRef.current.geometry.dispose();
        if (meshRef.current.material) meshRef.current.material.dispose();
      }
      
      renderer.dispose();
    };
  }, [type]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }} 
    />
  );
};

export default Hero3DModel;