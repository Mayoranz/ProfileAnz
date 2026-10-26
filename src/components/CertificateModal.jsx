import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  Award,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileText,
  ShieldCheck,
  X,
} from 'lucide-react';
import { PROFILE_DATA } from '../data/portfolioData';

export default function CertificateModal({ certificate, onClose }) {
  const dialogRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (certificate) {
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
  }, [certificate]);

  // Modern Web Guidance (light-dismiss-a-dialog):
  // Mandatory fallback for browsers without native HTMLDialogElement.prototype.closedBy support
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
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (isDialogContent) return;
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

  return (
    <dialog
      ref={dialogRef}
      {...{ closedby: 'any' }}
      aria-labelledby="modal-certificate-title"
      className="telemetry-modal"
    >
      {certificate && (
        <div ref={contentRef} className="p-6 sm:p-8 space-y-6 bg-[#141414] text-[#EDEAE4]">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-[#262626] pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2 font-mono-telemetry text-xs">
                <span className="px-2.5 py-0.5 rounded bg-[#C5B396] font-bold text-[#0F0F0F]">
                  {certificate.code}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-[#1A1A1A] border border-[#262626] text-[#EDEAE4]">
                  {certificate.category}
                </span>
                <span className="text-[#8E8A82] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#C5B396]" />
                  {certificate.date}
                </span>
              </div>
              <h2
                id="modal-certificate-title"
                className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-[#EDEAE4]"
              >
                {certificate.title}
              </h2>
            </div>

            <form method="dialog">
              <button
                type="submit"
                aria-label="Close certificate preview modal"
                className="p-2.5 rounded-md bg-[#1A1A1A] hover:bg-[#C5B396] text-[#EDEAE4] hover:text-[#0F0F0F] border border-[#262626] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Large Certificate Preview */}
          <div className="rounded-lg overflow-hidden border border-[#262626] bg-[#0A0A0A]">
            {certificate.imageUrl ? (
              <img
                src={certificate.imageUrl}
                alt={certificate.title}
                loading="lazy"
                className="w-full max-h-[440px] object-contain mx-auto"
              />
            ) : (
              <div className="p-8 sm:p-10 bg-[#0F0F0F] text-center space-y-4">
                <div className="w-14 h-14 rounded-lg bg-[#1A1A1A] border border-[#262626] flex items-center justify-center mx-auto text-[#C5B396]">
                  <Award className="w-7 h-7" />
                </div>
                <p className="font-mono-telemetry text-xs uppercase tracking-[0.25em] text-[#C5B396]">
                  OFFICIAL CERTIFICATE RECORD
                </p>
                <h3 className="font-display text-3xl sm:text-4xl text-[#EDEAE4] uppercase">
                  {PROFILE_DATA.fullName}
                </h3>
                <p className="text-sm text-[#8E8A82] max-w-xl mx-auto">
                  Diberikan oleh <strong className="text-[#EDEAE4]">{certificate.issuer}</strong> atas pencapaian:{' '}
                  <span className="text-[#C5B396]">{certificate.title}</span>
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded bg-[#1A1A1A] border border-[#262626] font-mono-telemetry text-xs text-[#C5B396]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>CREDENTIAL ID: {certificate.credentialId}</span>
                </div>
              </div>
            )}
          </div>

          {/* Details, Syllabus Modules & Skills */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7 space-y-4">
              <div>
                <h4 className="font-mono-telemetry text-xs uppercase tracking-widest text-[#C5B396] mb-1.5">
                  DESKRIPSI PENCAPAIAN
                </h4>
                <p className="text-sm sm:text-base text-[#EDEAE4] leading-relaxed">
                  {certificate.description}
                </p>
              </div>

              {certificate.modules && certificate.modules.length > 0 && (
                <div>
                  <h4 className="font-mono-telemetry text-xs uppercase tracking-widest text-[#C5B396] mb-2">
                    MATERI YANG DIPELAJARI (SILABUS)
                  </h4>
                  <ul className="space-y-2 bg-[#0F0F0F] border border-[#262626] rounded-lg p-4">
                    {certificate.modules.map((mod) => (
                      <li
                        key={mod}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-[#8E8A82]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#C5B396] shrink-0 mt-0.5" />
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="md:col-span-5 bg-[#0F0F0F] border border-[#262626] rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono-telemetry">
                <span className="text-[#8E8A82]">INSTITUSI</span>
                <span className="text-[#EDEAE4] font-bold text-right">{certificate.issuer}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono-telemetry border-t border-[#222222] pt-2">
                <span className="text-[#8E8A82]">CREDENTIAL ID</span>
                <span className="text-[#C5B396] font-bold">{certificate.credentialId}</span>
              </div>
              {certificate.hours && (
                <div className="flex items-center justify-between text-xs font-mono-telemetry border-t border-[#222222] pt-2">
                  <span className="text-[#8E8A82]">DURASI BELAJAR</span>
                  <span className="text-[#EDEAE4] font-bold">{certificate.hours}</span>
                </div>
              )}
              {certificate.validUntil && (
                <div className="flex items-center justify-between text-xs font-mono-telemetry border-t border-[#222222] pt-2">
                  <span className="text-[#8E8A82]">BERLAKU HINGGA</span>
                  <span className="text-[#8E8A82]">{certificate.validUntil}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs font-mono-telemetry border-t border-[#222222] pt-2">
                <span className="text-[#8E8A82]">KOMPETENSI</span>
                <div className="flex flex-wrap justify-end gap-1.5">
                  {certificate.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-[#1A1A1A] border border-[#262626] text-[11px] text-[#EDEAE4]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#262626]">
            <span className="font-mono-telemetry text-xs text-[#8E8A82]">
              KLIK DI LUAR ATAU TEKAN [ESC] UNTUK MENUTUP
            </span>

            <div className="flex flex-wrap items-center gap-3">
              {certificate.pdfUrl && (
                <a
                  href={certificate.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#1A1A1A] hover:bg-[#EDEAE4] text-[#EDEAE4] hover:text-[#0F0F0F] border border-[#262626] font-tech font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#C5B396]" />
                  <span>BUKA FILE PDF ASLI</span>
                </a>
              )}
              {certificate.credentialUrl && (
                <a
                  href={certificate.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#C5B396] hover:bg-[#EDEAE4] text-[#0F0F0F] font-tech font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <span>VERIFIKASI SERTIFIKAT</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
