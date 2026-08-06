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

    // 1. Three.js Scene Setup (Static Perspective Camera @ 1000px)
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

    // Color Tokens Matching Uploaded Reference Frame
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
      opacity: 0.28,
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
      opacity: 0.35,
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
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    globeGroup.add(particleSystem);

    // 4. Central Organic Core Loop & Core Node Callouts
    const coreTorusGeo = new THREE.TorusGeometry(85, 2.2, 16, 64);
    const coreTorusMat = new THREE.LineBasicMaterial({
      color: COLOR_WHITE,
      transparent: true,
      opacity: 0.85,
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
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const coreNodesSystem = new THREE.Points(coreNodesGeo, coreNodesMat);
    globeGroup.add(coreNodesSystem);

    // 5. Telemetry Text Sprite Helpers (Assembly HUD Callouts)
    const createTextSprite = (textLines) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.font = '13px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(207, 208, 205, 0.75)';
      textLines.forEach((line, idx) => {
        ctx.fillText(line, 10, 24 + idx * 20);
      });
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.8 });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(160, 80, 1);
      return sprite;
    };

    const topLeftSprite = createTextSprite(['push  %rbp', 'mov   %rsp,%rbp', 'call  0xffffffff81004580']);
    topLeftSprite.position.set(-280, 240, 50);
    globeGroup.add(topLeftSprite);

    const bottomRightSprite = createTextSprite(['str   x29, x30, [sp]', 'mov   x29, sp', 'ldr   x0, [x19, #24]']);
    bottomRightSprite.position.set(240, -220, 50);
    globeGroup.add(bottomRightSprite);

    // 6. Mouse Tilt Interaction Physics (Max 6 degrees tilt = 0.105 rad)
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

    // 7. 60 FPS Render Loop with Continuous Rotation
    let animationFrameId;
    let isTabActive = true;

    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animate = () => {
      if (isTabActive) {
        globeGroup.rotation.y += 0.0023;
        coreTorusMesh.rotation.z += 0.0040;

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
