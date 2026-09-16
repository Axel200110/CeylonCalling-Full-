// PartnerWithUs/components/ReviewCard.jsx

const ReviewCard = ({ formData }) => {
  const { businessName, ownerName, establishmentType, categories } = formData;

  return (
    <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60">
      <h4 className="text-sm font-semibold text-slate-700 mb-1">Summary</h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <span className="text-slate-500">Business:</span>
        <span className="font-medium text-slate-800">{businessName || "—"}</span>
        <span className="text-slate-500">Owner:</span>
        <span className="font-medium text-slate-800">{ownerName || "—"}</span>
        <span className="text-slate-500">Type:</span>
        <span className="font-medium text-slate-800 capitalize">{establishmentType}</span>
        <span className="text-slate-500">Categories:</span>
        <span className="font-medium text-slate-800">{categories.length} selected</span>
      </div>
    </div>
  );
};

export default ReviewCard;