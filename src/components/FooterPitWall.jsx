import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp, ArrowUpRight, Github, Instagram, Mail } from 'lucide-react';
import { PROFILE_DATA } from '../data/portfolioData';
import GlitchText from './GlitchText';

gsap.registerPlugin(ScrollTrigger);

export default function FooterPitWall() {
  const footerRef = useRef(null);
  const ctaCardRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const footerEl = footerRef.current;
    if (!footerEl) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerEl,
          start: 'top 85%',
          once: true,
        },
      });

      tl.fromTo(
        ctaCardRef.current,
        { y: 36, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' }
      ).fromTo(
        headingRef.current,
        { yPercent: 100, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'power4.out' },
        '-=0.55'
      );
    }, footerEl);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="pitwall"
      ref={footerRef}
      className="relative bg-[#0F0F0F] border-t border-[#262626] pt-20 pb-12 px-4 sm:px-8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Contact Call To Action (Flat Matte) */}
        <div
          ref={ctaCardRef}
          className="bg-[#141414] border border-[#262626] rounded-lg p-8 sm:p-12 mb-14"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="space-y-4 max-w-2xl">
              <div className="font-mono-telemetry text-xs uppercase tracking-[0.2em] text-[#C5B396]">
                <GlitchText
                  text="05 / CONTACT & COLLABORATION"
                  minDelay={4200}
                  maxDelay={8000}
                />
              </div>
              <div className="overflow-hidden">
                <h2
                  ref={headingRef}
                  className="font-display text-5xl sm:text-6xl uppercase text-[#EDEAE4] leading-[0.95] will-change-transform"
                >
                  <GlitchText text="LET'S BUILD" minDelay={3600} maxDelay={6900} />{' '}
                  <GlitchText
                    text="TOGETHER"
                    className="text-[#C5B396]"
                    minDelay={4100}
                    maxDelay={7600}
                  />
                </h2>
              </div>
              <p className="text-[#8E8A82] text-sm sm:text-base leading-relaxed">
                Hubungi <strong className="text-[#EDEAE4]">{PROFILE_DATA.fullName} ({PROFILE_DATA.handle})</strong> untuk kolaborasi pengembangan Web Full-Stack, aplikasi Mobile Flutter, maupun proyek fotografi & visual.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <a
                href={PROFILE_DATA.socials.email}
                className="group inline-flex items-center justify-between gap-4 px-6 py-4 rounded-md bg-[#C5B396] hover:bg-[#EDEAE4] text-[#0F0F0F] font-tech font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4" />
                  {PROFILE_DATA.socials.emailRaw}
                </span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={PROFILE_DATA.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-[#1A1A1A] hover:border-[#C5B396] border border-[#262626] text-[#EDEAE4] font-mono-telemetry text-xs uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Github className="w-4 h-4 text-[#C5B396]" />
                  <span>GITHUB</span>
                </a>

                <a
                  href={PROFILE_DATA.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-[#1A1A1A] hover:border-[#C5B396] border border-[#262626] text-[#EDEAE4] font-mono-telemetry text-xs uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Instagram className="w-4 h-4 text-[#C5B396]" />
                  <span>INSTAGRAM</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-[#262626] pt-8 font-mono-telemetry text-xs text-[#8E8A82]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-[#0F0F0F] border border-[#262626] overflow-hidden flex items-center justify-center shrink-0">
              <img src={PROFILE_DATA.logoUrl} alt="ANZ" className="w-full h-full object-cover" />
            </div>
            <span>
              © {new Date().getFullYear()} {PROFILE_DATA.fullName}. All Rights Reserved.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span>SMKN 1 CIANJUR — PPLG</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="group inline-flex items-center gap-2 text-[#EDEAE4] hover:text-[#C5B396] transition-colors cursor-pointer"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
