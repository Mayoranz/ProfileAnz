import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  CheckCircle2,
  ExternalLink,
  Github,
  Globe,
  Smartphone,
  X,
} from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  const dialogRef = useRef(null);
  const contentRef = useRef(null);

  // Open modal via native showModal() when a project is selected + GSAP entrance
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (project) {
      if (!dialog.open) {
        dialog.showModal();
      }
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { y: 24, scale: 0.97, autoAlpha: 0 },
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.45,
            ease: 'power3.out',
            overwrite: 'auto',
          }
        );
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [project]);

  // Modern Web Guidance (light-dismiss-a-dialog):
  // Mandatory fallback for browsers without native HTMLDialogElement.prototype.closedBy support (e.g., Safari)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleNativeClose = () => {
      if (onClose) onClose();
    };

    dialog.addEventListener('close', handleNativeClose);

    let handleBackdropClick = null;
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      handleBackdropClick = (event) => {
        // 1. When clicking the backdrop, the event target is the dialog element itself.
        if (event.target !== dialog) return;

        // 2. Check if click coordinates fall within the dialog's content box.
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;

        if (isDialogContent) return;

        // 3. Click was outside content area (on backdrop), manually close dialog.
        dialog.close();
      };
      dialog.addEventListener('click', handleBackdropClick);
    }

    return () => {
      dialog.removeEventListener('close', handleNativeClose);
      if (handleBackdropClick) {
        dialog.removeEventListener('click', handleBackdropClick);
      }
    };
  }, [onClose]);

  const isAndroidLogo = project?.mockupType === 'android-logo';

  return (
    <dialog
      ref={dialogRef}
      {...{ closedby: 'any' }}
      aria-labelledby="modal-project-title"
      className="telemetry-modal"
    >
      {project && (
        <div ref={contentRef} className="p-6 sm:p-8 space-y-6 bg-[#141414] text-[#EDEAE4]">
          {/* Top Modal Header */}
          <div className="flex items-start justify-between gap-4 border-b border-[#262626] pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2 font-mono-telemetry text-xs">
                <span className="px-2.5 py-0.5 rounded bg-[#C5B396] font-bold text-[#0F0F0F]">
                  {project.specNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-[#1A1A1A] border border-[#262626] text-[#EDEAE4]">
                  {project.category}
                </span>
                <span className="text-[#8E8A82]">YEAR — {project.year}</span>
              </div>
              <h2
                id="modal-project-title"
                className="font-display text-3xl sm:text-5xl uppercase tracking-wide text-[#EDEAE4]"
              >
                {project.name}
              </h2>
            </div>

            <form method="dialog">
              <button
                type="submit"
                aria-label="Close project telemetry modal"
                className="p-2.5 rounded-md bg-[#1A1A1A] hover:bg-[#C5B396] text-[#EDEAE4] hover:text-[#0F0F0F] border border-[#262626] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Full Visual Mockup / Android App Logo Preview */}
          {project.mockupUrl && (
            <div className="rounded-lg overflow-hidden border border-[#262626] bg-[#0F0F0F]">
              {isAndroidLogo ? (
                <div className="py-8 px-6 bg-[#0F0F0F] flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl p-2 bg-[#181818] border border-[#2A2A2A] shrink-0 flex items-center justify-center">
                    <img
                      src={project.mockupUrl}
                      alt={`Logo Aplikasi Android ${project.name}`}
                      loading="lazy"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                  <div className="text-center sm:text-left space-y-2 max-w-md">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1A1A1A] border border-[#262626] font-mono-telemetry text-xs text-[#C5B396] uppercase">
                      <Smartphone className="w-3.5 h-3.5" />
                      ANDROID APK — FLUTTER SDK
                    </span>
                    <h3 className="font-tech font-bold text-2xl text-[#EDEAE4]">
                      {project.repoName}.apk
                    </h3>
                    <p className="font-mono-telemetry text-xs text-[#8E8A82]">
                      PACKAGE: {project.previewDomain}
                    </p>
                    <p className="text-xs sm:text-sm text-[#8E8A82] leading-relaxed">
                      Identitas visual dan ikon launcher aplikasi Android yang dirancang untuk {project.name}.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Monochrome Browser Header */}
                  <div className="h-9 px-4 bg-[#181818] border-b border-[#262626] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3A3A3A]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3A3A3A]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3A3A3A]" />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#121212] border border-[#242424] font-mono-telemetry text-xs text-[#8E8A82]">
                      <Globe className="w-3.5 h-3.5 text-[#C5B396]" />
                      <span>{project.previewDomain || project.repoName}</span>
                    </div>
                    <span className="font-mono-telemetry text-[10px] text-[#8E8A82] uppercase">
                      PREVIEW
                    </span>
                  </div>
                  {/* Full Screenshot */}
                  <div className="max-h-[380px] overflow-y-auto bg-[#0A0A0A]">
                    <img
                      src={project.mockupUrl}
                      alt={`Mockup Web ${project.name}`}
                      loading="lazy"
                      className="w-full h-auto object-cover object-top"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Summary & Technical Architecture */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 space-y-4">
              <div>
                <h3 className="font-mono-telemetry text-xs uppercase tracking-widest text-[#C5B396] mb-1.5">
                  RINGKASAN PROYEK
                </h3>
                <p className="text-sm sm:text-base text-[#EDEAE4] leading-relaxed">
                  {project.summary}
                </p>
              </div>

              <div>
                <h3 className="font-mono-telemetry text-xs uppercase tracking-widest text-[#C5B396] mb-1.5">
                  ARSITEKTUR SISTEM
                </h3>
                <p className="text-sm text-[#8E8A82] leading-relaxed bg-[#0F0F0F] border border-[#262626] rounded-lg p-4">
                  {project.architecture}
                </p>
              </div>
            </div>

            {/* Key Highlights & Stack */}
            <div className="md:col-span-5 space-y-4 bg-[#0F0F0F] border border-[#262626] rounded-lg p-5">
              <div>
                <h3 className="font-mono-telemetry text-xs uppercase tracking-widest text-[#C5B396] mb-3">
                  FITUR UTAMA
                </h3>
                <ul className="space-y-2.5">
                  {project.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-[#EDEAE4]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#C5B396] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-[#222222]">
                <h3 className="font-mono-telemetry text-xs uppercase tracking-widest text-[#8E8A82] mb-2">
                  TEKNOLOGI
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((techItem) => (
                    <span
                      key={techItem}
                      className="px-2.5 py-1 rounded bg-[#1A1A1A] border border-[#262626] font-mono-telemetry text-xs text-[#EDEAE4]"
                    >
                      {techItem}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#262626]">
            <span className="font-mono-telemetry text-xs text-[#8E8A82]">
              KLIK DI LUAR ATAU TEKAN [ESC] UNTUK MENUTUP
            </span>

            <div className="flex flex-wrap items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#C5B396] hover:bg-[#EDEAE4] text-[#0F0F0F] font-tech font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <span>BUKA WEBSITE LIVE</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#1A1A1A] hover:bg-[#EDEAE4] text-[#EDEAE4] hover:text-[#0F0F0F] border border-[#262626] font-tech font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>LIHAT REPOSITORI GITHUB</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
