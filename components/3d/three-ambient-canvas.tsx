"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/components/providers/theme-provider";

// Helper to generate a crisp, anti-aliased glowing circular star sprite texture
function createStarTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.85)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.35)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const PALETTE_COLORS: Record<string, { primary: number; secondary: number; line: number }> = {
  terracotta: { primary: 0xe86f3c, secondary: 0xf59e0b, line: 0xc2410c },
  cyber: { primary: 0xa78bfa, secondary: 0xf472b6, line: 0x8b5cf6 },
  emerald: { primary: 0x34d399, secondary: 0x6ee7b7, line: 0x10b981 },
  ocean: { primary: 0x38bdf8, secondary: 0x818cf8, line: 0x0284c7 },
  sunset: { primary: 0xf59e0b, secondary: 0xfb923c, line: 0xd97706 },
  monochrome: { primary: 0xe4e4e7, secondary: 0xa1a1aa, line: 0x71717a },
};

export interface ThreeAmbientCanvasProps {
  intensity?: number;
}

export function ThreeAmbientCanvas({ intensity = 1 }: ThreeAmbientCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, palette } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 24;

    // 2. WebGL Renderer with High-DPI
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 3. Theme Colors
    const paletteTheme = PALETTE_COLORS[palette] ?? PALETTE_COLORS.terracotta;
    const starColor = new THREE.Color(paletteTheme.primary);
    const starColorAlt = new THREE.Color(paletteTheme.secondary);
    const lineColor = new THREE.Color(paletteTheme.line);

    // 4. Constellation Nodes (Star Particles)
    const nodeCount = window.innerWidth < 768 ? 65 : 120;
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);
    const sizes = new Float32Array(nodeCount);
    const velocities: { x: number; y: number; z: number; originX: number; originY: number; originZ: number }[] = [];

    const spreadX = 36;
    const spreadY = 24;
    const spreadZ = 16;

    for (let i = 0; i < nodeCount; i++) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * spreadX;
      const y = (Math.random() - 0.5) * spreadY;
      const z = (Math.random() - 0.5) * spreadZ;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      velocities.push({
        x: (Math.random() - 0.5) * 0.008,
        y: (Math.random() - 0.5) * 0.008,
        z: (Math.random() - 0.5) * 0.005,
        originX: x,
        originY: y,
        originZ: z,
      });

      // Color variation between primary and secondary accent
      const mixRatio = Math.random();
      const col = starColor.clone().lerp(starColorAlt, mixRatio);
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      // Varied node size
      sizes[i] = (Math.random() * 0.8 + 0.5) * (isDark ? 1.0 : 0.85);
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const starTexture = createStarTexture();
    const starMaterial = new THREE.PointsMaterial({
      size: isDark ? 0.75 : 0.65,
      map: starTexture,
      transparent: true,
      vertexColors: true,
      opacity: isDark ? 0.85 : 0.45,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });

    const starMesh = new THREE.Points(starGeometry, starMaterial);
    scene.add(starMesh);

    // 5. Constellation Filaments (Dynamic Line Geometry)
    const maxConnections = nodeCount * 4;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineColors = new Float32Array(maxConnections * 6);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage)
    );
    lineGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage)
    );

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.4 : 0.22,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });

    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineMesh);

    // 6. Interactive Pointer Physics
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 6;
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 4;
    };
    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    // 7. Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // 8. Silky Smooth 60fps Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();
    const connectionDistSq = 5.2 * 5.2;

    const animate = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Pointer smoothing
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      camera.position.x = currentMouseX * 0.8;
      camera.position.y = currentMouseY * 0.8;
      camera.lookAt(0, 0, 0);

      // Subtle group rotation
      starMesh.rotation.y = elapsedTime * 0.02;
      starMesh.rotation.x = Math.sin(elapsedTime * 0.015) * 0.03;
      lineMesh.rotation.y = starMesh.rotation.y;
      lineMesh.rotation.x = starMesh.rotation.x;

      // Update node positions with gentle floating wander
      const posAttr = starGeometry.attributes.position as THREE.BufferAttribute;
      const currentPos = posAttr.array as Float32Array;

      for (let i = 0; i < nodeCount; i++) {
        const i3 = i * 3;
        const vel = velocities[i];

        currentPos[i3] += vel.x + Math.sin(elapsedTime * 0.5 + i) * 0.003;
        currentPos[i3 + 1] += vel.y + Math.cos(elapsedTime * 0.4 + i) * 0.003;
        currentPos[i3 + 2] += vel.z;

        // Soft boundary reflection
        if (Math.abs(currentPos[i3] - vel.originX) > 4) vel.x *= -1;
        if (Math.abs(currentPos[i3 + 1] - vel.originY) > 3) vel.y *= -1;
        if (Math.abs(currentPos[i3 + 2] - vel.originZ) > 3) vel.z *= -1;
      }
      posAttr.needsUpdate = true;

      // Update dynamic constellation connection lines
      let lineIndex = 0;
      let colorIndex = 0;

      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const i3 = i * 3;
          const j3 = j * 3;

          const dx = currentPos[i3] - currentPos[j3];
          const dy = currentPos[i3 + 1] - currentPos[j3 + 1];
          const dz = currentPos[i3 + 2] - currentPos[j3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < connectionDistSq && lineIndex < maxConnections * 6 - 6) {
            const alpha = 1.0 - Math.sqrt(distSq) / 5.2;

            linePositions[lineIndex++] = currentPos[i3];
            linePositions[lineIndex++] = currentPos[i3 + 1];
            linePositions[lineIndex++] = currentPos[i3 + 2];

            linePositions[lineIndex++] = currentPos[j3];
            linePositions[lineIndex++] = currentPos[j3 + 1];
            linePositions[lineIndex++] = currentPos[j3 + 2];

            const intensity = alpha * (isDark ? 0.9 : 0.6);
            lineColors[colorIndex++] = lineColor.r * intensity;
            lineColors[colorIndex++] = lineColor.g * intensity;
            lineColors[colorIndex++] = lineColor.b * intensity;

            lineColors[colorIndex++] = lineColor.r * intensity;
            lineColors[colorIndex++] = lineColor.g * intensity;
            lineColors[colorIndex++] = lineColor.b * intensity;
          }
        }
      }

      lineGeometry.setDrawRange(0, lineIndex / 3);
      (lineGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (lineGeometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      starGeometry.dispose();
      starMaterial.dispose();
      starTexture.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme, palette, isDark]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700"
      style={{
        opacity: isDark ? 0.88 : 0.45,
      }}
    />
  );
}
