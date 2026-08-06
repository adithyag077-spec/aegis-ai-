import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles } from 'lucide-react';

export const GlobeTransition = ({ onComplete }) => {
  const mountRef = useRef(null);
  const [sequencePhase, setSequencePhase] = useState(0); // 0: Start, 1: Globe Formed, 2: Text Reveal, 3: Hold, 4: Morph Scale

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = mountRef.current;
    if (!container) {
      if (onComplete) onComplete();
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Perspective Camera Setup (Camera pushes from z: 1400 -> 950)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 1, 2000);
    camera.position.z = 1400;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Master Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroup.scale.set(0.2, 0.2, 0.2); // Start tiny for assembly reveal

    // 2. Color Palette Tokens
    const COLOR_PRIMARY_ACCENT = new THREE.Color('#55443A'); // Liver Chestnut
    const COLOR_SECONDARY_ACCENT = new THREE.Color('#8A9992'); // Morning Blue
    const COLOR_SURFACE = new THREE.Color('#4D2308'); // Arsenic

    // 3. Glowing 3D Wireframe Sphere (1,200 Particles)
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
      size: 4.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    globeGroup.add(particleSystem);

    // 4. Connecting Neural Mesh Lines
    const linePositions = [];
    const maxDistance = 78;

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
      opacity: 0.30,
      blending: THREE.AdditiveBlending
    });

    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    globeGroup.add(linesMesh);

    // 5. Orbiting Beacons & Travelling Light Pulses
    const orbitCount = 90;
    const orbitRadius = 400;
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
      size: 5.5,
      color: COLOR_SECONDARY_ACCENT,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const orbitSystem = new THREE.Points(orbitGeo, orbitMat);
    globeGroup.add(orbitSystem);

    // 6. Timed Phase Triggers
    const t1 = setTimeout(() => setSequencePhase(1), 600);  // 0.6s: Wireframe globe forms & illuminates
    const t2 = setTimeout(() => setSequencePhase(2), 1400); // 1.4s: Text reveal sequence
    const t3 = setTimeout(() => setSequencePhase(3), 2200); // 2.2s: Hold state (0.8s hold)
    const t4 = setTimeout(() => setSequencePhase(4), 3000); // 3.0s: Smooth scale & morph into landing page position
    const t5 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3400); // 3.4s: Complete & 0ms handoff

    // 7. 60 FPS Render Loop with Cinematic Camera Zoom & Cubic-Bezier Scale Lerp
    let animationFrameId;
    const startTime = performance.now();

    // Custom Cubic-Bezier easeInOutExpo Math
    const easeInOutExpo = (t) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      if ((t /= 0.5) < 1) return 0.5 * Math.pow(2, 10 * (t - 1));
      return 0.5 * (-Math.pow(2, -10 * --t) + 2);
    };

    const animate = (currentTime) => {
      const elapsed = (currentTime - startTime) / 1000; // in seconds

      // Camera push zoom lerp (1400 -> 950)
      const cameraProgress = Math.min(elapsed / 2.2, 1.0);
      camera.position.z = 1400 - easeInOutExpo(cameraProgress) * 450;

      // Globe rotation
      globeGroup.rotation.y += 0.006;
      orbitSystem.rotation.y -= 0.009;

      // Scale transition (0.2 -> 1.0 during assembly, then 1.0 -> 0.45 during morph at 3.0s)
      if (elapsed < 1.2) {
        const assemblyProgress = Math.min(elapsed / 1.2, 1.0);
        const s = 0.2 + easeInOutExpo(assemblyProgress) * 0.8;
        globeGroup.scale.set(s, s, s);
      } else if (elapsed > 3.0) {
        const morphProgress = Math.min((elapsed - 3.0) / 0.4, 1.0);
        const s = 1.0 - easeInOutExpo(morphProgress) * 0.55;
        globeGroup.scale.set(s, s, s);
      } else {
        globeGroup.scale.set(1.0, 1.0, 1.0);
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
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
      initial={{ opacity: 0 }}
      animate={{ opacity: sequencePhase === 4 ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[99998] bg-[#0D1117] flex items-center justify-center overflow-hidden pointer-events-none"
    >
      {/* 3D WebGL Globe Canvas */}
      <div ref={mountRef} className="absolute inset-0 flex items-center justify-center" />

      {/* Cinematic Staggered Text Reveal Overlay */}
      <div className="relative z-10 text-center max-w-3xl px-4 space-y-4">
        {/* AEGIS Logo */}
        {sequencePhase >= 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-3 mb-2"
          >
            <div className="w-12 h-12 rounded-2xl neu-raised flex items-center justify-center text-[#CFD0CD] bg-[#55443A] border border-[#8A9992]/50 shadow-[0_0_25px_rgba(138,153,146,0.3)]">
              <Shield className="w-6 h-6 text-[#CFD0CD]" strokeWidth={2.2} />
            </div>
          </motion.div>
        )}

        {/* Badge */}
        {sequencePhase >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neu-inset text-[#CFD0CD] border border-[#8A9992] text-xs font-mono font-bold bg-[#4D2308]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8A9992]" />
            <span>AUTONOMOUS AI CYBER SHIELD</span>
          </motion.div>
        )}

        {/* Title & Description */}
        {sequencePhase >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-2 font-heading"
          >
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#CFD0CD] tracking-tight">
              Enterprise AI Threat Detection & Identity Defense
            </h1>
            <p className="text-xs sm:text-sm text-[#8A9992] font-mono tracking-wide">
              Fusing Real-time Multi-vector Scanning & MITRE ATT&CK Mapping
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
