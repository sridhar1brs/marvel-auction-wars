import React, { useEffect, useRef } from 'react';
import { CombatEffectType } from '../../../data/characterMoves';

export type { CombatEffectType };

export interface ComicBurst {
  id: string;
  word: string;
  x: number;
  y: number;
  color: string;
  subText?: string;
}

interface Props {
  effectType?: CombatEffectType;
  attackerSide?: 'left' | 'right';
  comicBurst?: ComicBurst | null;
  isSuperMove?: boolean;
  superHeroName?: string;
  superHeroImageUrl?: string;
  superAbilityName?: string;
  signatureMoveName?: string;
}

export function CombatFXOverlay({
  effectType = 'none',
  attackerSide = 'left',
  comicBurst = null,
  isSuperMove = false,
  superHeroName = '',
  superHeroImageUrl = '',
  superAbilityName = '',
  signatureMoveName = ''
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 60FPS High Performance Particle & Beam Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (effectType === 'none' && !comicBurst) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let animationFrameId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
      shape?: 'circle' | 'spark' | 'ring' | 'line' | 'web';
      rot?: number;
      vRot?: number;
    }> = [];

    const originX = attackerSide === 'left' ? width * 0.35 : width * 0.65;
    const targetX = attackerSide === 'left' ? width * 0.70 : width * 0.30;
    const originY = height * 0.5;

    const paletteMap: Record<CombatEffectType, string[]> = {
      web: ['#38BDF8', '#E2E8F0', '#FFFFFF', '#94A3B8'],
      laser: ['#EF4444', '#F87171', '#FCA5A5', '#FFFFFF'],
      lightning: ['#38BDF8', '#60A5FA', '#93C5FD', '#FFFFFF'],
      claw: ['#38BDF8', '#E2E8F0', '#93C5FD', '#FFFFFF'],
      shield: ['#38BDF8', '#0284C7', '#BAE6FD', '#FFFFFF', '#EF4444'],
      magic: ['#EC4899', '#A855F7', '#C084FC', '#F472B6', '#E879F9'],
      cosmic: ['#8B5CF6', '#38BDF8', '#F59E0B', '#FFFFFF', '#EC4899'],
      fire: ['#F97316', '#EF4444', '#FBBF24', '#F59E0B'],
      symbiote: ['#0F172A', '#475569', '#94A3B8', '#DC2626', '#1E1B4B'],
      gamma_smash: ['#22C55E', '#16A34A', '#4ADE80', '#86EFAC', '#A3E635'],
      sonic: ['#06B6D4', '#67E8F9', '#A5F3FC', '#FFFFFF'],
      arrow: ['#8B5CF6', '#A78BFA', '#F59E0B', '#EF4444'],
      telekinetic: ['#C084FC', '#E879F9', '#F472B6', '#A855F7', '#FFFFFF'],
      gun_kata: ['#F59E0B', '#FCD34D', '#EF4444', '#94A3B8'],
      ice: ['#38BDF8', '#BAE6FD', '#E0F2FE', '#FFFFFF'],
      chi_martial: ['#F59E0B', '#FBBF24', '#FCD34D', '#EA580C', '#FFFFFF'],
      pym_particle: ['#EF4444', '#F87171', '#38BDF8', '#FFFFFF'],
      shadow_portal: ['#7C3AED', '#6D28D9', '#A78BFA', '#1E1B4B'],
      water_ocean: ['#0284C7', '#38BDF8', '#06B6D4', '#E0F2FE'],
      blade_dance: ['#94A3B8', '#CBD5E1', '#E2E8F0', '#38BDF8', '#FFFFFF'],
      melee: ['#F59E0B', '#EF4444', '#FCD34D', '#FFFFFF'],
      none: ['#FFFFFF']
    };

    const colors = paletteMap[effectType] || ['#F59E0B', '#EF4444'];
    const particleCount = effectType === 'cosmic' || effectType === 'gamma_smash' ? 65 : 45;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 10 + 4;
      particles.push({
        x: targetX + (Math.random() - 0.5) * 60,
        y: originY + (Math.random() - 0.5) * 60,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.025 + 0.015,
        shape: effectType === 'web' ? 'web' : (Math.random() > 0.35 ? 'spark' : 'circle'),
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.25
      });
    }

    let progress = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      progress += 0.045;

      // 1. Web Shooting & Geometric Netting
      if (effectType === 'web') {
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 8;
        
        // Multi-strand web ropes
        for (let s = -1; s <= 1; s++) {
          ctx.beginPath();
          ctx.moveTo(originX, originY + s * 10);
          ctx.lineTo(targetX, originY + s * 15);
          ctx.stroke();
        }

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        for (let s = -1; s <= 1; s++) {
          ctx.beginPath();
          ctx.moveTo(originX, originY + s * 10);
          ctx.lineTo(targetX, originY + s * 15);
          ctx.stroke();
        }

        // Geometric Web Trap at Target
        for (let w = 0; w < 6; w++) {
          const angle = (w / 6) * Math.PI * 2 + progress * 2;
          ctx.beginPath();
          ctx.moveTo(targetX, originY);
          ctx.lineTo(targetX + Math.cos(angle) * 50 * Math.min(1, progress * 1.5), originY + Math.sin(angle) * 50 * Math.min(1, progress * 1.5));
          ctx.stroke();
        }
        ctx.restore();
      }

      // 2. High-Energy Unibeam & Optic Blast
      if (effectType === 'laser') {
        ctx.save();
        const beamW = Math.sin(progress * Math.PI) * 24;
        
        // Outer plasma glow layer
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(targetX, originY);
        ctx.lineWidth = beamW * 1.5;
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.stroke();

        // Middle energy core
        ctx.lineWidth = beamW * 0.7;
        ctx.strokeStyle = '#FBBF24';
        ctx.stroke();

        // Inner white-hot laser rod
        ctx.lineWidth = beamW * 0.25;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();
        ctx.restore();
      }

      // 3. Branching Bifrost Lightning Web
      if (effectType === 'lightning') {
        ctx.save();
        for (let bolt = 0; bolt < 2; bolt++) {
          ctx.beginPath();
          let currX = originX;
          let currY = originY + (bolt - 0.5) * 15;
          ctx.moveTo(currX, currY);
          const steps = 8;
          for (let s = 1; s <= steps; s++) {
            const nextX = originX + ((targetX - originX) / steps) * s;
            const nextY = originY + (Math.random() - 0.5) * 40 + (bolt - 0.5) * 15;
            ctx.lineTo(nextX, nextY);
            currX = nextX;
            currY = nextY;
          }
          ctx.lineWidth = 3;
          ctx.strokeStyle = bolt === 0 ? '#FFFFFF' : '#38BDF8';
          ctx.stroke();
        }
        ctx.restore();
      }

      // 4. Gamma Ground-Fault Seismic Earthquake
      if (effectType === 'gamma_smash') {
        ctx.save();
        ctx.strokeStyle = '#22C55E';
        ctx.lineWidth = 4;

        // Ground fault fissure lines
        ctx.beginPath();
        let fx = originX;
        let fy = originY + 25;
        ctx.moveTo(fx, fy);
        for (let i = 0; i < 6; i++) {
          fx += (targetX - originX) / 6;
          fy = originY + 25 + (Math.random() - 0.5) * 20;
          ctx.lineTo(fx, fy);
        }
        ctx.stroke();

        // Expanding shockwave ellipses
        for (let r = 1; r <= 3; r++) {
          ctx.beginPath();
          ctx.ellipse(targetX, originY + 20, progress * 80 * r, progress * 30 * r, 0, 0, Math.PI * 2);
          ctx.strokeStyle = r % 2 === 0 ? 'rgba(134, 239, 172, 0.6)' : 'rgba(34, 197, 94, 0.8)';
          ctx.stroke();
        }
        ctx.restore();
      }

      // 5. Concentric Sonic Boom Compression Waves
      if (effectType === 'sonic') {
        ctx.save();
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
        ctx.lineWidth = 4;
        for (let s = 1; s <= 4; s++) {
          ctx.beginPath();
          const rad = (progress * 90 + s * 20) % 90;
          ctx.arc(originX + (targetX - originX) * (progress * 0.85), originY, rad, -Math.PI * 0.45, Math.PI * 0.45, attackerSide === 'right');
          ctx.stroke();
        }
        ctx.restore();
      }

      // 6. Sacred Tao Mystical Mandala & Runes
      if (effectType === 'magic') {
        ctx.save();
        ctx.translate(originX, originY);
        ctx.rotate(progress * Math.PI * 3);
        ctx.strokeStyle = '#E879F9';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(-25, -25, 50, 50);
        ctx.stroke();
        ctx.restore();
      }

      // 7. Cosmic Singularity Vortex
      if (effectType === 'cosmic') {
        ctx.save();
        ctx.translate(targetX, originY);
        ctx.rotate(-progress * Math.PI * 4);
        
        for (let a = 0; a < 3; a++) {
          ctx.beginPath();
          ctx.strokeStyle = a % 2 === 0 ? '#A855F7' : '#38BDF8';
          ctx.lineWidth = 3;
          ctx.arc(0, 0, (progress * 70 + a * 20) % 70, 0, Math.PI * 1.5);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.restore();
      }

      // 8. Roaring Inferno Flame Pillar
      if (effectType === 'fire') {
        ctx.save();
        ctx.strokeStyle = '#F97316';
        ctx.lineWidth = 4;
        for (let f = -1; f <= 1; f++) {
          ctx.beginPath();
          ctx.moveTo(originX + f * 15, originY + 30);
          ctx.quadraticCurveTo(
            targetX + (Math.random() - 0.5) * 30,
            originY - progress * 80,
            targetX + f * 15,
            originY - 15
          );
          ctx.stroke();
        }
        ctx.restore();
      }

      // 9. Symbiote Piercing Spikes
      if (effectType === 'symbiote') {
        ctx.save();
        ctx.fillStyle = '#0F172A';
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 2.5;
        for (let sp = 0; sp < 4; sp++) {
          const offY = (sp - 1.5) * 20;
          ctx.beginPath();
          ctx.moveTo(originX, originY + offY * 0.4);
          ctx.lineTo(targetX + 25 * progress, originY + offY);
          ctx.lineTo(originX, originY + offY * 0.4 + 8);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }

      // 10. Trick Arrow Trajectory
      if (effectType === 'arrow') {
        ctx.save();
        const arrowX = originX + (targetX - originX) * progress;
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(arrowX - 50, originY);
        ctx.lineTo(arrowX, originY);
        ctx.stroke();
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(arrowX, originY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 11. Ballistic Gun Kata Tracers
      if (effectType === 'gun_kata') {
        ctx.save();
        ctx.strokeStyle = '#FCD34D';
        ctx.lineWidth = 2.5;
        for (let b = 0; b < 3; b++) {
          const offY = (b - 1) * 14;
          ctx.beginPath();
          ctx.moveTo(originX + 20, originY + offY);
          ctx.lineTo(targetX, originY + offY);
          ctx.stroke();
        }
        ctx.restore();
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.rot !== undefined && p.vRot !== undefined) p.rot += p.vRot;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.strokeStyle = p.color;

          if (p.shape === 'web') {
            ctx.beginPath();
            ctx.moveTo(p.x - p.size * 1.5, p.y);
            ctx.lineTo(p.x + p.size * 1.5, p.y);
            ctx.moveTo(p.x, p.y - p.size * 1.5);
            ctx.lineTo(p.x, p.y + p.size * 1.5);
            ctx.stroke();
          } else if (p.shape === 'spark') {
            ctx.fillRect(p.x, p.y, p.size * 1.5, p.size * 0.7);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      });

      if (progress < 1.0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (ctx) ctx.clearRect(0, 0, width, height);
    };
  }, [effectType, attackerSide, comicBurst]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full absolute inset-0" />

      {/* 2. Comic Retro Action Typography Starburst */}
      {comicBurst && (
        <div
          className="absolute z-40 animate-comic-pop select-none"
          style={{
            left: `${comicBurst.x}%`,
            top: `${comicBurst.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* Retro Comic Starburst SVG */}
            <svg viewBox="0 0 200 200" className="w-36 h-36 sm:w-48 sm:h-48 drop-shadow-[0_0_30px_rgba(245,158,11,0.8)]">
              <polygon
                points="100,10 125,55 180,35 155,85 200,115 150,135 165,190 115,160 85,200 70,150 15,165 40,115 0,85 50,65 25,15 80,40"
                fill={comicBurst.color || '#EF4444'}
                stroke="#FFFFFF"
                strokeWidth="4"
              />
            </svg>

            {/* Comic Sound Word */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-heading font-black text-2xl sm:text-4xl text-white tracking-widest uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,0.9)] transform -rotate-6">
                {comicBurst.word}
              </span>
              {comicBurst.subText && (
                <span className="text-[10px] sm:text-xs font-mono font-bold bg-black/80 text-amber-300 px-2 py-0.5 rounded border border-white/20 uppercase tracking-wider mt-1">
                  {comicBurst.subText}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Claw / Blade Slash SVG Overlay */}
      {(effectType === 'claw' || effectType === 'blade_dance') && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 400 300" className="w-full h-full animate-laser-surge">
            <path
              d="M 50 50 Q 200 150 350 250"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="6"
              strokeLinecap="round"
              className="drop-shadow-[0_0_20px_#38BDF8]"
            />
            <path
              d="M 80 30 Q 230 130 380 230"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 20 70 Q 170 170 320 270"
              fill="none"
              stroke="#0284C7"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {/* 4. Vibranium Shield Throw SVG */}
      {effectType === 'shield' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full border-4 border-red-600 bg-blue-600 shadow-[0_0_25px_#38BDF8] animate-spin flex items-center justify-center">
            <span className="text-white text-xs font-black">★</span>
          </div>
        </div>
      )}
    </div>
  );
}
