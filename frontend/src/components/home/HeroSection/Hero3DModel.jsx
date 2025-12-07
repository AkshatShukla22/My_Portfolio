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

    // Camera setup - adjusted for better visibility
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 7;

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

    // Lighting - enhanced for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 1.2);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xec4899, 0.8);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xa855f7, 0.5);
    pointLight3.position.set(0, 5, -5);
    scene.add(pointLight3);

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
        const screenGeom = new THREE.BoxGeometry(2.2, 1.6, 0.08);
        const screenMat = new THREE.MeshStandardMaterial({
          color: 0x6366f1,
          metalness: 0.8,
          roughness: 0.1,
        });
        const screen = new THREE.Mesh(screenGeom, screenMat);
        screen.position.y = 0.5;
        screen.rotation.x = -0.25;
        laptopGroup.add(screen);
        
        // Screen frame
        const frameEdges = new THREE.EdgesGeometry(screenGeom);
        const frameMat = new THREE.LineBasicMaterial({ 
          color: 0xec4899,
          linewidth: 2 
        });
        const frameWire = new THREE.LineSegments(frameEdges, frameMat);
        frameWire.position.copy(screen.position);
        frameWire.rotation.copy(screen.rotation);
        laptopGroup.add(frameWire);
        
        // Base/Keyboard
        const baseGeom = new THREE.BoxGeometry(2.2, 0.1, 1.5);
        const base = new THREE.Mesh(baseGeom, material);
        base.position.y = -0.35;
        laptopGroup.add(base);
        
        // Keyboard keys (decorative) - fewer keys for better performance
        const keyGeom = new THREE.BoxGeometry(0.12, 0.04, 0.12);
        const keyMat = new THREE.MeshStandardMaterial({
          color: 0x8b5cf6,
          metalness: 0.5,
          roughness: 0.3,
        });
        
        for (let i = -3; i < 4; i++) {
          for (let j = -2; j < 3; j++) {
            const key = new THREE.Mesh(keyGeom, keyMat);
            key.position.set(i * 0.3, -0.3, j * 0.3);
            laptopGroup.add(key);
          }
        }
        
        scene.add(laptopGroup);
        meshRef.current = laptopGroup;
        geometry = laptopGroup;
        break;

      case 'sphere':
        geometry = new THREE.Mesh(
          new THREE.SphereGeometry(1.6, 32, 32),
          material
        );
        
        // Add wireframe overlay
        const sphereWire = new THREE.Mesh(
          new THREE.SphereGeometry(1.62, 16, 16),
          new THREE.MeshBasicMaterial({
            color: 0xec4899,
            wireframe: true,
          })
        );
        geometry.add(sphereWire);
        
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
        
        // Add corner spheres for visual interest
        const cornerGeom = new THREE.SphereGeometry(0.12, 16, 16);
        const cornerMat = new THREE.MeshStandardMaterial({
          color: 0xa855f7,
          metalness: 0.9,
          roughness: 0.1,
        });
        
        const positions = [
          [1, 1, 1], [-1, 1, 1],
          [1, -1, 1], [-1, -1, 1],
          [1, 1, -1], [-1, 1, -1],
          [1, -1, -1], [-1, -1, -1],
        ];
        
        positions.forEach(pos => {
          const corner = new THREE.Mesh(cornerGeom, cornerMat);
          corner.position.set(...pos);
          geometry.add(corner);
        });
        
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
      
      if (rendererRef.current && containerRef.current && containerRef.current.contains(rendererRef.current.domElement)) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose of Three.js resources
      if (meshRef.current) {
        if (meshRef.current.geometry) meshRef.current.geometry.dispose();
        if (meshRef.current.material) {
          if (Array.isArray(meshRef.current.material)) {
            meshRef.current.material.forEach(mat => mat.dispose());
          } else {
            meshRef.current.material.dispose();
          }
        }
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