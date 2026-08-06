import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

export const GlobeTransition = ({ onComplete }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) {
      if (onComplete) onComplete();
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Three.js Scene Setup with Static Perspective Camera (No camera movement/zoom)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 1, 2000);
    camera.position.z = 1000; // Static camera position

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Master Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // FIXED CONSTANTS: Scale = 1.0, X = 0, Y = 0 (No scale animation, no layout shifts)
    globeGroup.scale.set(1.0, 1.0, 1.0);
    globeGroup.position.x = 0;
    globeGroup.position.y = 0;

    // STARTING DEPTH POSITION (Z = -600 deep background space, target Z = 0)
    const START_Z = -600;
    const TARGET_Z = 0;
    globeGroup.position.z = START_Z;

    // 2. Glowing White/Cyan Holographic Color Palette Tokens
    const COLOR_WHITE = new THREE.Color('#FFFFFF');
    const COLOR_ALMOND_LIGHT = new THREE.Color('#CFD0CD');
    const COLOR_MORNING_BLUE = new THREE.Color('#8A9992');
    const COLOR_CORE_GLOW = new THREE.Color('#55443A');

    // 3. Inner Volumetric Glowing Core Sphere (Soft Additive Core Bloom)
    const coreGeo = new THREE.SphereGeometry(180, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: COLOR_CORE_GLOW,
      transparent: true,
      opacity: 0.0, // Fades 0.0 -> 0.35
      blending: THREE.AdditiveBlending
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // 4. Dense Spherical Particle Cloud (3,000 Neural Nodes)
    const particleCount = window.innerWidth < 768 ? 1000 : 3000;
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

      const randVal = Math.random();
      const c = randVal > 0.6 ? COLOR_WHITE : (randVal > 0.3 ? COLOR_ALMOND_LIGHT : COLOR_MORNING_BLUE);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 3.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.0, // Fades 0.0 -> 0.90
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    globeGroup.add(particleSystem);

    // 5. Connecting Neural Line Segments
    const linePositions = [];
    const maxDistance = 65;

    for (let i = 0; i < particleCount; i += 2) {
      for (let j = i + 1; j < particleCount; j += 2) {
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
      color: COLOR_MORNING_BLUE,
      transparent: true,
      opacity: 0.0, // Fades 0.0 -> 0.25
      blending: THREE.AdditiveBlending
    });

    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    globeGroup.add(linesMesh);

    // 6. Outer Orbiting Threat Beacons
    const orbitCount = 120;
    const orbitRadius = 390;
    const orbitPositions = new Float32Array(orbitCount * 3);

    for (let i = 0; i < orbitCount; i++) {
      const angle = (i / orbitCount) * Math.PI * 2;
      orbitPositions[i * 3] = Math.cos(angle) * orbitRadius;
      orbitPositions[i * 3 + 1] = (Math.random() - 0.5) * 90;
      orbitPositions[i * 3 + 2] = Math.sin(angle) * orbitRadius;
    }

    const orbitGeo = new THREE.BufferGeometry();
    orbitGeo.setAttribute('position', new THREE.BufferAttribute(orbitPositions, 3));

    const orbitMat = new THREE.PointsMaterial({
      size: 4.5,
      color: COLOR_ALMOND_LIGHT,
      transparent: true,
      opacity: 0.0, // Fades 0.0 -> 0.75
      blending: THREE.AdditiveBlending
    });

    const orbitSystem = new THREE.Points(orbitGeo, orbitMat);
    globeGroup.add(orbitSystem);

    // 7. Satellite Docking Depth Motion: easeOutQuint (1 - (1 - progress)^5)
    let animationFrameId;
    let lastTime = performance.now();
    const startTime = performance.now();
    const DURATION = 2000; // 2.0s

    const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);

    const animate = (currentTime) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const elapsed = currentTime - startTime;

      if (elapsed >= DURATION) {
        globeGroup.position.z = TARGET_Z;
        coreMat.opacity = 0.35;
        particlesMaterial.opacity = 0.90;
        linesMaterial.opacity = 0.25;
        orbitMat.opacity = 0.75;
        renderer.render(scene, camera);
        if (onComplete) onComplete();
        return;
      }

      const progress = Math.min(elapsed / DURATION, 1.0);
      const eased = easeOutQuint(progress);

      // Continuous 60 FPS Rotation
      globeGroup.rotation.y += 0.0023;
      orbitSystem.rotation.y -= 0.0035;

      // Pure Depth Movement along Z-axis (-600 -> 0.0)
      globeGroup.position.z = START_Z + eased * (TARGET_Z - START_Z);

      // Smooth Opacity Fade (0.0 -> 1.0)
      coreMat.opacity = eased * 0.35;
      particlesMaterial.opacity = eased * 0.90;
      linesMaterial.opacity = eased * 0.25;
      orbitMat.opacity = eased * 0.75;

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
      coreGeo.dispose();
      coreMat.dispose();
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
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[99998] pointer-events-none flex items-center justify-center bg-transparent"
    >
      <div ref={mountRef} className="w-full h-full flex items-center justify-center" />
    </motion.div>
  );
};
