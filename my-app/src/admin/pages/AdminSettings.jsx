import React, { useEffect, useState } from "react";
import { 
  Settings, Shield, Database, Bell, Eye, EyeOff, 
  RotateCcw, RefreshCw, AlertCircle, Save, Download, Server, Cpu, HardDrive, CheckCircle
} from "lucide-react";
import { useAdminStore } from "../store/adminStore";
import toast from "react-hot-toast";

const AdminSettings = () => {
  const { 
    settings, 
    updateSettings, 
    backups, 
    fetchBackups, 
    createBackup, 
    health, 
    fetchSystemHealth,
    updatePassword
  } = useAdminStore();

  const [isBackupLoading, setIsBackupLoading] = useState(false);
  
  // Password change form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPassLoading, setIsPassLoading] = useState(false);

  // Form states matching store
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);
  const [userRegistration, setUserRegistration] = useState(settings.userRegistration);
  const [emailNotifications, setEmailNotifications] = useState(settings.emailNotifications);

  useEffect(() => {
    fetchBackups();
    fetchSystemHealth();
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings({
      maintenanceMode,
      userRegistration,
      emailNotifications,
    });
    toast.success("Platform configurations saved successfully");
  };

  const handleTriggerBackup = async () => {
    setIsBackupLoading(true);
    try {
      const res = await createBackup();
      toast.success(`Database archive generated: ${res.backup?.filename}`);
    } catch {
      toast.error("Failed to generate database snapshot");
    } finally {
      setIsBackupLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please enter both current and new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setIsPassLoading(true);
    try {
      await updatePassword(currentPassword, newPassword);
      toast.success("Administrator password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setIsPassLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fadeIn">
      {/* Header Panel */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
          <Settings className="h-6 w-6 text-emerald-400" />
          Global Configurations & System Recovery
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Configure platform flags, inspect server health, generate genuine database snapshots, and secure credentials.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Settings options panel */}
        <div className="md:col-span-2 space-y-6">
          {/* General Platform Controls */}
          <div className="rounded-2xl border border-gray-900 bg-[#0B0F17] p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-gray-900 pb-3 mb-5">
              <Settings className="h-4.5 w-4.5 text-emerald-500" />
              General Platform Controls
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              {/* Maintenance Mode */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/40 border border-gray-900">
                <div className="pr-4">
                  <p className="text-xs font-bold text-white">Maintenance Mode</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Locks public site access with an announcement while system upgrades occur.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-800 rounded-full peer peer-checked:bg-emerald-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                </label>
              </div>

              {/* User Registrations */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/40 border border-gray-900">
                <div className="pr-4">
                  <p className="text-xs font-bold text-white">Public Merchant Registrations</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Toggle whether new partner applications are open.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userRegistration}
                    onChange={(e) => setUserRegistration(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-800 rounded-full peer peer-checked:bg-emerald-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                </label>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/40 border border-gray-900">
                <div className="pr-4">
                  <p className="text-xs font-bold text-white">System Email Alerts</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Trigger automated notifications upon new partner signups and critical alerts.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-800 rounded-full peer peer-checked:bg-emerald-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Save className="h-4 w-4" /> Save System Settings
                </button>
              </div>
            </form>
          </div>

          {/* Database Backup & Snapshot Generator */}
          <div className="rounded-2xl border border-gray-900 bg-[#0B0F17] p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-900 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="h-4.5 w-4.5 text-teal-400" />
                Database Backups & Disaster Recovery
              </h3>
              <button
                onClick={handleTriggerBackup}
                disabled={isBackupLoading}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-xs font-semibold text-white rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-teal-600/20"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isBackupLoading ? "animate-spin" : ""}`} />
                {isBackupLoading ? "Archiving..." : "Generate Snapshot"}
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-4">
              Generates sanitized, encrypted JSON snapshots of all business collections (Shops, Menus, Users, Reviews, Settings) outside the web root.
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {backups.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No backup archives generated yet.</p>
              ) : (
                backups.map((b, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-950/40 border border-gray-900 text-xs"
                  >
                    <div>
                      <p className="font-mono text-white font-medium">{b.filename}</p>
                      <span className="text-[10px] text-gray-500">
                        {new Date(b.createdAt).toLocaleString()} • {b.sizeFormatted}
                      </span>
                    </div>

                    <a
                      href={`/api/admin/backups/download/${b.filename}`}
                      className="px-2.5 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-emerald-400 text-xs font-medium flex items-center gap-1 border border-gray-800"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Security & System Health */}
        <div className="space-y-6">
          {/* System Health Status */}
          <div className="rounded-2xl border border-gray-900 bg-[#0B0F17] p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-gray-900 pb-3 mb-4">
              <Server className="h-4.5 w-4.5 text-emerald-400" />
              Live System Status
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-900/60">
                <span className="text-gray-400">Database Engine</span>
                <span className="text-emerald-400 font-semibold">{health?.database || "Connected"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-900/60">
                <span className="text-gray-400">Node Environment</span>
                <span className="text-gray-200 font-mono">{health?.environment || "production"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-900/60">
                <span className="text-gray-400">Memory Heap Used</span>
                <span className="text-gray-200 font-mono">{health?.memoryHeapUsedMB ? `${health.memoryHeapUsedMB} MB` : "—"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Uptime</span>
                <span className="text-gray-200 font-mono">{health?.uptimeSeconds ? `${Math.floor(health.uptimeSeconds / 60)} mins` : "Online"}</span>
              </div>
            </div>
          </div>

          {/* Admin Password Security */}
          <div className="rounded-2xl border border-gray-900 bg-[#0B0F17] p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-gray-900 pb-3 mb-4">
              <Shield className="h-4.5 w-4.5 text-emerald-400" />
              Administrator Credentials
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-1.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-1.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-1.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPassLoading}
                className="w-full mt-2 py-2 bg-gray-800 hover:bg-emerald-600 text-xs font-semibold text-white rounded-xl transition"
              >
                {isPassLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
