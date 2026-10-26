import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Github, ArrowUpRight, Terminal, Camera } from 'lucide-react';
import { PROFILE_DATA } from '../data/portfolioData';
import GlitchText from './GlitchText';

export default function Navbar({ trackMode, setTrackMode }) {
  const isOnTrack = trackMode === 'ON TRACK';
  const navBarRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navBarRef.current,
        { y: -32, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          delay: 1.4,
          ease: 'power3.out',
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleModeSwitch = (mode) => {
    setTrackMode(mode);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-4 pointer-events-none">
      <div
        ref={navBarRef}
        className="max-w-7xl mx-auto flex items-center justify-between gap-3 bg-[#141414]/95 backdrop-blur-md border border-[#262626] rounded-lg px-4 py-2.5 pointer-events-auto"
      >
        {/* Brand Monogram / Logo */}
        <a
          href="#top"
          className="group flex items-center gap-3 focus:outline-none"
          aria-label="Mayoranz Home"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-md bg-[#0F0F0F] border border-[#262626] group-hover:border-[#C5B396] overflow-hidden transition-colors shrink-0">
            <img
              src={PROFILE_DATA.logoUrl}
              alt="ANZ Logo"
              width="40"
              height="40"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-tech font-bold text-sm tracking-wider text-[#EDEAE4] leading-none group-hover:text-[#C5B396] transition-colors">
              <GlitchText text={PROFILE_DATA.fullName} minDelay={5000} maxDelay={9500} />
            </span>
            <span className="font-mono-telemetry text-[10px] text-[#8E8A82] tracking-widest uppercase mt-1">
              <GlitchText
                text={`${PROFILE_DATA.handle} — PPLG`}
                triggerKey={trackMode}
                minDelay={4000}
                maxDelay={8000}
              />
            </span>
          </div>
        </a>

        {/* ON TRACK / OFF TRACK Switcher (Flat Matte, No Gradients/Glow) */}
        <div
          className="flex items-center bg-[#0F0F0F] p-1 rounded-md border border-[#262626]"
          role="group"
          aria-label="Switch Portfolio Mode between On Track and Off Track"
        >
          <button
            type="button"
            onClick={() => handleModeSwitch('ON TRACK')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded font-mono-telemetry text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              isOnTrack
                ? 'bg-[#C5B396] text-[#0F0F0F] font-bold'
                : 'text-[#8E8A82] hover:text-[#EDEAE4]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>ON TRACK</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeSwitch('OFF TRACK')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded font-mono-telemetry text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              !isOnTrack
                ? 'bg-[#C5B396] text-[#0F0F0F] font-bold'
                : 'text-[#8E8A82] hover:text-[#EDEAE4]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>OFF TRACK</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 font-mono-telemetry text-xs uppercase tracking-widest text-[#8E8A82]">
          <a href="#duality-section" className="hover:text-[#EDEAE4] transition-colors">
            <GlitchText
              text={`01 / ${isOnTrack ? 'ENGINEERING' : 'CREATIVE'}`}
              triggerKey={trackMode}
              periodic={false}
            />
          </a>
          <a href="#garage" className="hover:text-[#EDEAE4] transition-colors">
            02 / WORKS
          </a>
          <a href="#trophies" className="hover:text-[#EDEAE4] transition-colors">
            03 / CERTIFICATES
          </a>
          <a href="#telemetry" className="hover:text-[#EDEAE4] transition-colors">
            04 / GITHUB
          </a>
          <a href="#pitwall" className="hover:text-[#EDEAE4] transition-colors">
            05 / CONTACT
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={PROFILE_DATA.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#C5B396] text-[#EDEAE4] hover:text-[#0F0F0F] border border-[#262626] hover:border-[#C5B396] px-3.5 py-2 rounded-md font-mono-telemetry text-xs uppercase tracking-wider transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden md:inline">@Mayoranz</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
