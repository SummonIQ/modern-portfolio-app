"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroCanvas } from "@/components/marketing/hero-canvas";
import { SocialIcons } from "@/components/marketing/social-icons";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function Hero({
  ownerName,
  headline,
  tagline,
  socials,
}: {
  ownerName: string;
  headline: string;
  tagline: string;
  socials: Array<{ id: string; platform: string; url: string; icon?: string | null }>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const card = cardRef.current;
    if (!card) return;
    function onMove(e: MouseEvent) {
      const rect = card!.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rx = Math.max(-1, Math.min(1, dy)) * -3;
      const ry = Math.max(-1, Math.min(1, dx)) * 3;
      card!.style.setProperty("--rx", `${rx}deg`);
      card!.style.setProperty("--ry", `${ry}deg`);
    }
    function onLeave() {
      card!.style.setProperty("--rx", "0deg");
      card!.style.setProperty("--ry", "0deg");
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [reduceMotion]);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative h-[calc(100svh-4rem)] min-h-[640px] w-full">
        <HeroCanvas />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-6">
          <div
            ref={cardRef}
            className="w-full max-w-3xl"
            style={{
              perspective: "1200px",
              transformStyle: "preserve-3d",
              transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-md animate-fade-up",
              )}
            >
              <Sparkles className="size-3 text-brand-400" />
              Available for new projects
            </span>
            <h1
              className="mt-6 font-display text-5xl font-medium leading-[1.15] tracking-tight text-balance sm:text-6xl md:text-7xl animate-fade-up"
              style={{ animationDelay: "0.08s" }}
            >
              <span className="block text-foreground">Hi, I&apos;m {ownerName}.</span>
              <span className="mt-3 block bg-gradient-to-r from-brand-400 via-accent2-400 to-brand-600 bg-clip-text pb-2 text-transparent">
                {headline}
              </span>
            </h1>
            <p
              className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl text-pretty animate-fade-up"
              style={{ animationDelay: "0.18s" }}
            >
              {tagline}
            </p>
            <div
              className="mt-8 flex flex-wrap items-center gap-3 animate-fade-up"
              style={{ animationDelay: "0.28s" }}
            >
              <ButtonLink href="/projects" size="lg">
                View my work
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/contact" size="lg" variant="outline">
                Get in touch
              </ButtonLink>
            </div>
            {socials.length > 0 && (
              <div
                className="mt-10 animate-fade-up"
                style={{ animationDelay: "0.38s" }}
              >
                <SocialIcons links={socials} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
