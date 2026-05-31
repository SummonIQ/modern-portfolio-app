"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseR: number;
  hue: number;
};

const PARTICLE_COUNT = 70;
const LINK_DIST = 140;
const MOUSE_INFLUENCE = 180;

/**
 * Interactive hero background:
 *  • Drifting particle constellation (lines drawn between near neighbors)
 *  • Mouse repels nearby particles + bumps their glow
 *  • Floating gradient orbs with subtle parallax to the cursor
 *  • Respects prefers-reduced-motion (renders a static gradient instead)
 */
export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let width = 0;
    let height = 0;
    const mouse = { x: -9999, y: -9999, active: false };
    const particles: Particle[] = [];

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const r = Math.random() * 1.6 + 0.4;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r,
          baseR: r,
          hue: 250 + Math.random() * 40, // violet → indigo
        });
      }
    }

    function step() {
      ctx!.clearRect(0, 0, width, height);

      // Subtle gradient wash
      const grad = ctx!.createRadialGradient(
        width * 0.5,
        height * 0.4,
        0,
        width * 0.5,
        height * 0.4,
        Math.max(width, height) * 0.6,
      );
      grad.addColorStop(0, isDark ? "rgba(139,92,246,0.06)" : "rgba(139,92,246,0.04)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, width, height);

      // Update + draw particles
      for (const p of particles) {
        // Mouse repel
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_INFLUENCE && dist > 0.001) {
            const force = (1 - dist / MOUSE_INFLUENCE) * 0.6;
            p.vx += (dx / dist) * force * 0.3;
            p.vy += (dy / dist) * force * 0.3;
            p.r = p.baseR + force * 1.6;
          } else {
            p.r += (p.baseR - p.r) * 0.08;
          }
        } else {
          p.r += (p.baseR - p.r) * 0.05;
        }

        // Damping + drift
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Particle glow — darker hue in light mode for contrast
        const glowLightness = isDark ? 70 : 50;
        const dotLightness = isDark ? 78 : 45;
        const glow = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        glow.addColorStop(0, `hsla(${p.hue}, 90%, ${glowLightness}%, ${isDark ? 0.55 : 0.4})`);
        glow.addColorStop(1, `hsla(260, 90%, ${glowLightness}%, 0)`);
        ctx!.fillStyle = glow;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.fillStyle = `hsla(${p.hue}, 95%, ${dotLightness}%, 0.95)`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Connecting lines — darker + more opaque in light mode
      const lineLightness = isDark ? 70 : 45;
      const lineMaxAlpha = isDark ? 0.35 : 0.55;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * lineMaxAlpha;
            ctx!.strokeStyle = `hsla(${(a.hue + b.hue) / 2}, 90%, ${lineLightness}%, ${alpha})`;
            ctx!.lineWidth = isDark ? 0.7 : 0.9;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      raf = requestAnimationFrame(step);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;

      // Parallax orbs
      if (orbsRef.current) {
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const nx = ((mouse.x - cx) / cx) * 14;
        const ny = ((mouse.y - cy) / cy) * 14;
        orbsRef.current.style.setProperty("--mx", `${nx}px`);
        orbsRef.current.style.setProperty("--my", `${ny}px`);
      }
    }

    function onMouseLeave() {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
      if (orbsRef.current) {
        orbsRef.current.style.setProperty("--mx", `0px`);
        orbsRef.current.style.setProperty("--my", `0px`);
      }
    }

    let raf = 0;
    const ro = new ResizeObserver(() => {
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      resize();
      seed();
    });
    ro.observe(canvas);
    resize();
    seed();
    raf = requestAnimationFrame(step);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [isDark]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="bf-grid absolute inset-0 opacity-30" />
      <div
        ref={orbsRef}
        className="absolute inset-0"
        style={{
          // CSS vars updated by mousemove for parallax
          ["--mx" as string]: "0px",
          ["--my" as string]: "0px",
        }}
      >
        <div
          className="absolute -top-24 -left-24 size-[28rem] rounded-full bg-brand-500/30 blur-[120px] animate-pulse-glow"
          style={{ transform: "translate3d(var(--mx), var(--my), 0)" }}
        />
        <div
          className="absolute top-1/3 right-[-6rem] size-[22rem] rounded-full bg-accent2-400/20 blur-[110px] animate-pulse-glow"
          style={{
            animationDelay: "1.4s",
            transform: "translate3d(calc(var(--mx) * -1), calc(var(--my) * -1), 0)",
          }}
        />
        <div
          className="absolute bottom-[-6rem] left-1/3 size-[26rem] rounded-full bg-brand-700/20 blur-[120px] animate-pulse-glow"
          style={{
            animationDelay: "2.8s",
            transform: "translate3d(calc(var(--mx) * 0.5), calc(var(--my) * -0.5), 0)",
          }}
        />
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
      <div className="bf-noise absolute inset-0 opacity-[0.35] mix-blend-overlay" />
      {/* Bottom fade so the section feels grounded */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
