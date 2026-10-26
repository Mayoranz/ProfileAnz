import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

const ERROR_GLYPHS = '01X/#_█Ø749ERR//';

export default function GlitchText({
  text,
  as: Tag = 'span',
  className = '',
  periodic = true,
  minDelay = 3200,
  maxDelay = 6800,
  glitchOnHover = true,
  triggerKey,
}) {
  const elRef = useRef(null);
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const isAnimatingRef = useRef(false);
  const prevTextRef = useRef(text);
  const prevTriggerRef = useRef(triggerKey);

  // Short occasional partial-character error glitch
  const runMicroGlitch = useCallback(() => {
    if (!elRef.current || isAnimatingRef.current || !text) return;
    isAnimatingRef.current = true;
    setIsGlitching(true);

    const chars = String(text).split('');
    const total = chars.length;

    const corruptSome = (intensity = 0.28) =>
      chars
        .map((ch) => {
          if (ch === ' ') return ' ';
          if (Math.random() < intensity) {
            return ERROR_GLYPHS[Math.floor(Math.random() * ERROR_GLYPHS.length)];
          }
          return ch;
        })
        .join('');

    const tl = gsap.timeline({
      onComplete: () => {
        setDisplayText(text);
        setIsGlitching(false);
        if (elRef.current) {
          gsap.set(elRef.current, { x: 0, skewX: 0 });
        }
        isAnimatingRef.current = false;
      },
    });

    tl.to(elRef.current, {
      x: -4,
      skewX: -5,
      duration: 0.04,
      onStart: () => setDisplayText(corruptSome(total > 10 ? 0.25 : 0.4)),
    })
      .to(elRef.current, {
        x: 5,
        skewX: 4,
        duration: 0.05,
        onStart: () => setDisplayText(corruptSome(total > 10 ? 0.35 : 0.5)),
      })
      .to(elRef.current, {
        x: -2,
        skewX: 0,
        duration: 0.04,
        onStart: () => setDisplayText(text),
      })
      .to(elRef.current, {
        x: 3,
        skewX: -3,
        duration: 0.04,
        onStart: () => setDisplayText(corruptSome(0.2)),
      })
      .to(elRef.current, {
        x: 0,
        skewX: 0,
        duration: 0.04,
        onStart: () => setDisplayText(text),
      });
  }, [text]);

  // Full scramble transition when text or triggerKey changes (e.g., ON TRACK <-> OFF TRACK)
  const runFullTransitionGlitch = useCallback((targetStr) => {
    if (!elRef.current) {
      setDisplayText(targetStr);
      return;
    }
    isAnimatingRef.current = true;
    setIsGlitching(true);

    const chars = String(targetStr).split('');
    const progressObj = { p: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        setDisplayText(targetStr);
        setIsGlitching(false);
        if (elRef.current) {
          gsap.set(elRef.current, { x: 0, skewX: 0 });
        }
        isAnimatingRef.current = false;
      },
    });

    tl.to(
      progressObj,
      {
        p: 1,
        duration: 0.42,
        ease: 'power2.out',
        onUpdate: () => {
          const revealCount = Math.floor(progressObj.p * chars.length);
          const next = chars
            .map((ch, idx) => {
              if (ch === ' ') return ' ';
              if (idx < revealCount) return ch;
              return ERROR_GLYPHS[Math.floor(Math.random() * ERROR_GLYPHS.length)];
            })
            .join('');
          setDisplayText(next);
        },
      },
      0
    )
      .to(
        elRef.current,
        {
          keyframes: [
            { x: -7, skewX: -8, duration: 0.06 },
            { x: 8, skewX: 6, duration: 0.06 },
            { x: -5, skewX: -4, duration: 0.06 },
            { x: 4, skewX: 3, duration: 0.06 },
            { x: 0, skewX: 0, duration: 0.08 },
          ],
        },
        0
      );
  }, []);

  // Watch for text or triggerKey change
  useEffect(() => {
    if (prevTextRef.current !== text || prevTriggerRef.current !== triggerKey) {
      prevTextRef.current = text;
      prevTriggerRef.current = triggerKey;
      runFullTransitionGlitch(text);
    }
  }, [text, triggerKey, runFullTransitionGlitch]);

  // Periodic occasional error glitch
  useEffect(() => {
    if (!periodic) return;

    let timerId;
    let cancelled = false;

    const schedule = () => {
      const delay = gsap.utils.random(minDelay, maxDelay, 150);
      timerId = setTimeout(() => {
        if (cancelled) return;
        runMicroGlitch();
        schedule();
      }, delay);
    };

    schedule();
    return () => {
      cancelled = true;
      clearTimeout(timerId);
    };
  }, [periodic, minDelay, maxDelay, runMicroGlitch]);

  return (
    <Tag
      ref={elRef}
      data-text={displayText}
      onMouseEnter={glitchOnHover ? runMicroGlitch : undefined}
      className={`editorial-glitch-text ${isGlitching ? 'is-glitching' : ''} ${className}`}
    >
      {displayText}
    </Tag>
  );
}
