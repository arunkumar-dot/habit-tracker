"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/components/providers/theme-provider";

interface ThreeStreakCrystalProps {
  streak: number;
  size?: number;
  isCompletedToday?: boolean;
  completionRatio?: number;
}

const PALETTE_CRYSTAL_THEMES: Record<
  string,
  { base: string; emissive: string; m3: string; m7: string; m30: string }
> = {
  terracotta: { base: "#C2410C", emissive: "#EA580C", m3: "#10B981", m7: "#8B5CF6", m30: "#F59E0B" },
  cyber: { base: "#7C3AED", emissive: "#A78BFA", m3: "#EC4899", m7: "#06B6D4", m30: "#FACC15" },
  emerald: { base: "#059669", emissive: "#34D399", m3: "#10B981", m7: "#0D9488", m30: "#F59E0B" },
  ocean: { base: "#0284C7", emissive: "#38BDF8", m3: "#60A5FA", m7: "#818CF8", m30: "#34D399" },
  sunset: { base: "#D97706", emissive: "#F59E0B", m3: "#FB7185", m7: "#EA580C", m30: "#FDE047" },
  monochrome: { base: "#71717A", emissive: "#E4E4E7", m3: "#A1A1AA", m7: "#D4D4D8", m30: "#FFFFFF" },
};

export function ThreeStreakCrystal({
  streak,
  size = 180,
  isCompletedToday = false,
  completionRatio = 0,
}: ThreeStreakCrystalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { palette, theme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const themeColors = PALETTE_CRYSTAL_THEMES[palette] ?? PALETTE_CRYSTAL_THEMES.terracotta;

    // Pick crystal colors based on streak milestones & theme
    let baseHex = themeColors.base;
    let emissiveHex = themeColors.emissive;
    if (streak >= 30) {
      baseHex = themeColors.m30;
      emissiveHex = themeColors.m30;
    } else if (streak >= 7) {
      baseHex = themeColors.m7;
      emissiveHex = themeColors.m7;
    } else if (streak >= 3) {
      baseHex = themeColors.m3;
      emissiveHex = themeColors.m3;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5.5;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Dynamic Lighting adjusted for daily completions
    const lightMultiplier = isCompletedToday ? 1.6 : 1.0 + completionRatio * 0.4;
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2 * lightMultiplier);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(new THREE.Color(baseHex), 3.5 * lightMultiplier, 20);
    pointLight.position.set(3, 4, 4);
    scene.add(pointLight);

    const backLight = new THREE.PointLight(0xffffff, 2 * lightMultiplier, 20);
    backLight.position.set(-3, -4, -2);
    scene.add(backLight);

    // ── 1. Morphing 3D Geometry based on Streak Level ─────────────────────────
    let crystalGeo: THREE.BufferGeometry;
    let wireGeo: THREE.BufferGeometry;

    if (streak >= 30) {
      // Mastery Gem: Complex Subdivided Icosahedron
      crystalGeo = new THREE.IcosahedronGeometry(1.55, 1);
      wireGeo = new THREE.IcosahedronGeometry(1.58, 1);
    } else if (streak >= 7) {
      // Momentum Gem: 20-Faceted Icosahedron
      crystalGeo = new THREE.IcosahedronGeometry(1.55, 0);
      wireGeo = new THREE.IcosahedronGeometry(1.58, 0);
    } else if (streak >= 3) {
      // Sprout Gem: 12-Faceted Dodecahedron
      crystalGeo = new THREE.DodecahedronGeometry(1.48, 0);
      wireGeo = new THREE.DodecahedronGeometry(1.51, 0);
    } else {
      // Initiate Crystal: 8-Faceted Octahedron
      crystalGeo = new THREE.OctahedronGeometry(1.6, 0);
      wireGeo = new THREE.OctahedronGeometry(1.63, 0);
    }

    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(baseHex),
      emissive: new THREE.Color(emissiveHex),
      emissiveIntensity: isCompletedToday ? 0.75 : 0.25 + completionRatio * 0.35,
      roughness: isCompletedToday ? 0.05 : 0.12,
      metalness: isCompletedToday ? 0.25 : 0.15,
      transmission: 0.65,
      thickness: 1.3,
      ior: 1.6,
      transparent: true,
      opacity: isCompletedToday ? 0.95 : 0.9,
      flatShading: true,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    scene.add(crystal);

    // Inner wireframe glow
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(emissiveHex),
      wireframe: true,
      transparent: true,
      opacity: isCompletedToday ? 0.65 : 0.35 + completionRatio * 0.2,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    // ── 2. Floating Ember Halo (Doubles on 100% daily completion) ────────────
    const emberCount = isCompletedToday ? 48 : 24 + Math.round(completionRatio * 16);
    const emberGeo = new THREE.BufferGeometry();
    const emberPos = new Float32Array(emberCount * 3);
    for (let i = 0; i < emberCount; i++) {
      const radius = 2.1 + Math.random() * (isCompletedToday ? 1.2 : 0.8);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      emberPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      emberPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      emberPos[i * 3 + 2] = radius * Math.cos(phi);
    }
    emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPos, 3));
    const emberMat = new THREE.PointsMaterial({
      size: isCompletedToday ? 0.11 : 0.08,
      color: new THREE.Color(emissiveHex),
      transparent: true,
      opacity: isCompletedToday ? 0.95 : 0.75,
      blending: THREE.AdditiveBlending,
    });
    const embers = new THREE.Points(emberGeo, emberMat);
    scene.add(embers);

    // Interactive pointer tilt
    let targetRotX = 0;
    let targetRotY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      targetRotY = x * 1.2;
      targetRotX = y * 1.2;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    let animationId: number;
    const startTime = performance.now();

    const animate = () => {
      if (document.hidden) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      const t = (performance.now() - startTime) * 0.001;

      // Spin rate increases when all today's habits are completed
      const spinSpeed = isCompletedToday ? 0.9 : 0.6;
      crystal.rotation.y += (targetRotY + t * spinSpeed - crystal.rotation.y) * 0.05;
      crystal.rotation.x += (targetRotX + Math.sin(t * 0.8) * 0.2 - crystal.rotation.x) * 0.05;
      crystal.position.y = Math.sin(t * 1.5) * (isCompletedToday ? 0.16 : 0.12);

      wire.rotation.copy(crystal.rotation);
      wire.position.copy(crystal.position);

      // Embers swirl around
      embers.rotation.y = -t * (isCompletedToday ? 0.5 : 0.3);
      embers.rotation.x = Math.sin(t * 0.5) * 0.25;

      if (renderer) {
        renderer.render(scene, camera);
      }
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handlePointerMove);
      crystalGeo.dispose();
      crystalMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      emberGeo.dispose();
      emberMat.dispose();
      if (renderer && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [streak, size, palette, theme, isCompletedToday, completionRatio]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    />
  );
}
