import { useRef, useEffect } from "react";
import * as THREE from "three";

export function EarthAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // --- Scene ---
    const scene = new THREE.Scene();

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.8;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // --- Earth sphere ---
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);

    // Custom shader material for a stylized wireframe earth
    const earthMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color("#10B981") },
        uColor2: { value: new THREE.Color("#3B82F6") },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;

        void main() {
          // Fresnel/rim lighting effect
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
          
          // Animated latitude/longitude grid lines
          float lat = abs(sin(vPosition.y * 12.0));
          float lon = abs(sin(atan(vPosition.z, vPosition.x) * 8.0 + uTime * 0.3));
          float grid = smoothstep(0.92, 0.96, lat) + smoothstep(0.92, 0.96, lon);
          grid = clamp(grid, 0.0, 1.0);

          // Animated dot pattern (continental feel)
          float dots = sin(vPosition.x * 20.0 + uTime * 0.5) * sin(vPosition.y * 20.0) * sin(vPosition.z * 20.0);
          dots = smoothstep(0.3, 0.5, dots) * 0.3;

          // Color gradient from top to bottom
          vec3 color = mix(uColor1, uColor2, vUv.y + sin(uTime * 0.2) * 0.1);
          
          // Combine
          float alpha = fresnel * 0.6 + grid * 0.8 + dots;
          alpha = clamp(alpha, 0.05, 0.9);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.rotation.x = 0.3;
    scene.add(earth);

    // --- Wireframe overlay ---
    const wireGeo = new THREE.SphereGeometry(1.005, 32, 32);
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#10B981"),
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const wireframe = new THREE.Mesh(wireGeo, wireMat);
    wireframe.rotation.x = 0.3;
    scene.add(wireframe);

    // --- Atmosphere glow ---
    const atmosphereGeo = new THREE.SphereGeometry(1.15, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color("#10B981") },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
          gl_FragColor = vec4(uColor, intensity * 0.4);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphere);

    // --- Orbiting particles ---
    const particleCount = 200;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.3 + Math.random() * 0.5;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      speeds[i] = 0.002 + Math.random() * 0.005;
    }

    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color("#10B981"),
      size: 0.015,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particlesGeo, particleMat);
    scene.add(particles);

    // --- Animation loop ---
    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Rotate earth slowly
      earth.rotation.y = elapsed * 0.15;
      wireframe.rotation.y = elapsed * 0.15;

      // Update shader time
      earthMaterial.uniforms.uTime.value = elapsed;

      // Rotate particles
      particles.rotation.y = elapsed * 0.05;
      particles.rotation.x = Math.sin(elapsed * 0.1) * 0.1;

      // Subtle camera breathing
      camera.position.z = 2.8 + Math.sin(elapsed * 0.3) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // --- Resize handler ---
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
      particlesGeo.dispose();
      particleMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: "100%" }}
    />
  );
}
