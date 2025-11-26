/**
 * Custom GLSL Shaders for 3D Splash Screen
 * "Ice Matrix Wave" - Vertex displacement and gradient effects
 */

export const waveVertexShader = `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    vUv = uv;
    
    // Create flowing sine wave displacement
    vec3 pos = position;
    float wave = sin(pos.x * uFrequency + uTime) * 
                 cos(pos.y * uFrequency * 0.5 + uTime * 0.8);
    pos.z += wave * uAmplitude;
    
    vElevation = wave;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const waveFragmentShader = `
  uniform float uTime;
  uniform vec3 uColorStart;
  uniform vec3 uColorEnd;
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    // Blue to gold gradient based on wave elevation
    float mixStrength = (vElevation + 1.0) * 0.5;
    vec3 color = mix(uColorStart, uColorEnd, mixStrength);
    
    // Add glow effect
    float glow = pow(mixStrength, 2.0);
    color += glow * 0.3;
    
    gl_FragColor = vec4(color, 0.9);
  }
`;

export const particleVertexShader = `
  uniform float uTime;
  uniform float uSize;
  attribute float aScale;
  attribute vec3 aVelocity;
  varying vec3 vColor;
  
  void main() {
    vec3 pos = position + aVelocity * uTime;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * aScale * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    
    // Color based on velocity
    vColor = vec3(0.83, 0.69, 0.22); // Gold
  }
`;

export const particleFragmentShader = `
  varying vec3 vColor;
  
  void main() {
    // Create circular particle
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    if (dist > 0.5) discard;
    
    // Soft edges
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    
    gl_FragColor = vec4(vColor, alpha);
  }
`;





