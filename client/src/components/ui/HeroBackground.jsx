import { useMemo } from "react";
import { motion } from "framer-motion";

const CONFETTI_COLORS = [
  "#FFD166", // yellow
  "#FF6B6B", // coral red
  "#4ECDC4", // teal
  "#A78BFA", // violet
  "#FB7185", // pink
  "#60A5FA", // blue
  "#34D399", // emerald
];

const useConfetti = (count = 28) =>
  useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,           // % from left
        size: 6 + Math.random() * 10,         // px
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        duration: 6 + Math.random() * 6,      // seconds to fall
        delay: Math.random() * 8,             // stagger start
        rotateStart: Math.random() * 360,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      })),
    [count]
  );

const useSparkles = (count = 14) =>
  useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 2,
        size: 3 + Math.random() * 4,
      })),
    [count]
  );

const HeroBackground = () => {
  const confetti = useConfetti(28);
  const sparkles = useSparkles(16);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* ---- 1. BASE GRADIENT MESH ---- */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-fuchsia-800 to-purple-900" />

      <motion.div
        animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full
                   bg-gradient-to-br from-pink-500/40 to-orange-400/30 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 -right-24 w-[26rem] h-[26rem] rounded-full
                   bg-gradient-to-br from-amber-400/30 to-yellow-300/20 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-32 left-1/4 w-[24rem] h-[24rem] rounded-full
                   bg-gradient-to-br from-cyan-400/25 to-violet-500/25 blur-3xl"
      />

      {/* ---- 2. SUBTLE DOT GRID PATTERN ---- */}
      <div
        className="absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ---- 3. RADIAL VIGNETTE for text contrast ---- */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(76,29,149,0.45)_100%)]" />

      {/* ---- 4. FLOATING BALLOONS ---- */}
      {[
        { left: "8%",  color: "from-rose-400 to-rose-500",     size: 60, delay: 0,   duration: 14 },
        { left: "15%",  color: "from-blue-400 to-blue-500",     size: 30, delay: 2.5,   duration: 11.5 },
        { left: "25%", color: "from-amber-300 to-amber-400",   size: 44, delay: 1.2, duration: 10 },
        { left: "85%", color: "from-violet-400 to-violet-500", size: 56, delay: 0.6, duration: 8.5 },
        { left: "92%", color: "from-cyan-300 to-cyan-400",     size: 38, delay: 2,   duration: 12.5 },
        { left: "75%", color: "from-emerald-300 to-emerald-400", size: 48, delay: 1.6, duration: 9.5 },
      ].map((b, i) => (
        <motion.div
          key={i}
          className="absolute bottom-[-10%]"
          style={{ left: b.left }}
          animate={{ y: ["50%", "-630%"], x: [0, 15, -10, 0] }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            ease: "linear",
            delay: b.delay,
          }}
        >
          <div
            className={`relative rounded-full bg-gradient-to-br ${b.color} shadow-lg`}
            style={{ width: b.size, height: b.size * 1.2 }}
          >
            {/* Shine highlight */}
            <div className="absolute top-2 left-2 w-2.5 h-3.5 bg-white/40 rounded-full blur-[1px]" />
          </div>
          <div
            className={`mx-auto bg-gradient-to-br ${b.color}`}
            style={{
              width: 6,
              height: 6,
              clipPath: "polygon(50% 100%, 0 0, 100% 0)",
            }}
          />
          <div className="mx-auto w-px h-16 bg-white/30" />
        </motion.div>
      ))}

      {/* ---- 5. CONFETTI RAIN ---- */}
      {confetti.map((c) => (
        <motion.span
          key={c.id}
          className="absolute top-[-5%]"
          style={{
            left: `${c.left}%`,
            width: c.shape === "circle" ? c.size : c.size * 0.6,
            height: c.size,
            backgroundColor: c.color,
            borderRadius: c.shape === "circle" ? "9999px" : "2px",
          }}
          initial={{ y: "-10vh", rotate: c.rotateStart, opacity: 0 }}
          animate={{
            y: "110vh",
            rotate: c.rotateStart + 360,
            opacity: [0, 1, 1, 0.8, 0],
          }}
          transition={{
            duration: c.duration,
            repeat: Infinity,
            delay: c.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* ---- 6. TWINKLING SPARKLES ---- */}
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{ top: `${s.top}%`, left: `${s.left}%` }}
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4] }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        >
          <svg width={s.size * 4} height={s.size * 4} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"
              fill="#FDE68A"
            />
          </svg>
        </motion.div>
      ))}

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-950/60 to-transparent" />
    </div>
  );
};

export default HeroBackground;