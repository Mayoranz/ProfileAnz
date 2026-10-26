import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { PROFILE_DATA } from '../data/portfolioData';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const counter = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    tl.to(counter, {
      val: 100,
      duration: 1.35,
      ease: 'power3.inOut',
      onUpdate: () => {
        setProgress(Math.round(counter.val));
      },
    })
      .to(
        barRef.current,
        {
          scaleX: 1,
          duration: 1.35,
          ease: 'power3.inOut',
        },
        0
      )
      .to(containerRef.current, {
        yPercent: -100,
        duration: 0.75,
        ease: 'power4.inOut',
        delay: 0.15,
      });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#0F0F0F] p-6 sm:p-12 text-[#EDEAE4] select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#262626] pb-4 font-mono-telemetry text-xs tracking-widest uppercase text-[#8E8A82]">
        <div className="flex items-center gap-3">
          <span className="text-[#EDEAE4] font-bold">
            {PROFILE_DATA.monogram} — {PROFILE_DATA.fullName}
          </span>
        </div>
        <div>{PROFILE_DATA.location}</div>
      </div>

      {/* Center Counter */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center">
        <p className="font-mono-telemetry text-xs uppercase tracking-[0.3em] text-[#8E8A82] mb-4">
          PORTFOLIO ARCHIVE
        </p>
        <div className="font-display text-7xl sm:text-9xl leading-none tracking-tight text-[#EDEAE4]">
          {String(progress).padStart(3, '0')}
          <span className="text-[#C5B396] text-3xl sm:text-5xl align-top ml-1">%</span>
        </div>
        <div className="mt-8 w-64 sm:w-80 h-[2px] bg-[#262626] overflow-hidden">
          <div
            ref={barRef}
            className="h-full w-full origin-left scale-x-0 bg-[#C5B396]"
          />
        </div>
      </div>

      {/* Bottom Status */}
      <div className="relative z-10 flex items-center justify-between border-t border-[#262626] pt-4 font-mono-telemetry text-xs text-[#8E8A82] uppercase tracking-widest">
        <span>{PROFILE_DATA.school} — PPLG</span>
        <span className="text-[#C5B396]">INDEX // 2026</span>
      </div>
    </div>
  );
}
