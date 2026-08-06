import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Glowing Cyber Network Sphere & Particles Component
const CyberSphere = ({ mouse, introProgress }) => {
  const meshRef = useRef();
  const particlesRef = useRef();
  const linesRef = useRef();

  // Generate icosahedron geometry vertices for glowing network nodes
  const { nodePositions, linePositions, particlePositions } = useMemo(() => {
    const sphereGeo = new THREE.IcosahedronGeometry(2.4, 2);
    const posAttr = sphereGeo.attributes.position;
    const count = posAttr.count;

    const nodes = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      nodes[i] = posAttr.array[i];
    }

    // Connect close vertices with lines
    const lineCoords = [];
    for (let i = 0; i < count; i++) {
      const v1 = new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
      for (let j = i + 1; j < count; j++) {
        const v2 = new THREE.Vector3(posAttr.getX(j), posAttr.getY(j), posAttr.getZ(j));
        if (v1.distanceTo(v2) < 1.3) {
          lineCoords.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
        }
      }
    }

    // Ambient floating particles around the network
    const pCount = 350;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 3.2 + Math.random() * 3.5;

      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = r * Math.cos(phi);
    }

    return {
      nodePositions: nodes,
      linePositions: new Float32Array(lineCoords),
      particlePositions: pPos
    };
  }, []);

  useFrame((state, delta) => {
    // Infinite gentle rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x += delta * 0.08;

      // Mouse Parallax Interaction
      const targetX = (mouse.current.x * 0.4 - meshRef.current.rotation.y) * 0.05;
      const targetY = (mouse.current.y * 0.4 - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y += targetX;
      meshRef.current.rotation.x += targetY;

      // Intro scale transition (0.5s -> 4.0s)
      const scaleVal = Math.min(1, Math.max(0.001, (introProgress - 0.5) / 1.5));
      meshRef.current.scale.setScalar(scaleVal);
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y -= delta * 0.05;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Network Node Dots */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodePositions.length / 3}
            array={nodePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#06B6D4"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Network Connections */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#3B82F6"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Ambient Floating Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlePositions.length / 3}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#38BDF8"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Inner Core Glow Sphere */}
      <mesh>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial
          color="#071A35"
          transparent
          opacity={0.4}
          wireframe
        />
      </mesh>
    </group>
  );
};

// Dynamic Scene Lights & Camera Controller
const DynamicScene = ({ mouse, introProgress }) => {
  const lightRef = useRef();

  useFrame(({ camera }) => {
    // Camera Intro Zoom (1.0s to 3.0s)
    const zoomProgress = Math.min(1, Math.max(0, (introProgress - 1.0) / 2.0));
    const startZ = 9.0;
    const targetZ = 5.8;
    camera.position.z = startZ - (startZ - targetZ) * zoomProgress;

    // Dynamic light movement
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(state => state.clock.getElapsedTime()) * 3;
      lightRef.current.position.y = Math.cos(state => state.clock.getElapsedTime()) * 3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#06B6D4" />
      <pointLight ref={lightRef} position={[-5, -5, 2]} intensity={1.5} color="#3B82F6" />
      <CyberSphere mouse={mouse} introProgress={introProgress} />
    </>
  );
};

export const Hero3DCanvas = ({ introProgress }) => {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouse.current = {
          x: (e.touches[0].clientX / window.innerWidth) * 2 - 1,
          y: -(e.touches[0].clientY / window.innerHeight) * 2 + 1
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <DynamicScene mouse={mouse} introProgress={introProgress} />
      </Canvas>
    </div>
  );
};
