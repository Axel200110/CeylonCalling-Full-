import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Send, MessageSquare, User, Loader2, RefreshCw, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

const AdminMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeOwnerId, setActiveOwnerId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef(null);
  const location = useLocation();

  const getShopPhoto = (photo) => {
    if (!photo) return "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&auto=format&fit=crop&q=60";
    if (photo.startsWith("http")) return photo;
    return photo;
  };

  const fetchConversations = async (silent = false) => {
    if (!silent) setLoadingList(true);
    try {
      const res = await fetch("/api/messages/admin/conversations", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations);
        
        // Handle router state selection if navigating from shops management
        if (location.state?.selectOwnerId && !silent && !activeOwnerId) {
          setActiveOwnerId(location.state.selectOwnerId);
          // clear history state
          window.history.replaceState({}, document.title);
        }
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    } finally {
      if (!silent) setLoadingList(false);
    }
  };

  const fetchChat = async (ownerId, silent = false) => {
    if (!silent) setLoadingChat(true);
    try {
      const res = await fetch(`/api/messages/admin/${ownerId}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to fetch chat:", err);
    } finally {
      if (!silent) setLoadingChat(false);
    }
  };

  // Poll active chats list and chat thread
  useEffect(() => {
    fetchConversations();
    const interval = setInterval(() => {
      fetchConversations(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeOwnerId) {
      fetchChat(activeOwnerId);
      // Mark read locally in list
      setConversations((prev) =>
        prev.map((c) => (c.shopOwnerId === activeOwnerId ? { ...c, unreadCount: 0 } : c))
      );
    } else {
      setMessages([]);
    }
  }, [activeOwnerId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Background chat thread polling
  useEffect(() => {
    if (!activeOwnerId) return;
    const chatInterval = setInterval(() => {
      fetchChat(activeOwnerId, true);
    }, 5000);
    return () => clearInterval(chatInterval);
  }, [activeOwnerId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeOwnerId || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopOwnerId: activeOwnerId, content: newMessage.trim() }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
        fetchConversations(true); // update last message in sidebar
      } else {
        toast.error(data.message || "Failed to send message.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const activeConversation = conversations.find((c) => c.shopOwnerId === activeOwnerId);

  return (
    <div className="flex h-[calc(100vh-4rem)] border border-gray-900 bg-[#0B0F17] rounded-2xl overflow-hidden shadow-2xl text-gray-200">
      
      {/* Sidebar List */}
      <div className="w-80 border-r border-gray-900 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-900 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            Partner Chats
          </h2>
          <button
            onClick={() => fetchConversations()}
            className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-900/60 scrollbar-hide">
          {loadingList && conversations.length === 0 ? (
            <div className="h-full flex items-center justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-500">
              No registered merchants / partners found.
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.shopOwnerId === activeOwnerId;
              return (
                <button
                  key={conv.shopOwnerId}
                  onClick={() => setActiveOwnerId(conv.shopOwnerId)}
                  className={`w-full text-left p-4 flex gap-3 transition-colors ${
                    isActive ? "bg-blue-600/10 border-l-4 border-blue-500" : "hover:bg-gray-900/40"
                  }`}
                >
                  <img
                    src={getShopPhoto(conv.shopPhoto)}
                    alt={conv.shopName}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-gray-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="text-xs font-bold text-white truncate">{conv.shopName}</h4>
                      {conv.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-full shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5 truncate font-medium">{conv.ownerName}</p>
                    <p className="text-[10px] text-gray-500 mt-1 truncate italic">
                      {conv.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Thread */}
      <div className="flex-1 flex flex-col bg-[#070A0F]">
        {activeOwnerId ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-900 bg-[#0B0F17] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={getShopPhoto(activeConversation?.shopPhoto)}
                  alt={activeConversation?.shopName}
                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-gray-800"
                />
                <div>
                  <h3 className="text-xs font-bold text-white">{activeConversation?.shopName}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5 font-medium">
                    Owner: {activeConversation?.ownerName} ({activeConversation?.ownerEmail})
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-hide">
              {loadingChat ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="space-y-3.5">
                  {messages.map((msg) => {
                    // Check if sender is admin or shop owner
                    const isSelf = msg.sender !== activeOwnerId;
                    return (
                      <div key={msg._id} className={`flex ${isSelf ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[70%] rounded-xl p-3 shadow text-xs leading-relaxed ${
                            isSelf
                              ? "bg-blue-600 text-white rounded-tr-none"
                              : "bg-[#0F141E] border border-gray-800 text-gray-200 rounded-tl-none"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          <div className="flex items-center justify-end gap-1.5 mt-1.5">
                            <span className="text-[9px] text-gray-400 font-medium">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Bar */}
            <footer className="p-4 border-t border-gray-900 bg-[#0B0F17] shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a response to this merchant partner..."
                  disabled={sending}
                  className="flex-1 rounded-xl border border-gray-800 bg-gray-950 p-3 text-xs text-white outline-none focus:border-blue-500 transition"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Send</span>
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 shadow mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-white">No conversation selected</h3>
            <p className="text-xs text-gray-500 max-w-xs mt-1.5 leading-relaxed">
              Select a merchant from the left sidebar to start direct private messaging.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
