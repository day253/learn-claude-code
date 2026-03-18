"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
  vx: number;
  vy: number;
  delay: number;
}

const COLORS = [
  "#f7768e",
  "#ff9e64",
  "#e0af68",
  "#9ece6a",
  "#73daca",
  "#7aa2f7",
  "#bb9af7",
  "#cba6f7",
];

export default function Confetti({ onDone }: { onDone?: () => void }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const ps: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 20,
      y: 50,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 1,
      vx: (Math.random() - 0.5) * 80,
      vy: -30 - Math.random() * 60,
      delay: Math.random() * 300,
    }));
    setParticles(ps);

    const timer = setTimeout(() => {
      setParticles([]);
      onDone?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg) scale(${p.scale})`,
            animation: `confetti-fall 2s ease-out ${p.delay}ms forwards`,
            ["--vx" as string]: `${p.vx}px`,
            ["--vy" as string]: `${p.vy}px`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(var(--vx), calc(var(--vy) + 400px))
              rotate(720deg);
          }
        }
      `}</style>
    </div>
  );
}
