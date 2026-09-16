import React, { useState } from "react";
import { 
  MapPin, Search, Star, Trash2, Eye, EyeOff, 
  Map, MessageSquare, Compass 
} from "lucide-react";
import { useAdminStore } from "../store/adminStore";
import toast from "react-hot-toast";

const ListingsManagement = () => {
  const { listings, updateListingStatus, deleteListing } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const handleToggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    updateListingStatus(id, nextStatus);
    toast.success(`Listing status updated to ${nextStatus}`);
  };

  const handleDeleteListing = (id) => {
    if (window.confirm("Are you sure you want to delete this listing from the platform database?")) {
      deleteListing(id);
      toast.success("Listing deleted successfully");
    }
  };

  // Get unique categories for filters
  const categories = ["all", ...new Set(listings.map((l) => l.category))];

  // Filter listings
  const filteredListings = listings.filter((l) => {
    const matchesSearch = 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || l.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Listings Directory</h2>
          <p className="text-xs text-gray-400 mt-1">Monitor, suspend or update destinations and local attraction listings.</p>
        </div>
      </div>

      {/* Filters and search panel */}
      <div className="flex flex-col md:flex-row justify-between gap-4 p-4 rounded-2xl border border-gray-900 bg-[#0B0F17] shadow-lg">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search listings by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-800 bg-gray-950/60 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 outline-none transition-all focus:border-blue-500/50"
          />
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-gray-800 bg-gray-950/60 py-2 px-3 text-xs text-white outline-none focus:border-blue-500/50 cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid view of Listings */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredListings.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-500 font-medium">
            No attraction listings found.
          </div>
        ) : (
          filteredListings.map((listing) => (
            <div 
              key={listing.id}
              className={`rounded-2xl border bg-gradient-to-b from-[#0B0F17] to-gray-950/40 p-4 shadow-xl flex flex-col justify-between transition-all duration-300 ${
                listing.status === "active" ? "border-gray-900" : "border-rose-500/25 opacity-70"
              }`}
            >
              <div>
                <div className="relative h-40 rounded-xl overflow-hidden border border-gray-900">
                  <img 
                    src={listing.image} 
                    alt={listing.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur px-2 py-0.5 rounded-md text-[10px] text-amber-400 font-bold border border-gray-850">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{listing.rating}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-blue-600/95 text-white font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                    {listing.category}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <h3 className="font-bold text-white tracking-wide truncate">{listing.name}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <MapPin className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                    <span className="truncate">{listing.location}, Sri Lanka</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-gray-900/60 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {listing.reviewsCount} reviews
                  </span>
                  <span className={`h-2 w-2 rounded-full ${listing.status === "active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleStatus(listing.id, listing.status)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      listing.status === "active" 
                        ? "border-gray-850 text-gray-400 hover:text-white hover:bg-gray-850" 
                        : "border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10"
                    }`}
                    title={listing.status === "active" ? "Deactivate Listing" : "Activate Listing"}
                  >
                    {listing.status === "active" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteListing(listing.id)}
                    className="p-1.5 rounded-lg border border-gray-850 text-gray-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all"
                    title="Delete Listing"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ListingsManagement;
