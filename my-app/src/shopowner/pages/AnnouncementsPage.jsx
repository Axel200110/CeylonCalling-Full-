import React, { useEffect, useState } from "react";
import { Plus, Trash2, Bell, Calendar, Tag, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import SidebarNavigation from "../components/SideNavbar";
import { useAuthStore } from "../store/authStore";

const AnnouncementsPage = () => {
  const { announcements, fetchAnnouncements, createAnnouncement, deleteAnnouncement } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    tag: "general",
    endDate: "",
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      toast.error("Please fill title and message");
      return;
    }

    try {
      setIsSubmitting(true);
      await createAnnouncement(formData);
      toast.success("Announcement broadcasted successfully!");
      setShowModal(false);
      setFormData({
        title: "",
        message: "",
        tag: "general",
        endDate: "",
      });
    } catch {
      toast.error("Failed to publish announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this announcement from your public profile?")) {
      try {
        await deleteAnnouncement(id);
        toast.success("Announcement removed");
      } catch {
        toast.error("Failed to delete announcement");
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex font-sans">
      <SidebarNavigation />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full pt-20 md:pt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Bell className="h-6 w-6 text-emerald-400" />
              Store Announcements & Notices
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Broadcast special events, holiday operational hours, or new arrivals directly on your store profile.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded-xl flex items-center gap-2 transition shadow-lg shadow-emerald-600/20 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> New Announcement
          </button>
        </div>

        {announcements.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/30 rounded-2xl border border-neutral-900">
            <Bell className="h-10 w-10 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-300">No active announcements</p>
            <p className="text-xs text-neutral-500 mt-1">Keep travelers informed with live notices and alerts.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {announcements.map((ann) => (
              <div
                key={ann._id}
                className="p-5 rounded-2xl border border-neutral-900 bg-neutral-900/40 flex flex-col justify-between hover:border-emerald-500/30 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {ann.tag.replace("_", " ")}
                    </span>
                    <button
                      onClick={() => handleDelete(ann._id)}
                      className="text-neutral-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1.5">{ann.title}</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-neutral-800/80">
                    "{ann.message}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800 text-[10px] text-neutral-500 flex items-center justify-between">
                  <span>Broadcasted:</span>
                  <span className="text-neutral-300">{new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="text-sm font-bold text-white">Broadcast Store Announcement</h3>

              <form onSubmit={handleCreate} className="space-y-3 text-xs">
                <div>
                  <label className="text-neutral-400 block mb-1">Headline / Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Extended Dinner Hours this Friday"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Category Tag</label>
                  <select
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="general">General Notice</option>
                    <option value="special_event">Special Event / Music</option>
                    <option value="holiday">Holiday Notice</option>
                    <option value="new_menu">New Menu Item Added</option>
                    <option value="temporary_closure">Temporary Schedule Adjustment</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Message Body *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details for your customers..."
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/20"
                  >
                    {isSubmitting ? "Broadcasting..." : "Broadcast Notice"}
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

export default AnnouncementsPage;
