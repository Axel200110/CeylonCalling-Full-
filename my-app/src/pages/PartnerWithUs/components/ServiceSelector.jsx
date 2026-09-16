// PartnerWithUs/components/ServiceSelector.jsx

import { Check, ConciergeBell, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

const ServiceSelector = ({ 
  services = [], 
  selected = [], 
  onToggle 
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Safely default and calculate values to prevent structural drift or division by zero
  const totalCount = services.length;
  const selectedCount = selected.length;

  // Optimized lookup layer handling high-velocity data lookups
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services;
    const query = searchQuery.toLowerCase();
    return services.filter(
      (service) =>
        service.label?.toLowerCase().includes(query) ||
        service.sinhala?.toLowerCase().includes(query)
    );
  }, [searchQuery, services]);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm space-y-5 transition-all duration-300">
      
      {/* SECTION HEADER: Semantic Context Panels & Selected Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
            <ConciergeBell className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-wide text-slate-800 flex items-center gap-2">
              Services & Facilities <span className="text-xs font-normal text-slate-400">| සේවා සහ පහසුකම්</span>
            </h4>
            <p className="text-xs text-slate-400">
              Select the operational amenities and hospitality provisions your infrastructure offers.
            </p>
          </div>
        </div>

        {/* Dynamic State Aggregator Counter */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 whitespace-nowrap shadow-inner">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span>Active Amenities: <span className="text-emerald-600 font-extrabold">{selectedCount}</span></span>
        </div>
      </div>

      {/* FILTER BRIDGE: Search Utility Panel */}
      {totalCount > 6 && (
        <div className="relative max-w-md group animate-fadeIn">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-slate-500 transition-colors" />
          <input
            type="text"
            placeholder="Search specific facility / පහසුකම් සොයන්න..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 shadow-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300"
          />
        </div>
      )}

      {/* COMPONENT CANVAS: Modern Feature Switch Matrices */}
      {filteredServices.length > 0 ? (
        <div 
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 transition-all duration-300"
          role="group"
          aria-label="Services and facilities selection panel"
        >
          {filteredServices.map((service) => {
            const isChecked = selected.includes(service.id);

            return (
              <label
                key={service.id}
                className={`group flex items-start gap-3 p-3 rounded-xl border font-semibold cursor-pointer transition-all duration-300 transform active:scale-[0.98] select-none ${
                  isChecked
                    ? "bg-gradient-to-br from-emerald-50/60 to-white border-emerald-500 text-emerald-950 shadow-sm ring-1 ring-emerald-500/10"
                    : "bg-slate-50/40 border-slate-200/60 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50/80 shadow-sm"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(service.id)}
                  className="sr-only"
                  aria-label={`Select facility parameter: ${service.label}`}
                />

                {/* Squared Smooth Checkbox Overlay */}
                <div 
                  className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                    isChecked
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                      : "border-slate-300 bg-white group-hover:border-slate-400"
                  }`}
                  aria-hidden="true"
                >
                  {isChecked && <Check className="w-3 h-3 text-white stroke-[4]" />}
                </div>

                {/* Dual-Locale Visual Context Elements */}
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-1.5 leading-tight">
                    <span className="text-base select-none filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200" aria-hidden="true">
                      {service.emoji}
                    </span>
                    <span className={`text-xs font-bold truncate transition-colors ${isChecked ? "text-emerald-950" : "text-slate-800"}`}>
                      {service.label}
                    </span>
                  </div>
                  {service.sinhala && (
                    <span className={`text-[10px] block truncate tracking-tight font-medium ${
                      isChecked ? "text-emerald-700/80 font-semibold" : "text-slate-400"
                    }`}>
                      {service.sinhala}
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      ) : (
        /* Empty Fallback State Layout */
        <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/30 animate-fadeIn">
          <p className="text-xs font-medium text-slate-400">No matching hospitality parameters discovered.</p>
        </div>
      )}
    </div>
  );
};

export default ServiceSelector;