import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

export const GlobeTransition = ({ onComplete }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = mountRef.current;
    if (!container) {
      if (onComplete) onComplete();
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 1, 2000);
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Master Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 2. Color Palette Tokens
    const COLOR_PRIMARY_ACCENT = new THREE.Color('#55443A'); // Liver Chestnut
    const COLOR_SECONDARY_ACCENT = new THREE.Color('#8A9992'); // Morning Blue
    const COLOR_SURFACE = new THREE.Color('#4D2308'); // Arsenic

    // 3. Glowing Wireframe Sphere (1,200 Particle Nodes)
    const particleCount = window.innerWidth < 768 ? 500 : 1200;
    const radius = 340;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const nodeCoords = [];

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      nodeCoords.push({ x, y, z });

      const c = Math.random() > 0.4 ? COLOR_PRIMARY_ACCENT : (Math.random() > 0.5 ? COLOR_SECONDARY_ACCENT : COLOR_SURFACE);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 4.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    globeGroup.add(particleSystem);

    // 4. Connecting Glowing Network Lines
    const linePositions = [];
    const maxDistance = 80;

    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = nodeCoords[i].x - nodeCoords[j].x;
        const dy = nodeCoords[i].y - nodeCoords[j].y;
        const dz = nodeCoords[i].z - nodeCoords[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDistance) {
          linePositions.push(nodeCoords[i].x, nodeCoords[i].y, nodeCoords[i].z);
          linePositions.push(nodeCoords[j].x, nodeCoords[j].y, nodeCoords[j].z);
        }
      }
    }

    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

    const linesMaterial = new THREE.LineBasicMaterial({
      color: COLOR_SECONDARY_ACCENT,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending
    });

    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    globeGroup.add(linesMesh);

    // 5. 60 FPS Animation & 2.0 Second Timer
    let animationFrameId;
    let startTime = performance.now();
    const DURATION = 2000; // Exactly 2.0 seconds

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;

      if (elapsed >= DURATION) {
        if (onComplete) onComplete();
        return;
      }

      // Smooth fast rotation during 2s transition
      globeGroup.rotation.y += 0.008;
      globeGroup.rotation.x += 0.002;

      // Scale transition toward final position in last 500ms
      if (elapsed > 1500) {
        const factor = 1 - (elapsed - 1500) / 500;
        globeGroup.scale.set(factor, factor, factor);
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Fallback timer safety
    const safetyTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2000);

    return () => {
      clearTimeout(safetyTimer);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      linesGeometry.dispose();
      linesMaterial.dispose();
      renderer.dispose();
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[99998] bg-[#0D1117] flex items-center justify-center pointer-events-none"
    >
      <div ref={mountRef} className="w-full h-full flex items-center justify-center" />
    </motion.div>
  );
};
