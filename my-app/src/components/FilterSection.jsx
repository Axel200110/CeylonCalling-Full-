import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";

/**
 * Clean, modern, Apple-style PriceFilter component tailored for tourism guides.
 * Integrates seamlessly without duplicate containers or wrapper headers.
 */
function PriceFilter({ min = 0, max = 5000, value, onChange }) {
  const [localMin, setLocalMin] = useState(value?.min ?? min);
  const [localMax, setLocalMax] = useState(value?.max ?? max);

  // Sync state if parent props change
  useEffect(() => {
    if (value) {
      setLocalMin(value.min);
      setLocalMax(value.max);
    }
  }, [value]);

  // Apply values to callback
  const handleApply = (minValue = localMin, maxValue = localMax) => {
    const finalMin = Math.max(min, Math.min(Number(minValue) || 0, Number(maxValue) || max));
    const finalMax = Math.min(max, Math.max(Number(maxValue) || 0, Number(minValue) || min));
    
    setLocalMin(finalMin);
    setLocalMax(finalMax);

    if (onChange) {
      onChange({ min: finalMin, max: finalMax });
    }
  };

  // Quick preset handlers
  const applyPreset = (presetMin, presetMax) => {
    setLocalMin(presetMin);
    setLocalMax(presetMax);
    handleApply(presetMin, presetMax);
  };

  return (
    <div className="w-full space-y-4">
      {/* Input Fields Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Min Input */}
        <div className="relative flex-1 w-full">
          <label htmlFor="min-price-input" className="sr-only">Minimum Price (LKR)</label>
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="text-slate-400 text-xs font-bold tracking-wider">MIN</span>
          </div>
          <input
            id="min-price-input"
            type="number"
            min={min}
            max={localMax}
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            onBlur={() => handleApply()}
            placeholder="0"
            className="w-full pl-14 pr-12 py-3 rounded-2xl border border-slate-200 bg-white/70 text-slate-800 text-sm font-bold placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition duration-200"
          />
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <span className="text-slate-400 text-xs font-semibold">LKR</span>
          </div>
        </div>

        {/* Separator Line */}
        <span className="hidden sm:block text-slate-300 font-medium select-none">—</span>

        {/* Max Input */}
        <div className="relative flex-1 w-full">
          <label htmlFor="max-price-input" className="sr-only">Maximum Price (LKR)</label>
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="text-slate-400 text-xs font-bold tracking-wider">MAX</span>
          </div>
          <input
            id="max-price-input"
            type="number"
            min={localMin}
            max={max}
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            onBlur={() => handleApply()}
            placeholder={max.toString()}
            className="w-full pl-14 pr-12 py-3 rounded-2xl border border-slate-200 bg-white/70 text-slate-800 text-sm font-bold placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition duration-200"
          />
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <span className="text-slate-400 text-xs font-semibold">LKR</span>
          </div>
        </div>

        {/* Manual Apply Button */}
        <button
          type="button"
          onClick={() => handleApply()}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl px-6 py-3 shadow-sm hover:shadow-md transition duration-155 text-sm active:scale-[0.98]"
        >
          <FaFilter className="text-xs text-emerald-400" />
          Apply
        </button>
      </div>

      {/* Quick Select Presets */}
      {/* Quick Select Presets */}
<div className="flex flex-wrap items-center gap-2 pt-1.5">
  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none mr-1">
    Quick Filters / ඉක්මන් පෙරහන්:
  </span>

  <button
    type="button"
    onClick={() => applyPreset(0, 1000)}
    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
      localMin === 0 && localMax === 1000
        ? "bg-emerald-55 border-emerald-250 text-emerald-800"
        : "bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300"
    }`}
  >
    Budget / අඩු වියදම් (&lt; 1,000)
  </button>

  <button
    type="button"
    onClick={() => applyPreset(1000, 3000)}
    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
      localMin === 1000 && localMax === 3000
        ? "bg-emerald-55 border-emerald-250 text-emerald-800"
        : "bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300"
    }`}
  >
    Standard / සාමාන්‍ය (1,000 - 3,000)
  </button>

  <button
    type="button"
    onClick={() => applyPreset(3000, 5000)}
    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
      localMin === 3000 && localMax === 5000
        ? "bg-emerald-55 border-emerald-250 text-emerald-800"
        : "bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300"
    }`}
  >
    Premium / සුඛෝපභෝගී (3,000+)
  </button>

  <button
    type="button"
    onClick={() => applyPreset(0, 5000)}
    className="px-3 py-1.5 rounded-full text-xs font-semibold border bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition"
  >
    Clear / ඉවත් කරන්න
  </button>
</div>
    </div>
  );
}

export default PriceFilter;