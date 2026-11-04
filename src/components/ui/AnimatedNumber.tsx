'use client';

import React, { useEffect, useRef } from 'react';

interface AnimatedNumberProps {
  value: string | number;
  duration?: number;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 600,
  className = '',
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const prevValueRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Parse raw value string into components preserving standard short-scale units (K, M, B)
  const parseValue = (raw: string | number) => {
    const str = String(raw).trim();
    
    // Extract prefix like '$' or '+'
    const prefixMatch = str.match(/^([+$]+)/);
    const prefix = prefixMatch ? prefixMatch[1] : '';

    // Extract suffix like 'K', 'M', 'B', '%', 'h', 'x'
    const suffixMatch = str.match(/([a-zA-Z%]+)$/);
    const suffix = suffixMatch ? suffixMatch[1] : '';

    // Extract numeric core
    const numericClean = str
      .slice(prefix.length, suffix ? str.length - suffix.length : undefined)
      .replace(/,/g, '')
      .trim();
    const num = parseFloat(numericClean);

    const hasDecimals = numericClean.includes('.');
    const decimalPlaces = hasDecimals ? (numericClean.split('.')[1] || '').length : 0;

    return {
      isValid: !isNaN(num),
      numeric: isNaN(num) ? 0 : num,
      prefix,
      suffix,
      decimalPlaces,
      hasCommas: str.includes(','),
      original: str,
    };
  };

  const formatNumberWithCommas = (n: number, decimals: number) => {
    const fixed = n.toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  useEffect(() => {
    const target = parseValue(value);
    if (!spanRef.current) return;

    if (!target.isValid) {
      spanRef.current.textContent = target.original;
      return;
    }

    const startValue = prevValueRef.current;
    const targetValue = target.numeric;
    const startTime = performance.now();

    // Direct DOM mutation bypassing React re-renders for 120fps performance
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Snappy cubic ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (targetValue - startValue) * easeOut;

      const formattedNum = target.hasCommas
        ? formatNumberWithCommas(current, target.decimalPlaces)
        : current.toFixed(target.decimalPlaces);

      if (spanRef.current) {
        spanRef.current.textContent = `${target.prefix}${formattedNum}${target.suffix}`;
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        prevValueRef.current = targetValue;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration]);

  return <span ref={spanRef} className={className}>{String(value)}</span>;
};
