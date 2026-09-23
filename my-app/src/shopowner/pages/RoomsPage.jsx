import React, { useEffect, useState, useRef } from "react";
import { 
  Bed, Plus, Trash2, Users, DollarSign, CheckCircle2, XCircle, Wrench, 
  Calendar, Phone, Mail, Clock, UserCheck, ShieldCheck, Filter, Edit3, 
  Camera, Image as ImageIcon, AlertCircle, X, Layers
} from "lucide-react";
import toast from "react-hot-toast";
import SidebarNavigation from "../components/SideNavbar";
import { useAuthStore } from "../store/authStore";

const BACKEND_BASE = import.meta.env.MODE === "development" ? "" : "";

const getRoomImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  return `${BACKEND_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};

const INITIAL_FORM = {
  name: "",
  roomType: "Double",
  description: "",
  pricePerNight: "",
  capacityGuests: 2,
  bedType: "1 Queen Bed",
  facilities: "Wi-Fi, Air conditioning, Private Bathroom, Hot Water",
  status: "available",
  totalUnits: 1,
  availableUnits: 1,
};

const RoomsPage = () => {
  const { 
    rooms, 
    fetchRooms, 
    createRoom, 
    updateRoom, 
    updateRoomAvailability, 
    deleteRoom, 
    bookings, 
    fetchBookings, 
    updateBookingStatus, 
    shop 
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState("rooms"); // 'rooms' or 'bookings'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingFilter, setBookingFilter] = useState("all");

  // Create Form State
  const [createData, setCreateData] = useState(INITIAL_FORM);
  const [createFiles, setCreateFiles] = useState([]);
  const [createPreviews, setCreatePreviews] = useState([]);
  const createFileInputRef = useRef(null);

  // Edit Form State
  const [editData, setEditData] = useState(INITIAL_FORM);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [editNewFiles, setEditNewFiles] = useState([]);
  const [editNewPreviews, setEditNewPreviews] = useState([]);
  const editFileInputRef = useRef(null);

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, [fetchRooms, fetchBookings]);

  // ---------------- CREATE PHOTO HANDLERS ----------------
  const handleCreatePhotoSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 5 - createFiles.length;
    if (remainingSlots <= 0) {
      toast.error("Maximum 5 photos allowed per room");
      return;
    }

    const validFiles = files.slice(0, remainingSlots).filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB size limit`);
        return false;
      }
      return true;
    });

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setCreateFiles((prev) => [...prev, ...validFiles]);
    setCreatePreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removeCreatePhoto = (index) => {
    URL.revokeObjectURL(createPreviews[index]);
    setCreateFiles((prev) => prev.filter((_, i) => i !== index));
    setCreatePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------- EDIT PHOTO HANDLERS ----------------
  const handleOpenEdit = (room) => {
    setEditingRoom(room);
    setEditData({
      name: room.name || "",
      roomType: room.roomType || "Double",
      description: room.description || "",
      pricePerNight: room.pricePerNight || "",
      capacityGuests: room.capacityGuests || 2,
      bedType: room.bedType || "1 Queen Bed",
      facilities: Array.isArray(room.facilities) ? room.facilities.join(", ") : room.facilities || "",
      status: room.status || "available",
      totalUnits: room.totalUnits || 1,
      availableUnits: room.availableUnits ?? 1,
    });
    setExistingPhotos(room.photos || []);
    setEditNewFiles([]);
    setEditNewPreviews([]);
    setShowEditModal(true);
  };

  const handleEditPhotoSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const currentTotal = existingPhotos.length + editNewFiles.length;
    const remainingSlots = 5 - currentTotal;
    if (remainingSlots <= 0) {
      toast.error("Maximum 5 photos allowed per room");
      return;
    }

    const validFiles = files.slice(0, remainingSlots).filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB size limit`);
        return false;
      }
      return true;
    });

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setEditNewFiles((prev) => [...prev, ...validFiles]);
    setEditNewPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removeExistingPhoto = (index) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeEditNewPhoto = (index) => {
    URL.revokeObjectURL(editNewPreviews[index]);
    setEditNewFiles((prev) => prev.filter((_, i) => i !== index));
    setEditNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------- FORM SUBMISSIONS ----------------
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createData.name || !createData.pricePerNight) {
      toast.error("Please provide Room Name and Price per night");
      return;
    }

    try {
      setIsSubmitting(true);
      const parsedFacilities = createData.facilities
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const formData = new FormData();
      formData.append("name", createData.name);
      formData.append("roomType", createData.roomType);
      formData.append("description", createData.description);
      formData.append("pricePerNight", Number(createData.pricePerNight));
      formData.append("capacityGuests", Number(createData.capacityGuests));
      formData.append("bedType", createData.bedType);
      formData.append("status", createData.status);
      formData.append("totalUnits", Number(createData.totalUnits) || 1);
      formData.append("availableUnits", Number(createData.availableUnits) ?? 1);
      formData.append("facilities", JSON.stringify(parsedFacilities));

      // Append up to 5 photos
      createFiles.slice(0, 5).forEach((file) => {
        formData.append("photos", file);
      });

      await createRoom(formData);
      toast.success("Accommodation unit added successfully with photos!");
      setShowCreateModal(false);
      setCreateData(INITIAL_FORM);
      createPreviews.forEach((url) => URL.revokeObjectURL(url));
      setCreateFiles([]);
      setCreatePreviews([]);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add room";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData.name || !editData.pricePerNight) {
      toast.error("Please fill in Room Name and Price per night");
      return;
    }

    try {
      setIsSubmitting(true);
      const parsedFacilities = editData.facilities
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("roomType", editData.roomType);
      formData.append("description", editData.description);
      formData.append("pricePerNight", Number(editData.pricePerNight));
      formData.append("capacityGuests", Number(editData.capacityGuests));
      formData.append("bedType", editData.bedType);
      formData.append("status", editData.status);
      formData.append("totalUnits", Number(editData.totalUnits) || 1);
      formData.append("availableUnits", Number(editData.availableUnits) ?? 1);
      formData.append("facilities", JSON.stringify(parsedFacilities));
      formData.append("existingPhotos", JSON.stringify(existingPhotos));

      // Append newly added photo files
      editNewFiles.forEach((file) => {
        formData.append("photos", file);
      });

      await updateRoom(editingRoom._id, formData);
      toast.success("Room listing updated successfully!");
      setShowEditModal(false);
      setEditingRoom(null);
      editNewPreviews.forEach((url) => URL.revokeObjectURL(url));
      setEditNewFiles([]);
      setEditNewPreviews([]);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update room";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Availability Status Toggle
  const handleQuickStatusChange = async (roomId, newStatus) => {
    try {
      await updateRoomAvailability(roomId, { status: newStatus });
      toast.success(`Availability updated: ${newStatus.toUpperCase()}`);
    } catch (err) {
      toast.error("Failed to update availability");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this accommodation listing?")) {
      try {
        await deleteRoom(id);
        toast.success("Room listing removed");
      } catch {
        toast.error("Failed to delete room");
      }
    }
  };

  const handleBookingStatus = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      toast.success(`Booking updated to ${newStatus.toUpperCase()}`);
    } catch {
      toast.error("Failed to update booking status");
    }
  };

  const filteredBookings = (bookings || []).filter((b) => {
    if (bookingFilter === "all") return true;
    return b.status === bookingFilter;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex font-sans">
      <SidebarNavigation />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pt-20 md:pt-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <Bed className="h-6 w-6 text-emerald-400" />
              Accommodations & Room Inventory
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Manage room availability, upload up to 5 photos per room, configure tariffs and monitor guest bookings for {shop?.shopName || "your venue"}.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {activeTab === "rooms" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-xl flex items-center gap-2 transition shadow-lg shadow-emerald-600/20"
              >
                <Plus className="h-4 w-4" /> Add Room Listing
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-neutral-900 pb-2">
          <button
            onClick={() => setActiveTab("rooms")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "rooms"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Bed className="h-4 w-4" />
            Room Inventory ({rooms.length})
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "bookings"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Guest Reservations ({bookings.length})
          </button>
        </div>

        {/* ── TAB 1: ROOMS INVENTORY ── */}
        {activeTab === "rooms" && (
          <>
            {rooms.length === 0 ? (
              <div className="text-center py-20 bg-neutral-900/30 rounded-3xl border border-neutral-900">
                <Bed className="h-12 w-12 text-neutral-600 mx-auto mb-3" />
                <p className="text-base font-bold text-neutral-300">No rooms listed yet</p>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  Add your hotel rooms, villa suites, or cottages with up to 5 photos and availability status so guests can find and reserve them.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-xl inline-flex items-center gap-2 transition shadow-lg shadow-emerald-600/20"
                >
                  <Plus className="h-4 w-4" /> Add First Room
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rooms.map((room) => {
                  const hasPhotos = room.photos && room.photos.length > 0;
                  const coverPhoto = hasPhotos ? getRoomImageUrl(room.photos[0]) : null;

                  return (
                    <div
                      key={room._id}
                      className="rounded-2xl border border-neutral-800 bg-neutral-900/50 overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition shadow-lg"
                    >
                      {/* Room Photo Gallery Preview */}
                      <div className="relative h-44 bg-neutral-950 w-full overflow-hidden group">
                        {coverPhoto ? (
                          <img
                            src={coverPhoto}
                            alt={room.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900/80 text-neutral-600">
                            <ImageIcon className="h-8 w-8 mb-1" />
                            <span className="text-[11px]">No photos uploaded</span>
                          </div>
                        )}

                        {/* Badges on Image */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/20">
                            {room.roomType}
                          </span>
                          {hasPhotos && (
                            <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md text-neutral-200 border border-white/10 flex items-center gap-1">
                              <Camera className="h-3 w-3" /> {room.photos.length} / 5
                            </span>
                          )}
                        </div>

                        {/* Units pill */}
                        <div className="absolute top-2.5 right-2.5">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-neutral-200 border border-white/10 flex items-center gap-1">
                            <Layers className="h-3 w-3 text-cyan-400" />
                            {room.availableUnits ?? 1}/{room.totalUnits || 1} Units
                          </span>
                        </div>

                        {/* Thumbnail Strip for additional photos */}
                        {hasPhotos && room.photos.length > 1 && (
                          <div className="absolute bottom-2 left-2 right-2 flex gap-1 p-1 rounded-lg bg-black/60 backdrop-blur-md overflow-x-auto">
                            {room.photos.slice(0, 5).map((pUrl, idx) => (
                              <img
                                key={idx}
                                src={getRoomImageUrl(pUrl)}
                                alt={`Thumbnail ${idx + 1}`}
                                className={`w-8 h-8 rounded object-cover border ${
                                  idx === 0 ? "border-emerald-400" : "border-white/20 opacity-80"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Room Card Body */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h3 className="text-base font-bold text-white line-clamp-1">{room.name}</h3>
                          <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                            {room.description || "Comfortable guest stay unit with verified amenities."}
                          </p>

                          {/* Quick Specs */}
                          <div className="my-3 p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1.5 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-neutral-400">Nightly Tariff:</span>
                              <span className="font-extrabold text-emerald-400 text-sm">
                                LKR {room.pricePerNight?.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-neutral-300">
                              <span className="text-neutral-400">Max Capacity:</span>
                              <span>{room.capacityGuests} Guests &bull; {room.bedType}</span>
                            </div>
                          </div>

                          {/* Facilities chips */}
                          {room.facilities?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {room.facilities.slice(0, 4).map((fac, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded-md bg-neutral-800 text-[10px] text-neutral-300">
                                  {fac}
                                </span>
                              ))}
                              {room.facilities.length > 4 && (
                                <span className="px-1.5 py-0.5 rounded-md bg-neutral-800 text-[10px] text-neutral-400">
                                  +{room.facilities.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Availability Selector & Action Buttons */}
                        <div className="pt-3 border-t border-neutral-800/80 space-y-2.5">
                          {/* Live Availability Quick Switch */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-semibold text-neutral-400">Status:</span>
                            <select
                              value={room.status || "available"}
                              onChange={(e) => handleQuickStatusChange(room._id, e.target.value)}
                              className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none capitalize transition ${
                                room.status === "available"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                  : room.status === "booked"
                                  ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              }`}
                            >
                              <option value="available" className="bg-neutral-900 text-emerald-400">● Available</option>
                              <option value="booked" className="bg-neutral-900 text-blue-400">● Fully Booked</option>
                              <option value="maintenance" className="bg-neutral-900 text-amber-400">● Maintenance</option>
                            </select>
                          </div>

                          {/* Action Buttons: Edit & Delete */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(room)}
                              className="flex-1 py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-neutral-700"
                            >
                              <Edit3 className="h-3.5 w-3.5 text-emerald-400" /> Edit Details & Photos
                            </button>
                            <button
                              onClick={() => handleDelete(room._id)}
                              className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition border border-neutral-800"
                              title="Delete Room"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── TAB 2: GUEST RESERVATIONS QUEUE ── */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            {/* Filter bar */}
            <div className="flex items-center gap-2 bg-neutral-900/60 p-1 rounded-xl border border-neutral-800 overflow-x-auto w-fit">
              {["all", "pending", "confirmed", "checked_in", "completed", "cancelled"].map((st) => (
                <button
                  key={st}
                  onClick={() => setBookingFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
                    bookingFilter === st
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>

            {filteredBookings.length === 0 ? (
              <div className="text-center py-20 bg-neutral-900/30 rounded-2xl border border-neutral-900">
                <Calendar className="h-10 w-10 text-neutral-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-neutral-300">No bookings in this category</p>
                <p className="text-xs text-neutral-500 mt-1">Incoming guest reservations will appear here.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredBookings.map((b) => {
                  const checkIn = new Date(b.checkInDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                  const checkOut = new Date(b.checkOutDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                  const nights = Math.max(1, Math.ceil((new Date(b.checkOutDate) - new Date(b.checkInDate)) / (1000 * 60 * 60 * 24)));

                  return (
                    <div
                      key={b._id}
                      className="p-5 rounded-2xl border border-neutral-900 bg-neutral-900/40 flex flex-col justify-between space-y-4 hover:border-emerald-500/30 transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="font-mono text-xs font-bold text-emerald-400">{b.bookingReference}</span>
                            <h4 className="text-sm font-bold text-white mt-0.5">{b.customerName}</h4>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              b.status === "completed"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : b.status === "cancelled"
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                : b.status === "checked_in"
                                ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {b.status?.replace("_", " ")}
                          </span>
                        </div>

                        <div className="text-xs text-neutral-400 space-y-1 mb-3">
                          <p className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-neutral-500" /> {b.customerPhone}</p>
                          <p className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-neutral-500" /> {b.customerEmail}</p>
                        </div>

                        {/* Stay Details */}
                        <div className="p-3 rounded-xl bg-black/40 border border-neutral-800/80 space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Unit:</span>
                            <span className="font-bold text-white">{b.room?.name || "Room"} ({b.room?.roomType || "Standard"})</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Dates:</span>
                            <span className="text-neutral-200">{checkIn} → {checkOut} ({nights} {nights === 1 ? "night" : "nights"})</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Guests:</span>
                            <span className="text-neutral-200">{b.guestsCount} Guests</span>
                          </div>
                          {b.specialRequests && (
                            <div className="pt-1 text-[11px] text-neutral-400 italic">
                              "{b.specialRequests}"
                            </div>
                          )}
                          <div className="pt-2 border-t border-neutral-800 flex justify-between font-bold text-white">
                            <span>Total Tariff:</span>
                            <span className="text-emerald-400">LKR {b.totalPrice?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-800">
                        {b.status === "pending" && (
                          <button
                            onClick={() => handleBookingStatus(b._id, "confirmed")}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                          >
                            Confirm Reservation
                          </button>
                        )}
                        {b.status === "confirmed" && (
                          <button
                            onClick={() => handleBookingStatus(b._id, "checked_in")}
                            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1"
                          >
                            <UserCheck className="h-3.5 w-3.5" /> Check In Guest
                          </button>
                        )}
                        {b.status === "checked_in" && (
                          <button
                            onClick={() => handleBookingStatus(b._id, "completed")}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                          >
                            Complete & Check Out
                          </button>
                        )}
                        {b.status !== "completed" && b.status !== "cancelled" && (
                          <button
                            onClick={() => handleBookingStatus(b._id, "cancelled")}
                            className="px-3 py-1.5 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 text-xs font-semibold ml-auto"
                          >
                            Cancel Stay
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── CREATE ROOM MODAL (WITH 5-PHOTO UPLOAD) ── */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Bed className="h-5 w-5 text-emerald-400" /> Add Accommodation Unit
                  </h2>
                  <p className="text-xs text-neutral-400">List a room with up to 5 photos, tariffs, and availability settings.</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                {/* Room Photos (Max 5) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                      <Camera className="h-4 w-4 text-emerald-400" />
                      Room Photos (Up to 5)
                    </label>
                    <span className="text-[11px] font-bold text-neutral-400">
                      {createFiles.length} / 5 Selected
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2.5 mb-2">
                    {createPreviews.map((preview, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-700 group bg-neutral-950">
                        <img src={preview} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded shadow">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeCreatePhoto(idx)}
                          className="absolute top-1 right-1 p-1 bg-black/75 text-rose-400 hover:text-white hover:bg-rose-600 rounded-full transition"
                          title="Remove Photo"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}

                    {createFiles.length < 5 && (
                      <button
                        type="button"
                        onClick={() => createFileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-neutral-700 hover:border-emerald-500/50 bg-neutral-950/50 hover:bg-neutral-950 flex flex-col items-center justify-center text-neutral-400 hover:text-emerald-400 transition"
                      >
                        <Camera className="h-5 w-5 mb-1" />
                        <span className="text-[10px] font-medium">+ Add Photo</span>
                      </button>
                    )}
                  </div>

                  <input
                    ref={createFileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleCreatePhotoSelect}
                    className="hidden"
                  />
                  <p className="text-[10px] text-neutral-500">
                    JPG, PNG or WEBP (Max 5MB each). First image serves as the listing cover.
                  </p>
                </div>

                {/* Name & Room Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Room / Unit Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Deluxe Royal Garden Suite"
                      value={createData.name}
                      onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Room Classification</label>
                    <select
                      value={createData.roomType}
                      onChange={(e) => setCreateData({ ...createData, roomType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Single">Single Room</option>
                      <option value="Double">Double Room</option>
                      <option value="Deluxe">Deluxe Room</option>
                      <option value="Suite">Suite</option>
                      <option value="Family Room">Family Room</option>
                      <option value="Villa Entire">Entire Villa</option>
                      <option value="Bungalow">Bungalow</option>
                      <option value="Cottage">Cottage</option>
                      <option value="Standard">Standard Room</option>
                    </select>
                  </div>
                </div>

                {/* Pricing & Units */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Price / Night (LKR) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 15000"
                      value={createData.pricePerNight}
                      onChange={(e) => setCreateData({ ...createData, pricePerNight: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Total Units Count</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 5"
                      value={createData.totalUnits}
                      onChange={(e) => setCreateData({ ...createData, totalUnits: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Available Units Right Now</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 5"
                      value={createData.availableUnits}
                      onChange={(e) => setCreateData({ ...createData, availableUnits: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Capacity & Bedding & Initial Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Max Guests</label>
                    <input
                      type="number"
                      min="1"
                      value={createData.capacityGuests}
                      onChange={(e) => setCreateData({ ...createData, capacityGuests: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Bedding Setup</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 King Bed, 2 Singles"
                      value={createData.bedType}
                      onChange={(e) => setCreateData({ ...createData, bedType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Availability Status</label>
                    <select
                      value={createData.status}
                      onChange={(e) => setCreateData({ ...createData, status: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 capitalize"
                    >
                      <option value="available">Available</option>
                      <option value="booked">Fully Booked</option>
                      <option value="maintenance">Under Maintenance</option>
                    </select>
                  </div>
                </div>

                {/* Facilities */}
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Room Facilities (Comma-separated)</label>
                  <input
                    type="text"
                    value={createData.facilities}
                    onChange={(e) => setCreateData({ ...createData, facilities: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-neutral-500 mt-1 block">e.g. Wi-Fi, Air conditioning, Private Pool, Balcony, Hot Water, Lake View</span>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Description</label>
                  <textarea
                    rows="2"
                    placeholder="Scenic Anuradhapura paddy view, private balcony, luxury rain shower..."
                    value={createData.description}
                    onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-xl shadow-lg shadow-emerald-600/20 transition"
                  >
                    {isSubmitting ? "Uploading & Saving..." : "Publish Room Listing"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── EDIT ROOM MODAL (WITH 5-PHOTO MANAGEMENT) ── */}
        {showEditModal && editingRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Edit3 className="h-5 w-5 text-emerald-400" /> Edit Room Details & Photos
                  </h2>
                  <p className="text-xs text-neutral-400">Update unit info, change photos (up to 5), and manage live availability.</p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* Photos Gallery Management */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                      <Camera className="h-4 w-4 text-emerald-400" />
                      Manage Photos (Up to 5)
                    </label>
                    <span className="text-[11px] font-bold text-neutral-400">
                      {existingPhotos.length + editNewFiles.length} / 5 Photos
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2.5 mb-2">
                    {/* Existing Photos */}
                    {existingPhotos.map((photoUrl, idx) => (
                      <div key={`exist-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-700 group bg-neutral-950">
                        <img src={getRoomImageUrl(photoUrl)} alt={`Existing ${idx + 1}`} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded shadow">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeExistingPhoto(idx)}
                          className="absolute top-1 right-1 p-1 bg-black/75 text-rose-400 hover:text-white hover:bg-rose-600 rounded-full transition"
                          title="Remove Photo"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}

                    {/* New Upload Previews */}
                    {editNewPreviews.map((preview, idx) => (
                      <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-emerald-500/50 group bg-neutral-950">
                        <img src={preview} alt={`New upload ${idx + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute top-1 left-1 text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded shadow">
                          New
                        </span>
                        <button
                          type="button"
                          onClick={() => removeEditNewPhoto(idx)}
                          className="absolute top-1 right-1 p-1 bg-black/75 text-rose-400 hover:text-white hover:bg-rose-600 rounded-full transition"
                          title="Remove Photo"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}

                    {/* Add Photo Slot Button */}
                    {existingPhotos.length + editNewFiles.length < 5 && (
                      <button
                        type="button"
                        onClick={() => editFileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-neutral-700 hover:border-emerald-500/50 bg-neutral-950/50 hover:bg-neutral-950 flex flex-col items-center justify-center text-neutral-400 hover:text-emerald-400 transition"
                      >
                        <Camera className="h-5 w-5 mb-1" />
                        <span className="text-[10px] font-medium">+ Add Photo</span>
                      </button>
                    )}
                  </div>

                  <input
                    ref={editFileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleEditPhotoSelect}
                    className="hidden"
                  />
                  <p className="text-[10px] text-neutral-500">
                    Click the "X" to remove photos. You can upload replacement images up to the 5 photo limit.
                  </p>
                </div>

                {/* Name & Room Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Room / Unit Name *</label>
                    <input
                      type="text"
                      required
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Room Classification</label>
                    <select
                      value={editData.roomType}
                      onChange={(e) => setEditData({ ...editData, roomType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Single">Single Room</option>
                      <option value="Double">Double Room</option>
                      <option value="Deluxe">Deluxe Room</option>
                      <option value="Suite">Suite</option>
                      <option value="Family Room">Family Room</option>
                      <option value="Villa Entire">Entire Villa</option>
                      <option value="Bungalow">Bungalow</option>
                      <option value="Cottage">Cottage</option>
                      <option value="Standard">Standard Room</option>
                    </select>
                  </div>
                </div>

                {/* Pricing & Units */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Price / Night (LKR) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editData.pricePerNight}
                      onChange={(e) => setEditData({ ...editData, pricePerNight: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Total Units Count</label>
                    <input
                      type="number"
                      min="1"
                      value={editData.totalUnits}
                      onChange={(e) => setEditData({ ...editData, totalUnits: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Available Units Right Now</label>
                    <input
                      type="number"
                      min="0"
                      value={editData.availableUnits}
                      onChange={(e) => setEditData({ ...editData, availableUnits: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Capacity & Bedding & Live Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Max Guests</label>
                    <input
                      type="number"
                      min="1"
                      value={editData.capacityGuests}
                      onChange={(e) => setEditData({ ...editData, capacityGuests: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Bedding Setup</label>
                    <input
                      type="text"
                      value={editData.bedType}
                      onChange={(e) => setEditData({ ...editData, bedType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Availability Status</label>
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 capitalize"
                    >
                      <option value="available">Available</option>
                      <option value="booked">Fully Booked</option>
                      <option value="maintenance">Under Maintenance</option>
                    </select>
                  </div>
                </div>

                {/* Facilities */}
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Room Facilities (Comma-separated)</label>
                  <input
                    type="text"
                    value={editData.facilities}
                    onChange={(e) => setEditData({ ...editData, facilities: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Description</label>
                  <textarea
                    rows="2"
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-xl shadow-lg shadow-emerald-600/20 transition"
                  >
                    {isSubmitting ? "Updating Listing..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RoomsPage;
