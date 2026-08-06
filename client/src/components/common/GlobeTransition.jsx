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

    // Color Tokens Matching Reference Palette
    const COLOR_WHITE = new THREE.Color('#FFFFFF');
    const COLOR_ICE_BLUE = new THREE.Color('#E2E8F0');
    const COLOR_CYAN = new THREE.Color('#4299E1');
    const COLOR_MORNING_BLUE = new THREE.Color('#8A9992');
    const COLOR_MAGENTA_ACCENT = new THREE.Color('#D53F8C');

    // 2. Outer Geodesic Wireframe Lattice (Icosahedron Detail 2)
    const geoGridGeometry = new THREE.IcosahedronGeometry(340, 2);
    const wireframeGeo = new THREE.WireframeGeometry(geoGridGeometry);
    const geoGridMaterial = new THREE.LineBasicMaterial({
      color: COLOR_MORNING_BLUE,
      transparent: true,
      opacity: 0.0, // Fades 0.0 -> 0.28
      blending: THREE.AdditiveBlending
    });
    const geoGridMesh = new THREE.LineSegments(wireframeGeo, geoGridMaterial);
    globeGroup.add(geoGridMesh);

    // Bottom-Left Magenta Accent Edge Highlight
    const accentGeo = new THREE.IcosahedronGeometry(342, 1);
    const accentWire = new THREE.WireframeGeometry(accentGeo);
    const accentMat = new THREE.LineBasicMaterial({
      color: COLOR_MAGENTA_ACCENT,
      transparent: true,
      opacity: 0.0, // Fades 0.0 -> 0.35
      blending: THREE.AdditiveBlending
    });
    const accentMesh = new THREE.LineSegments(accentWire, accentMat);
    accentMesh.rotation.z = Math.PI / 4;
    globeGroup.add(accentMesh);

    // 3. Dense Concentric Particle Shell (3,500 Particles)
    const particleCount = window.innerWidth < 768 ? 1200 : 3500;
    const radius = 330;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const rand = Math.random();
      const c = rand > 0.65 ? COLOR_WHITE : (rand > 0.35 ? COLOR_ICE_BLUE : (rand > 0.1 ? COLOR_CYAN : COLOR_MORNING_BLUE));
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
      opacity: 0.0, // Fades 0.0 -> 0.95
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    globeGroup.add(particleSystem);

    // 4. Central Organic Core Loop & Core Node Callouts
    const coreTorusGeo = new THREE.TorusGeometry(85, 2.2, 16, 64);
    const coreTorusMat = new THREE.LineBasicMaterial({
      color: COLOR_WHITE,
      transparent: true,
      opacity: 0.0, // Fades 0.0 -> 0.85
      blending: THREE.AdditiveBlending
    });
    const coreTorusMesh = new THREE.LineLoop(coreTorusGeo, coreTorusMat);
    coreTorusMesh.rotation.x = Math.PI / 6;
    globeGroup.add(coreTorusMesh);

    // Pulsing Central Core Node Spots
    const coreNodesCount = 6;
    const coreNodesPositions = new Float32Array(coreNodesCount * 3);
    for (let i = 0; i < coreNodesCount; i++) {
      const angle = (i / coreNodesCount) * Math.PI * 2;
      coreNodesPositions[i * 3] = Math.cos(angle) * 75;
      coreNodesPositions[i * 3 + 1] = Math.sin(angle) * 75;
      coreNodesPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    const coreNodesGeo = new THREE.BufferGeometry();
    coreNodesGeo.setAttribute('position', new THREE.BufferAttribute(coreNodesPositions, 3));
    const coreNodesMat = new THREE.PointsMaterial({
      size: 7,
      color: COLOR_WHITE,
      transparent: true,
      opacity: 0.0, // Fades 0.0 -> 0.95
      blending: THREE.AdditiveBlending
    });
    const coreNodesSystem = new THREE.Points(coreNodesGeo, coreNodesMat);
    globeGroup.add(coreNodesSystem);

    // 5. Satellite Docking Depth Motion: easeOutQuint (1 - (1 - progress)^5)
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
        geoGridMaterial.opacity = 0.28;
        accentMat.opacity = 0.35;
        particlesMaterial.opacity = 0.95;
        coreTorusMat.opacity = 0.85;
        coreNodesMat.opacity = 0.95;
        renderer.render(scene, camera);
        if (onComplete) onComplete();
        return;
      }

      const progress = Math.min(elapsed / DURATION, 1.0);
      const eased = easeOutQuint(progress);

      // Continuous 60 FPS Rotation
      globeGroup.rotation.y += 0.0023;
      coreTorusMesh.rotation.z += 0.0040;

      // Pure Depth Movement along Z-axis (-600 -> 0.0)
      globeGroup.position.z = START_Z + eased * (TARGET_Z - START_Z);

      // Smooth Opacity Fade (0.0 -> 1.0 target opacities)
      geoGridMaterial.opacity = eased * 0.28;
      accentMat.opacity = eased * 0.35;
      particlesMaterial.opacity = eased * 0.95;
      coreTorusMat.opacity = eased * 0.85;
      coreNodesMat.opacity = eased * 0.95;

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
      geoGridGeometry.dispose();
      wireframeGeo.dispose();
      geoGridMaterial.dispose();
      accentGeo.dispose();
      accentWire.dispose();
      accentMat.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      coreTorusGeo.dispose();
      coreTorusMat.dispose();
      coreNodesGeo.dispose();
      coreNodesMat.dispose();
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
