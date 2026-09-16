import React from "react";

const StatCard = ({ title, value, icon: Icon, description, trend, trendType, color }) => {
  const isPositive = trendType === "positive";

  // Color theme definitions for styling
  const colorThemes = {
    blue: {
      bg: "from-blue-500/10 to-indigo-500/5",
      border: "border-blue-500/20 hover:border-blue-500/40",
      iconBg: "bg-blue-500/10 text-blue-400",
      glow: "shadow-blue-500/5"
    },
    green: {
      bg: "from-emerald-500/10 to-teal-500/5",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      iconBg: "bg-emerald-500/10 text-emerald-400",
      glow: "shadow-emerald-500/5"
    },
    amber: {
      bg: "from-amber-500/10 to-orange-500/5",
      border: "border-amber-500/20 hover:border-amber-500/40",
      iconBg: "bg-amber-500/10 text-amber-400",
      glow: "shadow-amber-500/5"
    },
    purple: {
      bg: "from-purple-500/10 to-pink-500/5",
      border: "border-purple-500/20 hover:border-purple-500/40",
      iconBg: "bg-purple-500/10 text-purple-400",
      glow: "shadow-purple-500/5"
    },
  };

  const theme = colorThemes[color] || colorThemes.blue;

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${theme.bg} ${theme.border} p-6 shadow-lg ${theme.glow} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}>
      {/* Decorative background glow circle */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-current opacity-5 blur-2xl" />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</h3>
        </div>
        <div className={`rounded-xl p-3 ${theme.iconBg}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {trend && (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
            isPositive ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
          }`}>
            {isPositive ? "+" : ""}{trend}%
          </span>
        )}
        <span className="text-xs text-gray-400">{description}</span>
      </div>
    </div>
  );
};

export default StatCard;
