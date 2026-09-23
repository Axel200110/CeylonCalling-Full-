// PartnerWithUs/components/BusinessInfo.jsx

import {
    AlertCircle,
    Building2,
    Compass,
    Contact,
    Eye,
    EyeOff,
    FileText,
    Lock,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    Store,
    User,
    Navigation,
} from "lucide-react";
import { useState } from "react";
import Input from "../../../shopowner/components/Input";
import { ESTABLISHMENT_TYPES, SRI_LANKAN_DISTRICTS, getCitiesByDistrict } from "../constants";

const BusinessInfo = ({ formData, errors = {}, onInputChange, onEstablishmentChange }) => {
  // Safe destructuring with structural fallbacks to guard against rendering crashes
  const { 
    businessName = "", 
    ownerName = "", 
    email = "", 
    phone = "", 
    password = "", 
    confirmPassword = "", 
    district = "", 
    city = "",
    streetAddress = "",
    latitude = "",
    longitude = "",
    establishmentType = "", 
    businessDescription = "",
    hasFood = true,
    hasAccommodation = false,
    totalUnits = "",
    startingPricePerNight = ""
  } = formData || {};

  // Interactive password masking states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Dynamic inline computation for the real-time password compliance gauge
  const computePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: "Weak", color: "bg-slate-200" };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch(score) {
      case 1: return { score: 25, text: "Weak", color: "bg-rose-500", txtColor: "text-rose-600" };
      case 2: return { score: 50, text: "Fair", color: "bg-amber-500", txtColor: "text-amber-600" };
      case 3: return { score: 75, text: "Good", color: "bg-blue-500", txtColor: "text-blue-600" };
      case 4: return { score: 100, text: "Excellent & Secure", color: "bg-emerald-500", txtColor: "text-emerald-600" };
      default: return { score: 0, text: "Weak", color: "bg-slate-200", txtColor: "text-slate-400" };
    }
  };

  const strength = computePasswordStrength(password);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* SECTION 1: Corporate Profile Identity Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Corporate & Operator Identity</h3>
            <p className="text-xs text-slate-400">Provide official legal registered trade titles and operator details.</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              Business Brand Name <span className="text-rose-500">*</span>
            </label>
            <Input
              icon={Store}
              type="text"
              name="businessName"
              placeholder="e.g., Ceylon Heritage Villa"
              value={businessName}
              onChange={onInputChange}
              required
              error={errors.businessName}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:border-slate-300"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              Operator Full Name <span className="text-rose-500">*</span>
            </label>
            <Input
              icon={User}
              type="text"
              name="ownerName"
              placeholder="e.g., Anura Perera"
              value={ownerName}
              onChange={onInputChange}
              required
              error={errors.ownerName}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:border-slate-300"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Communications Matrix Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
            <Contact className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Communication & Connectivity</h3>
            <p className="text-xs text-slate-400">Verified touchpoints for real-time B2B routing updates.</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              Official Email Address <span className="text-rose-500">*</span>
            </label>
            <Input
              icon={Mail}
              type="email"
              name="email"
              placeholder="info@yourdomain.com"
              value={email}
              onChange={onInputChange}
              required
              error={errors.email}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:border-slate-300"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              Contact Number <span className="text-rose-500">*</span>
            </label>
            <Input
              icon={Phone}
              type="text"
              name="phone"
              placeholder="+94 7X XXX XXXX"
              value={phone}
              onChange={onInputChange}
              required
              error={errors.phone}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:border-slate-300"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Cryptographic Access Protection Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Security Credentials</h3>
            <p className="text-xs text-slate-400">Configure access credentials for security compliance access tokens.</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5 relative">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              Access Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative group">
              <Input
                icon={Lock}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={onInputChange}
                required
                error={errors.password}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 pr-10 text-sm text-slate-900 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:border-slate-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-emerald-600 transition-colors z-10"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
            
            {/* Dynamic visual complexity assessment system */}
            {password && (
              <div className="mt-2 space-y-1.5 animate-fadeIn">
                <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${strength.color}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-slate-400">Entropy Metrics:</span>
                  <span className={strength.txtColor}>{strength.text}</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              Verify Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative group">
              <Input
                icon={ShieldCheck}
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={onInputChange}
                required
                error={errors.confirmPassword}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 pr-10 text-sm text-slate-900 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:border-slate-300"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-emerald-600 transition-colors z-10"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Segment Stratification Grid Selector */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900" id="establishment-type-label">Tourism Sector Classification</h3>
            <p className="text-xs text-slate-400">Map your vertical sector to fine-tune automated consumer marketplace discovery channels.</p>
          </div>
        </div>

        <div 
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          role="radiogroup"
          aria-labelledby="establishment-type-label"
        >
          {ESTABLISHMENT_TYPES?.map((type) => {
            const isSelected = establishmentType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onEstablishmentChange(type.id)}
                className={`group flex flex-col items-center justify-between p-4 min-h-[140px] rounded-2xl border-2 text-center transition-all duration-300 transform active:scale-[0.98] ${
                  isSelected
                    ? "border-emerald-600 bg-gradient-to-b from-emerald-50/40 to-white text-emerald-950 shadow-md ring-1 ring-emerald-500/10"
                    : "border-slate-100 hover:border-slate-200 bg-slate-50/40 text-slate-700 hover:bg-white shadow-sm hover:shadow"
                }`}
              >
                <div className="w-full flex justify-end items-center h-2">
                  <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isSelected ? "bg-emerald-600 ring-4 ring-emerald-100" : "bg-transparent group-hover:bg-slate-200"
                  }`} />
                </div>

                <div className="flex flex-col items-center flex-1 justify-center my-1">
                  <span className="text-3xl mb-2 filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110 select-none">
                    {type.emoji}
                  </span>
                  <span className="text-xs font-bold tracking-tight text-slate-800 transition-colors group-hover:text-slate-950">
                    {type.label}
                  </span>
                </div>

                {type.sinhala && (
                  <span className={`text-[10px] font-medium tracking-normal border-t w-full pt-2 mt-auto transition-colors ${
                    isSelected ? "border-emerald-100 text-emerald-700/80" : "border-slate-100 text-slate-400"
                  }`}>
                    {type.sinhala}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {errors.establishmentType && (
          <p className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-1 animate-fadeIn">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.establishmentType}
          </p>
        )}
      </div>

      {/* SECTION 5: North Central Province Regional Placement */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Regional Destination Placement</h3>
              <p className="text-xs text-slate-400">Exclusively verifying tourism venues within the North Central Province.</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold">
            <ShieldCheck size={14} className="text-emerald-600" />
            North Central Province
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* District Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              District <span className="text-rose-500">*</span>
            </label>
            <div className="relative group">
              <select
                id="district"
                name="district"
                value={district}
                onChange={onInputChange}
                className={`w-full rounded-xl border appearance-none bg-white pl-4 pr-10 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 hover:border-slate-300 transition-all duration-200 cursor-pointer ${
                  errors.district ? "border-rose-300 bg-rose-50/20" : "border-slate-200"
                }`}
                aria-invalid={!!errors.district}
              >
                <option value="">Select District</option>
                {SRI_LANKAN_DISTRICTS?.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.emoji} {d.label} {d.sinhala ? `(${d.sinhala})` : ""}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 group-hover:text-slate-600 transition-colors">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            {errors.district && (
              <p className="text-xs font-medium text-rose-500 flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.district}
              </p>
            )}
          </div>

          {/* Dynamic City / Town Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              Town / Tourism Zone <span className="text-rose-500">*</span>
            </label>
            <div className="relative group">
              <select
                id="city"
                name="city"
                value={city}
                onChange={onInputChange}
                disabled={!district}
                className={`w-full rounded-xl border appearance-none bg-white pl-4 pr-10 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 hover:border-slate-300 transition-all duration-200 cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed ${
                  errors.city ? "border-rose-300 bg-rose-50/20" : "border-slate-200"
                }`}
                aria-invalid={!!errors.city}
              >
                <option value="">{district ? "Select Local Town / Area" : "Select district first"}</option>
                {getCitiesByDistrict(district)?.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} {c.sinhala ? `(${c.sinhala})` : ""}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 group-hover:text-slate-600 transition-colors">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            {errors.city && (
              <p className="text-xs font-medium text-rose-500 flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.city}
              </p>
            )}
          </div>
        </div>

        {/* Street Address / Landmark */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
            Street Address or Landmark (Optional)
          </label>
          <input
            type="text"
            name="streetAddress"
            placeholder="e.g. Near Sacred Bo Tree, Nuwara Wewa Road, Mihintale Road"
            value={streetAddress}
            onChange={onInputChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:border-slate-300 transition-all duration-200"
          />
        </div>

        {/* Geographic Coordinates for Directions & Navigation */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between pb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Navigation size={13} className="text-emerald-600" />
              <span>Map Coordinates (Latitude &amp; Longitude)</span>
            </label>
            <span className="text-[11px] text-slate-400">Enables &ldquo;Get Directions&rdquo; for tourists</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">Latitude</span>
              <input
                type="number"
                step="any"
                name="latitude"
                placeholder={district === "Polonnaruwa" ? "7.9403" : "8.3114"}
                value={latitude}
                onChange={onInputChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:border-slate-300 transition-all font-mono"
              />
              {errors.latitude && (
                <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.latitude}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">Longitude</span>
              <input
                type="number"
                step="any"
                name="longitude"
                placeholder={district === "Polonnaruwa" ? "81.0188" : "80.4037"}
                value={longitude}
                onChange={onInputChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:border-slate-300 transition-all font-mono"
              />
              {errors.longitude && (
                <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.longitude}
                </p>
              )}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Default coordinates are automatically assigned based on your chosen district if left blank.
          </p>
        </div>
      </div>

      {/* SECTION 6: Business Capabilities & Stays Snapshot */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Service Capabilities</h3>
            <p className="text-xs text-slate-400">Declare which hospitality services are active at your venue.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition ${
            hasFood ? "border-emerald-500 bg-emerald-50/30" : "border-slate-100 hover:border-slate-200"
          }`}>
            <input
              type="checkbox"
              name="hasFood"
              checked={Boolean(hasFood)}
              onChange={(e) => onInputChange({ target: { name: "hasFood", value: e.target.checked } })}
              className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <span className="text-xs font-extrabold text-slate-800 block">Food & Dining Experience</span>
              <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">Authentic meals, dining menus, beverages or snacks.</span>
            </div>
          </label>

          <label className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition ${
            hasAccommodation ? "border-emerald-500 bg-emerald-50/30" : "border-slate-100 hover:border-slate-200"
          }`}>
            <input
              type="checkbox"
              name="hasAccommodation"
              checked={Boolean(hasAccommodation)}
              onChange={(e) => onInputChange({ target: { name: "hasAccommodation", value: e.target.checked } })}
              className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <span className="text-xs font-extrabold text-slate-800 block">Overnight Stay & Rooms</span>
              <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">Guest rooms, suites, villas, chalets or homestay units.</span>
            </div>
          </label>
        </div>

        {/* Accommodation Quick Snapshot (If Stay is enabled) */}
        {hasAccommodation && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-4 animate-fadeIn">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Stay Capacity Snapshot</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Total Units/Rooms (Approx.)</label>
                <input
                  type="number"
                  min="1"
                  name="totalUnits"
                  placeholder="e.g. 8"
                  value={totalUnits}
                  onChange={onInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Starting Price / Night (LKR)</label>
                <input
                  type="number"
                  min="0"
                  name="startingPricePerNight"
                  placeholder="e.g. 6500"
                  value={startingPricePerNight}
                  onChange={onInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold focus:border-emerald-500"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Full individual room photos, amenities, and bed configurations can be customized in the Shop Owner Dashboard after verification.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 6: Portfolio Dossier & Copywriting Deck */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Amenities Showcase & Profile Dossier</h3>
            <p className="text-xs text-slate-400">Draft rich marketing context outlining target excursions, values, and distinct amenities.</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <textarea
            id="businessDescription"
            name="businessDescription"
            value={businessDescription}
            onChange={onInputChange}
            placeholder="Highlight unique travel packages, nearby heritage landmarks, fluent language features, eco-policies, or unique guest comfort arrangements..."
            className={`w-full resize-none rounded-xl border bg-white shadow-sm px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 hover:border-slate-300 transition-all duration-200 ${
              errors.businessDescription ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10" : "border-slate-200"
            }`}
            rows={5}
          />
          {errors.businessDescription && (
            <p className="text-xs font-medium text-rose-500 flex items-center gap-1 animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.businessDescription}
            </p>
          )}
        </div>
      </div>

    </div>
  );
};

export default BusinessInfo;