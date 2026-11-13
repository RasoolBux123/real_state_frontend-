"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

// Counts from 0 up to `to` when it scrolls into view.
export default function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 1.2, ease: "easeOut", onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to]);

  return <span ref={ref}>{value}</span>;
}