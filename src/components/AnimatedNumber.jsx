import { useEffect, useRef, useState } from "react";

export default function AnimatedNumber({ value = 0, duration = 700, className = "", prefix = "", suffix = "" }) {
  const [displayValue, setDisplayValue] = useState(value);
  const displayRef = useRef(value);

  useEffect(() => {
    const startValue = Number(displayRef.current) || 0;
    const endValue = Number(value) || 0;
    const startTime = performance.now();

    let frameId = 0;
    const tick = (now) => {
      const elapsed = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const current = startValue + (endValue - startValue) * eased;
      setDisplayValue(current);

      if (elapsed < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  useEffect(() => {
    displayRef.current = displayValue;
  }, [displayValue]);

  return (
    <span className={className}>
      {prefix}
      {Math.round(displayValue)}
      {suffix}
    </span>
  );
}