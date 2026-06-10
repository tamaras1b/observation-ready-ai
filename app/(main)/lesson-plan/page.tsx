"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, RefreshCw, ChevronRight, CheckCircle, Printer, Zap, Loader2,
  BookOpen, X, Search, Save, Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SaveDialog } from "@/components/save-dialog";
import { saveLessonPlan } from "@/lib/storage";
import type { LessonForm } from "@/lib/storage";
import { cn } from "@/lib/utils";

const emptyForm: LessonForm = {
  teacher: "", subject: "", gradeLevel: "", date: "", duration: "45",
  topic: "", standards: "", objectives: "", materials: "",
  hook: "", instruction: "", guidedPractice: "", independentPractice: "",
  closure: "", assessment: "", ell: "", iep: "", gifted: "", anticipatedChallenges: "",
};

const SUBJECTS = ["English Language Arts","Mathematics","Science","Social Studies","Reading","Writing","History","Biology","Algebra","Geometry","Other"];
const GRADES   = ["Kindergarten","1st Grade","2nd Grade","3rd Grade","4th Grade","5th Grade","6th Grade","7th Grade","8th Grade","9th Grade","10th Grade","11th Grade","12th Grade"];
const DURATIONS = ["30","45","60","75","90"];

// ─── Standards Picker ─────────────────────────────────────────────────────────
function StandardsPicker({ onSelect }: { onSelect: (text: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [standards, setStandards] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    if (open) {
      try {
        const raw = localStorage.getItem("obs_ready_standards");
        if (raw) setStandards(JSON.parse(raw));
      } catch {}
    }
  }, [open]);

  const filtered = standards.filter(s =>
    search === "" || s.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Button type="button" variant="outline" size="sm" className="gap-2 text-xs" onClick={() => setOpen(true)}>
        <BookOpen className="h-3.5 w-3.5" /> Browse My Standards
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader><DialogTitle className="text-base">Select a Standard</DialogTitle></DialogHeader>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Search standards..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {standards.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>No standards saved yet. Go to "My Standards & Questions" to upload yours.</p>
            </div>
          ) : (
            <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
              {filtered.map(s => (
                <button key={s.id} onClick={() => { onSelect(s.text); setOpen(false); }}
                  className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all text-sm text-slate-700">
                  {s.text}
                </button>
              ))}
              {filtered.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No matches for "{search}"</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── AI Suggestion Panel ──────────────────────────────────────────────────────
interface AISuggestions {
  objectives?: string; hook?: string; instruction?: string;
  guidedPractice?: string; independentPractice?: string;
  closure?: string; assessment?: string; ell?: string; iep?: string; gifted?: string;
}

function AISuggestionPanel({ suggestions, onApply, onClose }: {
  suggestions: AISuggestions;
  onApply: (field: keyof LessonForm, value: string) => void;
  onClose: () => void;
}) {
  const fields: { key: keyof LessonForm; label: string; emoji: string }[] = [
    { key: "objectives", label: "Learning Objectives", emoji: "🎯" },
    { key: "hook", label: "Opening / Hook", emoji: "🔥" },
    { key: "instruction", label: "Direct Instruction", emoji: "📖" },
    { key: "guidedPractice", label: "Guided Practice", emoji: "🤝" },
    { key: "independentPractice", label: "Independent Practice", emoji: "✏️" },
    { key: "closure", label: "Closure", emoji: "🎓" },
    { key: "assessment", label: "Assessment", emoji: "📊" },
    { key: "ell", label: "ELL Support", emoji: "🌎" },
    { key: "iep", label: "IEP Support", emoji: "♿" },
    { key: "gifted", label: "Enrichment", emoji: "⭐" },
  ];
  const available = fields.filter(f => suggestions[f.key as keyof AISuggestions]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      className="fixed right-6 top-24 w-80 z-50 shadow-2xl rounded-2xl overflow-hidden border border-indigo-100"
    >
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-white" />
          <span className="text-white font-semibold text-sm">AI Suggestions Ready</span>
        </div>
        <button onClick={onClose} className="text-indigo-200 hover:text-white"><X className="h-4 w-4" /></button>
      </div>
      <div className="bg-white max-h-[70vh] overflow-y-auto">
        <div className="p-3 bg-indigo-50 border-b border-indigo-100">
          <p className="text-xs text-indigo-700 font-medium">Click "Apply" to insert into your form.</p>
        </div>
        <div className="divide-y divide-slate-100">
          {available.map(({ key, label, emoji }) => {
            const value = suggestions[key as keyof AISuggestions] as string;
            return (
              <div key={key} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{emoji} {label}</span>
                  <Button size="sm" className="h-6 px-2 text-xs bg-indigo-600 hover:bg-indigo-700" onClick={() => onApply(key, value)}>Apply</Button>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-4">{value}</p>
              </div>
            );
          })}
        </div>
        <div className="p-3 border-t border-slate-100">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-sm gap-2" onClick={() => {
            available.forEach(({ key }) => { const v = suggestions[key as keyof AISuggestions]; if (v) onApply(key, v as string); });
            onClose();
          }}>
            <CheckCircle className="h-4 w-4" /> Apply All Suggestions
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Lesson Preview ───────────────────────────────────────────────────────────
function Section({ title, content, prefix }: { title: string; content: string; prefix?: string }) {
  if (!content) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{title}</p>
      {prefix && <p className="text-xs text-slate-500 mb-1 italic">{prefix}</p>}
      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{content}</p>
    </div>
  );
}

function PhaseBlock({ emoji, title, time, content, color }: { emoji: string; title: string; time: string; content: string; color: string }) {
  return (
    <div className={`rounded-lg border p-3 ${color}`}>
      <div className="flex items-center gap-2 mb-1">
        <span>{emoji}</span><span className="text-sm font-semibold text-slate-700">{title}</span>
        <Badge variant="outline" className="text-xs ml-auto">{time}</Badge>
      </div>
      <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
        {content || <span className="italic text-slate-400">Not provided</span>}
      </p>
    </div>
  );
}

function LessonPreview({ form, onSave, onExportPDF, saveSuccess }: {
  form: LessonForm;
  onSave: () => void;
  onExportPDF: () => void;
  saveSuccess: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-slate-800">Generated Lesson Plan</h2>
        <div className="flex gap-2">
          <Button
            onClick={onSave}
            variant="outline"
            size="sm"
            className={cn("gap-2", saveSuccess && "border-emerald-500 text-emerald-600")}
          >
            {saveSuccess ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <Save className="h-4 w-4" />}
            {saveSuccess ? "Saved!" : "Save Plan"}
          </Button>
          <Button onClick={onExportPDF} size="sm" className="bg-indigo-600 hover:bg-indigo-700 gap-2">
            <Download className="h-4 w-4" /> Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
            <Printer className="h-4 w-4" /> Print
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="pt-6 pb-6 space-y-5">
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <h3 className="text-xl font-bold text-indigo-900">{form.topic || "Untitled Lesson"}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.subject    && <Badge className="bg-indigo-100 text-indigo-700 border-0">{form.subject}</Badge>}
              {form.gradeLevel && <Badge className="bg-violet-100 text-violet-700 border-0">{form.gradeLevel}</Badge>}
              {form.date       && <Badge variant="outline">{form.date}</Badge>}
              {form.duration   && <Badge variant="outline">{form.duration} min</Badge>}
            </div>
          </div>
          {form.teacher && <div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Teacher</p><p className="text-slate-700 mt-1">{form.teacher}</p></div>}
          <Separator />
          <Section title="Standards Alignment" content={form.standards} />
          <Section title="Learning Objectives" content={form.objectives} prefix="By the end of this lesson, students will be able to:" />
          <Section title="Materials & Resources" content={form.materials} />
          <Separator />
          <div>
            <p className="text-sm font-bold text-slate-700 mb-3">📋 Lesson Sequence</p>
            <div className="space-y-3">
              <PhaseBlock emoji="🔥" title="Opening / Hook"        time="5–10 min"  content={form.hook}                color="bg-orange-50 border-orange-200" />
              <PhaseBlock emoji="📖" title="Direct Instruction"    time="10–15 min" content={form.instruction}         color="bg-blue-50 border-blue-200" />
              <PhaseBlock emoji="🤝" title="Guided Practice"       time="10–15 min" content={form.guidedPractice}      color="bg-indigo-50 border-indigo-200" />
              <PhaseBlock emoji="✏️" title="Independent Practice"  time="10–15 min" content={form.independentPractice} color="bg-violet-50 border-violet-200" />
              <PhaseBlock emoji="🎯" title="Closure"               time="5 min"     content={form.closure}             color="bg-emerald-50 border-emerald-200" />
            </div>
          </div>
          <Separator />
          <Section title="Assessment Strategy" content={form.assessment} />
          <div>
            <p className="text-sm font-bold text-slate-700 mb-3">♿ Differentiation Strategies</p>
            <div className="space-y-2">
              {[["ELL Students", form.ell], ["IEP / Special Needs", form.iep], ["Enrichment / Gifted", form.gifted]].map(([label, val]) => (
                <div key={label} className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                  <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
                  <p className="text-sm text-slate-700">{val || <span className="italic text-slate-400">Not specified</span>}</p>
                </div>
              ))}
            </div>
          </div>
          {form.anticipatedChallenges && (<><Separator /><Section title="Anticipated Challenges & Solutions" content={form.anticipatedChallenges} /></>)}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LessonPlanPage() {
  const [form, setForm]             = useState<LessonForm>(emptyForm);
  const [generated, setGenerated]   = useState(false);
  const [activeTab, setActiveTab]   = useState("build");
  const [aiLoading, setAiLoading]   = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestions | null>(null);
  const [aiError, setAiError]       = useState("");
  const [saveOpen, setSaveOpen]     = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const update = (field: keyof LessonForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));
  const updateSelect = (field: keyof LessonForm) => (val: string) =>
    setForm(prev => ({ ...prev, [field]: val }));
  const applyAI = (field: keyof LessonForm, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));
  const appendStandard = (text: string) =>
    setForm(prev => ({ ...prev, standards: prev.standards ? prev.standards + "\n" + text : text }));

  const handleAISuggest = async () => {
    if (!form.subject || !form.gradeLevel || !form.topic) {
      setAiError("Please fill in Subject, Grade Level, and Topic first.");
      return;
    }
    setAiError("");
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "full_lesson", subject: form.subject, grade: form.gradeLevel, topic: form.topic, standards: form.standards }),
      });
      const data = await res.json();
      if (data.success) setAiSuggestions(data.suggestions);
      else {
        const msg = data?.error || "Could not generate suggestions. Please try again.";
        setAiError(msg);
      }
    } catch { setAiError("Network error. Please check your connection and try again."); }
    setAiLoading(false);
  };

  const handleSave = (name: string) => {
    saveLessonPlan(name, form);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportPDF = async () => {
    setPdfLoading(true);
    try {
      const { exportLessonPlanPDF } = await import("@/lib/pdf-export");
      await exportLessonPlanPDF(form, form.topic || "Lesson Plan");
    } catch (e) {
      console.error(e);
    }
    setPdfLoading(false);
  };

  const handleReset = () => {
    setForm(emptyForm);
    setGenerated(false);
    setActiveTab("build");
    setAiSuggestions(null);
    setSaveSuccess(false);
  };

  return (
    <div className="p-8 pb-24">
      <AnimatePresence>
        {aiSuggestions && (
          <AISuggestionPanel suggestions={aiSuggestions} onApply={applyAI} onClose={() => setAiSuggestions(null)} />
        )}
      </AnimatePresence>

      <SaveDialog
        open={saveOpen}
        onOpenChange={setSaveOpen}
        defaultName={form.topic || "My Lesson Plan"}
        onSave={handleSave}
        type="lesson-plan"
      />

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Lesson Plan Builder</h1>
        </div>
        <p className="text-slate-500 text-sm ml-12">Build an observation-ready lesson plan with AI suggestions — then save or export as PDF.</p>
      </div>

      {/* AI Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-xl p-4 mb-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-indigo-900">AI Lesson Suggestions</p>
          <p className="text-xs text-indigo-700 mt-0.5">Fill in Subject, Grade, and Topic — then click to auto-populate the entire plan.</p>
        </div>
        <Button onClick={handleAISuggest} disabled={aiLoading} className="bg-indigo-600 hover:bg-indigo-700 gap-2 flex-shrink-0">
          {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
          {aiLoading ? "Generating..." : "Get AI Suggestions"}
        </Button>
      </div>

      {aiError && (
          <div className="mb-4 bg-rose-50 border border-rose-200 rounded-xl p-4 flex gap-3 items-start">
            <span className="text-rose-400 text-lg flex-shrink-0">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-rose-700">AI Suggestion Error</p>
              <p className="text-sm text-rose-600 mt-0.5">{aiError}</p>
            </div>
            <button onClick={() => setAiError("")} className="ml-auto text-rose-300 hover:text-rose-500 flex-shrink-0 text-lg leading-none">&times;</button>
          </div>
        )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="build">📝 Build Plan</TabsTrigger>
          <TabsTrigger value="preview" disabled={!generated}>👁️ Preview & Export</TabsTrigger>
        </TabsList>

        <TabsContent value="build">
          <div className="space-y-6">
            {/* Step 1 */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-base text-slate-700 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs flex items-center justify-center font-bold">1</span>
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Teacher Name</Label><Input placeholder="Your name" value={form.teacher} onChange={update("teacher")} /></div>
                <div className="space-y-2"><Label>Lesson Topic / Title <span className="text-rose-500">*</span></Label><Input placeholder="e.g. Introduction to Fractions" value={form.topic} onChange={update("topic")} /></div>
                <div className="space-y-2">
                  <Label>Subject <span className="text-rose-500">*</span></Label>
                  <Select onValueChange={updateSelect("subject")} value={form.subject}>
                    <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Grade Level <span className="text-rose-500">*</span></Label>
                  <Select onValueChange={updateSelect("gradeLevel")} value={form.gradeLevel}>
                    <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                    <SelectContent>{GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Date of Lesson</Label><Input type="date" value={form.date} onChange={update("date")} /></div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select onValueChange={updateSelect("duration")} value={form.duration}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{DURATIONS.map(d => <SelectItem key={d} value={d}>{d} minutes</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-base text-slate-700 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs flex items-center justify-center font-bold">2</span>
                  Standards & Objectives
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between"><Label>Standards Alignment</Label><StandardsPicker onSelect={appendStandard} /></div>
                  <Textarea placeholder="e.g. CCSS.ELA-LITERACY.RI.5.1 — Quote accurately from a text..." value={form.standards} onChange={update("standards")} rows={3} className="resize-none" />
                </div>
                <div className="space-y-2">
                  <Label>Learning Objectives</Label>
                  <Textarea placeholder={"By the end of this lesson, students will be able to:\n• Identify main idea and supporting details\n• Summarize text using key vocabulary"} value={form.objectives} onChange={update("objectives")} rows={4} className="resize-none" />
                  <p className="text-xs text-slate-400">💡 AI generates Bloom's Taxonomy-aligned objectives. Click "Get AI Suggestions" above.</p>
                </div>
                <div className="space-y-2">
                  <Label>Materials & Resources</Label>
                  <Textarea placeholder="e.g. Chromebooks, printed passages, graphic organizers..." value={form.materials} onChange={update("materials")} rows={2} className="resize-none" />
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-base text-slate-700 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs flex items-center justify-center font-bold">3</span>
                  Lesson Sequence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: "hook",               label: "🔥 Opening / Hook",         placeholder: "Capture student attention and activate prior knowledge (5–10 min)", rows: 3 },
                  { id: "instruction",         label: "📖 Direct Instruction",      placeholder: "What will you model or teach directly? (10–15 min)", rows: 3 },
                  { id: "guidedPractice",      label: "🤝 Guided Practice",         placeholder: "Activity done WITH your guidance (10–15 min)", rows: 3 },
                  { id: "independentPractice", label: "✏️ Independent Practice",    placeholder: "What students do independently (10–15 min)", rows: 3 },
                  { id: "closure",             label: "🎯 Closure / Wrap-Up",       placeholder: "Summarize learning and check for understanding (5 min)", rows: 2 },
                ].map(({ id, label, placeholder, rows }) => (
                  <div key={id} className="space-y-2">
                    <Label>{label}</Label>
                    <Textarea placeholder={placeholder} value={form[id as keyof LessonForm]} onChange={update(id as keyof LessonForm)} rows={rows} className="resize-none" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-base text-slate-700 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs flex items-center justify-center font-bold">4</span>
                  Assessment & Differentiation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: "assessment",            label: "Assessment Strategy",              placeholder: "Exit ticket, formative quiz, observation checklist..." },
                  { id: "ell",                    label: "ELL / Language Support",           placeholder: "Sentence frames, visual supports, bilingual glossary..." },
                  { id: "iep",                    label: "IEP / Special Needs Support",      placeholder: "Extended time, graphic organizers, read-aloud..." },
                  { id: "gifted",                 label: "Enrichment / Gifted Extension",    placeholder: "Extension project, higher-order questioning..." },
                  { id: "anticipatedChallenges",  label: "Anticipated Challenges & Solutions", placeholder: "Students may struggle with vocabulary — pre-teach key terms..." },
                ].map(({ id, label, placeholder }) => (
                  <div key={id} className="space-y-2">
                    <Label>{label}</Label>
                    <Textarea placeholder={placeholder} value={form[id as keyof LessonForm]} onChange={update(id as keyof LessonForm)} rows={3} className="resize-none" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-3 pb-8 flex-wrap">
              <Button onClick={() => { setGenerated(true); setActiveTab("preview"); }} className="bg-indigo-600 hover:bg-indigo-700 gap-2 px-6">
                <CheckCircle className="h-4 w-4" /> Generate Lesson Plan <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => setSaveOpen(true)} className="gap-2">
                <Save className="h-4 w-4" /> Save Plan
              </Button>
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RefreshCw className="h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <AnimatePresence>
            {generated && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <LessonPreview
                  form={form}
                  onSave={() => setSaveOpen(true)}
                  onExportPDF={handleExportPDF}
                  saveSuccess={saveSuccess}
                />
                <div className="mt-6 flex gap-3 pb-8">
                  <Button variant="outline" onClick={() => setActiveTab("build")} className="gap-2">
                    <RefreshCw className="h-4 w-4" /> Edit Plan
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
}
