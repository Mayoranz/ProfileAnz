import React, { useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TrackDualitySection from './components/TrackDualitySection';
import ProjectGarage from './components/ProjectGarage';
import ProjectModal from './components/ProjectModal';
import TrophyCabinet from './components/TrophyCabinet';
import CertificateModal from './components/CertificateModal';
import TelemetrySection from './components/TelemetrySection';
import FooterPitWall from './components/FooterPitWall';
import TrackGlitchOverlay from './components/TrackGlitchOverlay';
import { useGithubTelemetry } from './hooks/useGithubTelemetry';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [trackMode, setTrackModeState] = useState('ON TRACK');
  const [glitchTransition, setGlitchTransition] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const telemetry = useGithubTelemetry('Mayoranz');

  // Trigger a GSAP Glitch Cutover whenever switching between ON TRACK and OFF TRACK
  const handleSetTrackMode = useCallback((nextMode) => {
    setGlitchTransition({ id: Date.now(), mode: nextMode });
    setTimeout(() => {
      setTrackModeState(nextMode);
    }, 110);
  }, []);

  // Synchronize Lenis Smooth Scroll with GSAP ScrollTrigger & Ticker
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const update = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  // Refresh ScrollTrigger positions after preloader or mode switch changes layout height
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, [bootComplete, trackMode]);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#EDEAE4] relative">
      {!bootComplete && <Preloader onComplete={() => setBootComplete(true)} />}

      <TrackGlitchOverlay glitchTransition={glitchTransition} />

      <Navbar trackMode={trackMode} setTrackMode={handleSetTrackMode} />

      <main>
        <HeroSection
          bootComplete={bootComplete}
          trackMode={trackMode}
          setTrackMode={handleSetTrackMode}
          liveRepoCount={telemetry.user.public_repos}
          githubAvatarUrl={telemetry.user.avatar_url}
        />

        <TrackDualitySection trackMode={trackMode} setTrackMode={handleSetTrackMode} />

        <ProjectGarage onSelectProject={(project) => setSelectedProject(project)} />

        <TrophyCabinet
          onSelectCertificate={(cert) => setSelectedCertificate(cert)}
        />

        <TelemetrySection telemetry={telemetry} />
      </main>

      <FooterPitWall />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />
    </div>
  );
}
