import React from "react";
import {
  MapPin,
  Building2,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Wifi,
  Car,
  Snowflake,
  Trees,
  Waves,
  Utensils,
  CalendarCheck,
  Bed,
  Star,
  ChevronDown,
} from "lucide-react";
import {
  ESTABLISHMENT_TYPES,
  SRI_LANKAN_DISTRICTS,
  getCitiesByDistrict,
} from "../../pages/PartnerWithUs/constants";

export const CAPABILITY_OPTIONS = [
  { id: "dine_in", label: "Dine-In Service", icon: Utensils, field: "hasDineIn" },
  { id: "takeaway", label: "Takeaway Service", icon: Utensils, field: "hasTakeaway" },
  { id: "delivery", label: "Food Delivery", icon: Utensils, field: "hasDelivery" },
  { id: "reservations", label: "Table Reservation", icon: CalendarCheck, field: "hasReservations" },
  { id: "room_booking", label: "Room Booking", icon: Bed, field: "hasRoomBooking" },
];

export const FACILITY_OPTIONS = [
  { id: "wifi", label: "Free Wi-Fi", icon: Wifi },
  { id: "parking", label: "Free Parking", icon: Car },
  { id: "air_conditioned", label: "Air Conditioned", icon: Snowflake },
  { id: "outdoor_seating", label: "Outdoor Seating", icon: Trees },
  { id: "pool", label: "Swimming Pool", icon: Waves },
];

export const PRICE_TIER_OPTIONS = [
  { id: "all", label: "Any Price" },
  { id: "budget", label: "Budget", desc: "< 1,000" },
  { id: "standard", label: "Standard", desc: "1,000–3,000" },
  { id: "premium", label: "Premium", desc: "> 3,000" },
];

export const RATING_FILTER_OPTIONS = [
  { id: "all", label: "Any Rating" },
  { id: "4.5", label: "4.5 & up" },
  { id: "4.0", label: "4.0 & up" },
  { id: "3.5", label: "3.5 & up" },
];

export default function DiscoverFilterSidebar({
  selectedDistrict,
  setSelectedDistrict,
  selectedCity,
  setSelectedCity,
  selectedType,
  setSelectedType,
  selectedCapabilities = [],
  setSelectedCapabilities,
  selectedFacilities = [],
  setSelectedFacilities,
  selectedPrice,
  setSelectedPrice,
  selectedRating,
  setSelectedRating,
  onResetFilters,
  totalResultsCount = 0,
}) {
  const toggleCapability = (capId) => {
    if (selectedCapabilities.includes(capId)) {
      setSelectedCapabilities(selectedCapabilities.filter((c) => c !== capId));
    } else {
      setSelectedCapabilities([...selectedCapabilities, capId]);
    }
  };

  const toggleFacility = (facId) => {
    if (selectedFacilities.includes(facId)) {
      setSelectedFacilities(selectedFacilities.filter((f) => f !== facId));
    } else {
      setSelectedFacilities([...selectedFacilities, facId]);
    }
  };

  // Get available cities if district is selected
  const availableCities =
    selectedDistrict && selectedDistrict !== "all"
      ? getCitiesByDistrict(selectedDistrict)
      : [];

  return (
    <div className="space-y-6 text-slate-800">
      {/* 1. Location Filters: District & Town */}
      <section className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <MapPin size={13} className="text-emerald-600" />
          <span>Location</span>
        </label>

        {/* District Dropdown */}
        <div className="relative">
          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedCity("all");
            }}
            className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer appearance-none pr-8"
          >
            <option value="all">All North Central Province</option>
            {SRI_LANKAN_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label} ({d.sinhala})
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* City / Area Dropdown (if district chosen) */}
        {availableCities.length > 0 && (
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer appearance-none pr-8"
            >
              <option value="all">All Towns in {selectedDistrict}</option>
              {availableCities.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        )}
      </section>

      {/* 2. Business Type Filter */}
      <section className="space-y-3 pt-4 border-t border-slate-200/80">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Building2 size={13} className="text-emerald-600" />
          <span>Business Type</span>
        </label>

        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setSelectedType("all")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
              selectedType === "all"
                ? "bg-emerald-50 text-emerald-800 font-semibold"
                : "text-slate-600 hover:bg-slate-100/70"
            }`}
          >
            <span>All Establishment Types</span>
            {selectedType === "all" && <Check size={14} className="text-emerald-600" />}
          </button>

          {ESTABLISHMENT_TYPES.map((t) => {
            const isSelected = selectedType === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedType(t.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                  isSelected
                    ? "bg-emerald-50 text-emerald-800 font-semibold"
                    : "text-slate-600 hover:bg-slate-100/70"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={13} className={isSelected ? "text-emerald-600" : "text-slate-400"} />
                  <span>{t.label}</span>
                </div>
                {isSelected && <Check size={14} className="text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Capabilities (Services provided by business) */}
      <section className="space-y-3 pt-4 border-t border-slate-200/80">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Services &amp; Capabilities
        </label>

        <div className="space-y-1.5">
          {CAPABILITY_OPTIONS.map((cap) => {
            const isChecked = selectedCapabilities.includes(cap.id);
            const Icon = cap.icon;
            return (
              <label
                key={cap.id}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100/70 cursor-pointer text-xs select-none transition"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCapability(cap.id)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20 h-4 w-4"
                />
                <Icon size={13} className="text-slate-400 shrink-0" />
                <span className={isChecked ? "text-slate-900 font-semibold" : "text-slate-600"}>
                  {cap.label}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* 4. Facilities (Physical amenities) */}
      <section className="space-y-3 pt-4 border-t border-slate-200/80">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Property Facilities
        </label>

        <div className="space-y-1.5">
          {FACILITY_OPTIONS.map((fac) => {
            const isChecked = selectedFacilities.includes(fac.id);
            const Icon = fac.icon;
            return (
              <label
                key={fac.id}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100/70 cursor-pointer text-xs select-none transition"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleFacility(fac.id)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20 h-4 w-4"
                />
                <Icon size={13} className="text-slate-400 shrink-0" />
                <span className={isChecked ? "text-slate-900 font-semibold" : "text-slate-600"}>
                  {fac.label}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* 5. Price Tier */}
      <section className="space-y-3 pt-4 border-t border-slate-200/80">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Price Range
        </label>

        <div className="grid grid-cols-2 gap-1.5">
          {PRICE_TIER_OPTIONS.map((pt) => {
            const isSelected = selectedPrice === pt.id;
            return (
              <button
                key={pt.id}
                type="button"
                onClick={() => setSelectedPrice(pt.id)}
                className={`px-2.5 py-2 rounded-lg border text-left text-xs transition ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold"
                    : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-600"
                }`}
              >
                <div className="font-semibold leading-tight">{pt.label}</div>
                {pt.desc && (
                  <div className="text-[10px] text-slate-400 font-normal mt-0.5">{pt.desc}</div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 6. Rating Filter */}
      <section className="space-y-3 pt-4 border-t border-slate-200/80">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Minimum Rating
        </label>

        <div className="flex flex-wrap gap-1.5">
          {RATING_FILTER_OPTIONS.map((rat) => {
            const isSelected = selectedRating === rat.id;
            return (
              <button
                key={rat.id}
                type="button"
                onClick={() => setSelectedRating(rat.id)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs transition ${
                  isSelected
                    ? "bg-amber-50 border-amber-400 text-amber-900 font-semibold"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 font-medium"
                }`}
              >
                {rat.id !== "all" && <Star size={11} className="fill-amber-400 text-amber-400" />}
                <span>{rat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 7. Reset Action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onResetFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-100/80 text-slate-600 text-xs font-semibold transition"
        >
          <RotateCcw size={13} />
          <span>Reset All Filters</span>
        </button>
      </div>
    </div>
  );
}
