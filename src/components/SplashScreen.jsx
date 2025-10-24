/**
 * 3D Welcome Splash Screen - "Ice Matrix Wave"
 * Three.js powered animated intro with wireframe rink and probability wave
 */

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import {
  waveVertexShader,
  waveFragmentShader,
  particleVertexShader,
  particleFragmentShader,
} from '../shaders/waveShader';

// Wireframe Hockey Rink Tunnel
function RinkTunnel({ phase }) {
  const meshRef = useRef();
  
  useEffect(() => {
    if (!meshRef.current) return;
    
    // Create custom rink geometry
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const segments = 50;
    const radius = 3;
    
    // Create tunnel rings
    for (let i = 0; i < segments; i++) {
      const z = (i / segments) * 20 - 10;
      const points = 24;
      
      for (let j = 0; j <= points; j++) {
        const angle = (j / points) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.6; // Hockey rink oval shape
        vertices.push(x, y, z);
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    meshRef.current.geometry = geometry;
  }, []);
  
  useFrame((state) => {
    if (meshRef.current && phase === 1) {
      meshRef.current.rotation.z += 0.002;
    }
  });
  
  return (
    <points ref={meshRef}>
      <pointsMaterial
        color="#3B82F6"
        size={0.05}
        transparent
        opacity={phase === 1 ? 1 : 0}
      />
    </points>
  );
}

// Probability Wave
function ProbabilityWave({ phase }) {
  const meshRef = useRef();
  const uniforms = useRef({
    uTime: { value: 0 },
    uAmplitude: { value: 0.5 },
    uFrequency: { value: 2.0 },
    uColorStart: { value: new THREE.Color('#3B82F6') }, // Blue
    uColorEnd: { value: new THREE.Color('#D4AF37') },   // Gold
  });
  
  useFrame((state) => {
    if (meshRef.current && phase === 2) {
      uniforms.current.uTime.value = state.clock.elapsedTime;
    }
  });
  
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[8, 8, 64, 64]} />
      <shaderMaterial
        vertexShader={waveVertexShader}
        fragmentShader={waveFragmentShader}
        uniforms={uniforms.current}
        transparent
        opacity={phase === 2 ? 1 : 0}
      />
    </mesh>
  );
}

// Particle Explosion
function ParticleExplosion({ phase, onComplete }) {
  const particlesRef = useRef();
  const [particleCount] = useState(2000);
  
  useEffect(() => {
    if (!particlesRef.current) return;
    
    const geometry = particlesRef.current.geometry;
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Start in center
      positions[i * 3] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      
      scales[i] = Math.random();
      
      // Explosion velocities
      velocities[i * 3] = (Math.random() - 0.5) * 3;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 3;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aVelocity', new THREE.BufferAttribute(velocities, 3));
  }, [particleCount]);
  
  const uniforms = useRef({
    uTime: { value: 0 },
    uSize: { value: 8.0 },
  });
  
  useFrame((state) => {
    if (particlesRef.current && phase === 3) {
      uniforms.current.uTime.value = (state.clock.elapsedTime - 2.5) * 2;
      
      if (uniforms.current.uTime.value > 1.5 && onComplete) {
        onComplete();
      }
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <shaderMaterial
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms.current}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={phase === 3 ? 1 : 0}
      />
    </points>
  );
}

// Floating Stats
function FloatingStats({ phase }) {
  if (phase !== 2) return null;
  
  return (
    <>
      <Text
        position={[-2, 1.5, 0]}
        fontSize={0.3}
        color="#60A5FA"
        anchorX="center"
        anchorY="middle"
      >
        4 GAMES
      </Text>
      <Text
        position={[0, 1, 0]}
        fontSize={0.3}
        color="#3B82F6"
        anchorX="center"
        anchorY="middle"
      >
        +EV: 4
      </Text>
      <Text
        position={[2, 0.5, 0]}
        fontSize={0.3}
        color="#D4AF37"
        anchorX="center"
        anchorY="middle"
      >
        ELITE: 3
      </Text>
    </>
  );
}

// Logo Text
function LogoText({ phase }) {
  if (phase !== 3) return null;
  
  return (
    <Text
      position={[0, 0, 0]}
      fontSize={0.8}
      color="#D4AF37"
      anchorX="center"
      anchorY="middle"
      font="/fonts/Inter-Bold.woff"
      letterSpacing={0.05}
    >
      NHL SAVANT
    </Text>
  );
}

// Camera Animation
function CameraAnimation({ phase }) {
  const { camera } = useThree();
  
  useEffect(() => {
    const timeline = gsap.timeline();
    
    // Phase 1: Fly through rink tunnel (0-1s)
    timeline.to(camera.position, {
      z: -5,
      duration: 1,
      ease: 'power2.inOut',
    });
    
    // Phase 2: Pull back for wave view (1-2.5s)
    timeline.to(camera.position, {
      z: 5,
      y: 3,
      duration: 1.5,
      ease: 'power1.out',
    });
    
    // Phase 3: Center for explosion (2.5-3.5s)
    timeline.to(camera.position, {
      z: 4,
      y: 0,
      duration: 1,
      ease: 'power2.inOut',
    });
    
    return () => timeline.kill();
  }, [camera]);
  
  return null;
}

// Main Scene
function Scene({ phase, onParticleComplete }) {
  return (
    <>
      <CameraAnimation phase={phase} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <RinkTunnel phase={phase} />
      <ProbabilityWave phase={phase} />
      <FloatingStats phase={phase} />
      <ParticleExplosion phase={phase} onComplete={onParticleComplete} />
      <LogoText phase={phase} />
    </>
  );
}

// Main Component
export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState(1);
  const [fadeOut, setFadeOut] = useState(false);
  
  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(2), 1000);
    const timer2 = setTimeout(() => setPhase(3), 2500);
    const timer3 = setTimeout(() => setFadeOut(true), 3500);
    const timer4 = setTimeout(() => onComplete(), 4000);
    
    // Skip on any key press or click
    const handleSkip = () => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    };
    
    window.addEventListener('keydown', handleSkip);
    window.addEventListener('click', handleSkip);
    window.addEventListener('touchstart', handleSkip);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      window.removeEventListener('keydown', handleSkip);
      window.removeEventListener('click', handleSkip);
      window.removeEventListener('touchstart', handleSkip);
    };
  }, [onComplete]);
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        background: '#000',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Scene phase={phase} onParticleComplete={() => {}} />
      </Canvas>
      
      {/* Skip hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '0.875rem',
          fontFamily: 'Inter, sans-serif',
          opacity: fadeOut ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      >
        Press any key or tap to skip
      </div>
    </div>
  );
}

