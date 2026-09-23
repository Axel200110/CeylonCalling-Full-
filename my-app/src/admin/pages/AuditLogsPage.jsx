import React, { useEffect, useState } from "react";
import { FileText, Search, Filter, Shield, Clock, User, ArrowDownRight } from "lucide-react";
import { useAdminStore } from "../store/adminStore";
import toast from "react-hot-toast";

const AuditLogsPage = () => {
  const { auditLogs, fetchAuditLogs } = useAdminStore();
  const [targetTypeFilter, setTargetTypeFilter] = useState("");
  const [actionSearch, setActionSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadLogs();
  }, [targetTypeFilter]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      await fetchAuditLogs({ targetType: targetTypeFilter });
    } catch {
      toast.error("Failed to load audit trail");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = auditLogs.filter((l) => {
    const q = actionSearch.toLowerCase();
    return (
      l.action.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      (l.adminEmail && l.adminEmail.toLowerCase().includes(q)) ||
      (l.targetName && l.targetName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
          <FileText className="h-6 w-6 text-emerald-400" />
          System & Administrative Audit Logs
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Immutable ledger of security actions, merchant approvals, review moderation, and system configurations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0B0F17] p-4 rounded-2xl border border-gray-900 shadow-xl">
        <div className="relative w-full md:w-96">
          <Search className="h-4 w-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, target, or administrator..."
            value={actionSearch}
            onChange={(e) => setActionSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {[
            { label: "All Records", val: "" },
            { label: "Shops", val: "shop" },
            { label: "Reviews", val: "review" },
            { label: "Warnings", val: "warning" },
            { label: "Auth / Security", val: "auth" },
            { label: "Backups", val: "backup" },
            { label: "System", val: "system" },
          ].map((cat) => (
            <button
              key={cat.val}
              onClick={() => setTargetTypeFilter(cat.val)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                targetTypeFilter === cat.val
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "bg-gray-950 text-gray-400 hover:text-white border border-gray-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-gray-900 bg-[#0B0F17] shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="text-center py-20 text-gray-500 text-xs">Loading audit ledger...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Shield className="h-10 w-10 text-gray-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-300">No audit events found</p>
            <p className="text-xs text-gray-500 mt-1">Actions performed by administrators will appear here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-900 bg-gray-950/40 text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Performed By</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900 text-gray-300">
                {filtered.map((log) => (
                  <tr key={log._id || log.id} className="hover:bg-gray-900/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      {log.action}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-gray-800 text-gray-300">
                        {log.targetType}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <p className="font-medium text-white">{log.description}</p>
                      {log.reason && (
                        <p className="text-[11px] text-amber-400/80 mt-0.5 italic">
                          Reason: {log.reason}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {log.adminEmail || "system"}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-500">
                      {log.ipAddress || "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogsPage;
