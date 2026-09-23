// PartnerWithUs/components/ReviewCard.jsx

const ReviewCard = ({ formData }) => {
  const {
    businessName,
    ownerName,
    shopType,
    establishmentType,
    district,
    city,
    streetAddress,
    hasFood,
    hasAccommodation,
    totalUnits,
    startingPricePerNight,
    categories = [],
    services = []
  } = formData;

  const typeDisplay = shopType || establishmentType || "Restaurant";
  const districtDisplay = district
    ? district.charAt(0).toUpperCase() + district.slice(1)
    : "Anuradhapura";

  return (
    <div className="bg-slate-50/90 rounded-xl p-5 border border-emerald-100 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Application Summary</h4>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
          North Central Focus
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs md:text-sm">
        <span className="text-slate-500">Business Name:</span>
        <span className="font-semibold text-slate-800">{businessName || "—"}</span>

        <span className="text-slate-500">Owner / Manager:</span>
        <span className="font-medium text-slate-700">{ownerName || "—"}</span>

        <span className="text-slate-500">Type / Classification:</span>
        <span className="font-medium text-slate-700 capitalize">{typeDisplay}</span>

        <span className="text-slate-500">Province & District:</span>
        <span className="font-semibold text-emerald-800">North Central &bull; {districtDisplay}</span>

        <span className="text-slate-500">City / Tourism Zone:</span>
        <span className="font-medium text-slate-800">{city || "Not specified"}</span>

        {streetAddress && (
          <>
            <span className="text-slate-500">Street / Landmark:</span>
            <span className="text-slate-700 truncate">{streetAddress}</span>
          </>
        )}

        <span className="text-slate-500">Offerings:</span>
        <div className="flex flex-wrap gap-1">
          {hasFood && (
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
              Food & Dining
            </span>
          )}
          {hasAccommodation && (
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
              Stays ({totalUnits || 0} units &bull; LKR {Number(startingPricePerNight || 0).toLocaleString()}+)
            </span>
          )}
          {!hasFood && !hasAccommodation && (
            <span className="text-slate-500 text-xs">Standard listing</span>
          )}
        </div>

        <span className="text-slate-500">Selected Tags:</span>
        <span className="font-medium text-slate-700">
          {categories.length} {categories.length === 1 ? "category" : "categories"}
          {services.length > 0 ? `, ${services.length} amenities` : ""}
        </span>
      </div>
    </div>
  );
};

export default ReviewCard;