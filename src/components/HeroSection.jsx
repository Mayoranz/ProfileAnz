import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowDownRight,
  MapPin,
} from 'lucide-react';
import { PROFILE_DATA } from '../data/portfolioData';
import GlitchText from './GlitchText';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection({
  bootComplete,
  trackMode,
  setTrackMode,
  liveRepoCount,
  githubAvatarUrl,
}) {
  const heroRef = useRef(null);
  const topStripRef = useRef(null);
  const titleLeftWrapRef = useRef(null);
  const titleRightWrapRef = useRef(null);
  const titleLeftRef = useRef(null);
  const titleRightRef = useRef(null);
  const leftCardRef = useRef(null);
  const portraitCardRef = useRef(null);
  const portraitImgRef = useRef(null);
  const glitchFullRef = useRef(null);
  const sliceTopRef = useRef(null);
  const sliceMidRef = useRef(null);
  const sliceBotRef = useRef(null);
  const scanlineRef = useRef(null);
  const glitchBadgeRef = useRef(null);
  const rightCardRef = useRef(null);
  const hasPlayedIntro = useRef(false);
  const isGlitchingRef = useRef(false);

  // Starts false (shows formal photo as primary, glitches GitHub avatar).
  // Once clicked, locks to true (shows GitHub avatar as primary, glitches formal photo) until page refresh.
  const [isLockedToGithub, setIsLockedToGithub] = useState(false);

  const isOnTrack = trackMode === 'ON TRACK';

  const resolvedGithubUrl = githubAvatarUrl || PROFILE_DATA.avatarUrl;
  const formalPhotoUrl = PROFILE_DATA.formalPhotoUrl || '/andhika-profile.jpg';

  // Primary image vs. Secondary (Glitch) image swap based on lock state
  const primaryPortraitSrc = isLockedToGithub ? resolvedGithubUrl : formalPhotoUrl;
  const glitchPortraitSrc = isLockedToGithub ? formalPhotoUrl : resolvedGithubUrl;

  // Reusable GSAP Error Glitch Burst (flashes glitchPortraitSrc in horizontal tear slices & full frames)
  const triggerGlitchBurst = useCallback((onPeakCallback) => {
    if (
      !portraitImgRef.current ||
      !glitchFullRef.current ||
      !sliceTopRef.current ||
      !sliceMidRef.current ||
      !sliceBotRef.current
    ) {
      if (onPeakCallback) onPeakCallback();
      return;
    }

    if (isGlitchingRef.current && !onPeakCallback) return;
    isGlitchingRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(
          [
            glitchFullRef.current,
            sliceTopRef.current,
            sliceMidRef.current,
            sliceBotRef.current,
            scanlineRef.current,
          ],
          { autoAlpha: 0, x: 0, y: 0, skewX: 0 }
        );
        gsap.set(portraitImgRef.current, { x: 0, y: 0, skewX: 0, filter: 'none' });
        if (glitchBadgeRef.current) {
          gsap.set(glitchBadgeRef.current, { x: 0 });
        }
        isGlitchingRef.current = false;
      },
    });

    // Randomize horizontal tear bands for an authentic signal error look
    const t1 = gsap.utils.random(4, 22, 1);
    const b1 = gsap.utils.random(60, 76, 1);
    const t2 = gsap.utils.random(32, 48, 1);
    const b2 = gsap.utils.random(28, 44, 1);
    const t3 = gsap.utils.random(64, 78, 1);
    const b3 = gsap.utils.random(4, 18, 1);

    tl.set(sliceTopRef.current, { clipPath: `inset(${t1}% 0 ${b1}% 0)` })
      .set(sliceMidRef.current, { clipPath: `inset(${t2}% 0 ${b2}% 0)` })
      .set(sliceBotRef.current, { clipPath: `inset(${t3}% 0 ${b3}% 0)` })
      // Frame 1: Initial signal tear
      .to(scanlineRef.current, { autoAlpha: 0.85, duration: 0.03 })
      .to(
        portraitImgRef.current,
        { x: -7, skewX: -2.5, filter: 'contrast(1.35) brightness(1.1)', duration: 0.04 },
        '<'
      )
      .to(
        sliceTopRef.current,
        { autoAlpha: 1, x: 18, duration: 0.04 },
        '<'
      )
      .to(
        sliceMidRef.current,
        { autoAlpha: 1, x: -22, duration: 0.04 },
        '<'
      )
      // Frame 2: Full alternate image flash
      .to(glitchFullRef.current, { autoAlpha: 0.92, x: 5, scale: 1.02, duration: 0.06 })
      .to(sliceBotRef.current, { autoAlpha: 1, x: 15, duration: 0.05 }, '<')
      .to(portraitImgRef.current, { x: 8, skewX: 2, duration: 0.05 }, '<')
      // Frame 3: Brief cut back + optional state swap on click
      .add(() => {
        if (onPeakCallback) onPeakCallback();
      })
      .to(glitchFullRef.current, { autoAlpha: 0, x: 0, duration: 0.04 })
      .to(
        [sliceTopRef.current, sliceMidRef.current],
        { x: (i) => (i === 0 ? -16 : 20), duration: 0.05 },
        '<'
      )
      // Frame 4: Second sharp flash of alternate portrait
      .to(glitchFullRef.current, {
        autoAlpha: 0.96,
        x: -4,
        filter: 'contrast(1.25)',
        duration: 0.07,
      })
      .to(
        sliceBotRef.current,
        { x: -18, duration: 0.06 },
        '<'
      )
      // Frame 5: Snap clean
      .to(
        [
          glitchFullRef.current,
          sliceTopRef.current,
          sliceMidRef.current,
          sliceBotRef.current,
          scanlineRef.current,
        ],
        { autoAlpha: 0, x: 0, skewX: 0, duration: 0.05 }
      )
      .to(
        portraitImgRef.current,
        { x: 0, skewX: 0, filter: 'none', duration: 0.06 },
        '<'
      );
  }, []);

  // Periodic Occasional Error Glitch Loop (runs both before and after click!)
  useEffect(() => {
    if (!bootComplete) return;

    let timeoutId;
    let isCancelled = false;

    const scheduleNextGlitch = () => {
      const nextDelay = gsap.utils.random(2400, 4200, 100);
      timeoutId = setTimeout(() => {
        if (isCancelled) return;
        triggerGlitchBurst();
        scheduleNextGlitch();
      }, nextDelay);
    };

    // First glitch shortly after hero intro finishes
    const initialTimer = setTimeout(() => {
      if (isCancelled) return;
      triggerGlitchBurst();
      scheduleNextGlitch();
    }, 1800);

    return () => {
      isCancelled = true;
      clearTimeout(initialTimer);
      clearTimeout(timeoutId);
    };
  }, [bootComplete, triggerGlitchBurst]);

  // Click handler: switches primary image to GitHub profile permanently until browser refresh
  const handlePortraitClick = () => {
    if (!isLockedToGithub) {
      triggerGlitchBurst(() => {
        setIsLockedToGithub(true);
      });
    } else {
      // Already locked to GitHub profile until refresh; clicking triggers a brief glitch flash of the initial photo
      triggerGlitchBurst();
    }
  };

  // 1. Choreographed GSAP Intro Timeline & ScrollTrigger Scrub Parallax
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const ctx = gsap.context(() => {
      // Scroll-scrubbed kinetic typography & portrait depth
      gsap.to(titleLeftWrapRef.current, {
        xPercent: -7,
        ease: 'none',
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(titleRightWrapRef.current, {
        xPercent: 7,
        ease: 'none',
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(portraitCardRef.current, {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, heroEl);

    return () => ctx.revert();
  }, []);

  // 2. Play Entrance Reveal when Preloader finishes
  useEffect(() => {
    if (!bootComplete || hasPlayedIntro.current) return;
    hasPlayedIntro.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo(
        topStripRef.current,
        { y: -16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7 }
      )
        .fromTo(
          [titleLeftRef.current, titleRightRef.current],
          { yPercent: 110, skewY: 2 },
          {
            yPercent: 0,
            skewY: 0,
            duration: 1.05,
            stagger: 0.1,
          },
          '-=0.45'
        )
        .fromTo(
          [leftCardRef.current, portraitCardRef.current, rightCardRef.current],
          { y: 42, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.95,
            stagger: 0.12,
            ease: 'power3.out',
          },
          '-=0.65'
        )
        .fromTo(
          portraitImgRef.current,
          { scale: 1.1 },
          { scale: 1, duration: 1.3, ease: 'power3.out' },
          '-=0.95'
        );
    }, heroRef);

    return () => ctx.revert();
  }, [bootComplete]);

  // 3. Animate Typography, Cards & Portrait Glitch when switching ON TRACK <-> OFF TRACK
  useEffect(() => {
    if (!hasPlayedIntro.current) return;
    triggerGlitchBurst();

    const ctx = gsap.context(() => {
      // Glitch tear on background display titles
      gsap.fromTo(
        [titleLeftRef.current, titleRightRef.current],
        { x: (i) => (i === 0 ? -24 : 24), skewX: -8, autoAlpha: 0.35 },
        {
          keyframes: [
            { x: (i) => (i === 0 ? 14 : -14), skewX: 6, autoAlpha: 0.85, duration: 0.06 },
            { x: (i) => (i === 0 ? -8 : 8), skewX: -4, autoAlpha: 0.6, duration: 0.06 },
            { x: 0, skewX: 0, autoAlpha: 1, duration: 0.25, ease: 'power3.out' },
          ],
          overwrite: 'auto',
        }
      );

      // Glitch jitter on left & right foreground cards
      gsap.fromTo(
        [leftCardRef.current, rightCardRef.current],
        { x: -10, skewX: -3, filter: 'contrast(1.25)' },
        {
          keyframes: [
            { x: 8, skewX: 3, duration: 0.05 },
            { x: -5, skewX: -2, duration: 0.05 },
            { x: 0, skewX: 0, filter: 'none', duration: 0.16, ease: 'power2.out' },
          ],
          overwrite: 'auto',
        }
      );

      gsap.fromTo(
        '.hero-mode-copy',
        { x: -12, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.35,
          stagger: 0.04,
          ease: 'power2.out',
          overwrite: 'auto',
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [trackMode, triggerGlitchBurst]);

  // 4. Interactive Mouse Parallax & Subtle 3D Portrait Tilt (gsap.quickTo)
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const xLeftTo = gsap.quickTo(titleLeftRef.current, 'x', {
      duration: 0.7,
      ease: 'power3.out',
    });
    const xRightTo = gsap.quickTo(titleRightRef.current, 'x', {
      duration: 0.7,
      ease: 'power3.out',
    });
    const rotYTo = gsap.quickTo(portraitCardRef.current, 'rotationY', {
      duration: 0.6,
      ease: 'power2.out',
    });
    const rotXTo = gsap.quickTo(portraitCardRef.current, 'rotationX', {
      duration: 0.6,
      ease: 'power2.out',
    });

    gsap.set(portraitCardRef.current, { transformPerspective: 1000 });

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const xNorm = (e.clientX / innerWidth - 0.5) * 2;
      const yNorm = (e.clientY / innerHeight - 0.5) * 2;

      xLeftTo(xNorm * -16);
      xRightTo(xNorm * 16);
      rotYTo(xNorm * 4.5);
      rotXTo(yNorm * -3.5);
    };

    const handleMouseLeave = () => {
      xLeftTo(0);
      xRightTo(0);
      rotYTo(0);
      rotXTo(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    heroEl.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      heroEl.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative min-h-screen pt-28 pb-16 flex flex-col justify-between overflow-hidden bg-[#0F0F0F] bg-telemetry-grid"
    >
      {/* Top Editorial Info Strip */}
      <div
        ref={topStripRef}
        className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 flex flex-wrap items-center justify-between gap-4 text-xs font-mono-telemetry uppercase tracking-widest text-[#8E8A82] border-b border-[#262626] pb-4"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#1A1A1A] border border-[#262626] text-[#C5B396] font-bold">
            <img src={PROFILE_DATA.logoUrl} alt="ANZ" className="w-3.5 h-3.5 object-cover rounded-sm" />
            <span>{PROFILE_DATA.monogram}</span>
          </span>
          <span className="text-[#EDEAE4]">
            {PROFILE_DATA.school} — {PROFILE_DATA.major}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-[#8E8A82]">
            <MapPin className="w-3.5 h-3.5 text-[#C5B396]" />
            {PROFILE_DATA.location}
          </span>
          <span className="hidden sm:inline text-[#C5B396]">
            {liveRepoCount || PROFILE_DATA.stats.publicRepos} REPOSITORIES
          </span>
        </div>
      </div>

      {/* Main Hero Stage */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 my-auto py-8 lg:py-10">
        {/* Background Editorial Typography with Clipping Masks */}
        <div
          className="pointer-events-none select-none flex flex-col items-center justify-center text-center leading-[0.88] mb-8 lg:mb-0"
          aria-hidden="true"
        >
          <div ref={titleLeftWrapRef} className="overflow-hidden px-2">
            <div
              ref={titleLeftRef}
              className="font-display text-[16vw] sm:text-[13.5vw] lg:text-[11rem] uppercase tracking-tight text-[#EDEAE4] will-change-transform"
            >
              <GlitchText
                text={isOnTrack ? 'MAYORANZ' : 'CREATIVE'}
                triggerKey={trackMode}
                minDelay={2800}
                maxDelay={5200}
              />
            </div>
          </div>
          <div ref={titleRightWrapRef} className="overflow-hidden px-2 -mt-2 sm:-mt-4">
            <div
              ref={titleRightRef}
              className="font-display text-[14vw] sm:text-[12vw] lg:text-[9.5rem] uppercase tracking-tight text-stroke-sand will-change-transform"
            >
              <GlitchText
                text={isOnTrack ? 'FULL STACK' : 'OFF TRACK'}
                triggerKey={trackMode}
                minDelay={3400}
                maxDelay={6000}
              />
            </div>
          </div>
        </div>

        {/* Center Foreground Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch lg:-mt-20">
          {/* Left Column: Narrative & Mode Callout */}
          <div
            ref={leftCardRef}
            className="lg:col-span-4 flex flex-col justify-between bg-[#141414] border border-[#262626] p-6 rounded-lg"
          >
            <div className="space-y-4">
              <div className="hero-mode-copy inline-flex items-center gap-2 px-2.5 py-1 bg-[#1A1A1A] border border-[#262626] font-mono-telemetry text-[11px] uppercase tracking-widest text-[#C5B396]">
                <GlitchText
                  text={
                    isOnTrack
                      ? 'ON TRACK — SOFTWARE ENGINEERING'
                      : 'OFF TRACK — PHOTOGRAPHY & DESIGN'
                  }
                  triggerKey={trackMode}
                  minDelay={3800}
                  maxDelay={7200}
                />
              </div>

              <h1 className="hero-mode-copy font-tech font-bold text-2xl sm:text-3xl text-[#EDEAE4] uppercase leading-tight">
                <GlitchText
                  text={PROFILE_DATA.fullName}
                  triggerKey={trackMode}
                  minDelay={4200}
                  maxDelay={8200}
                />
                <span className="block text-[#C5B396] text-base sm:text-lg font-normal mt-1">
                  <GlitchText
                    text={
                      isOnTrack
                        ? 'Full-Stack Web & Flutter Mobile Developer'
                        : 'DSLR Photographer, 3D Artist & Designer'
                    }
                    triggerKey={trackMode}
                    minDelay={4500}
                    maxDelay={8500}
                  />
                </span>
              </h1>

              <p className="hero-mode-copy text-sm text-[#8E8A82] leading-relaxed">
                {isOnTrack
                  ? 'Membangun aplikasi web full-stack (React, TypeScript, Laravel, Node.js) dan aplikasi mobile lintas platform (Flutter & Dart) dengan arsitektur yang rapi dan terukur.'
                  : 'Di luar penulisan kode, aktif memotret menggunakan kamera DSLR, mengolah tone warna di Adobe Lightroom, membuat pemodelan 3D di Blender, serta merancang ilustrasi vektor.'}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#262626] flex flex-wrap items-center gap-3">
              <a
                href="#garage"
                className="group inline-flex items-center gap-2 bg-[#EDEAE4] hover:bg-[#C5B396] text-[#0F0F0F] font-tech font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-md transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>LIHAT PROYEK</span>
                <ArrowDownRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>

              <button
                type="button"
                onClick={() => setTrackMode(isOnTrack ? 'OFF TRACK' : 'ON TRACK')}
                className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:border-[#C5B396] text-[#EDEAE4] border border-[#262626] font-mono-telemetry text-xs uppercase tracking-wider px-4 py-3 rounded-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>MODE: {isOnTrack ? 'OFF TRACK' : 'ON TRACK'}</span>
              </button>
            </div>
          </div>

          {/* Center Column: Interactive Glitch Portrait Frame (LCP Candidate Image) */}
          <div className="lg:col-span-4 flex justify-center">
            <div
              ref={portraitCardRef}
              onClick={handlePortraitClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePortraitClick();
                }
              }}
              aria-label={
                isLockedToGithub
                  ? 'Foto profil GitHub Mayoranz aktif (efek glitch aktif)'
                  : 'Klik untuk mengubah foto utama ke profil GitHub Mayoranz'
              }
              title={
                isLockedToGithub
                  ? 'Terkunci pada profil GitHub (Refresh halaman untuk kembali ke foto awal)'
                  : 'Klik untuk beralih ke foto profil GitHub'
              }
              className="group relative w-full max-w-[340px] rounded-lg bg-[#141414] p-2 border border-[#262626] hover:border-[#C5B396] transition-colors cursor-pointer select-none will-change-transform"
            >
              <div className="relative rounded overflow-hidden bg-[#0F0F0F] aspect-[4/4.6]">
                {/* Top Glitch Status Indicator Pill */}
                <div
                  ref={glitchBadgeRef}
                  className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none"
                >
                  <span className="px-2 py-0.5 rounded bg-[#0F0F0F]/90 border border-[#262626] font-mono-telemetry text-[10px] uppercase tracking-widest text-[#C5B396]">
                    {isLockedToGithub ? 'SYNC // GITHUB ID' : 'ERR_GLITCH // CLICK PHOTO'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#0F0F0F]/90 border border-[#262626] font-mono-telemetry text-[10px] text-[#8E8A82]">
                    {isLockedToGithub ? 'LOCKED' : '01 / 02'}
                  </span>
                </div>

                {/* 1. Primary Hero LCP Image: uses fetchpriority="high" and never loading="lazy" per optimize-image-priority */}
                <img
                  ref={portraitImgRef}
                  src={primaryPortraitSrc}
                  alt={`${PROFILE_DATA.fullName} (${PROFILE_DATA.handle})`}
                  fetchpriority="high"
                  width="340"
                  height="390"
                  className="w-full h-full object-cover object-center will-change-transform"
                />

                {/* 2. Secondary Full Glitch Flash Layer (above-the-fold, initially hidden -> fetchpriority="low") */}
                <img
                  ref={glitchFullRef}
                  src={glitchPortraitSrc}
                  alt=""
                  aria-hidden="true"
                  fetchpriority="low"
                  width="340"
                  height="390"
                  className="pointer-events-none absolute inset-0 w-full h-full object-cover object-center opacity-0 mix-blend-normal will-change-transform"
                />

                {/* 3. Horizontal Glitch Slice — Top Band */}
                <img
                  ref={sliceTopRef}
                  src={glitchPortraitSrc}
                  alt=""
                  aria-hidden="true"
                  fetchpriority="low"
                  width="340"
                  height="390"
                  style={{
                    filter: 'drop-shadow(4px 0 0 rgba(197,179,150,0.75)) drop-shadow(-4px 0 0 rgba(15,15,15,0.85))',
                  }}
                  className="pointer-events-none absolute inset-0 w-full h-full object-cover object-center opacity-0 will-change-transform"
                />

                {/* 4. Horizontal Glitch Slice — Middle Band */}
                <img
                  ref={sliceMidRef}
                  src={glitchPortraitSrc}
                  alt=""
                  aria-hidden="true"
                  fetchpriority="low"
                  width="340"
                  height="390"
                  style={{
                    filter: 'drop-shadow(-5px 0 0 rgba(237,234,228,0.7)) drop-shadow(4px 0 0 rgba(197,179,150,0.7))',
                  }}
                  className="pointer-events-none absolute inset-0 w-full h-full object-cover object-center opacity-0 will-change-transform"
                />

                {/* 5. Horizontal Glitch Slice — Bottom Band */}
                <img
                  ref={sliceBotRef}
                  src={glitchPortraitSrc}
                  alt=""
                  aria-hidden="true"
                  fetchpriority="low"
                  width="340"
                  height="390"
                  style={{
                    filter: 'drop-shadow(5px 0 0 rgba(197,179,150,0.8))',
                  }}
                  className="pointer-events-none absolute inset-0 w-full h-full object-cover object-center opacity-0 will-change-transform"
                />

                {/* 6. Digital Scanline & Signal Tear Overlay during glitch */}
                <div
                  ref={scanlineRef}
                  aria-hidden="true"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(0deg, rgba(15,15,15,0.55) 0px, rgba(15,15,15,0.55) 2px, rgba(197,179,150,0.12) 2px, rgba(197,179,150,0.12) 4px)',
                  }}
                  className="pointer-events-none absolute inset-0 z-20 opacity-0"
                />

                {/* Bottom Card Overlay (Flat Matte Bar) */}
                <div className="absolute bottom-0 inset-x-0 z-30 bg-[#141414]/95 border-t border-[#262626] p-4 flex items-end justify-between">
                  <div>
                    <span className="block font-mono-telemetry text-[10px] text-[#C5B396] uppercase tracking-widest mb-1">
                      {isLockedToGithub
                        ? `${PROFILE_DATA.handle} // GITHUB PROFILE`
                        : `${PROFILE_DATA.handle} // CLICK TO SWITCH`}
                    </span>
                    <h2 className="font-display text-xl text-[#EDEAE4] uppercase tracking-wide leading-none">
                      ANDHIKA N. HIDAYAT
                    </h2>
                    <p className="font-mono-telemetry text-[10px] text-[#8E8A82] mt-1">
                      SMKN 1 CIANJUR — PPLG
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#1A1A1A] border border-[#262626] font-mono-telemetry text-[10px] text-[#EDEAE4]">
                    <img src={PROFILE_DATA.logoUrl} alt="ANZ" className="w-3.5 h-3.5 object-cover rounded-sm" />
                    <span>{PROFILE_DATA.monogram}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Summary Specs */}
          <div
            ref={rightCardRef}
            className="lg:col-span-4 flex flex-col justify-between bg-[#141414] border border-[#262626] rounded-lg p-6"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4">
                <span className="font-mono-telemetry text-xs uppercase tracking-widest text-[#8E8A82]">
                  ARCHIVE SUMMARY
                </span>
                <span className="font-mono-telemetry text-xs text-[#C5B396]">
                  @{PROFILE_DATA.handle}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-[#0F0F0F] border border-[#262626] rounded-md p-3.5">
                  <span className="font-mono-telemetry text-[10px] text-[#8E8A82] uppercase block">
                    REPOSITORIES
                  </span>
                  <span className="font-display text-3xl text-[#EDEAE4]">
                    {liveRepoCount || PROFILE_DATA.stats.publicRepos}
                  </span>
                  <span className="font-mono-telemetry text-[10px] text-[#C5B396] block mt-0.5">
                    PUBLIC ARCHIVES
                  </span>
                </div>

                <div className="bg-[#0F0F0F] border border-[#262626] rounded-md p-3.5">
                  <span className="font-mono-telemetry text-[10px] text-[#8E8A82] uppercase block">
                    CURATED WORKS
                  </span>
                  <span className="font-display text-3xl text-[#C5B396]">12</span>
                  <span className="font-mono-telemetry text-[10px] text-[#8E8A82] block mt-0.5">
                    WEB • MOBILE • API
                  </span>
                </div>
              </div>
            </div>

            {/* Stack Pills */}
            <div className="space-y-2.5 pt-4 border-t border-[#262626]">
              <div className="flex items-center justify-between text-xs font-mono-telemetry text-[#8E8A82]">
                <span>CORE DISCIPLINES</span>
                <span className="text-[#EDEAE4]">WEB, MOBILE & VISUALS</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'React',
                  'TypeScript',
                  'Laravel',
                  'Node.js',
                  'Flutter',
                  'Dart',
                  'DSLR Photography',
                  'Blender 3D',
                ].map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 rounded bg-[#1A1A1A] border border-[#262626] hover:border-[#C5B396] transition-colors font-mono-telemetry text-[11px] text-[#EDEAE4]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Flat Editorial Ticker Marquee */}
      <div className="relative z-20 mt-8 bg-[#141414] text-[#8E8A82] py-3 border-y border-[#262626] overflow-hidden">
        <div className="animate-marquee-left flex items-center gap-8 font-mono-telemetry text-xs uppercase tracking-[0.25em]">
          {Array.from({ length: 2 }).map((_, idx) => (
            <React.Fragment key={idx}>
              <span className="text-[#EDEAE4]">ANDHIKA NOOR HIDAYAT</span>
              <span className="text-[#C5B396]">•</span>
              <span>FULL-STACK WEB DEVELOPER</span>
              <span className="text-[#C5B396]">•</span>
              <span>FLUTTER MOBILE DEVELOPMENT</span>
              <span className="text-[#C5B396]">•</span>
              <span>DSLR PHOTOGRAPHY & 3D VISUALS</span>
              <span className="text-[#C5B396]">•</span>
              <span>SMKN 1 CIANJUR (PPLG)</span>
              <span className="text-[#C5B396]">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
