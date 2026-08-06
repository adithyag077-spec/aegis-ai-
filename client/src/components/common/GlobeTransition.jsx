import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

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

    // 1. Three.js Scene Setup (Transparent WebGL Canvas overlay)
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

    // Initial position behind page in Z-space (-600px) and start scale (0.20)
    globeGroup.position.z = -600;
    globeGroup.scale.set(0.20, 0.20, 0.20);

    // 2. Color Palette Tokens
    const COLOR_PRIMARY_ACCENT = new THREE.Color('#55443A'); // Liver Chestnut
    const COLOR_SECONDARY_ACCENT = new THREE.Color('#8A9992'); // Morning Blue
    const COLOR_SURFACE = new THREE.Color('#4D2308'); // Arsenic

    // 3. Glowing Wireframe Sphere (1,200 Particles)
    const particleCount = window.innerWidth < 768 ? 500 : 1200;
    const radius = 320;
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
      size: 3.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    globeGroup.add(particleSystem);

    // 4. Connecting Neural Line Segments
    const linePositions = [];
    const maxDistance = 75;

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
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });

    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    globeGroup.add(linesMesh);

    // 5. Outer Orbiting Threat Beacons
    const orbitCount = 80;
    const orbitRadius = 390;
    const orbitPositions = new Float32Array(orbitCount * 3);

    for (let i = 0; i < orbitCount; i++) {
      const angle = (i / orbitCount) * Math.PI * 2;
      orbitPositions[i * 3] = Math.cos(angle) * orbitRadius;
      orbitPositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      orbitPositions[i * 3 + 2] = Math.sin(angle) * orbitRadius;
    }

    const orbitGeo = new THREE.BufferGeometry();
    orbitGeo.setAttribute('position', new THREE.BufferAttribute(orbitPositions, 3));

    const orbitMat = new THREE.PointsMaterial({
      size: 5,
      color: COLOR_SECONDARY_ACCENT,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const orbitSystem = new THREE.Points(orbitGeo, orbitMat);
    globeGroup.add(orbitSystem);

    // 6. Physically Based Smoothstep Glide Trajectory: smoothstep(t) = t * t * (3 - 2 * t)
    let animationFrameId;
    const startTime = performance.now();
    const DURATION = 2000; // 2.0s

    const smoothstep = (t) => t * t * (3 - 2 * t);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;

      if (elapsed >= DURATION) {
        if (onComplete) onComplete();
        return;
      }

      const progress = Math.min(elapsed / DURATION, 1.0);
      const smoothed = smoothstep(progress);

      // Continuous 60 FPS Rotation
      globeGroup.rotation.y += 0.006;
      orbitSystem.rotation.y -= 0.009;

      // Smoothstep Z-axis glide (-600 -> 0.0)
      globeGroup.position.z = -600 + smoothed * 600;

      // Smoothstep scale lerp (0.20 -> 0.45 target hero scale)
      const scaleVal = 0.20 + smoothed * 0.25;
      globeGroup.scale.set(scaleVal, scaleVal, scaleVal);

      // Material opacities brighten smoothly as globe glides into position
      particlesMaterial.opacity = 0.15 + smoothed * 0.70;
      linesMaterial.opacity = 0.08 + smoothed * 0.14;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

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
      orbitGeo.dispose();
      orbitMat.dispose();
      renderer.dispose();
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[99998] pointer-events-none flex items-center justify-center bg-transparent"
    >
      <div ref={mountRef} className="w-full h-full flex items-center justify-center" />
    </motion.div>
  );
};
