"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

interface ToastProps {
  message: string;
  type: "success" | "achievement";
  onDone: () => void;
}

export default function Toast({ message, type, onDone }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, type === "achievement" ? 3000 : 2000);
    return () => clearTimeout(timer);
  }, [onDone, type]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div
        className={`px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg backdrop-blur-sm border ${
          type === "achievement"
            ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
        }`}
      >
        {message}
      </div>
    </motion.div>
  );
}
