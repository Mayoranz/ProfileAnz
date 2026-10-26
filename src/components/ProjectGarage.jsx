import React, { useState, useMemo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ExternalLink,
  Eye,
  Github,
  Globe,
  Smartphone,
} from 'lucide-react';
import { GARAGE_PROJECTS } from '../data/portfolioData';
import GlitchText from './GlitchText';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
  'ALL WORKS',
  'WEB & FULL-STACK',
  'MOBILE (FLUTTER)',
  'BACKEND & API',
  'OFF-TRACK LAB',
];

export default function ProjectGarage({ onSelectProject }) {
  const [activeCategory, setActiveCategory] = useState('ALL WORKS');
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const dividerRef = useRef(null);
  const tabsRef = useRef(null);
  const gridRef = useRef(null);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'ALL WORKS') return GARAGE_PROJECTS;
    return GARAGE_PROJECTS.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  // 1. Section Header & Filter Tabs ScrollTrigger Reveal
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
      )
        .fromTo(
          dividerRef.current,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.9, ease: 'power3.inOut' },
          '-=0.55'
        )
        .fromTo(
          tabsRef.current?.children || [],
          { y: 16, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out',
          },
          '-=0.45'
        );
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  // 2. Staggered Project Cards Reveal on Scroll & Glitch Burst on Category Switch
  const isInitialCategory = useRef(true);
  useEffect(() => {
    const gridEl = gridRef.current;
    if (!gridEl) return;

    const ctx = gsap.context(() => {
      const cards = gridEl.querySelectorAll('.project-anim-card');
      if (isInitialCategory.current) {
        isInitialCategory.current = false;
        gsap.fromTo(
          cards,
          { y: 36, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            stagger: 0.06,
            ease: 'power3.out',
            overwrite: 'auto',
            scrollTrigger: {
              trigger: gridEl,
              start: 'top 85%',
              once: true,
            },
          }
        );
      } else {
        gsap.fromTo(
          cards,
          {
            x: (i) => (i % 2 === 0 ? -16 : 16),
            skewX: (i) => (i % 2 === 0 ? -4 : 4),
            autoAlpha: 0,
          },
          {
            keyframes: [
              { x: (i) => (i % 2 === 0 ? 10 : -10), skewX: 2, autoAlpha: 0.85, duration: 0.05 },
              { x: 0, skewX: 0, autoAlpha: 1, duration: 0.24, ease: 'power3.out' },
            ],
            stagger: 0.04,
            overwrite: 'auto',
          }
        );
      }
    }, sectionRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [activeCategory]);

  return (
    <section
      id="garage"
      ref={sectionRef}
      className="relative py-24 sm:py-28 px-4 sm:px-8 bg-[#0F0F0F] border-t border-[#262626] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8">
          <div>
            <div className="flex items-center gap-2 font-mono-telemetry text-xs uppercase tracking-[0.2em] text-[#C5B396] mb-3">
              <GlitchText
                text="02 / SELECTED WORKS"
                triggerKey={activeCategory}
                minDelay={3800}
                maxDelay={7200}
              />
              <span>—</span>
              <span>{GARAGE_PROJECTS.length} PROJECTS</span>
            </div>
            <div className="overflow-hidden">
              <h2
                ref={headingRef}
                className="font-display text-5xl sm:text-6xl uppercase text-[#EDEAE4] leading-[0.95] will-change-transform"
              >
                <GlitchText
                  text="PROJECT"
                  triggerKey={activeCategory}
                  minDelay={3400}
                  maxDelay={6500}
                />{' '}
                <GlitchText
                  text="ARCHIVE"
                  triggerKey={activeCategory}
                  className="text-stroke-sand"
                  minDelay={4000}
                  maxDelay={7500}
                />
              </h2>
            </div>
          </div>

          <p className="max-w-md text-sm text-[#8E8A82]">
            Kumpulan proyek web full-stack, REST API, dan aplikasi mobile Android (Flutter) dari repositori GitHub{' '}
            <a
              href="https://github.com/Mayoranz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#EDEAE4] underline decoration-[#C5B396] hover:text-[#C5B396]"
            >
              @Mayoranz
            </a>
            . Klik kartu untuk melihat detail arsitektur & preview penuh.
          </p>
        </div>

        {/* Animated Hairline Divider */}
        <div
          ref={dividerRef}
          className="h-[1px] w-full bg-[#262626] mb-10"
        />

        {/* Category Filter Pills (Flat Matte) */}
        <div
          ref={tabsRef}
          className="flex flex-wrap items-center gap-2 mb-10"
          role="tablist"
          aria-label="Filter projects by category"
        >
          {CATEGORIES.map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-md font-mono-telemetry text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
                  active
                    ? 'bg-[#C5B396] text-[#0F0F0F] border-[#C5B396] font-bold'
                    : 'bg-[#141414] text-[#8E8A82] border-[#262626] hover:border-[#404040] hover:text-[#EDEAE4]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Project Archive Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isAndroidLogo = project.mockupType === 'android-logo';

            return (
              <article
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="project-anim-card group bg-[#141414] border border-[#262626] hover:border-[#C5B396] hover:-translate-y-1.5 rounded-lg p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer"
              >
                {/* Top Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#222222]">
                    <span className="font-mono-telemetry text-xs font-bold text-[#C5B396]">
                      {project.specNumber} — {project.category}
                    </span>

                    <div className="flex items-center gap-2">
                      {project.liveUrl && (
                        <span className="px-2 py-0.5 rounded bg-[#1A1A1A] border border-[#2E2E2E] font-mono-telemetry text-[10px] text-[#C5B396] uppercase">
                          LIVE
                        </span>
                      )}
                      <span className="font-mono-telemetry text-xs text-[#8E8A82]">
                        {project.year}
                      </span>
                    </div>
                  </div>

                  {/* Minimalist Monochrome Mockup Frame */}
                  {isAndroidLogo ? (
                    <div className="relative h-48 mb-5 rounded-md bg-[#0F0F0F] border border-[#262626] overflow-hidden flex flex-col items-center justify-center p-4">
                      <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono-telemetry text-[#8E8A82]">
                        <span className="inline-flex items-center gap-1 uppercase tracking-wider">
                          <Smartphone className="w-3 h-3 text-[#C5B396]" />
                          ANDROID APK
                        </span>
                        <span className="truncate max-w-[150px]">
                          {project.previewDomain}
                        </span>
                      </div>

                      <div className="mt-3 w-24 h-24 rounded-2xl p-1.5 bg-[#181818] border border-[#2A2A2A] flex items-center justify-center overflow-hidden">
                        <img
                          src={project.mockupUrl}
                          alt={`Logo Aplikasi Android ${project.name}`}
                          loading="lazy"
                          className="w-full h-full object-contain rounded-xl transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      </div>

                      <span className="mt-2 font-mono-telemetry text-[11px] text-[#8E8A82] tracking-wider">
                        {project.repoName}.apk
                      </span>
                    </div>
                  ) : (
                    <div className="relative h-48 mb-5 rounded-md bg-[#0F0F0F] border border-[#262626] overflow-hidden flex flex-col">
                      {/* Monochrome Window Header Bar (Neutral Gray Dots) */}
                      <div className="h-7 px-3 bg-[#181818] border-b border-[#262626] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#3A3A3A]" />
                          <span className="w-2 h-2 rounded-full bg-[#3A3A3A]" />
                          <span className="w-2 h-2 rounded-full bg-[#3A3A3A]" />
                        </div>
                        <div className="px-2 py-0.5 rounded bg-[#121212] border border-[#242424] font-mono-telemetry text-[10px] text-[#8E8A82] truncate max-w-[180px]">
                          {project.previewDomain || project.repoName}
                        </div>
                        <Globe className="w-3 h-3 text-[#8E8A82]" />
                      </div>

                      {/* Screenshot Viewport */}
                      <div className="relative flex-1 w-full overflow-hidden bg-[#0A0A0A]">
                        <img
                          src={project.mockupUrl}
                          alt={`Tampilan Mockup Web ${project.name}`}
                          loading="lazy"
                          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Project Title & Summary */}
                  <h3 className="font-tech font-bold text-xl text-[#EDEAE4] group-hover:text-[#C5B396] transition-colors mb-2">
                    {project.name}
                  </h3>
                  <p className="text-sm text-[#8E8A82] line-clamp-3 leading-relaxed mb-5">
                    {project.summary}
                  </p>
                </div>

                {/* Bottom Tech Stack & Inspect Action */}
                <div className="pt-4 border-t border-[#222222] space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded bg-[#1A1A1A] border border-[#262626] font-mono-telemetry text-[11px] text-[#EDEAE4]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono-telemetry pt-1">
                    <span className="text-[#C5B396] inline-flex items-center gap-1.5 font-semibold">
                      <Eye className="w-3.5 h-3.5" />
                      LIHAT DETAIL
                    </span>

                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded bg-[#1A1A1A] hover:bg-[#C5B396] text-[#EDEAE4] hover:text-[#0F0F0F] border border-[#262626] transition-colors"
                          title="Open Live Website"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded bg-[#1A1A1A] hover:bg-[#EDEAE4] text-[#8E8A82] hover:text-[#0F0F0F] border border-[#262626] transition-colors"
                        title="Open GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
