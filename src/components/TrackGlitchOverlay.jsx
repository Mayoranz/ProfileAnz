import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function TrackGlitchOverlay({ glitchTransition }) {
  const overlayRef = useRef(null);
  const bannerRef = useRef(null);

  useEffect(() => {
    if (!glitchTransition || !overlayRef.current) return;

    const overlay = overlayRef.current;
    const slices = overlay.querySelectorAll('.track-glitch-slice');
    const banner = bannerRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlay, { autoAlpha: 0 });
          gsap.set(slices, { scaleX: 0, xPercent: 0, autoAlpha: 0 });
        },
      });

      tl.set(overlay, { autoAlpha: 1 })
        // Burst 1: Horizontal signal tear slices flash in
        .fromTo(
          slices,
          {
            scaleX: () => gsap.utils.random(0.3, 1),
            xPercent: (i) => (i % 2 === 0 ? -15 : 15),
            autoAlpha: 0.92,
          },
          {
            scaleX: 1,
            xPercent: (i) => (i % 2 === 0 ? 8 : -8),
            autoAlpha: 1,
            duration: 0.07,
            stagger: 0.015,
            ease: 'steps(2)',
          }
        )
        // Banner flash
        .fromTo(
          banner,
          { autoAlpha: 0, scale: 0.94, skewX: -8 },
          { autoAlpha: 1, scale: 1, skewX: 4, duration: 0.06 },
          '<'
        )
        // Burst 2: Mid-glitch invert jitter
        .to(slices, {
          xPercent: (i) => (i % 2 === 0 ? -22 : 22),
          scaleY: () => gsap.utils.random(0.6, 1.35),
          duration: 0.06,
          ease: 'steps(2)',
        })
        .to(banner, { x: -10, skewX: -6, duration: 0.05 }, '<')
        .to(banner, { x: 8, skewX: 0, duration: 0.05 })
        // Burst 3: Slices clear out rapidly
        .to(
          slices,
          {
            scaleX: 0,
            autoAlpha: 0,
            duration: 0.09,
            stagger: 0.012,
            ease: 'power3.in',
          },
          '-=0.02'
        )
        .to(
          banner,
          { autoAlpha: 0, duration: 0.07 },
          '<'
        );
    }, overlay);

    return () => ctx.revert();
  }, [glitchTransition]);

  const targetMode = glitchTransition?.mode || 'ON TRACK';

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[90] pointer-events-none opacity-0 overflow-hidden flex flex-col justify-between editorial-scanlines"
    >
      {/* 8 Horizontal Displacement Slices */}
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={idx}
          className={`track-glitch-slice w-full flex-1 border-y border-[#262626]/60 ${
            idx % 3 === 0
              ? 'bg-[#0F0F0F]/95'
              : idx % 3 === 1
              ? 'bg-[#141414]/90'
              : 'bg-[#C5B396]/20'
          }`}
        />
      ))}

      {/* Center Signal Override Diagnostic Flash */}
      <div
        ref={bannerRef}
        className="absolute inset-0 flex items-center justify-center p-4"
      >
        <div className="bg-[#0F0F0F] border border-[#C5B396] px-6 py-4 rounded-md shadow-2xl text-center">
          <span className="block font-mono-telemetry text-[10px] uppercase tracking-[0.3em] text-[#C5B396] mb-1">
            SYS_SIGNAL_OVERRIDE // 0x{targetMode === 'ON TRACK' ? '01' : '02'}
          </span>
          <span className="font-display text-3xl sm:text-5xl uppercase tracking-wider text-[#EDEAE4]">
            SWITCHING TO {targetMode}
          </span>
        </div>
      </div>
    </div>
  );
}
