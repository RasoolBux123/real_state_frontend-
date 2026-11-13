"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Background photo that zooms in very slowly (Ken Burns effect).
export default function AnimatedBg() {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ scale: 1 }}
      animate={{ scale: 1.12 }}
      transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
    >
      <Image src="/background.png" alt="" fill priority sizes="100vw" className="object-cover object-center" />
    </motion.div>
  );
}