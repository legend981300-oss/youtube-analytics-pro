'use client';

import React, { useEffect, useState, useRef } from 'react';

interface AnimatedNumberProps {
  value: string | number;
  duration?: number;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 800,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<string>(String(value));
  const prevValueRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Parse raw value string into components
  const parseValue = (raw: string | number) => {
    const str = String(raw).trim();
    const hasDollar = str.startsWith('$');
    const hasPercent = str.endsWith('%');
    const hasHours = str.endsWith('h');

    // Extract numeric core
    const numericClean = str.replace(/[^0-9.-]+/g, '');
    const num = parseFloat(numericClean);

    const hasDecimals = numericClean.includes('.');
    const decimalPlaces = hasDecimals ? numericClean.split('.')[1].length : 0;

    return {
      isValid: !isNaN(num),
      numeric: isNaN(num) ? 0 : num,
      prefix: hasDollar ? '$' : '',
      suffix: hasPercent ? '%' : hasHours ? 'h' : '',
      decimalPlaces,
      hasCommas: str.includes(','),
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
    if (!target.isValid) {
      setDisplayValue(String(value));
      return;
    }

    const startValue = prevValueRef.current;
    const targetValue = target.numeric;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Quartic ease out curve for snappy, luxurious feel
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const current = startValue + (targetValue - startValue) * easeOut;

      const formattedNum = target.hasCommas
        ? formatNumberWithCommas(current, target.decimalPlaces)
        : current.toFixed(target.decimalPlaces);

      setDisplayValue(`${target.prefix}${formattedNum}${target.suffix}`);

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

  return <span className={className}>{displayValue}</span>;
};
