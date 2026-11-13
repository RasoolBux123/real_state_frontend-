"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const WORDS = ["Modern", "Luxury", "Comfortable", "Affordable"];

// Headline: the highlighted word keeps changing, with a moving shine on it.
export default function HeroTitle() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % WORDS.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight text-white sm:text-6xl">
      Curated Homes for{" "}
      <span className="relative inline-block min-w-[3ch] align-bottom">
        <AnimatePresence mode="wait">
          <motion.span
            key={WORDS[i]}
            initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -30, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="inline-block bg-gradient-to-r from-indigo-300 via-white to-indigo-400 bg-[length:200%_100%] bg-clip-text text-transparent"
            style={{ animation: "heroshine 3s linear infinite" }}
          >
            {WORDS[i]}
          </motion.span>
        </AnimatePresence>
      </span>{" "}
      Living
    </h1>
  );
}