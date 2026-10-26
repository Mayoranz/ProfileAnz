import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  Github,
} from 'lucide-react';
import { PROFILE_DATA } from '../data/portfolioData';
import GlitchText from './GlitchText';

gsap.registerPlugin(ScrollTrigger);

export default function TelemetrySection({ telemetry }) {
  const { isLive, user, recentRepos, languageBreakdown } = telemetry;
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const dividerRef = useRef(null);
  const repoCountRef = useRef(null);
  const followerCountRef = useRef(null);
  const exerciseCountRef = useRef(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const ctx = gsap.context(() => {
      // 1. Section Header & Hairline Reveal
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
          '.telemetry-metric-card',
          { y: 32, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: 'power3.out',
          },
          '-=0.45'
        )
        .fromTo(
          '.telemetry-panel',
          { y: 34, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.75,
            stagger: 0.12,
            ease: 'power3.out',
          },
          '-=0.35'
        );

      // 2. Animated GSAP Number Counters
      const counterObj = {
        repos: 0,
        followers: 0,
        exercises: 0,
      };

      gsap.to(counterObj, {
        repos: Number(user.public_repos) || 31,
        followers: Number(user.followers) || 4,
        exercises: 200,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 78%',
          once: true,
        },
        onUpdate: () => {
          if (repoCountRef.current) {
            repoCountRef.current.textContent = Math.round(counterObj.repos);
          }
          if (followerCountRef.current) {
            followerCountRef.current.textContent = Math.round(counterObj.followers);
          }
          if (exerciseCountRef.current) {
            exerciseCountRef.current.textContent = `${Math.round(counterObj.exercises)}+`;
          }
        },
      });
    }, sectionEl);

    return () => ctx.revert();
  }, [user.public_repos, user.followers]);

  return (
    <section
      id="telemetry"
      ref={sectionRef}
      className="relative py-24 sm:py-28 px-4 sm:px-8 bg-[#0F0F0F] border-t border-[#262626] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8">
          <div>
            <div className="flex items-center gap-2 font-mono-telemetry text-xs uppercase tracking-[0.2em] text-[#C5B396] mb-3">
              <GlitchText
                text="04 / GITHUB REPOSITORY ACTIVITY"
                minDelay={4000}
                maxDelay={7800}
              />
              <span>—</span>
              <span>{isLive ? 'GITHUB API SYNCED' : 'ARCHIVE SNAPSHOT'}</span>
            </div>
            <div className="overflow-hidden">
              <h2
                ref={headingRef}
                className="font-display text-5xl sm:text-6xl uppercase text-[#EDEAE4] leading-[0.95] will-change-transform"
              >
                <GlitchText text="OPEN SOURCE &" minDelay={3500} maxDelay={6800} />{' '}
                <GlitchText
                  text="REPOSITORIES"
                  className="text-stroke-sand"
                  minDelay={4300}
                  maxDelay={7900}
                />
              </h2>
            </div>
          </div>

          <a
            href={PROFILE_DATA.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-md bg-[#141414] hover:bg-[#C5B396] text-[#EDEAE4] hover:text-[#0F0F0F] border border-[#262626] font-mono-telemetry text-xs uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 self-start lg:self-end"
          >
            <Github className="w-4 h-4" />
            <span>GITHUB.COM/MAYORANZ</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Animated Hairline Divider */}
        <div
          ref={dividerRef}
          className="h-[1px] w-full bg-[#262626] mb-12"
        />

        {/* Big 4 Metric Cards (Flat Matte) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="telemetry-metric-card bg-[#141414] border border-[#262626] hover:border-[#C5B396] transition-colors rounded-lg p-6">
            <span className="font-mono-telemetry text-xs text-[#8E8A82] uppercase block mb-2">
              PUBLIC REPOSITORIES
            </span>
            <div ref={repoCountRef} className="font-display text-5xl text-[#EDEAE4]">
              {user.public_repos}
            </div>
            <span className="font-mono-telemetry text-xs text-[#C5B396] mt-2 block">
              ACTIVE CODE ARCHIVES
            </span>
          </div>

          <div className="telemetry-metric-card bg-[#141414] border border-[#262626] hover:border-[#C5B396] transition-colors rounded-lg p-6">
            <span className="font-mono-telemetry text-xs text-[#8E8A82] uppercase block mb-2">
              FOLLOWERS
            </span>
            <div ref={followerCountRef} className="font-display text-5xl text-[#C5B396]">
              {user.followers}
            </div>
            <span className="font-mono-telemetry text-xs text-[#8E8A82] mt-2 block">
              FOLLOWING {user.following} DEVELOPERS
            </span>
          </div>

          <div className="telemetry-metric-card bg-[#141414] border border-[#262626] hover:border-[#C5B396] transition-colors rounded-lg p-6">
            <span className="font-mono-telemetry text-xs text-[#8E8A82] uppercase block mb-2">
              CODING EXERCISES
            </span>
            <div ref={exerciseCountRef} className="font-display text-5xl text-[#EDEAE4]">
              200+
            </div>
            <span className="font-mono-telemetry text-xs text-[#C5B396] mt-2 block">
              100 JS + 100 PYTHON LABS
            </span>
          </div>

          <div className="telemetry-metric-card bg-[#141414] border border-[#262626] hover:border-[#C5B396] transition-colors rounded-lg p-6">
            <span className="font-mono-telemetry text-xs text-[#8E8A82] uppercase block mb-2">
              LOCATION
            </span>
            <div className="font-display text-4xl sm:text-5xl text-[#EDEAE4] uppercase">
              CIANJUR
            </div>
            <span className="font-mono-telemetry text-xs text-[#8E8A82] mt-2 block">
              SMKN 1 CIANJUR — PPLG
            </span>
          </div>
        </div>

        {/* Lower Grid: Language Breakdown + Recent Repositories */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Language Distribution (Clean Table List) */}
          <div className="telemetry-panel lg:col-span-5 bg-[#141414] border border-[#262626] rounded-lg p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono-telemetry text-xs text-[#8E8A82] mb-5 pb-3 border-b border-[#222222]">
                <span>PRIMARY LANGUAGES</span>
                <span className="text-[#C5B396]">BY REPOSITORY COUNT</span>
              </div>

              <div className="divide-y divide-[#222222] border-y border-[#222222]">
                {languageBreakdown.map((item) => (
                  <div
                    key={item.lang}
                    className="py-3.5 flex items-center justify-between font-mono-telemetry text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[#EDEAE4] font-semibold">{item.lang}</span>
                    </div>
                    <span className="text-[#8E8A82]">
                      {item.count} repos
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#222222] flex items-center justify-between font-mono-telemetry text-xs text-[#8E8A82]">
              <span>GITHUB HANDLE</span>
              <span className="text-[#EDEAE4] font-bold">@{user.login}</span>
            </div>
          </div>

          {/* Recent Repository List */}
          <div className="telemetry-panel lg:col-span-7 bg-[#141414] border border-[#262626] rounded-lg p-6 sm:p-7">
            <div className="flex items-center justify-between font-mono-telemetry text-xs text-[#8E8A82] mb-5 pb-3 border-b border-[#222222]">
              <span>RECENTLY UPDATED REPOSITORIES</span>
              <span className="text-[#C5B396]">PUBLIC</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {(recentRepos.length > 0
                ? recentRepos.slice(0, 6)
                : [
                    {
                      id: 1,
                      name: 'tiktik',
                      language: 'JavaScript',
                      html_url: 'https://github.com/Mayoranz/tiktik',
                      updated_at: '2026-09-15',
                    },
                    {
                      id: 2,
                      name: 'Laravel-ReactProjectAPI',
                      language: 'Blade',
                      html_url: 'https://github.com/Mayoranz/Laravel-ReactProjectAPI',
                      updated_at: '2026-06-18',
                    },
                    {
                      id: 3,
                      name: 'ziepoint_app',
                      language: 'Dart',
                      html_url: 'https://github.com/Mayoranz/ziepoint_app',
                      updated_at: '2026-06-18',
                    },
                    {
                      id: 4,
                      name: 'appMuslim',
                      language: 'Dart',
                      html_url: 'https://github.com/Mayoranz/appMuslim',
                      updated_at: '2026-06-18',
                    },
                    {
                      id: 5,
                      name: 'POS-jewellery',
                      language: 'JavaScript',
                      html_url: 'https://github.com/Mayoranz/POS-jewellery',
                      updated_at: '2026-05-16',
                    },
                    {
                      id: 6,
                      name: 'wanagement',
                      language: 'TypeScript',
                      html_url: 'https://github.com/Mayoranz/wanagement',
                      updated_at: '2026-05-05',
                    },
                  ]
              ).map((repo) => (
                <a
                  key={repo.id || repo.name}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#0F0F0F] hover:border-[#C5B396] hover:-translate-y-1 border border-[#262626] rounded-md p-4 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-tech font-bold text-base text-[#EDEAE4] group-hover:text-[#C5B396] transition-colors truncate">
                      {repo.name}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-[#8E8A82] group-hover:text-[#C5B396] shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <div className="flex items-center justify-between font-mono-telemetry text-[11px] text-[#8E8A82] mt-2">
                    <span className="text-[#C5B396]">{repo.language || 'Code'}</span>
                    <span>
                      {repo.updated_at ? String(repo.updated_at).slice(0, 10) : '2026'}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
