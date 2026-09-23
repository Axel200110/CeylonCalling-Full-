import React, { useEffect, useState } from "react";
import {
  X, CheckCircle, AlertTriangle, ShieldAlert, Utensils,
  MapPin, Phone, Mail, Clock, Calendar, Star, Info, MessageSquare, AlertCircle,
  Bed, Camera, Layers, Image as ImageIcon, Navigation
} from "lucide-react";
import toast from "react-hot-toast";
import { useAdminStore } from "../store/adminStore";

const BACKEND_BASE = import.meta.env.MODE === "development" ? "" : "";

const getRoomImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  return `${BACKEND_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};

const ShopVerificationModal = ({ shopId, onClose, onActionSuccess }) => {
  const { getShopDetails, updateShopStatus, issueWarning } = useAdminStore();
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Status change modal states
  const [statusAction, setStatusAction] = useState("");
  const [reasonInput, setReasonInput] = useState("");
  const [actionRequiredInput, setActionRequiredInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Warning issuance form
  const [warningReason, setWarningReason] = useState("");
  const [warningMsg, setWarningMsg] = useState("");
  const [warningSeverity, setWarningSeverity] = useState("medium");

  useEffect(() => {
    loadShop();
  }, [shopId]);

  const loadShop = async () => {
    try {
      setLoading(true);
      const data = await getShopDetails(shopId);
      setShopData(data);
    } catch {
      toast.error("Failed to load shop details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (
      (statusAction === "rejected" || statusAction === "suspended" || statusAction === "changes_requested") &&
      !reasonInput.trim()
    ) {
      toast.error("A reason or feedback note is mandatory.");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateShopStatus(shopId, {
        status: statusAction,
        reason: reasonInput,
        feedbackForOwner: reasonInput,
        actionRequired: actionRequiredInput
      });
      toast.success(`Merchant status updated to ${statusAction.replace('_', ' ')}`);
      setStatusAction("");
      setReasonInput("");
      setActionRequiredInput("");
      onActionSuccess && onActionSuccess();
      loadShop();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendWarning = async (e) => {
    e.preventDefault();
    if (!warningReason || !warningMsg) {
      toast.error("Please fill in both reason and warning message");
      return;
    }

    try {
      setIsSubmitting(true);
      await issueWarning({
        shopId,
        reason: warningReason,
        message: warningMsg,
        severity: warningSeverity,
      });
      toast.success("Warning issued and sent to merchant owner.");
      setWarningReason("");
      setWarningMsg("");
      loadShop();
    } catch {
      toast.error("Failed to issue warning");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="text-white text-sm bg-[#0F141F] p-6 rounded-2xl border border-gray-800">
          Loading merchant inspection data...
        </div>
      </div>
    );
  }

  const { 
    shop, 
    foods = [], 
    foodItems = foods, 
    rooms = [], 
    categories = [], 
    reviews = [], 
    warnings = [] 
  } = shopData || {};
  const photosArray = shop?.photos && shop.photos.length > 0 ? shop.photos : shop?.photo ? [shop.photo] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#0F141F] border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-950/40">
          <div className="flex items-center gap-3">
            <img
              src={photosArray[0] || "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100"}
              alt={shop?.name}
              className="h-10 w-10 rounded-xl object-cover border border-gray-800"
            />
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {shop?.name}
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {shop?.status}
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Owner: <span className="text-gray-200">{shop?.owner?.name}</span> ({shop?.owner?.email})
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800 bg-[#0B0F17] px-6 gap-4 text-xs font-semibold overflow-x-auto">
          {[
            { id: "overview", label: "Overview & Verification" },
            { id: "rooms", label: `Rooms & Stays (${rooms.length})` },
            { id: "menu", label: `Menu & Pricing (${foodItems.length})` },
            { id: "reviews", label: `Reviews (${reviews.length})` },
            { id: "warnings", label: `Warnings & Sanctions (${warnings.length})` },
            { id: "history", label: "Audit Timeline" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-emerald-400 text-emerald-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs text-gray-300">
          
          {/* TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Existing Admin Feedback Banner if changes were requested */}
              {shop?.adminNotes?.feedbackForOwner && (
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-amber-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>Pending Feedback for Merchant</span>
                  </div>
                  <p className="text-xs text-amber-200/90">{shop.adminNotes.feedbackForOwner}</p>
                  {shop.adminNotes.actionRequired && (
                    <p className="text-xs text-amber-300 font-semibold">
                      Required Action: {shop.adminNotes.actionRequired}
                    </p>
                  )}
                </div>
              )}

              {(() => {
                const rawCoords = shop?.location?.coordinates?.coordinates;
                const isPol = String(shop?.location?.district || shop?.addressDetails?.district || (typeof shop?.location === "string" ? shop.location : "")).toLowerCase().includes("polonnaruwa");
                const lng = Array.isArray(rawCoords) && Number.isFinite(rawCoords[0]) ? Number(rawCoords[0]) : (Number(shop?.addressDetails?.coordinates?.lng) || (isPol ? 81.0188 : 80.4037));
                const lat = Array.isArray(rawCoords) && Number.isFinite(rawCoords[1]) ? Number(rawCoords[1]) : (Number(shop?.addressDetails?.coordinates?.lat) || (isPol ? 7.9403 : 8.3114));
                const hasExactCoords = Boolean(Array.isArray(rawCoords) && rawCoords.length >= 2 && rawCoords[0] !== 0 && rawCoords[1] !== 0);
                const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

                return (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* North Central Regional Information & Map Inspection */}
                    <div className="p-4 rounded-xl bg-gray-950/40 border border-gray-900 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                          Regional Location &amp; Coordinates
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          North Central
                        </span>
                      </div>

                      <p className="flex items-center gap-2 text-white font-medium">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{shop?.location?.district || shop?.addressDetails?.district || (isPol ? "Polonnaruwa" : "Anuradhapura")} District</span>
                      </p>
                      <p className="text-gray-300 pl-5 text-xs">
                        Town / Zone: <strong className="text-white">{shop?.location?.city || shop?.addressDetails?.city || "N/A"}</strong>
                      </p>
                      {(shop?.location?.address || shop?.addressDetails?.streetAddress) && (
                        <p className="text-gray-400 pl-5 text-[11px]">
                          Street: {shop?.location?.address || shop?.addressDetails?.streetAddress}
                        </p>
                      )}

                      {/* Coordinates & Google Maps Link */}
                      <div className="pl-5 pt-1.5 space-y-1.5 border-t border-gray-900">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Coordinates:</span>
                          <span className="font-mono text-emerald-400 text-[11px]">
                            {lat.toFixed(4)}, {lng.toFixed(4)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                            hasExactCoords
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            {hasExactCoords ? "✓ Exact GPS Coordinates" : "District Centroid (Default)"}
                          </span>

                          <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 hover:underline"
                          >
                            <Navigation className="h-3 w-3" />
                            <span>Inspect Maps</span>
                          </a>
                        </div>
                      </div>

                      <p className="flex items-center gap-2 pt-1 border-t border-gray-900">
                        <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> {shop?.contact || "N/A"}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> {shop?.activeTime || "Standard Operational Hours"}
                      </p>
                      <p className="flex items-center gap-2 text-gray-400">
                        <Calendar className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Registered: {new Date(shop?.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Establishment Profile & Capabilities */}
                    <div className="p-4 rounded-xl bg-gray-950/40 border border-gray-900 space-y-2">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                        Establishment Profile &amp; Services
                      </span>
                      <p><strong className="text-white">Type:</strong> <span className="capitalize">{shop?.shopType}</span></p>
                      <div className="flex flex-wrap gap-1.5 py-1">
                        {shop?.capabilities?.hasFood && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold">
                            Food &amp; Dining
                          </span>
                        )}
                        {shop?.capabilities?.hasAccommodation && (
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-semibold">
                            Accommodation ({shop?.accommodationSnapshot?.totalUnits || 0} Units &bull; LKR {Number(shop?.accommodationSnapshot?.startingPricePerNight || 0).toLocaleString()}+)
                          </span>
                        )}
                      </div>
                      <p><strong className="text-white">Categories:</strong> {shop?.categories?.join(", ") || "General Tourism"}</p>
                      <p><strong className="text-white">Amenities:</strong> {shop?.services?.join(", ") || "None specified"}</p>
                      <p><strong className="text-white">Price Range:</strong> {shop?.priceRange || "Affordable"}</p>
                    </div>
                  </div>
                );
              })()}

              <div className="p-4 rounded-xl bg-gray-950/40 border border-gray-900 space-y-2">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                  Business Description
                </span>
                <p className="text-gray-300 leading-relaxed">
                  {shop?.description || shop?.businessDescription || "No detailed description provided."}
                </p>
              </div>

              {/* Photos Gallery */}
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2">
                  Merchant Photo Proofs & Assets ({photosArray.length})
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {photosArray.map((p, idx) => (
                    <img
                      key={idx}
                      src={p}
                      alt="Proof"
                      className="h-24 w-full rounded-xl object-cover border border-gray-800"
                    />
                  ))}
                </div>
              </div>

              {/* Action Decision Bar */}
              <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">Governance Action:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {shop?.status !== "approved" && (
                    <button
                      onClick={() => { setStatusAction("approved"); }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/20 cursor-pointer"
                    >
                      Approve & Verify
                    </button>
                  )}
                  {shop?.status !== "changes_requested" && (
                    <button
                      onClick={() => { setStatusAction("changes_requested"); }}
                      className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-xl font-semibold cursor-pointer"
                    >
                      Request Changes
                    </button>
                  )}
                  {shop?.status !== "under_review" && (
                    <button
                      onClick={() => { setStatusAction("under_review"); }}
                      className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl font-semibold cursor-pointer"
                    >
                      Under Review
                    </button>
                  )}
                  {shop?.status !== "suspended" && (
                    <button
                      onClick={() => { setStatusAction("suspended"); }}
                      className="px-3 py-1.5 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/30 rounded-xl font-semibold cursor-pointer"
                    >
                      Suspend Listing
                    </button>
                  )}
                  {shop?.status !== "rejected" && (
                    <button
                      onClick={() => { setStatusAction("rejected"); }}
                      className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl font-semibold cursor-pointer"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>

              {/* Status Action Form */}
              {statusAction && (
                <div className="p-4 rounded-xl bg-gray-950 border border-emerald-500/30 space-y-3">
                  <h4 className="font-bold text-white">
                    Confirm Transition to: <span className="uppercase text-emerald-400">{statusAction.replace('_', ' ')}</span>
                  </h4>
                  <p className="text-gray-400">
                    {statusAction === "changes_requested"
                      ? "Explain what information or documents the merchant needs to update:"
                      : "Provide note/reason (will be logged in audit trail and notified to owner):"}
                  </p>
                  <textarea
                    rows={3}
                    value={reasonInput}
                    onChange={(e) => setReasonInput(e.target.value)}
                    placeholder={
                      statusAction === "changes_requested"
                        ? "e.g. Please upload clear facade photos and specify exact room amenities."
                        : "e.g., Verified license and location details."
                    }
                    className="w-full px-3 py-2 bg-[#0B0F17] border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />

                  {statusAction === "changes_requested" && (
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                        Specific Action Required by Merchant:
                      </label>
                      <input
                        type="text"
                        value={actionRequiredInput}
                        onChange={(e) => setActionRequiredInput(e.target.value)}
                        placeholder="e.g. Upload tourist board license and update room prices"
                        className="w-full px-3 py-2 bg-[#0B0F17] border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setStatusAction("")}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleStatusChange}
                      disabled={isSubmitting}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg cursor-pointer shadow-lg shadow-emerald-600/20"
                    >
                      {isSubmitting ? "Saving..." : "Confirm Decision"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: ROOMS & STAYS */}
          {activeTab === "rooms" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Bed className="h-4 w-4 text-emerald-400" />
                    Accommodation Units & Real-Time Availability
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Verified stay offerings, photo proofs (up to 5), unit counts, and nightly tariffs.
                  </p>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  {rooms.length} Units Registered
                </span>
              </div>

              {rooms.length === 0 ? (
                <div className="text-center py-12 bg-gray-950/40 rounded-xl border border-gray-900">
                  <Bed className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 font-semibold">No accommodation units listed</p>
                  <p className="text-gray-500 text-[11px] mt-0.5">This venue has not yet registered any rooms or stay suites.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {rooms.map((room) => {
                    const photos = room.photos || [];
                    const cover = photos.length > 0 ? getRoomImageUrl(photos[0]) : null;

                    return (
                      <div
                        key={room._id}
                        className="rounded-xl bg-gray-950/60 border border-gray-900 overflow-hidden flex flex-col justify-between"
                      >
                        {/* Room Cover & Photo Gallery */}
                        <div className="relative h-40 bg-black/50 w-full overflow-hidden">
                          {cover ? (
                            <img
                              src={cover}
                              alt={room.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                              <ImageIcon className="h-8 w-8 mb-1" />
                              <span className="text-[10px]">No photos provided</span>
                            </div>
                          )}

                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-black/80 text-emerald-400 border border-emerald-500/20">
                              {room.roomType}
                            </span>
                            {photos.length > 0 && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/80 text-white border border-white/10 flex items-center gap-1">
                                <Camera className="h-3 w-3" /> {photos.length} / 5
                              </span>
                            )}
                          </div>

                          <div className="absolute top-2 right-2">
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                                room.status === "available"
                                  ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                                  : room.status === "booked"
                                  ? "bg-blue-950/80 text-blue-400 border-blue-500/30"
                                  : "bg-amber-950/80 text-amber-400 border-amber-500/30"
                              }`}
                            >
                              ● {room.status}
                            </span>
                          </div>

                          {/* Thumbnails of all 5 photos */}
                          {photos.length > 1 && (
                            <div className="absolute bottom-2 left-2 right-2 flex gap-1 p-1 rounded-lg bg-black/70 overflow-x-auto">
                              {photos.map((p, idx) => (
                                <img
                                  key={idx}
                                  src={getRoomImageUrl(p)}
                                  alt={`Room photo ${idx + 1}`}
                                  className="w-7 h-7 rounded object-cover border border-white/20"
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Room Details */}
                        <div className="p-3.5 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h5 className="font-bold text-white text-sm">{room.name}</h5>
                              <p className="text-[11px] text-gray-400 line-clamp-2 mt-0.5">
                                {room.description || "No specific description."}
                              </p>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-lg bg-[#0B0F17] border border-gray-900 space-y-1 text-[11px]">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Nightly Tariff:</span>
                              <span className="font-bold text-emerald-400">
                                LKR {room.pricePerNight?.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Inventory Units:</span>
                              <span className="font-semibold text-white">
                                {room.availableUnits ?? 1} Available / {room.totalUnits || 1} Total
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Max Capacity:</span>
                              <span className="text-gray-200">
                                {room.capacityGuests} Guests &bull; {room.bedType}
                              </span>
                            </div>
                          </div>

                          {room.facilities?.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {room.facilities.map((fac, idx) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.5 rounded bg-gray-800 text-[9px] text-gray-300"
                                >
                                  {fac}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: MENU & FOOD */}
          {activeTab === "menu" && (
            <div className="space-y-4">
              {foodItems.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No food or menu items listed yet.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {foodItems.map((food) => (
                    <div key={food._id} className="p-3 rounded-xl bg-gray-950/40 border border-gray-900 flex gap-3 items-center">
                      <img
                        src={food.picture || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"}
                        alt={food.name}
                        className="h-12 w-12 rounded-xl object-cover border border-gray-800"
                      />
                      <div className="flex-1">
                        <h5 className="font-bold text-white">{food.name}</h5>
                        <p className="text-[11px] text-emerald-400 font-semibold">LKR {food.price}</p>
                        <span className="text-[10px] text-gray-500">{food.category?.name || "General"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: REVIEWS */}
          {activeTab === "reviews" && (
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No customer reviews yet.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r._id} className="p-3 rounded-xl bg-gray-950/40 border border-gray-900 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">{r.user?.name || "Customer"}</span>
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400" /> {r.rating}.0
                      </span>
                    </div>
                    <p className="text-gray-300">"{r.message}"</p>
                    <span className="text-[10px] text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: WARNINGS */}
          {activeTab === "warnings" && (
            <div className="space-y-6">
              {/* Warning Form */}
              <form onSubmit={handleSendWarning} className="p-4 rounded-xl bg-gray-950 border border-gray-900 space-y-3">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" /> Issue Official Sanction / Warning
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Violation Reason</label>
                    <input
                      type="text"
                      value={warningReason}
                      onChange={(e) => setWarningReason(e.target.value)}
                      placeholder="e.g., Inaccurate menu prices or poor hygiene reports"
                      className="w-full px-3 py-1.5 bg-[#0B0F17] border border-gray-800 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Severity Level</label>
                    <select
                      value={warningSeverity}
                      onChange={(e) => setWarningSeverity(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#0B0F17] border border-gray-800 rounded-xl text-white text-xs"
                    >
                      <option value="low">Low (Notice)</option>
                      <option value="medium">Medium (Warning)</option>
                      <option value="high">High (Final Notice)</option>
                      <option value="critical">Critical (Imminent Suspension)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Detailed Explanation & Correction Instructions</label>
                  <textarea
                    rows={2}
                    value={warningMsg}
                    onChange={(e) => setWarningMsg(e.target.value)}
                    placeholder="Provide specific instructions for what the owner must correct..."
                    className="w-full px-3 py-1.5 bg-[#0B0F17] border border-gray-800 rounded-xl text-white text-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl"
                >
                  {isSubmitting ? "Dispatching..." : "Dispatch Warning"}
                </button>
              </form>

              {/* Warning List */}
              <div className="space-y-2">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                  Past Sanctions History
                </span>
                {warnings.length === 0 ? (
                  <p className="text-gray-500 py-2">Clean compliance record. No warnings issued.</p>
                ) : (
                  warnings.map((w) => (
                    <div key={w._id} className="p-3 rounded-xl bg-gray-950/40 border border-gray-900 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{w.reason}</span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {w.severity}
                          </span>
                        </div>
                        <p className="text-gray-400 mt-1">{w.message}</p>
                        <span className="text-[10px] text-gray-500 mt-1 block">
                          Issued by: {w.issuedBy?.name || "Admin"} on {new Date(w.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-semibold text-gray-400">{w.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: AUDIT TIMELINE */}
          {activeTab === "history" && (
            <div className="space-y-3">
              {shop?.statusHistory?.length === 0 ? (
                <p className="text-center py-6 text-gray-500">No status transition history recorded yet.</p>
              ) : (
                shop?.statusHistory?.map((h, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-gray-950/40 border border-gray-900 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">Status transitioned to: <span className="uppercase text-emerald-400">{h.status}</span></p>
                      <p className="text-gray-400 text-[11px] mt-0.5">{h.reason || "Updated in admin console"}</p>
                    </div>
                    <span className="text-[10px] text-gray-500">{new Date(h.changedAt).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default ShopVerificationModal;
