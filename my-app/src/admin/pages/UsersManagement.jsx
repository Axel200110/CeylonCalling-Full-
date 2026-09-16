import React, { useState } from "react";
import { 
  Users, Search, UserCheck, UserX, Trash2, 
  Mail, Calendar, Key, CheckCircle, ShieldAlert 
} from "lucide-react";
import { useAdminStore } from "../store/adminStore";
import toast from "react-hot-toast";

const UsersManagement = () => {
  const { users, updateUserStatus, deleteUser } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    updateUserStatus(id, nextStatus);
    if (nextStatus === "suspended") {
      toast.error("User account suspended");
    } else {
      toast.success("User account activated!");
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this user account? This cannot be undone.")) {
      deleteUser(id);
      toast.success("User account removed");
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = users.filter((u) => u.status === "active").length;
  const suspendedCount = users.filter((u) => u.status === "suspended").length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Users Directory</h2>
          <p className="text-xs text-gray-400 mt-1">Audit, suspend, activate or delete registered user accounts.</p>
        </div>
      </div>

      {/* Directory Metrics Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-900 bg-[#0B0F17] p-4 flex items-center justify-between shadow">
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Users</p>
            <p className="text-xl font-bold text-white mt-1">{users.length}</p>
          </div>
          <Users className="h-8 w-8 text-blue-500 bg-blue-500/10 rounded-lg p-1.5" />
        </div>
        <div className="rounded-xl border border-gray-900 bg-[#0B0F17] p-4 flex items-center justify-between shadow">
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Active Accounts</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">{activeCount}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-emerald-500 bg-emerald-500/10 rounded-lg p-1.5" />
        </div>
        <div className="rounded-xl border border-gray-900 bg-[#0B0F17] p-4 flex items-center justify-between shadow">
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Suspended Accounts</p>
            <p className="text-xl font-bold text-rose-400 mt-1">{suspendedCount}</p>
          </div>
          <ShieldAlert className="h-8 w-8 text-rose-500 bg-rose-500/10 rounded-lg p-1.5" />
        </div>
      </div>

      {/* Search and Filters panel */}
      <div className="flex flex-col md:flex-row justify-between gap-4 p-4 rounded-2xl border border-gray-900 bg-[#0B0F17] shadow-lg">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-800 bg-gray-950/60 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 outline-none transition-all focus:border-blue-500/50"
          />
        </div>
      </div>

      {/* Users table */}
      <div className="rounded-2xl border border-gray-900 bg-[#0B0F17] overflow-hidden shadow-xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-900 bg-gray-950/40 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-6">User specifications</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6">Join Date</th>
                <th className="py-4 px-6">Account Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500 font-medium">
                    No users found matching query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-900/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-gray-850 border border-gray-850 flex items-center justify-center font-bold text-white shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white">{user.name}</p>
                          <p className="text-[9px] text-gray-500 mt-0.5">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-gray-300">
                        <Mail className="h-3.5 w-3.5 text-gray-500" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-gray-300">
                        <Calendar className="h-3.5 w-3.5 text-gray-500" />
                        <span>{user.joinDate}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        user.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.status === "active" ? (
                          <button
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            className="p-1.5 rounded-lg border border-gray-850 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                            title="Suspend User"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            className="p-1.5 rounded-lg border border-gray-850 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                            title="Activate User"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 rounded-lg border border-gray-850 text-gray-500 hover:text-rose-400 hover:bg-rose-500/5 transition-colors"
                          title="Delete User Account"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default UsersManagement;
