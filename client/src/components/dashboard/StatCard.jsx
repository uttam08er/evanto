import { motion } from "framer-motion";

const StatCard = ({ icon: Icon, label, value, sub, color = "violet", trend, index = 0 }) => {
  const palettes = {
    violet: { bg: "bg-violet-50", icon: "bg-violet-100 text-violet-600", text: "text-violet-600" },
    blue:   { bg: "bg-blue-50",   icon: "bg-blue-100 text-blue-600",     text: "text-blue-600" },
    green:  { bg: "bg-emerald-50",icon: "bg-emerald-100 text-emerald-600",text: "text-emerald-600" },
    amber:  { bg: "bg-amber-50",  icon: "bg-amber-100 text-amber-600",   text: "text-amber-600" },
    rose:   { bg: "bg-rose-50",   icon: "bg-rose-100 text-rose-600",     text: "text-rose-600" },
    indigo: { bg: "bg-indigo-50", icon: "bg-indigo-100 text-indigo-600", text: "text-indigo-600" },
  };
  const p = palettes[color] || palettes.violet;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`${p.bg} rounded-2xl p-5 border border-white shadow-sm`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${p.icon} flex items-center justify-center`}>
          <Icon size={18} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className={`text-2xl font-bold text-gray-900 mb-0.5`}>{value}</p>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </motion.div>
  );
};

export default StatCard;
