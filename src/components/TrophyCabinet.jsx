import React, { useState, useMemo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Award,
  Calendar,
  ExternalLink,
  Eye,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { CERTIFICATES_DATA, PROFILE_DATA } from '../data/portfolioData';
import GlitchText from './GlitchText';

gsap.registerPlugin(ScrollTrigger);

const CERT_CATEGORIES = [
  'SEMUA SERTIFIKAT',
  'SERTIFIKASI TEKNIS',
  'KOMPETISI & PENGHARGAAN',
  'AKADEMIK & KOMPETENSI',
];

export default function TrophyCabinet({ onSelectCertificate }) {
  const [activeCategory, setActiveCategory] = useState('SEMUA SERTIFIKAT');
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const dividerRef = useRef(null);
  const tabsRef = useRef(null);
  const gridRef = useRef(null);

  const filteredCertificates = useMemo(() => {
    if (activeCategory === 'SEMUA SERTIFIKAT') return CERTIFICATES_DATA;
    return CERTIFICATES_DATA.filter((cert) => cert.category === activeCategory);
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

  // 2. Staggered Certificate Cards Reveal on Scroll & Category Switch
  useEffect(() => {
    const gridEl = gridRef.current;
    if (!gridEl) return;

    const ctx = gsap.context(() => {
      const cards = gridEl.querySelectorAll('.cert-anim-card');
      gsap.fromTo(
        cards,
        { y: 36, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          overwrite: 'auto',
          scrollTrigger: {
            trigger: gridEl,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, sectionRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [activeCategory]);

  return (
    <section
      id="trophies"
      ref={sectionRef}
      className="relative py-24 sm:py-28 px-4 sm:px-8 bg-[#0F0F0F] border-t border-[#262626] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8">
          <div>
            <div className="flex items-center gap-2 font-mono-telemetry text-xs uppercase tracking-[0.2em] text-[#C5B396] mb-3">
              <GlitchText
                text="03 / CERTIFICATES & HONORS"
                triggerKey={activeCategory}
                minDelay={4100}
                maxDelay={7900}
              />
              <span>—</span>
              <span>{CERTIFICATES_DATA.length} VERIFIED CREDENTIALS</span>
            </div>
            <div className="overflow-hidden">
              <h2
                ref={headingRef}
                className="font-display text-5xl sm:text-6xl uppercase text-[#EDEAE4] leading-[0.95] will-change-transform"
              >
                <GlitchText
                  text="CERTIFICATES &"
                  triggerKey={activeCategory}
                  minDelay={3600}
                  maxDelay={6900}
                />{' '}
                <GlitchText
                  text="PIAGAM"
                  triggerKey={activeCategory}
                  className="text-stroke-sand"
                  minDelay={4200}
                  maxDelay={7600}
                />
              </h2>
            </div>
          </div>

          <p className="max-w-md text-xs sm:text-sm text-[#8E8A82]">
            Etalase sertifikasi kompetensi resmi dan piagam penghargaan{' '}
            <strong className="text-[#EDEAE4]">{PROFILE_DATA.fullName}</strong>. Klik kartu untuk melihat sertifikat penuh beserta rincian silabus.
          </p>
        </div>

        {/* Animated Hairline Divider */}
        <div
          ref={dividerRef}
          className="h-[1px] w-full bg-[#262626] mb-10"
        />

        {/* Category Filter Tabs */}
        <div
          ref={tabsRef}
          className="flex flex-wrap items-center gap-2 mb-10"
          role="tablist"
          aria-label="Filter piagam berdasarkan kategori"
        >
          {CERT_CATEGORIES.map((category) => {
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

        {/* Certificates Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((cert) => (
            <article
              key={cert.id}
              onClick={() => onSelectCertificate(cert)}
              className="cert-anim-card group bg-[#141414] border border-[#262626] hover:border-[#C5B396] hover:-translate-y-1.5 rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer"
            >
              {/* Certificate Visual Preview Frame */}
              <div>
                <div className="relative aspect-[16/11] bg-[#0A0A0A] border-b border-[#262626] overflow-hidden">
                  {cert.imageUrl ? (
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      loading="lazy"
                      width="480"
                      height="330"
                      className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="w-full h-full p-5 flex flex-col justify-between bg-[#141414] relative">
                      <div className="flex items-center justify-between">
                        <span className="font-mono-telemetry text-[10px] uppercase tracking-widest text-[#C5B396] border border-[#262626] bg-[#1A1A1A] px-2.5 py-0.5 rounded">
                          OFFICIAL CERTIFICATE
                        </span>
                        <Award className="w-6 h-6 text-[#C5B396]" />
                      </div>

                      <div className="my-auto py-2">
                        <p className="font-mono-telemetry text-[10px] text-[#8E8A82] uppercase tracking-widest">
                          PRESENTED TO
                        </p>
                        <p className="font-display text-2xl text-[#EDEAE4] uppercase tracking-wide">
                          {PROFILE_DATA.fullName}
                        </p>
                        <p className="font-mono-telemetry text-[11px] text-[#C5B396] truncate mt-0.5">
                          {cert.issuer}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono-telemetry text-[#8E8A82] border-t border-[#262626] pt-2">
                        <span>ID: {cert.credentialId}</span>
                        <span className="text-[#C5B396] flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Top Index Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded bg-[#141414]/95 border border-[#262626] font-mono-telemetry text-[11px] font-bold text-[#C5B396]">
                      {cert.code}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 font-mono-telemetry text-[11px] text-[#8E8A82] mb-2">
                    <span className="text-[#C5B396] uppercase">{cert.category}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {cert.date}
                    </span>
                  </div>

                  <h3 className="font-tech font-bold text-xl text-[#EDEAE4] group-hover:text-[#C5B396] transition-colors mb-2 leading-snug">
                    {cert.title}
                  </h3>

                  <p className="font-mono-telemetry text-xs text-[#8E8A82] mb-3">
                    {cert.issuer}
                  </p>

                  <p className="text-xs sm:text-sm text-[#8E8A82] line-clamp-2 leading-relaxed">
                    {cert.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 pb-6 pt-3 border-t border-[#222222] space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 rounded bg-[#1A1A1A] border border-[#262626] font-mono-telemetry text-[10px] text-[#EDEAE4]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between font-mono-telemetry text-xs pt-1">
                  <span className="text-[#C5B396] font-semibold inline-flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    LIHAT SERTIFIKAT
                  </span>
                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-[#8E8A82] text-[11px]">{cert.credentialId}</span>
                    {cert.pdfUrl && (
                      <a
                        href={cert.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Buka File PDF Sertifikat Asli"
                        className="p-1.5 rounded bg-[#1A1A1A] hover:bg-[#C5B396] text-[#EDEAE4] hover:text-[#0F0F0F] border border-[#262626] transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Verifikasi Sertifikat di Dicoding"
                        className="p-1.5 rounded bg-[#1A1A1A] hover:bg-[#EDEAE4] text-[#8E8A82] hover:text-[#0F0F0F] border border-[#262626] transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
