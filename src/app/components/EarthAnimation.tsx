import { useRef, useEffect } from "react";
import * as THREE from "three";

export function EarthAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // --- Scene Setup ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);

    // --- Textures ---
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");
    
    // Using unpkg with jsdelivr fallback implied by standard CDN usage for NASA textures
    const dayTextureUrl = "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg";
    const nightTextureUrl = "https://unpkg.com/three-globe/example/img/earth-night.jpg";

    const dayTexture = textureLoader.load(dayTextureUrl);
    const nightTexture = textureLoader.load(nightTextureUrl);

    // --- Earth Geometry ---
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);

    // --- Custom Day/Night Shader Material ---
    const sunDirection = new THREE.Vector3(1, 0.3, 1).normalize(); // Solar declination approximation

    const earthMaterial = new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayTexture },
        nightTexture: { value: nightTexture },
        sunDirection: { value: sunDirection },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunDirection;

        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          // Calculate light intensity based on normal and sun direction
          float lightIntensity = dot(vNormal, sunDirection);
          
          // Soft transition for the day/night terminator
          float mixFactor = smoothstep(-0.2, 0.2, lightIntensity);

          vec4 dayColor = texture2D(dayTexture, vUv);
          vec4 nightColor = texture2D(nightTexture, vUv);

          // Enhance city lights glowing on the dark side
          nightColor = nightColor * 1.5; 

          // Mix day and night colors
          vec4 finalColor = mix(nightColor, dayColor, mixFactor);
          
          gl_FragColor = vec4(finalColor.rgb, 1.0);
        }
      `,
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    // Tilt the Earth slightly
    earth.rotation.z = 23.5 * Math.PI / 180;
    scene.add(earth);

    // --- Atmosphere Rim Glow ---
    const atmosphereGeo = new THREE.SphereGeometry(1.05, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color("#10B981") }, // EcoTrack green
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
          // Fresnel rim effect
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
          gl_FragColor = vec4(uColor, intensity * 0.5);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphere);

    // --- Interaction (Draggable) ---
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let autoRotateSpeed = 0.002;
    let autoSpin = true;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      autoSpin = false;
      previousMousePosition = { x: e.offsetX, y: e.offsetY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.offsetX - previousMousePosition.x;
      const deltaY = e.offsetY - previousMousePosition.y;

      earth.rotation.y += deltaX * 0.005;
      earth.rotation.x += deltaY * 0.005;

      previousMousePosition = { x: e.offsetX, y: e.offsetY };
    };

    const onMouseUp = () => {
      isDragging = false;
      // Resume auto-spin after a delay
      setTimeout(() => {
        if (!isDragging) autoSpin = true;
      }, 2000);
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);
    canvas.style.cursor = 'grab';

    // --- Animation Loop ---
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      if (autoSpin) {
        earth.rotation.y += autoRotateSpeed;
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- Resize Handler ---
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
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseUp);
      
      renderer.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
      dayTexture.dispose();
      nightTexture.dispose();
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: "100%", touchAction: "none" }}
    />
  );
}
