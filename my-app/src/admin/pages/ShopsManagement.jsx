import {
    AlertCircle,
    Ban,
    Briefcase,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Edit,
    Eye,
    FileText,
    Info,
    Mail,
    MapPin,
    Maximize2,
    Phone,
    Plus,
    Search,
    ShieldAlert,
    ShieldCheck,
    ShoppingBag,
    Trash2,
    User,
    X,
    Loader2
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAdminStore } from "../store/adminStore";

const ShopsManagement = () => {
  const { shops, updateShopStatus, deleteShop, createShop, updateShop, isLoading } = useAdminStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Modal states
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // View Added Food Items Modal states
  const [viewFoodShopName, setViewFoodShopName] = useState("");
  const [shopFoods, setShopFoods] = useState([]);
  const [isViewFoodOpen, setIsViewFoodOpen] = useState(false);
  const [loadingFoods, setLoadingFoods] = useState(false);

  const handleChatWithOwner = (ownerId) => {
    if (!ownerId) {
      toast.error("No owner account linked to this shop.");
      return;
    }
    navigate("/admin/messages", { state: { selectOwnerId: ownerId } });
  };

  const handleViewShopFood = async (shopId) => {
    const shopObj = shops.find(s => s.id === shopId);
    setViewFoodShopName(shopObj?.name || "");
    setIsViewFoodOpen(true);
    setLoadingFoods(true);
    try {
      const res = await fetch(`/api/admin/shops/${shopId}/food`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setShopFoods(data.food || []);
      } else {
        toast.error("Failed to load food items");
      }
    } catch {
      toast.error("Failed to load food items");
    } finally {
      setLoadingFoods(false);
    }
  };

  // Edit Modal state
  const [editShop, setEditShop] = useState(null);
  const [editForm, setEditForm] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    location: "",
    establishmentType: "restaurant",
    categories: "",
    services: "",
    businessDescription: "",
    status: "approved",
    photosFiles: []
  });

  // Create Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    location: "Anuradhapura",
    establishmentType: "restaurant",
    categories: "",
    services: "",
    businessDescription: "",
    status: "approved",
    photosFiles: []
  });

  const selectedShop = shops.find((shop) => shop.id === selectedShopId);

  const normalizeArray = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch (error) {
        // ignore parse errors and fall back to comma-split
      }
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
    return [];
  };

  // Stats calculation
  const totalCount = shops.length;
  const pendingCount = shops.filter((s) => s.status === "pending").length;
  const approvedCount = shops.filter((s) => s.status === "approved").length;
  const suspendedCount = shops.filter((s) => s.status === "suspended").length;

  const handleApprove = async (id) => {
    try {
      await updateShopStatus(id, "approved");
      toast.success("Merchant successfully approved & verified!");
    } catch (error) {
      toast.error("Failed to approve merchant");
    }
  };

  const handleSuspend = async (id) => {
    try {
      await updateShopStatus(id, "suspended");
      toast.error("Merchant privileges suspended");
    } catch (error) {
      toast.error("Failed to suspend merchant");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this listing? All merchant data will be lost.")) {
      try {
        await deleteShop(id);
        toast.success("Merchant listing deleted permanently");
        if (selectedShopId === id) setSelectedShopId(null);
        if (editShop?.id === id) setEditShop(null);
      } catch (error) {
        toast.error("Failed to delete merchant");
      }
    }
  };

  // Open Edit Modal
  const openEditModal = (shop) => {
    const normalizedCategories = normalizeArray(shop.categories);
    const normalizedServices = normalizeArray(shop.services);
    setEditShop(shop);
    setEditForm({
      businessName: shop.businessName || shop.name || "",
      ownerName: shop.ownerName || "",
      email: shop.email || "",
      phone: shop.phone || shop.contact || "",
      location: shop.district || shop.location || "",
      establishmentType: shop.establishmentType || shop.category || "restaurant",
      categories: normalizedCategories.join(", "),
      services: normalizedServices.join(", "),
      businessDescription: shop.businessDescription || shop.description || "",
      status: shop.status || "approved",
      photosFiles: []
    });
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editShop) return;
    try {
      const formData = new FormData();
      formData.append("businessName", editForm.businessName);
      formData.append("ownerName", editForm.ownerName);
      formData.append("email", editForm.email);
      formData.append("phone", editForm.phone);
      formData.append("location", editForm.location);
      formData.append("establishmentType", editForm.establishmentType);
      formData.append("businessDescription", editForm.businessDescription);
      formData.append("status", editForm.status);

      const catArray = editForm.categories.split(",").map((s) => s.trim()).filter(Boolean);
      const srvArray = editForm.services.split(",").map((s) => s.trim()).filter(Boolean);
      formData.append("categories", JSON.stringify(catArray));
      formData.append("services", JSON.stringify(srvArray));

      if (editForm.photosFiles && editForm.photosFiles.length > 0) {
        Array.from(editForm.photosFiles).forEach((file) => {
          formData.append("photos", file);
        });
      }

      await updateShop(editShop.id, formData);
      toast.success("Merchant profile updated successfully!");
      setEditShop(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update merchant profile");
    }
  };

  // Handle Create Submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.businessName || !createForm.email || !createForm.phone) {
      toast.error("Please fill in required fields (Business Name, Email, Phone)");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("businessName", createForm.businessName);
      formData.append("ownerName", createForm.ownerName || createForm.businessName);
      formData.append("email", createForm.email);
      formData.append("phone", createForm.phone);
      formData.append("location", createForm.location || "Anuradhapura");
      formData.append("establishmentType", createForm.establishmentType);
      formData.append("businessDescription", createForm.businessDescription);
      formData.append("status", createForm.status);

      const catArray = createForm.categories.split(",").map((s) => s.trim()).filter(Boolean);
      const srvArray = createForm.services.split(",").map((s) => s.trim()).filter(Boolean);
      formData.append("categories", JSON.stringify(catArray));
      formData.append("services", JSON.stringify(srvArray));

      if (createForm.photosFiles && createForm.photosFiles.length > 0) {
        Array.from(createForm.photosFiles).forEach((file) => {
          formData.append("photos", file);
        });
      }

      await createShop(formData);
      toast.success("New merchant created successfully!");
      setIsCreateOpen(false);
      setCreateForm({
        businessName: "",
        ownerName: "",
        email: "",
        phone: "",
        location: "Anuradhapura",
        establishmentType: "restaurant",
        categories: "",
        services: "",
        businessDescription: "",
        status: "approved",
        photosFiles: []
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create merchant");
    }
  };

  const filteredShops = shops.filter((shop) => {
    const nameMatch = (shop.businessName || shop.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const ownerMatch = (shop.ownerName || "").toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = (shop.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const locationMatch = (shop.district || shop.location || "").toLowerCase().includes(searchQuery.toLowerCase());
    const typeMatch = (shop.establishmentType || shop.category || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSearch = nameMatch || ownerMatch || emailMatch || locationMatch || typeMatch;

    if (activeTab === "all") return matchesSearch;
    return shop.status === activeTab && matchesSearch;
  });

  return (
    <div className="space-y-6 text-gray-200">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-blue-500" />
            Merchant Verification Desk
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Audit partner registration submissions, inspect media assets, create & edit merchant profiles, and set system statuses.
          </p>
        </div>

      </div>

      {/* Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-900 bg-[#0B0F17] p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Total Partners</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{totalCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-900 bg-[#0B0F17] p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest block">Pending Review</span>
            <span className="text-2xl font-extrabold text-amber-400 mt-1 block">{pendingCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-900 bg-[#0B0F17] p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest block">Verified Active</span>
            <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">{approvedCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-900 bg-[#0B0F17] p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-rose-500/80 uppercase tracking-widest block">Suspended</span>
            <span className="text-2xl font-extrabold text-rose-400 mt-1 block">{suspendedCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Ban className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4 p-4 rounded-2xl border border-gray-900 bg-[#0B0F17] shadow-lg">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search title, owner, email, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-800 bg-gray-950/60 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 outline-none transition-all focus:border-blue-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto bg-gray-950/60 p-1 rounded-xl border border-gray-900 shrink-0 self-start md:self-center">
          {["all", "pending", "approved", "suspended"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow shadow-blue-600/10"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab} {tab === "pending" && pendingCount > 0 ? `(${pendingCount})` : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Data Table */}
      <div className="rounded-2xl border border-gray-900 bg-[#0B0F17] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-900 bg-gray-950/40 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-6">Enterprise Profile</th>
                <th className="py-4 px-6">Contact & District</th>
                <th className="py-4 px-6">Type & Tags</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900 text-xs">
              {filteredShops.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500 font-medium">
                    No active merchant applications match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredShops.map((shop) => {
                  const displayPhoto = shop.photos && shop.photos.length > 0 ? shop.photos[0] : shop.image;
                  return (
                    <tr key={shop.id} className="hover:bg-gray-900/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gray-950 border border-gray-800 overflow-hidden flex items-center justify-center shrink-0">
                            {displayPhoto ? (
                              <img src={displayPhoto} alt={shop.name} className="w-full h-full object-cover" />
                            ) : (
                              <ShoppingBag className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{shop.businessName || shop.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Owner: {shop.ownerName}</p>
                            <p className="text-[10px] text-gray-500">{shop.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-gray-300">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-gray-300">
                            <MapPin className="h-3.5 w-3.5 text-gray-500" />
                            <span>{shop.district || shop.location || "Anuradhapura"}</span>
                          </div>
                          {shop.phone && (
                            <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                              <Phone className="h-3 w-3 text-gray-500" />
                              <span>{shop.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="text-gray-300 capitalize font-medium block">
                          {shop.establishmentType || shop.category || "Restaurant"}
                        </span>
                        {normalizeArray(shop.categories).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {normalizeArray(shop.categories).slice(0, 2).map((cat, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[9px] uppercase font-semibold">
                                {cat}
                              </span>
                            ))}
                            {normalizeArray(shop.categories).length > 2 && (
                              <span className="text-[9px] text-gray-500">+{normalizeArray(shop.categories).length - 2}</span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                          shop.status === "approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          shop.status === "pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse" :
                          "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}>
                          {shop.status || "pending"}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedShopId(shop.id);
                              setActivePhotoIndex(0);
                            }}
                            className="p-1.5 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-850 transition-colors"
                            title="Audit / Inspect Application"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => openEditModal(shop)}
                            className="p-1.5 rounded-lg border border-gray-800 text-blue-400 hover:bg-blue-500/10 transition-colors"
                            title="Edit Merchant Profile"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          {shop.status !== "approved" && (
                            <button
                              disabled={isLoading}
                              onClick={() => handleApprove(shop.id)}
                              className="p-1.5 rounded-lg border border-gray-850 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                              title="Verify Merchant"
                            >
                              <ShieldCheck className="h-4 w-4" />
                            </button>
                          )}

                          {shop.status === "approved" && (
                            <button
                              disabled={isLoading}
                              onClick={() => handleSuspend(shop.id)}
                              className="p-1.5 rounded-lg border border-gray-850 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                              title="Suspend Merchant"
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          )}

                          <button
                            disabled={isLoading}
                            onClick={() => handleDelete(shop.id)}
                            className="p-1.5 rounded-lg border border-gray-850 text-gray-500 hover:text-rose-400 hover:bg-rose-500/5 transition-colors disabled:opacity-50"
                            title="Delete Merchant Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW / AUDIT OVERLAY MODAL */}
      {selectedShop && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fadeIn"
          onClick={() => setSelectedShopId(null)}
        >
          <div
            className="w-full max-w-5xl h-full max-h-[85vh] bg-[#0B0F17] border border-gray-900 rounded-2xl flex flex-col md:flex-row shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* LEFT HALF: Photo Gallery inspection */}
            <div className="w-full md:w-[50%] border-b md:border-b-0 md:border-r border-gray-900 bg-gray-950/40 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-gray-900 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-bold text-gray-400 tracking-wide uppercase">Merchant Visual Portfolio</span>
                  </div>
                  {selectedShop.photos && selectedShop.photos.length > 0 && (
                    <button
                      onClick={() => setIsPreviewOpen(true)}
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                      <Maximize2 className="h-3 w-3" />
                      <span>Full View</span>
                    </button>
                  )}
                </div>

                <div className="bg-black/60 rounded-xl border border-gray-900 flex flex-col items-center justify-center p-3 relative h-64 overflow-hidden group">
                  {selectedShop.photos && selectedShop.photos.length > 0 ? (
                    <>
                      <img
                        src={selectedShop.photos[activePhotoIndex] || selectedShop.photos[0]}
                        alt="Merchant submission"
                        className="w-full h-full object-contain rounded-lg shadow-inner"
                      />
                      {selectedShop.photos.length > 1 && (
                        <>
                          <button
                            onClick={() => setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : selectedShop.photos.length - 1))}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black border border-gray-800 transition"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setActivePhotoIndex((prev) => (prev < selectedShop.photos.length - 1 ? prev + 1 : 0))}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black border border-gray-800 transition"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </>
                  ) : selectedShop.image ? (
                    <img src={selectedShop.image} alt="Merchant fallback" className="w-full h-full object-contain rounded-lg shadow-inner" />
                  ) : (
                    <div className="text-center p-6">
                      <AlertCircle className="h-8 w-8 text-gray-700 mx-auto mb-2" />
                      <span className="text-xs text-gray-500">No profile photo submitted by merchant.</span>
                    </div>
                  )}
                </div>

                {/* Thumbnails row */}
                {selectedShop.photos && selectedShop.photos.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {selectedShop.photos.map((ph, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhotoIndex(idx)}
                        className={`h-12 w-12 rounded-lg border overflow-hidden shrink-0 transition ${
                          activePhotoIndex === idx ? "border-blue-500 ring-2 ring-blue-500/30" : "border-gray-800 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={ph} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-900 text-[11px] text-gray-500 flex justify-between items-center">
                <span>Submitted ID: <span className="font-mono text-gray-400">{selectedShop.id}</span></span>
                <span>Role: Partner Merchant</span>
              </div>
            </div>

            {/* RIGHT HALF: Specifications */}
            <div className="w-full md:w-[50%] p-6 flex flex-col justify-between bg-[#0B0F17] overflow-y-auto custom-scrollbar">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                    selectedShop.status === "approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    selectedShop.status === "pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}>
                    System Status: {selectedShop.status || "pending"}
                  </span>
                  <button
                    onClick={() => setSelectedShopId(null)}
                    className="p-1 rounded-lg text-gray-500 hover:text-white border border-transparent hover:border-gray-800 bg-gray-900/40 hover:bg-gray-900 transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-5">
                  <h3 className="text-2xl font-bold text-white tracking-tight">{selectedShop.businessName || selectedShop.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-500" />
                    <span>District: {selectedShop.district || selectedShop.location || "Anuradhapura"}, Sri Lanka</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-900 pb-1.5">Corporate Metadata</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-gray-900/60 bg-gray-950/40 p-3 flex items-start gap-2.5">
                      <Briefcase className="h-4 w-4 text-blue-400 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-500 font-semibold block uppercase">Establishment</span>
                        <p className="text-xs text-white font-bold mt-0.5 capitalize">{selectedShop.establishmentType || selectedShop.category || "Restaurant"}</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-900/60 bg-gray-950/40 p-3 flex items-start gap-2.5">
                      <User className="h-4 w-4 text-purple-400 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-500 font-semibold block uppercase">Authorized Rep</span>
                        <p className="text-xs text-white font-bold mt-0.5 truncate max-w-[140px]">{selectedShop.ownerName || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] text-gray-500 font-semibold block uppercase tracking-wide mb-1.5">Target Categories</span>
                      <div className="flex flex-wrap gap-1.5">
                        {normalizeArray(selectedShop.categories).length > 0 ? (
                          normalizeArray(selectedShop.categories).map((cat, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-medium uppercase">
                              {cat}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-600 italic">No specific categories tagged.</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 font-semibold block uppercase tracking-wide mb-1.5">Offered Services & Amenities</span>
                      <div className="flex flex-wrap gap-1.5">
                        {normalizeArray(selectedShop.services).length > 0 ? (
                          normalizeArray(selectedShop.services).map((srv, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[11px] font-medium">
                              {srv}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-600 italic">No supplemental services listed.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 font-semibold block uppercase tracking-wide mb-1.5">Business Overview</span>
                    <div className="rounded-xl border border-gray-900 bg-gray-950/40 p-3 text-xs text-gray-400 leading-relaxed max-h-24 overflow-y-auto">
                      {selectedShop.businessDescription || selectedShop.description || "No business description provided."}
                    </div>
                  </div>

                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-900 pt-1 pb-1.5">Communication Details</h4>
                  <div className="rounded-xl border border-gray-900/60 bg-gray-950/40 p-3.5 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Mail className="h-3.5 w-3.5 text-blue-400" />
                        <span>Email Address</span>
                      </div>
                      <span className="text-white font-mono font-medium select-all text-right">{selectedShop.email || "N/A"}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Phone className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Direct Phone</span>
                      </div>
                      <span className="text-white font-mono font-medium select-all text-right">{selectedShop.phone || selectedShop.contact || "Not Provided"}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleViewShopFood(selectedShop.id)}
                      className="flex-1 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-gray-900 bg-gray-950 hover:bg-gray-900 text-xs font-bold text-gray-300 transition-all cursor-pointer"
                    >
                      <FileText className="h-4 w-4 text-emerald-400" /> View Menu Items
                    </button>
                    <button
                      onClick={() => handleChatWithOwner(selectedShop.ownerId)}
                      className="flex-1 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-gray-900 bg-gray-950 hover:bg-gray-900 text-xs font-bold text-gray-300 transition-all cursor-pointer"
                    >
                      <Mail className="h-4 w-4 text-blue-400" /> Chat with Owner
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-900 mt-6 flex gap-3">
                <button
                  onClick={() => {
                    openEditModal(selectedShop);
                    setSelectedShopId(null);
                  }}
                  className="flex-1 inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-xs font-bold text-blue-400 transition-all cursor-pointer"
                >
                  <Edit className="h-4 w-4" /> Edit Profile
                </button>

                {selectedShop.status !== "approved" ? (
                  <button
                    disabled={isLoading}
                    onClick={() => handleApprove(selectedShop.id)}
                    className="flex-1 inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/10 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Verify Access
                  </button>
                ) : (
                  <button
                    disabled={isLoading}
                    onClick={() => handleSuspend(selectedShop.id)}
                    className="flex-1 inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-bold text-amber-400 border border-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Ban className="h-4 w-4" /> Suspend
                  </button>
                )}

                <button
                  disabled={isLoading}
                  onClick={() => handleDelete(selectedShop.id)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-900 text-gray-500 hover:text-rose-400 hover:bg-rose-500/5 transition-colors cursor-pointer disabled:opacity-50"
                  title="Purge Record"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MERCHANT MODAL */}
      {editShop && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setEditShop(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#0B0F17] border border-gray-800 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-900 pb-4 mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit className="h-5 w-5 text-blue-400" />
                Edit Merchant Profile
              </h3>
              <button onClick={() => setEditShop(null)} className="p-1 rounded-lg text-gray-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.businessName}
                    onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Owner Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.ownerName}
                    onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Direct Phone Line *</label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-400 mb-1">District / Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Establishment Type</label>
                  <select
                    value={editForm.establishmentType}
                    onChange={(e) => setEditForm({ ...editForm, establishmentType: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-blue-500"
                  >
                    <option value="restaurant">Restaurant</option>
                    <option value="hotel">Hotel / Resort</option>
                    <option value="villa">Private Villa</option>
                    <option value="guesthouse">Guest House</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-400 mb-1">Categories (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Traditional Rice & Curry, Lake View Dining"
                  value={editForm.categories}
                  onChange={(e) => setEditForm({ ...editForm, categories: e.target.value })}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-400 mb-1">Services & Amenities (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Dine-In, Free Wi-Fi, Parking"
                  value={editForm.services}
                  onChange={(e) => setEditForm({ ...editForm, services: e.target.value })}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-400 mb-1">Audit Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-400 mb-1">Business Description</label>
                <textarea
                  rows="3"
                  value={editForm.businessDescription}
                  onChange={(e) => setEditForm({ ...editForm, businessDescription: e.target.value })}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-400 mb-1">Upload Additional Photos (Optional)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setEditForm({ ...editForm, photosFiles: e.target.files })}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 p-2 text-gray-400 text-xs"
                />
              </div>

              <div className="pt-4 border-t border-gray-900 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditShop(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW MERCHANT MODAL */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsCreateOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#0B0F17] border border-gray-800 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-900 pb-4 mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-400" />
                Add New Partner Merchant
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 rounded-lg text-gray-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Heritage Villa"
                    value={createForm.businessName}
                    onChange={(e) => setCreateForm({ ...createForm, businessName: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Owner / Representative Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ruwan Perera"
                    value={createForm.ownerName}
                    onChange={(e) => setCreateForm({ ...createForm, ownerName: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="merchant@example.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Direct Phone Line *</label>
                  <input
                    type="text"
                    required
                    placeholder="+94 77 123 4567"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-400 mb-1">District / Location</label>
                  <input
                    type="text"
                    placeholder="Anuradhapura"
                    value={createForm.location}
                    onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Establishment Type</label>
                  <select
                    value={createForm.establishmentType}
                    onChange={(e) => setCreateForm({ ...createForm, establishmentType: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-blue-500"
                  >
                    <option value="restaurant">Restaurant</option>
                    <option value="hotel">Hotel / Resort</option>
                    <option value="villa">Private Villa</option>
                    <option value="guesthouse">Guest House</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-400 mb-1">Categories (comma-separated)</label>
                <input
                  type="text"
                  placeholder="Traditional Rice & Curry, Lake View Dining"
                  value={createForm.categories}
                  onChange={(e) => setCreateForm({ ...createForm, categories: e.target.value })}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-400 mb-1">Services & Amenities (comma-separated)</label>
                <input
                  type="text"
                  placeholder="Dine-In, Free Wi-Fi, Parking"
                  value={createForm.services}
                  onChange={(e) => setCreateForm({ ...createForm, services: e.target.value })}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-400 mb-1">Initial Status</label>
                <select
                  value={createForm.status}
                  onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-400 mb-1">Business Description</label>
                <textarea
                  rows="3"
                  placeholder="Overview of guest experiences and services..."
                  value={createForm.businessDescription}
                  onChange={(e) => setCreateForm({ ...createForm, businessDescription: e.target.value })}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-400 mb-1">Photos (Up to 5)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setCreateForm({ ...createForm, photosFiles: e.target.files })}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 p-2 text-gray-400 text-xs"
                />
              </div>

              <div className="pt-4 border-t border-gray-900 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                  Onboard Merchant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE INSPECTION */}
      {isPreviewOpen && selectedShop?.photos?.[activePhotoIndex] && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between px-6 z-10">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-950 px-3 py-1.5 border border-gray-900 rounded-lg flex items-center gap-2">
              <Info className="h-3.5 w-3.5 text-blue-400" />
              Inspection Matrix: <span className="text-white ml-1">{selectedShop.businessName || selectedShop.name}</span>
            </span>
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="p-2 rounded-xl border border-gray-800 bg-gray-950/80 text-gray-400 hover:text-white shadow-2xl"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative max-w-[95vw] max-h-[90vh] w-full h-full flex items-center justify-center select-none">
            <img
              src={selectedShop.photos[activePhotoIndex]}
              alt="Verification Sheet Full-Res Matrix"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-gray-900"
            />
          </div>
        </div>
      )}

      {/* VIEW MENU ITEMS MODAL */}
      {isViewFoodOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsViewFoodOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#0B0F17] border border-gray-800 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-900 pb-4 mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-emerald-400" />
                Menu Items: {viewFoodShopName}
              </h3>
              <button onClick={() => setIsViewFoodOpen(false)} className="p-1 rounded-lg text-gray-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {loadingFoods ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : shopFoods.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs">
                No food items added by this merchant yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
                {shopFoods.map((food) => (
                  <div key={food._id} className="rounded-xl border border-gray-900 bg-gray-950/40 p-3 flex gap-3 items-center">
                    <img
                      src={food.picture ? (food.picture.startsWith("http") ? food.picture : food.picture) : "https://via.placeholder.com/150"}
                      alt={food.name}
                      className="w-12 h-12 rounded-lg object-cover ring-1 ring-gray-800"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate">{food.name}</h4>
                      <p className="text-[10px] text-gray-400 capitalize mt-0.5">{food.category?.name || "Uncategorized"}</p>
                      <p className="text-xs text-emerald-400 font-bold mt-1">LKR {parseFloat(food.price).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsViewFoodOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-900 transition text-xs font-bold"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopsManagement;