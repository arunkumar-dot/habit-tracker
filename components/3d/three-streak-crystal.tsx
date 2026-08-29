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
  { base: string; emissive: string; m3: string; m7: string; m30: string; glow: string }
> = {
  terracotta: {
    base: "#C2410C",
    emissive: "#EA580C",
    m3: "#10B981",
    m7: "#8B5CF6",
    m30: "#F59E0B",
    glow: "#FB923C",
  },
  cyber: {
    base: "#7C3AED",
    emissive: "#9333EA",
    m3: "#EC4899",
    m7: "#06B6D4",
    m30: "#FACC15",
    glow: "#C084FC",
  },
  emerald: {
    base: "#059669",
    emissive: "#10B981",
    m3: "#14B8A6",
    m7: "#0D9488",
    m30: "#F59E0B",
    glow: "#34D399",
  },
  ocean: {
    base: "#0284C7",
    emissive: "#0EA5E9",
    m3: "#60A5FA",
    m7: "#818CF8",
    m30: "#34D399",
    glow: "#38BDF8",
  },
  sunset: {
    base: "#D97706",
    emissive: "#F59E0B",
    m3: "#FB7185",
    m7: "#EA580C",
    m30: "#FDE047",
    glow: "#FBBF24",
  },
  monochrome: {
    base: "#52525B",
    emissive: "#71717A",
    m3: "#A1A1AA",
    m7: "#D4D4D8",
    m30: "#FFFFFF",
    glow: "#E4E4E7",
  },
};

export function ThreeStreakCrystal({
  streak,
  size = 180,
  isCompletedToday = false,
  completionRatio = 0,
}: ThreeStreakCrystalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { palette, theme } = useTheme();

  // Clamp ratio between 0 and 1
  const ratio = Math.max(0, Math.min(1, completionRatio));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const themeColors = PALETTE_CRYSTAL_THEMES[palette] ?? PALETTE_CRYSTAL_THEMES.terracotta;

    // Pick crystal colors based on streak milestones
    let baseHex = themeColors.base;
    let emissiveHex = themeColors.emissive;
    let glowHex = themeColors.glow;

    if (streak >= 30) {
      baseHex = themeColors.m30;
      emissiveHex = themeColors.m30;
      glowHex = "#FDE047";
    } else if (streak >= 7) {
      baseHex = themeColors.m7;
      emissiveHex = themeColors.m7;
      glowHex = "#C084FC";
    } else if (streak >= 3) {
      baseHex = themeColors.m3;
      emissiveHex = themeColors.m3;
      glowHex = "#34D399";
    }

    // ── Smooth Color & Brightness Interpolation per Completed Habit ──────────
    // As habits are completed (ratio 0.0 -> 1.0), the color smoothly blooms in saturation & radiance
    const baseColor = new THREE.Color(baseHex).lerp(new THREE.Color(glowHex), ratio * 0.45);
    const emissiveColor = new THREE.Color(emissiveHex).lerp(new THREE.Color(glowHex), ratio * 0.65);
    const dynamicEmissiveIntensity = 0.20 + ratio * 0.65; // Gradual 0.20 -> 0.85
    const dynamicRoughness = 0.30 - ratio * 0.20; // 0.30 -> 0.10 (sleeker polish)
    const dynamicMetalness = 0.15 + ratio * 0.35; // 0.15 -> 0.50 (deeper reflection)

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5.6;

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

    // ── 1. Proportional Progressive Lighting ─────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85 + ratio * 0.35);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(new THREE.Color(glowHex), 1.8 + ratio * 1.8);
    mainLight.position.set(4, 5, 5);
    scene.add(mainLight);

    const rimLight = new THREE.PointLight(baseColor, 2.0 + ratio * 2.8, 15);
    rimLight.position.set(-4, -4, 3);
    scene.add(rimLight);

    // ── 2. Morphing 3D Geometry Based on Streak Level ─────────────────────────
    let crystalGeo: THREE.BufferGeometry;
    let wireGeo: THREE.BufferGeometry;

    if (streak >= 30) {
      crystalGeo = new THREE.IcosahedronGeometry(1.45, 1);
      wireGeo = new THREE.IcosahedronGeometry(1.48, 1);
    } else if (streak >= 7) {
      crystalGeo = new THREE.IcosahedronGeometry(1.45, 0);
      wireGeo = new THREE.IcosahedronGeometry(1.48, 0);
    } else if (streak >= 3) {
      crystalGeo = new THREE.DodecahedronGeometry(1.35, 0);
      wireGeo = new THREE.DodecahedronGeometry(1.38, 0);
    } else {
      crystalGeo = new THREE.OctahedronGeometry(1.5, 0);
      wireGeo = new THREE.OctahedronGeometry(1.53, 0);
    }

    // Saturated crystal material responding smoothly to each checkmark
    const crystalMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      emissive: emissiveColor,
      emissiveIntensity: dynamicEmissiveIntensity,
      roughness: dynamicRoughness,
      metalness: dynamicMetalness,
      flatShading: true,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    scene.add(crystal);

    // Glowing Neon Wireframe Outline (scales opacity smoothly with ratio)
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(glowHex),
      wireframe: true,
      transparent: true,
      opacity: 0.30 + ratio * 0.55, // Gradual 0.30 -> 0.85
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    // ── 3. Particle Starfield Halo (Progressively grows with each habit) ──────
    const emberCount = 16 + Math.round(ratio * 44); // Scales from 16 up to 60 particles
    const emberGeo = new THREE.BufferGeometry();
    const emberPos = new Float32Array(emberCount * 3);
    for (let i = 0; i < emberCount; i++) {
      const radius = 1.9 + Math.random() * (0.6 + ratio * 0.9);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      emberPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      emberPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      emberPos[i * 3 + 2] = radius * Math.cos(phi);
    }
    emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPos, 3));
    const emberMat = new THREE.PointsMaterial({
      size: 0.07 + ratio * 0.06, // Scales from 0.07 to 0.13
      color: new THREE.Color(glowHex),
      transparent: true,
      opacity: 0.55 + ratio * 0.40, // Scales from 0.55 to 0.95
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
      targetRotY = x * 1.3;
      targetRotX = y * 1.3;
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

      // Spin rate increases continuously with completion progress (0.65 -> 1.8)
      const dynamicSpeed = 0.65 + ratio * 1.15;
      crystal.rotation.y += (targetRotY + t * dynamicSpeed - crystal.rotation.y) * 0.06;
      crystal.rotation.x += (targetRotX + Math.sin(t * 0.9) * 0.25 - crystal.rotation.x) * 0.06;

      // Vertical bounce vitality scales with habits completed
      const bounceAmp = 0.08 + ratio * 0.10;
      crystal.position.y = Math.sin(t * 2.0) * bounceAmp;

      // At 100% completion, add a subtle breathing pulse
      if (ratio >= 1.0) {
        const pulseScale = 1.0 + Math.sin(t * 3.5) * 0.08;
        crystal.scale.set(pulseScale, pulseScale, pulseScale);
        wire.scale.set(pulseScale, pulseScale, pulseScale);
      } else {
        crystal.scale.set(1, 1, 1);
        wire.scale.set(1, 1, 1);
      }

      wire.rotation.copy(crystal.rotation);
      wire.position.copy(crystal.position);

      // Embers swirl faster as habits are completed
      embers.rotation.y = -t * (0.35 + ratio * 0.85);
      embers.rotation.x = Math.sin(t * 0.6) * 0.3;

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
  }, [streak, size, palette, theme, isCompletedToday, ratio]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    />
  );
}
