"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Trash, CheckCircle, Plus, Search, BookOpen, HelpCircle, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface LibraryItem {
  id: string;
  text: string;
  source: string;
  addedAt: string;
}

const STORAGE_KEY_STANDARDS = "obs_ready_standards";
const STORAGE_KEY_QUESTIONS = "obs_ready_questions";

function useLibrary(key: string) {
  const [items, setItems] = useState<LibraryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, [key]);

  const save = (updated: LibraryItem[]) => {
    setItems(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const add = (texts: string[], source: string) => {
    const newItems: LibraryItem[] = texts.map((text) => ({
      id: crypto.randomUUID(),
      text,
      source,
      addedAt: new Date().toISOString(),
    }));
    save([...items, ...newItems]);
    return newItems.length;
  };

  const remove = (id: string) => save(items.filter((i) => i.id !== id));

  const clear = () => save([]);

  return { items, add, remove, clear };
}

function UploadSection({
  title,
  icon: Icon,
  color,
  storageKey,
  placeholder,
  itemLabel,
}: {
  title: string;
  icon: React.ElementType;
  color: string;
  storageKey: string;
  placeholder: string;
  itemLabel: string;
}) {
  const { items, add, remove, clear } = useLibrary(storageKey);
  const [pastedText, setPastedText] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handlePaste = async () => {
    if (!pastedText.trim()) return showMessage("Please enter some text first.");
    setUploading(true);
    const formData = new FormData();
    formData.append("text", pastedText);
    const res = await fetch("/api/upload-document", { method: "POST", body: formData });
    const data = await res.json();
    if (data.success) {
      const count = add(data.items, sourceName || "Pasted text");
      showMessage(`✅ Added ${count} ${itemLabel}(s) to your library.`);
      setPastedText("");
      setSourceName("");
    } else {
      showMessage(`❌ ${data.error}`);
    }
    setUploading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload-document", { method: "POST", body: formData });
    const data = await res.json();
    if (data.success) {
      const count = add(data.items, file.name);
      showMessage(`✅ Imported ${count} ${itemLabel}(s) from ${file.name}.`);
    } else {
      showMessage(`❌ ${data.error}`);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const copyItem = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const filtered = items.filter(
    (i) =>
      search === "" ||
      i.text.toLowerCase().includes(search.toLowerCase()) ||
      i.source.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Upload Card */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-slate-700 flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            Add {itemLabel}s
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Source Name <span className="text-slate-400 text-xs">(optional — e.g. "FL State Standards Grade 4")</span></Label>
            <Input
              placeholder="e.g. NGSSS, Common Core, District IPDP Form..."
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Paste Text</Label>
            <Textarea
              placeholder={placeholder}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              rows={5}
              className="resize-none text-sm"
            />
            <p className="text-xs text-slate-400">Each line will be saved as a separate {itemLabel}.</p>
          </div>
          <div className="flex gap-3 items-center">
            <Button
              onClick={handlePaste}
              disabled={uploading || !pastedText.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              {uploading ? "Adding..." : `Add to Library`}
            </Button>
            <div className="relative">
              <Button variant="outline" onClick={() => fileRef.current?.click()} className="gap-2">
                <Upload className="h-4 w-4" /> Upload File (.txt, .csv)
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.csv,.md"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-medium text-emerald-600"
            >
              {message}
            </motion.p>
          )}
        </CardContent>
      </Card>

      {/* Library */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-slate-700">
              Your {title} Library
              <Badge variant="outline" className="ml-2 text-xs">{items.length} saved</Badge>
            </CardTitle>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                onClick={() => { if (confirm("Clear all? This cannot be undone.")) clear(); }}
              >
                <Trash className="h-3 w-3 mr-1" /> Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Icon className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No {itemLabel}s saved yet.</p>
              <p className="text-xs mt-1">Paste or upload above to get started.</p>
            </div>
          ) : (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={`Search your ${itemLabel}s...`}
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                <AnimatePresence>
                  {filtered.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="group flex items-start gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 leading-relaxed">{item.text}</p>
                        <p className="text-xs text-slate-400 mt-1">Source: {item.source}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyItem(item.id, item.text)}
                          className="p-1 rounded hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Copy"
                        >
                          {copied === item.id ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          onClick={() => remove(item.id)}
                          className="p-1 rounded hover:bg-rose-100 text-slate-400 hover:text-rose-500 transition-colors"
                          title="Delete"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filtered.length === 0 && search && (
                  <p className="text-sm text-slate-400 text-center py-4">No matches found for "{search}"</p>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function StandardsPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-violet-500 flex items-center justify-center">
            <Upload className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">My Standards & Questions</h1>
        </div>
        <p className="text-slate-500 text-sm ml-12">Upload your state/district standards and custom IPDP questions. They'll be available throughout the app.</p>
      </div>

      {/* Tips */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
        <div className="flex gap-3">
          <CheckCircle className="h-4 w-4 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-indigo-800 mb-1">How to use this library</p>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• Paste state standards or your district's standards list — one per line</li>
              <li>• Upload a <strong>.txt or .csv file</strong> from your standards document</li>
              <li>• Add your district's IPDP questions so they appear in the IPDP Assistant</li>
              <li>• Use the copy button (🗒️) on any item to copy it directly into your lesson plan or IPDP form</li>
            </ul>
          </div>
        </div>
      </div>

      <Tabs defaultValue="standards">
        <TabsList className="mb-6">
          <TabsTrigger value="standards">📚 Standards Library</TabsTrigger>
          <TabsTrigger value="questions">❓ Custom IPDP Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="standards">
          <UploadSection
            title="Standards"
            icon={BookOpen}
            color="bg-indigo-500"
            storageKey={STORAGE_KEY_STANDARDS}
            itemLabel="standard"
            placeholder={"Paste your standards here — one per line. Example:\nMAAFS.7.RP.1.1 — Compute unit rates associated with ratios of fractions\nMAAFS.7.RP.1.2 — Recognize and represent proportional relationships\nELA.7.R.1.1 — Analyze the impact of setting on character and plot"}
          />
        </TabsContent>

        <TabsContent value="questions">
          <UploadSection
            title="IPDP Questions"
            icon={HelpCircle}
            color="bg-emerald-500"
            storageKey={STORAGE_KEY_QUESTIONS}
            itemLabel="question"
            placeholder={"Paste your district's IPDP questions here — one per line. Example:\nWhat is your primary professional growth goal for this year?\nHow does your goal connect to your school improvement plan?\nWhat professional learning will you pursue to meet your goal?\nHow will you document your progress?"}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
