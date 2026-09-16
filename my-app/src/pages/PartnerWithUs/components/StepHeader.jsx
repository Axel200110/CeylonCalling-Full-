// PartnerWithUs/components/StepHeader.jsx

import { motion } from "framer-motion";

const StepHeader = ({ step, title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-1"
    >
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
          {step}
        </span>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
      </div>
      <p className="text-xs text-slate-400 pl-8">{subtitle}</p>
    </motion.div>
  );
};

export default StepHeader;