import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCheck,
  Clock,
  Headphones,
  Info,
  Loader2,
  Lock,
  MessageSquare,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Zap
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import SideNavbar from "../components/SideNavbar";
import { useAuthStore } from "../store/authStore";

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const user = useAuthStore((state) => state.user);

  const fetchMessages = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/messages/partner", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Poll for new messages every 5 seconds
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Smooth auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageContent = newMessage.trim();
    setSending(true);

    try {
      const res = await fetch("/api/messages/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageContent }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
      } else {
        toast.error(data.message || "Failed to deliver message.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#07090E] text-slate-100 font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-300 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 right-10 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Side Navigation Bar */}
      <SideNavbar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 md:pl-64">
        {/* ================= HEADER CONTROL BAR ================= */}
        <header className="h-20 shrink-0 border-b border-white/[0.08] bg-[#07090E]/80 backdrop-blur-xl px-6 md:px-8 flex items-center justify-between shadow-2xl relative">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-600" />

          <div className="flex items-center gap-4 pl-2">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/5">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#07090E] rounded-full shadow-md shadow-emerald-500/50" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">
                  Direct Support Channel
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3" /> Priority Thread
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal mt-0.5 flex items-center gap-1.5">
                <span>Ceylon Calling Administration</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-medium">Encrypted & Direct</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[11px] text-slate-400 font-medium">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>SLA Response: &lt; 2 hrs</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fetchMessages()}
              disabled={loading}
              className="p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08] active:bg-white/[0.1] transition shadow-sm disabled:opacity-40"
              title="Refresh conversation thread"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
            </motion.button>
          </div>
        </header>

        {/* ================= MESSAGE THREAD WORKSPACE ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
          {loading && messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <span className="text-xs font-medium text-slate-400 tracking-wide">
                Decrypting communication thread...
              </span>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-400 shadow-2xl mb-4 relative">
                <Sparkles className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">No Previous Encounters</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                You have an open direct line with Ceylon Calling platform administration. Send a message below to request operational assistance or account guidance.
              </p>
              <div className="mt-6 flex items-center gap-2 text-[11px] text-slate-400 bg-white/[0.02] border border-white/[0.06] px-3.5 py-1.5 rounded-full">
                <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Response times are typically under 2 hours.</span>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-5 pb-4">
              {/* Channel Security Banner */}
              <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[11px] text-slate-400 font-medium w-fit mx-auto shadow-sm">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Messages end-to-end encrypted with Ceylon Calling Core</span>
              </div>

              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <MessageBubble key={msg._id || idx} msg={msg} currentUserId={user?._id} />
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ================= INPUT ACTION BAR ================= */}
        <footer className="p-4 sm:p-5 bg-[#07090E]/90 border-t border-white/[0.08] backdrop-blur-2xl shrink-0">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message to Ceylon Calling Admin..."
                disabled={sending}
                className="w-full pl-4 pr-10 py-3.5 rounded-2xl bg-slate-900/80 border border-white/[0.08] text-xs font-normal text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner disabled:opacity-50"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20 border border-emerald-400/20 disabled:opacity-40 disabled:pointer-events-none shrink-0"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </motion.button>
          </form>
        </footer>
      </main>
    </div>
  );
};

/* ================= MESSAGE BUBBLE ITEM ================= */
const MessageBubble = ({ msg, currentUserId }) => {
  // Determine if the message was sent by current shopowner user
  const isSelf = msg.sender === currentUserId || msg.sender?._id === currentUserId;

  const formattedTime = msg.createdAt
    ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "Just now";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
    >
      <div className="max-w-[85%] sm:max-w-[70%] space-y-1">
        {/* Sender Designation Label */}
        <div className={`flex items-center gap-1.5 px-1 text-[10px] font-semibold text-slate-400 ${isSelf ? "justify-end" : "justify-start"}`}>
          {!isSelf && <Headphones className="w-3 h-3 text-teal-400" />}
          <span>{isSelf ? "You" : "Ceylon Calling Admin"}</span>
        </div>

        {/* Bubble Frame */}
        <div
          className={`p-4 rounded-3xl text-xs leading-relaxed shadow-xl border backdrop-blur-md relative overflow-hidden ${
            isSelf
              ? "bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-400/20 rounded-br-none"
              : "bg-white/[0.04] text-slate-200 border-white/[0.08] rounded-bl-none"
          }`}
        >
          <p className="whitespace-pre-wrap font-normal leading-relaxed">{msg.content}</p>

          <div className={`flex items-center gap-1 mt-2.5 text-[9px] ${isSelf ? "text-emerald-200/80 justify-end" : "text-slate-400 justify-end"}`}>
            <Clock className="w-2.5 h-2.5 opacity-70" />
            <span>{formattedTime}</span>
            {isSelf && <CheckCheck className="w-3 h-3 text-emerald-300 ml-0.5" />}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessagesPage;