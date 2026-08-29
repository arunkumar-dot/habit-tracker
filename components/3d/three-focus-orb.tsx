"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/components/providers/theme-provider";
import type { PomodoroMode } from "@/hooks/use-pomodoro";

interface ThreeFocusOrbProps {
  mode: PomodoroMode;
  isRunning: boolean;
  size?: number;
}

const THEME_FOCUS_COLORS: Record<string, { main: string; emissive: string; ring: string }> = {
  terracotta: { main: "#EA580C", emissive: "#C2410C", ring: "#F59E0B" },
  cyber: { main: "#8B5CF6", emissive: "#7C3AED", ring: "#EC4899" },
  emerald: { main: "#10B981", emissive: "#059669", ring: "#34D399" },
  ocean: { main: "#0284C7", emissive: "#0369A1", ring: "#38BDF8" },
  sunset: { main: "#D97706", emissive: "#B45309", ring: "#F59E0B" },
  monochrome: { main: "#E4E4E7", emissive: "#71717A", ring: "#FFFFFF" },
};

export function ThreeFocusOrb({ mode, isRunning, size = 260 }: ThreeFocusOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { palette: activePalette, theme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const themeFocus = THEME_FOCUS_COLORS[activePalette] ?? THEME_FOCUS_COLORS.terracotta;

    // Color configurations per mode
    const modePalettes: Record<PomodoroMode, { main: string; emissive: string; ring: string }> = {
      focus: themeFocus,
      shortBreak: {
        main: "#10B981",
        emissive: "#059669",
        ring: "#34D399",
      },
      longBreak: {
        main: "#3B82F6",
        emissive: "#2563EB",
        ring: "#60A5FA",
      },
    };

    const orbColors = modePalettes[mode];

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.8;

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

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(new THREE.Color(orbColors.main), 4, 15);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const backLight = new THREE.PointLight(new THREE.Color(orbColors.ring), 3, 15);
    backLight.position.set(-2, -3, -3);
    scene.add(backLight);

    // Liquid / Glass Orb Geometry
    const orbGeo = new THREE.IcosahedronGeometry(1.35, 16);
    const orbMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(orbColors.main),
      emissive: new THREE.Color(orbColors.emissive),
      emissiveIntensity: isRunning ? 0.45 : 0.25,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.75,
      thickness: 1.5,
      ior: 1.45,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
    const orbMesh = new THREE.Mesh(orbGeo, orbMat);
    scene.add(orbMesh);

    // Inner wireframe lattice
    const innerWireGeo = new THREE.IcosahedronGeometry(1.38, 2);
    const innerWireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(orbColors.ring),
      wireframe: true,
      transparent: true,
      opacity: isRunning ? 0.35 : 0.2,
    });
    const innerWire = new THREE.Mesh(innerWireGeo, innerWireMat);
    scene.add(innerWire);

    // Orbiting Energy Ring Particles
    const ringCount = 60;
    const ringGeo = new THREE.BufferGeometry();
    const ringPos = new Float32Array(ringCount * 3);
    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2;
      const r = 1.75 + (Math.random() - 0.5) * 0.25;
      ringPos[i * 3] = Math.cos(angle) * r;
      ringPos[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      ringPos[i * 3 + 2] = Math.sin(angle) * r;
    }
    ringGeo.setAttribute("position", new THREE.BufferAttribute(ringPos, 3));
    const ringMat = new THREE.PointsMaterial({
      size: 0.07,
      color: new THREE.Color(orbColors.ring),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Points(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 4;
    scene.add(ring);

    // Pointer hover
    let targetX = 0;
    let targetY = 0;
    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      targetX = x * 0.8;
      targetY = y * 0.8;
    };
    window.addEventListener("mousemove", onPointerMove, { passive: true });

    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      if (document.hidden) {
        animId = requestAnimationFrame(animate);
        return;
      }
      const t = (performance.now() - startTime) * 0.001;
      const speedMult = isRunning ? 1.6 : 0.8;

      // Pulse breathing
      const breath = Math.sin(t * 2 * speedMult) * 0.05 + 1;
      orbMesh.scale.set(breath, breath, breath);
      innerWire.scale.set(breath, breath, breath);

      // Smooth rotation
      orbMesh.rotation.y += (targetX + t * 0.4 * speedMult - orbMesh.rotation.y) * 0.06;
      orbMesh.rotation.x += (targetY + Math.sin(t * 0.6) * 0.2 - orbMesh.rotation.x) * 0.06;
      innerWire.rotation.copy(orbMesh.rotation);

      // Ring rotation
      ring.rotation.z = -t * 0.6 * speedMult;
      ring.rotation.y = t * 0.3 * speedMult;

      if (renderer) {
        renderer.render(scene, camera);
      }
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onPointerMove);
      orbGeo.dispose();
      orbMat.dispose();
      innerWireGeo.dispose();
      innerWireMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      if (renderer && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [mode, isRunning, size, activePalette, theme]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center select-none pointer-events-none"
      style={{ width: size, height: size }}
    />
  );
}
