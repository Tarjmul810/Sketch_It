"use client";

import { useCallback, useEffect, useRef } from "react";

interface UseMagneticOptions {
  strength?: number;
  ease?: number;
}

export function useMagnetic<T extends HTMLElement = HTMLElement>(
  options: UseMagneticOptions = {}
) {
  const { strength = 0.3, ease = 0.15 } = options;
  const ref = useRef<T>(null);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const rafRef = useRef<number | null>(null);

  const lerp = (start: number, end: number, t: number) =>
    start + (end - start) * t;

  const animate = useCallback(() => {
    currentX.current = lerp(currentX.current, targetX.current, ease);
    currentY.current = lerp(currentY.current, targetY.current, ease);

    if (ref.current) {
      ref.current.style.transform = `translate(${currentX.current}px, ${currentY.current}px)`;
    }

    const stillAnimating =
      Math.abs(targetX.current - currentX.current) > 0.1 ||
      Math.abs(targetY.current - currentY.current) > 0.1;

    if (stillAnimating) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      rafRef.current = null;
    }
  }, [ease]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      targetX.current = deltaX;
      targetY.current = deltaY;

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const handleMouseLeave = () => {
      targetX.current = 0;
      targetY.current = 0;

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [strength, animate]);

  return ref;
}
