import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Camera,
  Terminal,
} from 'lucide-react';
import {
  ON_TRACK_SKILLS,
  OFF_TRACK_PERSONA,
  PROFILE_DATA,
} from '../data/portfolioData';
import GlitchText from './GlitchText';

gsap.registerPlugin(ScrollTrigger);

export default function TrackDualitySection({ trackMode, setTrackMode }) {
  const isOnTrack = trackMode === 'ON TRACK';
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const dividerRef = useRef(null);
  const contentWrapRef = useRef(null);
  const glitchOverlayRef = useRef(null);
  const isInitialMount = useRef(true);

  // 1. ScrollTrigger Header & Hairline Reveal
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 80%',
          once: true,
        },
      });

      tl.fromTo(
        headingRef.current,
        { yPercent: 100, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.85, ease: 'power4.out' }
      ).fromTo(
        dividerRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.9, ease: 'power3.inOut' },
        '-=0.55'
      );
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  // 2. GSAP Glitch Transition when switching ON TRACK <-> OFF TRACK (and initial ScrollTrigger reveal)
  useEffect(() => {
    const contentEl = contentWrapRef.current;
    if (!contentEl) return;

    const ctx = gsap.context(() => {
      const cards = contentEl.querySelectorAll('.duality-anim-card');

      if (isInitialMount.current) {
        isInitialMount.current = false;
        gsap.fromTo(
          cards,
          { y: 34, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            overwrite: 'auto',
            scrollTrigger: {
              trigger: contentEl,
              start: 'top 85%',
              once: true,
            },
          }
        );
        return;
      }

      // Mode switch GSAP Error/Glitch Tear Timeline
      const tl = gsap.timeline();

      if (glitchOverlayRef.current) {
        tl.fromTo(
          glitchOverlayRef.current,
          { autoAlpha: 0.85 },
          { autoAlpha: 0, duration: 0.28, ease: 'steps(4)' },
          0
        );
      }

      if (headingRef.current) {
        tl.fromTo(
          headingRef.current,
          { x: -18, skewX: -8, autoAlpha: 0.3 },
          {
            keyframes: [
              { x: 14, skewX: 6, autoAlpha: 0.9, duration: 0.05 },
              { x: -7, skewX: -3, autoAlpha: 0.6, duration: 0.05 },
              { x: 0, skewX: 0, autoAlpha: 1, duration: 0.18, ease: 'power2.out' },
            ],
            overwrite: 'auto',
          },
          0
        );
      }

      tl.fromTo(
        cards,
        {
          x: (i) => (i % 2 === 0 ? -22 : 22),
          skewX: (i) => (i % 2 === 0 ? -5 : 5),
          autoAlpha: 0,
          filter: 'contrast(1.35)',
        },
        {
          keyframes: [
            {
              x: (i) => (i % 2 === 0 ? 12 : -12),
              skewX: (i) => (i % 2 === 0 ? 3 : -3),
              autoAlpha: 0.85,
              duration: 0.06,
            },
            {
              x: (i) => (i % 2 === 0 ? -5 : 5),
              skewX: 0,
              autoAlpha: 0.55,
              duration: 0.05,
            },
            {
              x: 0,
              skewX: 0,
              autoAlpha: 1,
              filter: 'none',
              duration: 0.24,
              ease: 'power3.out',
            },
          ],
          stagger: 0.04,
          overwrite: 'auto',
        },
        0
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [trackMode]);

  return (
    <section
      id="duality-section"
      ref={sectionRef}
      className="relative py-24 sm:py-28 px-4 sm:px-8 border-t border-[#262626] bg-[#0F0F0F] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header + Mode Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8">
          <div>
            <div className="flex items-center gap-3 font-mono-telemetry text-xs uppercase tracking-[0.2em] text-[#C5B396] mb-3">
              <GlitchText
                text="01 / PROFILE & DISCIPLINES"
                triggerKey={trackMode}
                minDelay={4000}
                maxDelay={7800}
              />
            </div>
            <div className="overflow-hidden">
              <h2
                ref={headingRef}
                className="font-display text-5xl sm:text-6xl uppercase tracking-tight text-[#EDEAE4] leading-[0.95] will-change-transform"
              >
                <GlitchText
                  text={isOnTrack ? 'ON TRACK' : 'OFF TRACK'}
                  triggerKey={trackMode}
                  minDelay={3200}
                  maxDelay={6400}
                />{' '}
                <GlitchText
                  text={isOnTrack ? 'ENGINEERING' : 'CREATIVE LAB'}
                  triggerKey={trackMode}
                  className="text-stroke-sand"
                  minDelay={3600}
                  maxDelay={6800}
                />
              </h2>
            </div>
          </div>

          {/* Flat Mode Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-[#141414] p-1.5 rounded-lg border border-[#262626] self-start lg:self-end">
            <button
              type="button"
              onClick={() => setTrackMode('ON TRACK')}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-mono-telemetry text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                isOnTrack
                  ? 'bg-[#C5B396] text-[#0F0F0F] font-bold'
                  : 'text-[#8E8A82] hover:text-[#EDEAE4]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>ON TRACK — FULL-STACK & MOBILE</span>
            </button>
            <button
              type="button"
              onClick={() => setTrackMode('OFF TRACK')}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-mono-telemetry text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                !isOnTrack
                  ? 'bg-[#C5B396] text-[#0F0F0F] font-bold'
                  : 'text-[#8E8A82] hover:text-[#EDEAE4]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>OFF TRACK — DSLR PHOTOGRAPHY, 3D & DESIGN</span>
            </button>
          </div>
        </div>

        {/* Animated Hairline Divider */}
        <div
          ref={dividerRef}
          className="h-[1px] w-full bg-[#262626] mb-12"
        />

        {/* Dynamic Content Area */}
        <div ref={contentWrapRef} className="relative">
          {/* In-Section Scanline Glitch Flash Layer */}
          <div
            ref={glitchOverlayRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 opacity-0 editorial-scanlines"
          />
          {isOnTrack ? (
            <div className="space-y-8">
              {/* Editorial Bio Banner (No Fake Code Block) */}
              <div className="duality-anim-card bg-[#141414] border border-[#262626] rounded-lg p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="max-w-3xl space-y-2">
                  <span className="font-mono-telemetry text-xs uppercase tracking-widest text-[#C5B396] block">
                    ENGINEERING FOCUS — {PROFILE_DATA.fullName}
                  </span>
                  <h3 className="font-tech font-bold text-xl sm:text-2xl text-[#EDEAE4]">
                    Merancang aplikasi web full-stack dan mobile lintas platform dari arsitektur database hingga antarmuka pengguna.
                  </h3>
                  <p className="text-[#8E8A82] text-sm sm:text-base leading-relaxed">
                    Sebagai siswa jurusan <strong className="text-[#EDEAE4]">PPLG di SMKN 1 Cianjur</strong>, Andhika membangun sistem berbasis <strong className="text-[#EDEAE4]">React, TypeScript, & Next.js</strong> di sisi frontend, <strong className="text-[#EDEAE4]">Laravel, PHP, & Node.js Express</strong> di sisi backend, serta <strong className="text-[#EDEAE4]">Flutter & Dart</strong> untuk perangkat Android.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 shrink-0 font-mono-telemetry text-xs">
                  <div className="bg-[#0F0F0F] border border-[#262626] rounded-md p-4">
                    <span className="text-[#8E8A82] block text-[10px] mb-1">EDUCATION</span>
                    <span className="text-[#EDEAE4] font-bold block">SMKN 1 Cianjur</span>
                    <span className="text-[#C5B396] text-[11px]">Jurusan PPLG</span>
                  </div>
                  <div className="bg-[#0F0F0F] border border-[#262626] rounded-md p-4">
                    <span className="text-[#8E8A82] block text-[10px] mb-1">PRIMARY FOCUS</span>
                    <span className="text-[#EDEAE4] font-bold block">Web & Mobile</span>
                    <span className="text-[#C5B396] text-[11px]">Full-Stack Dev</span>
                  </div>
                </div>
              </div>

              {/* 3-Column Engineering Grid (No Fake Percentage Bars) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {ON_TRACK_SKILLS.map((group) => (
                  <div
                    key={group.code}
                    className="duality-anim-card bg-[#141414] border border-[#262626] hover:border-[#C5B396] hover:-translate-y-1 rounded-lg p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono-telemetry text-xs text-[#8E8A82] mb-4 pb-3 border-b border-[#262626]">
                        <span className="text-[#C5B396] font-bold">{group.code}</span>
                        <span>TECHNICAL STACK</span>
                      </div>

                      <h3 className="font-display text-2xl sm:text-3xl text-[#EDEAE4] uppercase tracking-wide mb-2">
                        {group.category}
                      </h3>
                      <p className="text-sm text-[#8E8A82] mb-6 leading-relaxed">
                        {group.description}
                      </p>

                      <div className="divide-y divide-[#222222] border-y border-[#222222]">
                        {group.items.map((skill) => (
                          <div
                            key={skill.name}
                            className="py-3 flex items-center justify-between text-xs font-mono-telemetry"
                          >
                            <span className="text-[#EDEAE4] font-semibold">{skill.name}</span>
                            <span className="text-[#8E8A82] px-2 py-0.5 bg-[#1A1A1A] border border-[#262626] rounded">
                              {skill.tag}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* OFF TRACK VIEW: DSLR Photography, 3D Blender & Adobe Creative Suite */
            <div className="space-y-8">
              <div className="duality-anim-card bg-[#141414] border border-[#262626] rounded-lg p-6 sm:p-8">
                <div className="max-w-3xl space-y-2">
                  <span className="font-mono-telemetry text-xs uppercase tracking-widest text-[#C5B396] block">
                    OFF-TRACK — PHOTOGRAPHY & VISUAL DISCIPLINES
                  </span>
                  <h3 className="font-display text-3xl sm:text-4xl text-[#EDEAE4] uppercase tracking-wide">
                    {OFF_TRACK_PERSONA.headline}
                  </h3>
                  <p className="text-[#8E8A82] text-sm sm:text-base leading-relaxed">
                    {OFF_TRACK_PERSONA.subheadline}
                  </p>
                </div>

                {/* Creative Suite Cards (Flat Matte, Uniform Styling) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
                  {OFF_TRACK_PERSONA.creativeSuite.map((tool) => (
                    <div
                      key={tool.name}
                      className="duality-anim-card bg-[#0F0F0F] border border-[#262626] hover:border-[#C5B396] hover:-translate-y-1 rounded-lg p-5 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#222222]">
                        <span className="font-mono-telemetry text-[10px] uppercase tracking-widest text-[#C5B396] font-bold">
                          {tool.badge}
                        </span>
                      </div>
                      <h4 className="font-tech font-bold text-lg text-[#EDEAE4] mb-1">
                        {tool.name}
                      </h4>
                      <p className="font-mono-telemetry text-xs text-[#C5B396] mb-2">
                        {tool.role}
                      </p>
                      <p className="text-xs text-[#8E8A82] leading-relaxed">{tool.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Off-Track Lifestyle Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {OFF_TRACK_PERSONA.lifestyleCards.map((card) => (
                  <div
                    key={card.code}
                    className="duality-anim-card bg-[#141414] border border-[#262626] hover:border-[#C5B396] hover:-translate-y-1 rounded-lg p-6 sm:p-7 flex flex-col justify-between transition-all duration-300"
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono-telemetry text-xs text-[#8E8A82] mb-3 pb-3 border-b border-[#222222]">
                        <span className="text-[#C5B396] font-bold">{card.code}</span>
                        <span>{card.category}</span>
                      </div>
                      <h4 className="font-display text-2xl sm:text-3xl text-[#EDEAE4] uppercase tracking-wide mb-2.5">
                        {card.title}
                      </h4>
                      <p className="text-sm text-[#8E8A82] leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
