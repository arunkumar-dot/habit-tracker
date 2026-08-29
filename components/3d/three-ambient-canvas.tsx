"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/components/providers/theme-provider";

// Helper to generate a crisp glowing circular star sprite texture
function createStarTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.9)");
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

// Large dreamy bokeh texture for foreground embers & aurora orbs
function createBokehTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.85)");
    gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.5)");
    gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.15)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const PALETTE_COLORS: Record<string, { primary: number; secondary: number; line: number; warm: number }> = {
  terracotta: { primary: 0xe86f3c, secondary: 0xf59e0b, line: 0xc2410c, warm: 0xffedd5 },
  cyber: { primary: 0xa78bfa, secondary: 0xf472b6, line: 0x8b5cf6, warm: 0xfce7f3 },
  emerald: { primary: 0x34d399, secondary: 0x6ee7b7, line: 0x10b981, warm: 0xd1fae5 },
  ocean: { primary: 0x38bdf8, secondary: 0x818cf8, line: 0x0284c7, warm: 0xe0f2fe },
  sunset: { primary: 0xf59e0b, secondary: 0xfb923c, line: 0xd97706, warm: 0xfef3c7 },
  monochrome: { primary: 0xe4e4e7, secondary: 0xa1a1aa, line: 0x71717a, warm: 0xffffff },
};

export interface ThreeAmbientCanvasProps {
  intensity?: number;
}

export function ThreeAmbientCanvas({ intensity = 1 }: ThreeAmbientCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, palette, backgroundStyle } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clean prior canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Minimal mode disables WebGL canvas completely for battery saving
    if (backgroundStyle === "minimal") {
      return;
    }

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      120
    );
    camera.position.set(0, 0, 22);

    // 2. WebGL Renderer
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
    const primaryColor = new THREE.Color(paletteTheme.primary);
    const secondaryColor = new THREE.Color(paletteTheme.secondary);
    const warmColor = new THREE.Color(paletteTheme.warm);
    const lineColor = new THREE.Color(paletteTheme.line);

    // 4. Pointer Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseWorldX = 0;
    let mouseWorldY = 0;

    const onPointerMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onPointerMove, { passive: true });

    let animId: number;
    const startTime = performance.now();

    // -------------------------------------------------------------
    // MODE 1: COSMIC EMBERS & FIREFLIES (stardust)
    // -------------------------------------------------------------
    if (backgroundStyle === "stardust") {
      const emberCount = window.innerWidth < 768 ? 200 : 340;
      const positions = new Float32Array(emberCount * 3);
      const colors = new Float32Array(emberCount * 3);
      const baseColors = new Float32Array(emberCount * 3);
      const speeds = new Float32Array(emberCount);
      const phases = new Float32Array(emberCount);
      const sways = new Float32Array(emberCount);

      const spreadX = 40;
      const spreadY = 30;
      const spreadZ = 25;

      for (let i = 0; i < emberCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * spreadX;
        positions[i3 + 1] = (Math.random() - 0.5) * spreadY;
        positions[i3 + 2] = (Math.random() - 0.5) * spreadZ;

        speeds[i] = Math.random() * 0.02 + 0.008;
        phases[i] = Math.random() * Math.PI * 2;
        sways[i] = Math.random() * 0.015 + 0.005;

        const rand = Math.random();
        const chosen = rand > 0.6 ? primaryColor : rand > 0.3 ? secondaryColor : warmColor;
        colors[i3] = chosen.r;
        colors[i3 + 1] = chosen.g;
        colors[i3 + 2] = chosen.b;

        baseColors[i3] = chosen.r;
        baseColors[i3 + 1] = chosen.g;
        baseColors[i3 + 2] = chosen.b;
      }

      const emberGeo = new THREE.BufferGeometry();
      emberGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      emberGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const emberMat = new THREE.PointsMaterial({
        size: isDark ? 0.42 : 0.32,
        vertexColors: true,
        transparent: true,
        opacity: (isDark ? 0.88 : 0.6) * intensity,
        map: createStarTexture(),
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
        depthWrite: false,
      });

      const emberSystem = new THREE.Points(emberGeo, emberMat);
      scene.add(emberSystem);

      // Foreground bokeh orbs
      const bokehCount = 14;
      const bokehGeo = new THREE.BufferGeometry();
      const bokehPos = new Float32Array(bokehCount * 3);
      const bokehCol = new Float32Array(bokehCount * 3);

      for (let i = 0; i < bokehCount; i++) {
        bokehPos[i * 3] = (Math.random() - 0.5) * 32;
        bokehPos[i * 3 + 1] = (Math.random() - 0.5) * 22;
        bokehPos[i * 3 + 2] = Math.random() * 12;

        const col = i % 2 === 0 ? primaryColor : secondaryColor;
        bokehCol[i * 3] = col.r;
        bokehCol[i * 3 + 1] = col.g;
        bokehCol[i * 3 + 2] = col.b;
      }
      bokehGeo.setAttribute("position", new THREE.BufferAttribute(bokehPos, 3));
      bokehGeo.setAttribute("color", new THREE.BufferAttribute(bokehCol, 3));

      const bokehMat = new THREE.PointsMaterial({
        size: isDark ? 2.4 : 1.8,
        vertexColors: true,
        transparent: true,
        opacity: (isDark ? 0.25 : 0.12) * intensity,
        map: createBokehTexture(),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const bokehSystem = new THREE.Points(bokehGeo, bokehMat);
      scene.add(bokehSystem);

      const animateStardust = () => {
        if (document.hidden) {
          animId = requestAnimationFrame(animateStardust);
          return;
        }

        const t = (performance.now() - startTime) * 0.001;
        mouseX += (targetMouseX - mouseX) * 0.06;
        mouseY += (targetMouseY - mouseY) * 0.06;

        mouseWorldX = mouseX * 18;
        mouseWorldY = mouseY * 12;

        const posAttr = emberGeo.attributes.position as THREE.BufferAttribute;
        const colAttr = emberGeo.attributes.color as THREE.BufferAttribute;
        const pos = posAttr.array as Float32Array;
        const col = colAttr.array as Float32Array;

        const glowRadius = 7.5;

        for (let i = 0; i < emberCount; i++) {
          const i3 = i * 3;

          pos[i3 + 1] += speeds[i]!;
          pos[i3] += Math.sin(t * 1.2 + phases[i]!) * sways[i]!;
          pos[i3 + 2] += Math.cos(t * 0.9 + phases[i]!) * sways[i]!;

          if (pos[i3 + 1]! > spreadY / 2) {
            pos[i3 + 1] = -spreadY / 2;
            pos[i3] = (Math.random() - 0.5) * spreadX;
          }

          const dx = pos[i3]! - mouseWorldX;
          const dy = pos[i3 + 1]! - mouseWorldY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < glowRadius) {
            const glow = 1 - dist / glowRadius;
            col[i3] = THREE.MathUtils.lerp(baseColors[i3]!, warmColor.r * 1.8, glow);
            col[i3 + 1] = THREE.MathUtils.lerp(baseColors[i3 + 1]!, warmColor.g * 1.8, glow);
            col[i3 + 2] = THREE.MathUtils.lerp(baseColors[i3 + 2]!, warmColor.b * 1.8, glow);

            pos[i3] += (dx / (dist + 0.1)) * 0.03 * glow;
            pos[i3 + 1] += (dy / (dist + 0.1)) * 0.03 * glow;
          } else {
            col[i3] = THREE.MathUtils.lerp(col[i3]!, baseColors[i3]!, 0.06);
            col[i3 + 1] = THREE.MathUtils.lerp(col[i3 + 1]!, baseColors[i3 + 1]!, 0.06);
            col[i3 + 2] = THREE.MathUtils.lerp(col[i3 + 2]!, baseColors[i3 + 2]!, 0.06);
          }
        }

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;

        const bPos = (bokehGeo.attributes.position as THREE.BufferAttribute).array as Float32Array;
        for (let i = 0; i < bokehCount; i++) {
          const i3 = i * 3;
          bPos[i3 + 1] += 0.01;
          if (bPos[i3 + 1]! > 15) bPos[i3 + 1] = -15;
        }
        (bokehGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

        scene.rotation.y = mouseX * 0.12;
        scene.rotation.x = -mouseY * 0.1;

        renderer.render(scene, camera);
        animId = requestAnimationFrame(animateStardust);
      };

      animateStardust();
    }

    // -------------------------------------------------------------
    // MODE 2: MAGNETIC DOT MATRIX (magnetic_grid)
    // -------------------------------------------------------------
    else if (backgroundStyle === "magnetic_grid") {
      const cols = window.innerWidth < 768 ? 22 : 36;
      const rows = window.innerWidth < 768 ? 16 : 24;
      const totalDots = cols * rows;

      const positions = new Float32Array(totalDots * 3);
      const basePositions = new Float32Array(totalDots * 3);
      const colors = new Float32Array(totalDots * 3);
      const baseColors = new Float32Array(totalDots * 3);

      const spacingX = 42 / (cols - 1);
      const spacingY = 28 / (rows - 1);

      let idx = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = (c - (cols - 1) / 2) * spacingX;
          const y = (r - (rows - 1) / 2) * spacingY;
          const z = 0;

          positions[idx * 3] = x;
          positions[idx * 3 + 1] = y;
          positions[idx * 3 + 2] = z;

          basePositions[idx * 3] = x;
          basePositions[idx * 3 + 1] = y;
          basePositions[idx * 3 + 2] = z;

          const col = (r + c) % 4 === 0 ? secondaryColor : primaryColor;
          colors[idx * 3] = col.r * 0.55;
          colors[idx * 3 + 1] = col.g * 0.55;
          colors[idx * 3 + 2] = col.b * 0.55;

          baseColors[idx * 3] = col.r * 0.55;
          baseColors[idx * 3 + 1] = col.g * 0.55;
          baseColors[idx * 3 + 2] = col.b * 0.55;

          idx++;
        }
      }

      const gridGeo = new THREE.BufferGeometry();
      gridGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      gridGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const gridMat = new THREE.PointsMaterial({
        size: isDark ? 0.35 : 0.26,
        vertexColors: true,
        transparent: true,
        opacity: (isDark ? 0.85 : 0.5) * intensity,
        map: createStarTexture(),
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
        depthWrite: false,
      });

      const gridSystem = new THREE.Points(gridGeo, gridMat);
      scene.add(gridSystem);

      const animateGrid = () => {
        if (document.hidden) {
          animId = requestAnimationFrame(animateGrid);
          return;
        }

        const t = (performance.now() - startTime) * 0.001;
        mouseX += (targetMouseX - mouseX) * 0.06;
        mouseY += (targetMouseY - mouseY) * 0.06;

        mouseWorldX = mouseX * 20;
        mouseWorldY = mouseY * 13;

        const posAttr = gridGeo.attributes.position as THREE.BufferAttribute;
        const colAttr = gridGeo.attributes.color as THREE.BufferAttribute;
        const pos = posAttr.array as Float32Array;
        const col = colAttr.array as Float32Array;

        const magneticRadius = 9.0;

        for (let i = 0; i < totalDots; i++) {
          const i3 = i * 3;
          const bx = basePositions[i3]!;
          const by = basePositions[i3 + 1]!;

          const ambientWave = Math.sin(bx * 0.2 + t * 1.5) * Math.cos(by * 0.2 + t) * 0.8;

          const dx = bx - mouseWorldX;
          const dy = by - mouseWorldY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < magneticRadius) {
            const factor = 1 - dist / magneticRadius;
            pos[i3] = bx - (dx / (dist + 0.1)) * factor * 1.5;
            pos[i3 + 1] = by - (dy / (dist + 0.1)) * factor * 1.5;
            pos[i3 + 2] = ambientWave + factor * 5.0;

            col[i3] = THREE.MathUtils.lerp(baseColors[i3]!, warmColor.r * 1.6, factor);
            col[i3 + 1] = THREE.MathUtils.lerp(baseColors[i3 + 1]!, warmColor.g * 1.6, factor);
            col[i3 + 2] = THREE.MathUtils.lerp(baseColors[i3 + 2]!, warmColor.b * 1.6, factor);
          } else {
            pos[i3] += (bx - pos[i3]!) * 0.08;
            pos[i3 + 1] += (by - pos[i3 + 1]!) * 0.08;
            pos[i3 + 2] += (ambientWave - pos[i3 + 2]!) * 0.08;

            col[i3] += (baseColors[i3]! - col[i3]!) * 0.08;
            col[i3 + 1] += (baseColors[i3 + 1]! - col[i3 + 1]!) * 0.08;
            col[i3 + 2] += (baseColors[i3 + 2]! - col[i3 + 2]!) * 0.08;
          }
        }

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;

        scene.rotation.y = mouseX * 0.1;
        scene.rotation.x = -mouseY * 0.08;

        renderer.render(scene, camera);
        animId = requestAnimationFrame(animateGrid);
      };

      animateGrid();
    }

    // -------------------------------------------------------------
    // MODE 3: CELESTIAL CONSTELLATION (constellation)
    // -------------------------------------------------------------
    else if (backgroundStyle === "constellation") {
      const nodeCount = window.innerWidth < 768 ? 65 : 110;
      const positions = new Float32Array(nodeCount * 3);
      const colors = new Float32Array(nodeCount * 3);
      const velocities: { x: number; y: number; z: number }[] = [];

      const spreadX = 36;
      const spreadY = 24;
      const spreadZ = 16;

      for (let i = 0; i < nodeCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * spreadX;
        positions[i3 + 1] = (Math.random() - 0.5) * spreadY;
        positions[i3 + 2] = (Math.random() - 0.5) * spreadZ;

        velocities.push({
          x: (Math.random() - 0.5) * 0.008,
          y: (Math.random() - 0.5) * 0.008,
          z: (Math.random() - 0.5) * 0.004,
        });

        const chosenColor = Math.random() > 0.4 ? primaryColor : secondaryColor;
        colors[i3] = chosenColor.r;
        colors[i3 + 1] = chosenColor.g;
        colors[i3 + 2] = chosenColor.b;
      }

      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: isDark ? 0.38 : 0.28,
        vertexColors: true,
        transparent: true,
        opacity: (isDark ? 0.75 : 0.45) * intensity,
        map: createStarTexture(),
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
        depthWrite: false,
      });

      const particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);

      // Dynamic Filament Lines
      const maxConnections = nodeCount * 4;
      const linePositions = new Float32Array(maxConnections * 2 * 3);
      const lineColors = new Float32Array(maxConnections * 2 * 3);
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
      lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

      const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: (isDark ? 0.25 : 0.12) * intensity,
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
        depthWrite: false,
      });

      const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
      scene.add(lineMesh);

      const maxDist = 5.2;

      const animateConstellation = () => {
        if (document.hidden) {
          animId = requestAnimationFrame(animateConstellation);
          return;
        }

        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;

        let lineIdx = 0;
        let colorIdx = 0;

        for (let i = 0; i < nodeCount; i++) {
          const i3 = i * 3;
          posArray[i3] += velocities[i]!.x;
          posArray[i3 + 1] += velocities[i]!.y;
          posArray[i3 + 2] += velocities[i]!.z;

          if (Math.abs(posArray[i3]!) > spreadX / 2) velocities[i]!.x *= -1;
          if (Math.abs(posArray[i3 + 1]!) > spreadY / 2) velocities[i]!.y *= -1;
          if (Math.abs(posArray[i3 + 2]!) > spreadZ / 2) velocities[i]!.z *= -1;

          for (let j = i + 1; j < nodeCount; j++) {
            const j3 = j * 3;
            const dx = posArray[i3]! - posArray[j3]!;
            const dy = posArray[i3 + 1]! - posArray[j3 + 1]!;
            const dz = posArray[i3 + 2]! - posArray[j3 + 2]!;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < maxDist && lineIdx < maxConnections * 6) {
              const alpha = (1 - dist / maxDist) * (isDark ? 0.4 : 0.2);

              linePositions[lineIdx++] = posArray[i3]!;
              linePositions[lineIdx++] = posArray[i3 + 1]!;
              linePositions[lineIdx++] = posArray[i3 + 2]!;

              linePositions[lineIdx++] = posArray[j3]!;
              linePositions[lineIdx++] = posArray[j3 + 1]!;
              linePositions[lineIdx++] = posArray[j3 + 2]!;

              lineColors[colorIdx++] = lineColor.r * alpha;
              lineColors[colorIdx++] = lineColor.g * alpha;
              lineColors[colorIdx++] = lineColor.b * alpha;

              lineColors[colorIdx++] = secondaryColor.r * alpha;
              lineColors[colorIdx++] = secondaryColor.g * alpha;
              lineColors[colorIdx++] = secondaryColor.b * alpha;
            }
          }
        }

        posAttr.needsUpdate = true;
        (lineGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
        (lineGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
        lineGeo.setDrawRange(0, lineIdx / 3);

        scene.rotation.y = mouseX * 0.15;
        scene.rotation.x = -mouseY * 0.15;

        renderer.render(scene, camera);
        animId = requestAnimationFrame(animateConstellation);
      };

      animateConstellation();
    }

    // -------------------------------------------------------------
    // MODE 4: ETHEREAL AURORA GLOW (aurora_glow)
    // -------------------------------------------------------------
    else if (backgroundStyle === "aurora_glow") {
      const orbCount = 5;
      const orbGroup = new THREE.Group();
      scene.add(orbGroup);

      const orbMeshes: { mesh: THREE.Mesh; speedX: number; speedY: number; baseX: number; baseY: number; phase: number }[] = [];

      for (let i = 0; i < orbCount; i++) {
        const size = Math.random() * 12 + 10;
        const geo = new THREE.PlaneGeometry(size, size);
        const col = i % 2 === 0 ? primaryColor : secondaryColor;

        const mat = new THREE.MeshBasicMaterial({
          map: createBokehTexture(),
          color: col,
          transparent: true,
          opacity: (isDark ? 0.35 : 0.18) * intensity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const mesh = new THREE.Mesh(geo, mat);
        const baseX = (Math.random() - 0.5) * 20;
        const baseY = (Math.random() - 0.5) * 15;
        mesh.position.set(baseX, baseY, -4);
        orbGroup.add(mesh);

        orbMeshes.push({
          mesh,
          speedX: Math.random() * 0.4 + 0.2,
          speedY: Math.random() * 0.4 + 0.2,
          baseX,
          baseY,
          phase: Math.random() * Math.PI * 2,
        });
      }

      // Cursor spotlight mesh
      const spotGeo = new THREE.PlaneGeometry(16, 16);
      const spotMat = new THREE.MeshBasicMaterial({
        map: createBokehTexture(),
        color: warmColor,
        transparent: true,
        opacity: (isDark ? 0.28 : 0.14) * intensity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const spotMesh = new THREE.Mesh(spotGeo, spotMat);
      spotMesh.position.z = 2;
      scene.add(spotMesh);

      const animateAurora = () => {
        if (document.hidden) {
          animId = requestAnimationFrame(animateAurora);
          return;
        }

        const t = (performance.now() - startTime) * 0.001;
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        spotMesh.position.x = mouseX * 18;
        spotMesh.position.y = mouseY * 12;

        orbMeshes.forEach((o) => {
          o.mesh.position.x = o.baseX + Math.sin(t * o.speedX + o.phase) * 6;
          o.mesh.position.y = o.baseY + Math.cos(t * o.speedY + o.phase) * 4;
        });

        renderer.render(scene, camera);
        animId = requestAnimationFrame(animateAurora);
      };

      animateAurora();
    }

    // -------------------------------------------------------------
    // MODE 5: HYPERSPACE WARP FIELD (warp)
    // -------------------------------------------------------------
    else if (backgroundStyle === "warp") {
      const starCount = 350;
      const starGeo = new THREE.BufferGeometry();
      const starPositions = new Float32Array(starCount * 3);
      const starSpeeds = new Float32Array(starCount);

      for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 40;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        starPositions[i * 3 + 2] = Math.random() * 40 - 20;
        starSpeeds[i] = Math.random() * 0.12 + 0.06;
      }

      starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

      const starMat = new THREE.PointsMaterial({
        size: isDark ? 0.35 : 0.25,
        color: primaryColor,
        transparent: true,
        opacity: (isDark ? 0.8 : 0.5) * intensity,
        map: createStarTexture(),
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      });

      const starMesh = new THREE.Points(starGeo, starMat);
      scene.add(starMesh);

      const animateWarp = () => {
        if (document.hidden) {
          animId = requestAnimationFrame(animateWarp);
          return;
        }

        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        const positions = starGeo.attributes.position as THREE.BufferAttribute;
        const array = positions.array as Float32Array;

        for (let i = 0; i < starCount; i++) {
          const zIdx = i * 3 + 2;
          array[zIdx] += starSpeeds[i]! * 1.5;

          if (array[zIdx]! > 24) {
            array[zIdx] = -24;
            array[i * 3] = (Math.random() - 0.5) * 40;
            array[i * 3 + 1] = (Math.random() - 0.5) * 30;
          }
        }
        positions.needsUpdate = true;

        starMesh.rotation.x = mouseY * 0.2;
        starMesh.rotation.y = mouseX * 0.2;

        renderer.render(scene, camera);
        animId = requestAnimationFrame(animateWarp);
      };

      animateWarp();
    }

    // 5. Handle Resize
    const handleResize = () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // 6. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [theme, palette, backgroundStyle, intensity, isDark]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 overflow-hidden"
    />
  );
}
