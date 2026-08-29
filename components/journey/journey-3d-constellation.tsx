"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Flame, Play, Pause, Compass, Maximize2, Minimize2, Info } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import type { Habit } from "@/types";

export interface ConstellationHabit {
  _id: string;
  title: string;
  streak?: number;
  color?: string;
  frequency?: string;
}

interface Journey3DConstellationProps {
  habits?: Habit[];
  isLoading?: boolean;
}

// Crisp glowing star sprite
function createStarSpriteTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.95)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.4)");
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

export function Journey3DConstellation({ habits, isLoading }: Journey3DConstellationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [hoveredHabit, setHoveredHabit] = useState<{
    habit: ConstellationHabit;
    x: number;
    y: number;
  } | null>(null);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { theme, palette } = useTheme();
  const isDark = theme === "dark";

  // Synthetic demo habits if user has no habits yet
  const displayHabits: ConstellationHabit[] = useMemo(() => {
    if (habits && habits.length > 0) {
      return habits.map((h) => ({
        _id: String(h._id),
        title: h.title,
        streak: (h as any).streak ?? 3,
        color: h.color ?? "#a855f7",
        frequency: h.frequency,
      }));
    }
    return [
      { _id: "demo-1", title: "Morning Meditation", streak: 14, color: "#7C3AED", frequency: "daily" },
      { _id: "demo-2", title: "5K Daily Run", streak: 21, color: "#F59E0B", frequency: "daily" },
      { _id: "demo-3", title: "Deep Work Focus", streak: 7, color: "#0284C7", frequency: "daily" },
      { _id: "demo-4", title: "Hydration 3L", streak: 30, color: "#10B981", frequency: "daily" },
      { _id: "demo-5", title: "Evening Reading", streak: 5, color: "#EC4899", frequency: "daily" },
    ];
  }, [habits]);

  const totalStreakSum = useMemo(
    () => displayHabits.reduce((acc, h) => acc + (h.streak ?? 0), 0),
    [displayHabits]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 340;

    // 1. Three.js Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 4, 14);
    camera.lookAt(0, 0, 0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const starTexture = createStarSpriteTexture();

    // 3. Central Identity Core Nucleus
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const coreGeo = new THREE.IcosahedronGeometry(0.85, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0xffffff : 0x334155,
      emissive: 0xa855f7,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Core Glowing Aura
    const coreSpriteMat = new THREE.SpriteMaterial({
      map: starTexture,
      color: 0x9333ea,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const coreSprite = new THREE.Sprite(coreSpriteMat);
    coreSprite.scale.set(4, 4, 1);
    coreGroup.add(coreSprite);

    // Ambient & Point Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambLight);

    const pointLight = new THREE.PointLight(0xa855f7, 2.5, 30);
    pointLight.position.set(0, 2, 5);
    scene.add(pointLight);

    // 4. Position Habit Stars in 3D Orbit Space
    const habitStarMeshes: {
      mesh: THREE.Mesh;
      sprite: THREE.Sprite;
      habit: ConstellationHabit;
      orbitRadius: number;
      orbitSpeed: number;
      orbitAngle: number;
      elevation: number;
    }[] = [];

    const numHabits = displayHabits.length;
    const constellationGroup = new THREE.Group();
    scene.add(constellationGroup);

    displayHabits.forEach((habit, i) => {
      const streak = habit.streak ?? 1;
      const angle = (i / numHabits) * Math.PI * 2;
      const orbitRadius = 4.2 + (i % 3) * 1.5;
      const elevation = (Math.sin(i * 1.8) * 1.8);
      const starColor = habit.color ? new THREE.Color(habit.color) : new THREE.Color(0xa855f7);

      // 3D Crystal Star Mesh
      const starSize = 0.35 + Math.min(streak, 30) * 0.018;
      const starGeo = new THREE.OctahedronGeometry(starSize);
      const starMat = new THREE.MeshStandardMaterial({
        color: starColor,
        emissive: starColor,
        emissiveIntensity: 0.85,
        roughness: 0.1,
        metalness: 0.7,
      });

      const starMesh = new THREE.Mesh(starGeo, starMat);
      starMesh.userData = { habitId: habit._id, habit };

      // Surrounding Glow Sprite
      const spriteMat = new THREE.SpriteMaterial({
        map: starTexture,
        color: starColor,
        transparent: true,
        opacity: Math.min(0.4 + streak * 0.02, 0.9),
        blending: THREE.AdditiveBlending,
      });
      const starSprite = new THREE.Sprite(spriteMat);
      const spriteScale = starSize * 4.5;
      starSprite.scale.set(spriteScale, spriteScale, 1);

      const starNode = new THREE.Group();
      starNode.add(starMesh);
      starNode.add(starSprite);

      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;
      starNode.position.set(x, elevation, z);
      constellationGroup.add(starNode);

      habitStarMeshes.push({
        mesh: starMesh,
        sprite: starSprite,
        habit,
        orbitRadius,
        orbitSpeed: 0.003 + (i % 2 === 0 ? 0.001 : -0.001),
        orbitAngle: angle,
        elevation,
      });
    });

    // 5. Constellation Filaments (Lines connecting stars into constellations)
    const lineGeo = new THREE.BufferGeometry();
    const maxLineSegments = numHabits * 4;
    const linePositions = new Float32Array(maxLineSegments * 2 * 3);
    const lineColors = new Float32Array(maxLineSegments * 2 * 3);

    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.55 : 0.35,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });
    const constellationLines = new THREE.LineSegments(lineGeo, lineMat);
    constellationGroup.add(constellationLines);

    // 6. Ambient Cosmic Dust Particles
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let d = 0; d < dustCount; d++) {
      dustPositions[d * 3] = (Math.random() - 0.5) * 25;
      dustPositions[d * 3 + 1] = (Math.random() - 0.5) * 15;
      dustPositions[d * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.2,
      color: 0xc084fc,
      transparent: true,
      opacity: 0.45,
      map: starTexture,
      blending: THREE.AdditiveBlending,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // 7. Raycaster for Hover & Click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-100, -100);

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0]!.clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0]!.clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        constellationGroup.rotation.y += deltaX * 0.008;
        constellationGroup.rotation.x += deltaY * 0.008;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    container.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mouseup", onPointerUp);
    container.addEventListener("mousemove", onPointerMove);

    // 8. Animation Loop
    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      if (document.hidden) {
        animId = requestAnimationFrame(animate);
        return;
      }

      const t = (performance.now() - startTime) * 0.001;

      // Slow Auto-Orbit
      if (isRotating && !isDragging) {
        constellationGroup.rotation.y += 0.0025;
        coreMesh.rotation.y += 0.006;
        coreMesh.rotation.x += 0.004;
      }

      // Update Star Positions & Connections
      let lineIdx = 0;
      let colIdx = 0;

      habitStarMeshes.forEach((item, idx) => {
        item.mesh.rotation.y += 0.015;
        item.mesh.rotation.x += 0.01;

        // Bounded subtle pulsation
        const pulse = 1 + Math.sin(t * 2 + idx) * 0.08;
        item.mesh.scale.set(pulse, pulse, pulse);

        // Core connection line
        const starPos = item.mesh.parent?.position;
        if (starPos && lineIdx < maxLineSegments * 6) {
          // Connect star to Center Nucleus
          linePositions[lineIdx++] = 0;
          linePositions[lineIdx++] = 0;
          linePositions[lineIdx++] = 0;

          linePositions[lineIdx++] = starPos.x;
          linePositions[lineIdx++] = starPos.y;
          linePositions[lineIdx++] = starPos.z;

          const col = item.mesh.material instanceof THREE.MeshStandardMaterial
            ? item.mesh.material.color
            : new THREE.Color(0xa855f7);

          lineColors[colIdx++] = 0.65;
          lineColors[colIdx++] = 0.35;
          lineColors[colIdx++] = 0.95;

          lineColors[colIdx++] = col.r;
          lineColors[colIdx++] = col.g;
          lineColors[colIdx++] = col.b;

          // Connect to neighbor star
          const nextIdx = (idx + 1) % habitStarMeshes.length;
          const nextPos = habitStarMeshes[nextIdx]?.mesh.parent?.position;
          if (nextPos) {
            linePositions[lineIdx++] = starPos.x;
            linePositions[lineIdx++] = starPos.y;
            linePositions[lineIdx++] = starPos.z;

            linePositions[lineIdx++] = nextPos.x;
            linePositions[lineIdx++] = nextPos.y;
            linePositions[lineIdx++] = nextPos.z;

            lineColors[colIdx++] = col.r;
            lineColors[colIdx++] = col.g;
            lineColors[colIdx++] = col.b;

            lineColors[colIdx++] = 0.5;
            lineColors[colIdx++] = 0.5;
            lineColors[colIdx++] = 0.9;
          }
        }
      });

      (lineGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (lineGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
      lineGeo.setDrawRange(0, lineIdx / 3);

      // Raycasting for star hover detection
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        habitStarMeshes.map((h) => h.mesh)
      );

      if (intersects.length > 0 && intersects[0]?.object?.userData?.habit) {
        const h = intersects[0].object.userData.habit as ConstellationHabit;
        const screenPos = intersects[0].point.clone().project(camera);
        const rect = container.getBoundingClientRect();
        const x = ((screenPos.x + 1) / 2) * rect.width;
        const y = ((-screenPos.y + 1) / 2) * rect.height;

        setHoveredHabit({ habit: h, x, y });
        document.body.style.cursor = "pointer";
      } else {
        setHoveredHabit(null);
        document.body.style.cursor = "default";
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mouseup", onPointerUp);
      container.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("resize", handleResize);
      document.body.style.cursor = "default";
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [displayHabits, isDark, isRotating]);

  return (
    <section className="relative glass-card rounded-3xl p-5 border border-[var(--border-default)] overflow-hidden shadow-warm-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 z-10 relative">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs"
            style={{
              background: "color-mix(in srgb, var(--accent) 18%, var(--bg-sunken))",
              color: "var(--accent)",
            }}
          >
            <Compass size={16} />
          </div>
          <div>
            <h3
              className="text-base font-semibold leading-tight flex items-center gap-1.5"
              style={{ color: "var(--text-primary)" }}
            >
              <span>3D Habit Constellation</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--accent)] text-white shadow-2xs">
                INTERACTIVE
              </span>
            </h3>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              Drag to orbit • Your daily habits woven into a 3D starry galaxy
            </p>
          </div>
        </div>

        {/* Orbit & Auto-rotate Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className="p-2 rounded-xl bg-[var(--bg-sunken)] hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-all cursor-pointer shadow-2xs"
            title={isRotating ? "Pause auto-orbit" : "Resume auto-orbit"}
          >
            {isRotating ? <Pause size={13} /> : <Play size={13} />}
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing transition-all ${
          isFullscreen ? "h-[500px]" : "h-72 sm:h-80"
        }`}
        style={{
          background: isDark
            ? "radial-gradient(ellipse at center, #150e28 0%, #080612 100%)"
            : "radial-gradient(ellipse at center, #f4f0ff 0%, #ede8fc 100%)",
        }}
      >
        {/* Subtle Constellation Overlay Legend */}
        <div className="absolute top-3 left-3 pointer-events-none z-10 flex items-center gap-3 text-[11px] font-mono text-[var(--text-tertiary)]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            {displayHabits.length} Star Nodes
          </span>
          <span className="flex items-center gap-1">
            <Flame size={12} className="text-amber-500" />
            {totalStreakSum} Total Light-Days
          </span>
        </div>

        {/* Floating Tooltip on Hover */}
        <AnimatePresence>
          {hoveredHabit && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="absolute pointer-events-none z-30 px-3 py-2 rounded-2xl glass-card border border-white/20 shadow-xl flex items-center gap-2.5 backdrop-blur-md"
              style={{
                left: Math.min(Math.max(hoveredHabit.x - 70, 10), 400),
                top: Math.max(hoveredHabit.y - 65, 10),
                background: "rgba(20, 15, 35, 0.88)",
                color: "#ffffff",
              }}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: hoveredHabit.habit.color ?? "var(--accent)" }}
              />
              <div>
                <p className="text-xs font-bold leading-tight truncate">
                  {hoveredHabit.habit.title}
                </p>
                <p className="text-[10px] text-white/70 font-mono flex items-center gap-1 mt-0.5">
                  <Flame size={10} className="text-amber-400 fill-amber-400" />
                  <span>{hoveredHabit.habit.streak ?? 0} Day Streak</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Constellation Lore Footer */}
      <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-tertiary)]">
        <span className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-[var(--accent)]" />
          <span>Every habit is a living star — consistency expands your constellation</span>
        </span>
        <span className="font-mono text-[11px] font-semibold text-[var(--text-secondary)]">
          Galaxy Status: Active 🌟
        </span>
      </div>
    </section>
  );
}
