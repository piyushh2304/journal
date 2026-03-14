"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  History, 
  BarChart3, 
  Sparkles, 
  Trees, 
  Waves, 
  Mountain, 
  Send,
  Loader2,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Tag
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Entry = {
  _id: string;
  userId: string;
  ambience: string;
  text: string;
  emotion: string | null;
  keywords: string[];
  summary: string | null;
  createdAt: string;
};

type Insights = {
  totalEntries: number;
  topEmotion: string;
  mostUsedAmbience: string;
  recentKeywords: string[];
};

export default function JournalPage() {
  const [userId] = useState("123"); // Requirement: "userId": "123"
  const [activeTab, setActiveTab] = useState<"new" | "history" | "insights">("new");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [text, setText] = useState("");
  const [ambience, setAmbience] = useState("forest");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEntries();
    fetchInsights();
  }, [userId]);

  const fetchEntries = async () => {
    try {
      const res = await fetch(`/api/journal/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch entries");
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInsights = async () => {
    try {
      const res = await fetch(`/api/journal/insights/${userId}`);
      const data = await res.json();
      setInsights(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const colors: Record<string, string> = {
      forest: "#021108",
      ocean: "#020b1a",
      mountain: "#0d0211",
      default: "#050505"
    };
    document.documentElement.style.setProperty("--background", colors[ambience] || colors.default);
  }, [ambience]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    console.log("Submitting entry for user:", userId, "ambience:", ambience);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ambience, text }),
      });
      
      console.log("Response status:", res.status);
      if (res.ok) {
        const data = await res.json();
        console.log("Success:", data);
        setText("");
        fetchEntries();
        fetchInsights();
        setActiveTab("history");
      } else {
        const errorData = await res.text();
        console.error("Failed to save entry:", errorData);
        alert("Failed to save entry. Check console for details.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Error connecting to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnalyze = async (entryId: string, entryText: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/journal/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: entryText }),
      });
      const analysis = await res.json();

      // In a real app, we'd update the DB. For this demo, let's update local state
      // Actually, let's just show it in the UI
      setEntries(prev => prev.map(entry => 
        entry._id === entryId ? { ...entry, ...analysis } : entry
      ));
      fetchInsights();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "new", label: "New Entry", icon: Plus },
    { id: "history", label: "History", icon: History },
    { id: "insights", label: "Insights", icon: BarChart3 },
  ];

  const ambiences = [
    { id: "forest", label: "Forest", icon: Trees, color: "text-emerald-400" },
    { id: "ocean", label: "Ocean", icon: Waves, color: "text-blue-400" },
    { id: "mountain", label: "Mountain", icon: Mountain, color: "text-purple-400" },
  ];

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden flex flex-col items-center py-12 px-4 transition-colors duration-1000 ease-in-out antialiased"
    )}>
      <div className="noise" />
      
      {/* Background Decorative Elements */}
      <AnimatePresence>
        <motion.div 
          key={ambience}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 pointer-events-none"
        >
          {ambience === "forest" && (
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[120px]" />
          )}
          {ambience === "ocean" && (
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
          )}
          {ambience === "mountain" && (
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
          )}
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-zinc-600/10 rounded-full blur-[120px]" />
        </motion.div>
      </AnimatePresence>

      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center relative z-10"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Arvya<span className="gradient-text">X</span>
          </h1>
        </div>
        <p className="text-zinc-400 font-medium">Capture your soul, analyze your peace.</p>
      </motion.header>

      {/* Tabs */}
      <nav className="glass rounded-2xl p-1.5 flex gap-1 mb-10 relative z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm",
              activeTab === tab.id 
                ? "bg-white/10 text-white shadow-sm" 
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="w-full max-w-2xl relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "new" && (
            <motion.div
              key="new"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-3xl p-8 border border-white/10 shadow-2xl"
            >
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <Plus className="w-6 h-6 text-blue-400" />
                New Session Journal
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-3">Select Ambience</label>
                  <div className="grid grid-cols-3 gap-4">
                    {ambiences.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setAmbience(item.id)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-500",
                          ambience === item.id 
                            ? "bg-white/10 border-white/20 ring-2 ring-white/10 shadow-lg" 
                            : "bg-transparent border-white/5 opacity-40 hover:opacity-80"
                        )}
                      >
                        <item.icon className={cn("w-6 h-6", item.color)} />
                        <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-3">Your Journey Notes</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="How was your immersion?..."
                    className="w-full aspect-video bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all resize-none text-lg leading-relaxed"
                  />
                </div>

                <button
                  disabled={isSubmitting || !text.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20"
                >
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5" />}
                  Save Entry
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {entries.length === 0 ? (
                <div className="glass rounded-3xl p-12 text-center border border-white/5">
                  <MessageSquare className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500 font-medium">No journals yet. Start your journey today.</p>
                </div>
              ) : (
                entries.map((entry) => (
                  <div key={entry._id} className="glass-card rounded-2xl p-6 border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5">
                          {entry.ambience === "forest" && <Trees className="w-5 h-5 text-emerald-400" />}
                          {entry.ambience === "ocean" && <Waves className="w-5 h-5 text-blue-400" />}
                          {entry.ambience === "mountain" && <Mountain className="w-5 h-5 text-purple-400" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase text-zinc-500 tracking-tighter">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </p>
                          <h3 className="font-semibold capitalize text-lg">{entry.ambience} Session</h3>
                        </div>
                      </div>
                      
                      {!entry.emotion ? (
                        <button
                          onClick={() => handleAnalyze(entry._id, entry.text)}
                          disabled={isLoading}
                          className="text-xs bg-white text-black font-bold px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors flex items-center gap-2"
                        >
                          {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          Analyze
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" />
                          {entry.emotion}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-zinc-300 leading-relaxed mb-4">{entry.text}</p>
                    
                    {entry.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                        {entry.keywords.map((kw, idx) => (
                          <span key={idx} className="text-[10px] font-bold uppercase tracking-widest bg-white/5 text-zinc-500 px-3 py-1 rounded-md">
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {entry.summary && (
                      <div className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                        <p className="text-sm text-blue-400 italic">"{entry.summary}"</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "insights" && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-3xl p-6 border border-white/5">
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Total Sessions</p>
                  <p className="text-4xl font-bold">{insights?.totalEntries || 0}</p>
                </div>
                <div className="glass rounded-3xl p-6 border border-white/5">
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Top Emotion</p>
                  <p className="text-4xl font-bold text-emerald-400 capitalize">{insights?.topEmotion || "..."}</p>
                </div>
              </div>
              
              <div className="glass rounded-3xl p-6 border border-white/5">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Atmospheric Frequency</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm"><Trees className="w-4 h-4 text-emerald-400" /> Forest</span>
                    <span className="font-bold">{insights?.mostUsedAmbience === "forest" ? "Primary" : "-"}</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[70%]" />
                  </div>
                </div>
              </div>

              <div className="glass rounded-3xl p-6 border border-white/5">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Mindset Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {insights?.recentKeywords.map((kw, idx) => (
                    <div key={idx} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium">
                      {kw}
                    </div>
                  ))}
                  {insights?.recentKeywords.length === 0 && <p className="text-zinc-600 text-sm italic">Analyze entries to see keywords</p>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 text-zinc-600 text-xs tracking-widest uppercase font-bold text-center">
        ArvyaX Systems &copy; 2026 // Neural Journal Engine
      </footer>
    </div>
  );
}
