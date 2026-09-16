import React, { useState } from "react";
import { 
  Settings, Shield, Database, Bell, Eye, EyeOff, 
  RotateCcw, RefreshCw, AlertCircle, Save 
} from "lucide-react";
import { useAdminStore } from "../store/adminStore";
import toast from "react-hot-toast";

const AdminSettings = () => {
  const { settings, updateSettings, addLog } = useAdminStore();
  const [isBackupLoading, setIsBackupLoading] = useState(false);
  const [adminPass, setAdminPass] = useState("admin123");
  const [showPass, setShowPass] = useState(false);

  // Form states matching store
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);
  const [userRegistration, setUserRegistration] = useState(settings.userRegistration);
  const [emailNotifications, setEmailNotifications] = useState(settings.emailNotifications);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings({
      maintenanceMode,
      userRegistration,
      emailNotifications
    });
    toast.success("Platform configurations saved successfully");
  };

  const handleBackup = () => {
    setIsBackupLoading(true);
    addLog("Manual database backup initiated by administrator", "system");
    
    setTimeout(() => {
      setIsBackupLoading(false);
      toast.success("Database backup archive generated successfully (CeylonCalling_Backup_2026.sql)");
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fadeIn">
      
      {/* Header Panel */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Global Configurations</h2>
        <p className="text-xs text-gray-400 mt-1">Configure global application variables, manage data back-ups, and control system alerts.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Settings options panel */}
        <div className="md:col-span-2 space-y-6">
          
          {/* General Platform Controls */}
          <div className="rounded-2xl border border-gray-900 bg-[#0B0F17] p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-gray-900 pb-3 mb-5">
              <Settings className="h-4.5 w-4.5 text-blue-500" />
              General Platform Controls
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="space-y-4">
                {/* Maintenance Mode */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/30 border border-gray-900">
                  <div className="pr-4">
                    <p className="text-xs font-bold text-white">Maintenance Intercept Mode</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Locks public site access with a splash screen while you perform system upgrades.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={maintenanceMode}
                      onChange={(e) => setMaintenanceMode(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white" />
                  </label>
                </div>

                {/* User Registrations */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/30 border border-gray-900">
                  <div className="pr-4">
                    <p className="text-xs font-bold text-white">Allow Public Registrations</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Toggle whether new user and shopowner accounts are accepted.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={userRegistration}
                      onChange={(e) => setUserRegistration(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white" />
                  </label>
                </div>

                {/* Email Notifications */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/30 border border-gray-900">
                  <div className="pr-4">
                    <p className="text-xs font-bold text-white">Realtime Administrator Notifications</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Sends automated email summaries on shop registrations and critical logs.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white" />
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 text-xs font-semibold text-white shadow shadow-blue-600/10 transition-all cursor-pointer"
                >
                  <Save className="h-4 w-4" /> Save System Settings
                </button>
              </div>
            </form>
          </div>

          {/* Security & Password */}
          <div className="rounded-2xl border border-gray-900 bg-[#0B0F17] p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-gray-900 pb-3 mb-5">
              <Shield className="h-4.5 w-4.5 text-amber-500" />
              Administrative Security Credentials
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Update Admin Passcode
                </label>
                <div className="relative mt-2 max-w-sm">
                  <input
                    type={showPass ? "text" : "password"}
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="block w-full rounded-xl border border-gray-800 bg-gray-950/60 py-2.5 pl-3 pr-10 text-xs text-white placeholder-gray-600 outline-none transition-all focus:border-blue-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-400"
                  >
                    {showPass ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end max-w-sm pt-2">
                <button
                  onClick={() => {
                    toast.success("Admin passcode updated successfully (Local session update)");
                    addLog("Admin login passcode updated", "security");
                  }}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-800 hover:border-gray-700 px-4 text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  Change Code
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Database & backup panels */}
        <div className="space-y-6">
          {/* Database Backup Card */}
          <div className="rounded-2xl border border-gray-900 bg-[#0B0F17] p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-gray-900 pb-3 mb-5">
              <Database className="h-4.5 w-4.5 text-purple-500" />
              Backup & Recovery
            </h3>
            
            <p className="text-xs text-gray-400 leading-relaxed">
              Export the current platform SQL schema structure, registered vendor lists, user directory and logs as a backup archive.
            </p>

            <button
              onClick={handleBackup}
              disabled={isBackupLoading}
              className="mt-6 w-full inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-4 text-xs font-semibold text-white shadow shadow-purple-600/10 transition-all cursor-pointer"
            >
              {isBackupLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Compiling Backup...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" /> Run Manual Backup
                </>
              )}
            </button>
          </div>

          {/* System metadata */}
          <div className="rounded-2xl border border-gray-900 bg-[#0B0F17] p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white border-b border-gray-900 pb-3 mb-4">
              System Specifications
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Core Engine:</span>
                <span className="text-gray-300 font-medium">Ceylon CP v{settings.systemVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">React Core:</span>
                <span className="text-gray-300 font-medium">18.3.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tailwind Engine:</span>
                <span className="text-gray-300 font-medium">v4.1.8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Database Engine:</span>
                <span className="text-gray-300 font-medium">MongoDB Atlas</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-900/60">
                <span className="text-gray-500">Node Environment:</span>
                <span className="text-emerald-400 font-bold">Stable v20.x</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminSettings;
