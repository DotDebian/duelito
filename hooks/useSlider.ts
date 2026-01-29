'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface UseSliderOptions {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function useSlider({ min, max, value, onChange, disabled = false }: UseSliderOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const progress = ((value - min) / (max - min)) * 100;

  const updateValueFromPosition = useCallback(
    (clientX: number) => {
      if (!sliderRef.current || disabled) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const newValue = Math.round(min + (percentage / 100) * (max - min));
      onChange(newValue);
    },
    [min, max, onChange, disabled]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      updateValueFromPosition(e.clientX);
    },
    [updateValueFromPosition, disabled]
  );

  const handleThumbMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    [disabled]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateValueFromPosition(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, updateValueFromPosition]);

  return {
    sliderRef,
    isDragging,
    progress,
    handleClick,
    handleThumbMouseDown,
  };
}
