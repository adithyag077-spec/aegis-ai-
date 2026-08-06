import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Aegis3DGlobe = ({ visible = true }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Perspective Camera Setup (Camera Distance 1000px)
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

    // 3. Neural Node Sphere (1,200 Particles)
    const particleCount = window.innerWidth < 768 ? 400 : 1200;
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
      opacity: 0.85,
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
      opacity: 0.22,
      blending: THREE.AdditiveBlending
    });

    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    globeGroup.add(linesMesh);

    // 5. Latitude & Longitude Wireframe Rings
    const ringMaterial = new THREE.LineBasicMaterial({
      color: COLOR_SECONDARY_ACCENT,
      transparent: true,
      opacity: 0.12
    });

    for (let i = -2; i <= 2; i++) {
      const ringRadius = Math.sqrt(radius * radius - (i * 60) * (i * 60));
      if (ringRadius > 0) {
        const ringGeo = new THREE.RingGeometry(ringRadius - 0.5, ringRadius + 0.5, 64);
        const ringMesh = new THREE.LineLoop(ringGeo, ringMaterial);
        ringMesh.position.z = i * 60;
        ringMesh.rotation.x = Math.PI / 2;
        globeGroup.add(ringMesh);
      }
    }

    // 6. Outer Orbiting Threat Beacons
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

    // 7. Mouse Tilt Interaction Physics (Max 6 degrees tilt = 0.105 rad)
    let targetRotationX = 0;
    let targetRotationY = 0;
    const maxTilt = 0.105;

    const handleMouseMove = (e) => {
      if (window.innerWidth < 768 || prefersReducedMotion) return;
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      targetRotationY = mouseX * maxTilt;
      targetRotationX = -mouseY * maxTilt;
    };

    const handleMouseLeave = () => {
      targetRotationX = 0;
      targetRotationY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 8. 60 FPS Render Loop with Continuous 45s Rotation
    let animationFrameId;
    let isTabActive = true;

    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animate = () => {
      if (isTabActive) {
        globeGroup.rotation.y += 0.0023;
        orbitSystem.rotation.y -= 0.0035;

        globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.05;
        globeGroup.rotation.z += (targetRotationY - globeGroup.rotation.z) * 0.05;

        renderer.render(scene, camera);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup Lifecycle
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      particlesGeometry.dispose();
      particlesMaterial.dispose();
      linesGeometry.dispose();
      linesMaterial.dispose();
      ringMaterial.dispose();
      orbitGeo.dispose();
      orbitMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center transition-opacity duration-700 ${
        visible ? 'opacity-60' : 'opacity-0'
      }`}
    />
  );
};
