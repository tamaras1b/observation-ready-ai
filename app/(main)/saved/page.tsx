"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, FileText, BookOpen, Trash, Download, Edit, FolderOpen,
  CheckCircle, Loader2, Search, RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  getSavedLessonPlans, getSavedIPDPSessions,
  deleteLessonPlan, deleteIPDPSession,
  renameLessonPlan, formatDate,
} from "@/lib/storage";
import type { SavedLessonPlan, SavedIPDPSession } from "@/lib/storage";
import Link from "next/link";

// ─── Lesson Plan Cards ────────────────────────────────────────────────────────
function LessonPlanCard({ plan, onDelete, onExport }: {
  plan: SavedLessonPlan;
  onDelete: (id: string) => void;
  onExport: (plan: SavedLessonPlan) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName]       = useState(plan.name);
  const [exporting, setExporting] = useState(false);

  const handleRename = () => { renameLessonPlan(plan.id, name); setEditing(false); };

  const handleExport = async () => {
    setExporting(true);
    await onExport(plan);
    setExporting(false);
  };

  const { form } = plan;
  const phases = [form.hook, form.instruction, form.guidedPractice, form.independentPractice, form.closure].filter(Boolean).length;
  const diffCount = [form.ell, form.iep, form.gifted].filter(Boolean).length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}>
      <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                {editing ? (
                  <div className="flex gap-2 mb-1">
                    <Input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleRename()} className="h-7 text-sm" autoFocus />
                    <Button size="sm" className="h-7 px-2 bg-indigo-600 hover:bg-indigo-700 text-xs" onClick={handleRename}>Save</Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setEditing(false)}>Cancel</Button>
                  </div>
                ) : (
                  <h3 className="font-semibold text-slate-800 text-sm truncate">{plan.name}</h3>
                )}
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {form.subject    && <Badge className="text-xs bg-indigo-100 text-indigo-700 border-0">{form.subject}</Badge>}
                  {form.gradeLevel && <Badge className="text-xs bg-violet-100 text-violet-700 border-0">{form.gradeLevel}</Badge>}
                  {form.date       && <Badge variant="outline" className="text-xs">{form.date}</Badge>}
                  {form.duration   && <Badge variant="outline" className="text-xs">{form.duration} min</Badge>}
                </div>
                <div className="flex gap-3 mt-2">
                  {phases > 0    && <span className="text-xs text-slate-400">{phases}/5 phases</span>}
                  {diffCount > 0 && <span className="text-xs text-slate-400">{diffCount} diff. strategies</span>}
                  {form.standards && <span className="text-xs text-slate-400">Standards ✓</span>}
                </div>
                <p className="text-xs text-slate-400 mt-1">Saved {formatDate(plan.savedAt)}</p>
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title="Rename" onClick={() => setEditing(true)}>
                <Edit className="h-3.5 w-3.5 text-slate-400" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title="Delete" onClick={() => onDelete(plan.id)}>
                <Trash className="h-3.5 w-3.5 text-rose-400" />
              </Button>
            </div>
          </div>

          <Separator className="my-3" />

          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              onClick={handleExport}
              disabled={exporting}
              className="bg-indigo-600 hover:bg-indigo-700 gap-2 text-xs"
            >
              {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
              {exporting ? "Exporting..." : "Export PDF"}
            </Button>
            <Link href={`/lesson-plan?load=${plan.id}`}>
              <Button size="sm" variant="outline" className="gap-2 text-xs">
                <FolderOpen className="h-3.5 w-3.5" /> Load & Edit
              </Button>
            </Link>
          </div>

          {/* Quick preview */}
          {form.topic && (
            <div className="mt-3 bg-slate-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-500 mb-1">Topic</p>
              <p className="text-sm text-slate-700">{form.topic}</p>
              {form.objectives && (
                <><p className="text-xs font-semibold text-slate-500 mt-2 mb-1">Objectives (preview)</p>
                  <p className="text-xs text-slate-600 line-clamp-2">{form.objectives}</p></>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── IPDP Session Cards ───────────────────────────────────────────────────────
function IPDPSessionCard({ session, onDelete, onExport }: {
  session: SavedIPDPSession;
  onDelete: (id: string) => void;
  onExport: (session: SavedIPDPSession) => void;
}) {
  const [exporting, setExporting] = useState(false);
  const answeredCount = Object.values(session.responses).filter(v => v.trim()).length;

  const handleExport = async () => {
    setExporting(true);
    await onExport(session);
    setExporting(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}>
      <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 text-sm">{session.name}</h3>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <Badge className="text-xs bg-emerald-100 text-emerald-700 border-0">{answeredCount} response{answeredCount !== 1 ? "s" : ""}</Badge>
                  {session.smartGoals.length > 0 && (
                    <Badge className="text-xs bg-indigo-100 text-indigo-700 border-0">{session.smartGoals.length} goal{session.smartGoals.length !== 1 ? "s" : ""}</Badge>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">Saved {formatDate(session.savedAt)}</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title="Delete" onClick={() => onDelete(session.id)}>
              <Trash className="h-3.5 w-3.5 text-rose-400" />
            </Button>
          </div>

          {/* Goals preview */}
          {session.smartGoals.length > 0 && (
            <div className="mt-3 bg-emerald-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-emerald-700 mb-1">SMART Goals ({session.smartGoals.length})</p>
              {session.smartGoals.slice(0, 2).map((g, i) => (
                <p key={i} className="text-xs text-emerald-800 line-clamp-2 mb-1">• {g}</p>
              ))}
              {session.smartGoals.length > 2 && <p className="text-xs text-emerald-600">+{session.smartGoals.length - 2} more…</p>}
            </div>
          )}

          {/* Response previews */}
          {answeredCount > 0 && (
            <div className="mt-3 bg-slate-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-500 mb-2">Responses</p>
              <div className="space-y-1.5">
                {Object.entries(session.responses)
                  .filter(([, v]) => v.trim())
                  .slice(0, 2)
                  .map(([id, val]) => (
                    <p key={id} className="text-xs text-slate-600 line-clamp-1">• {val.slice(0, 100)}{val.length > 100 ? "…" : ""}</p>
                  ))}
                {answeredCount > 2 && <p className="text-xs text-slate-400">+{answeredCount - 2} more response{answeredCount - 2 !== 1 ? "s" : ""}…</p>}
              </div>
            </div>
          )}

          <Separator className="my-3" />

          <Button size="sm" onClick={handleExport} disabled={exporting || answeredCount === 0} className="bg-indigo-600 hover:bg-indigo-700 gap-2 text-xs">
            {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            {exporting ? "Exporting..." : "Export PDF"}
          </Button>
          {answeredCount === 0 && <p className="text-xs text-slate-400 mt-2">No responses recorded — nothing to export yet.</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SavedPlansPage() {
  const [lessonPlans, setLessonPlans]   = useState<SavedLessonPlan[]>([]);
  const [ipdpSessions, setIPDPSessions] = useState<SavedIPDPSession[]>([]);
  const [search, setSearch]             = useState("");
  const [activeTab, setActiveTab]       = useState("lessons");

  const loadData = useCallback(() => {
    setLessonPlans(getSavedLessonPlans());
    setIPDPSessions(getSavedIPDPSessions());
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDeleteLesson = (id: string) => {
    if (!confirm("Delete this lesson plan? This cannot be undone.")) return;
    deleteLessonPlan(id);
    loadData();
  };

  const handleDeleteIPDP = (id: string) => {
    if (!confirm("Delete this IPDP session? This cannot be undone.")) return;
    deleteIPDPSession(id);
    loadData();
  };

  const handleExportLesson = async (plan: SavedLessonPlan) => {
    const { exportLessonPlanPDF } = await import("@/lib/pdf-export");
    await exportLessonPlanPDF(plan.form, plan.name);
  };

  const handleExportIPDP = async (session: SavedIPDPSession) => {
    const { exportIPDPSessionPDF } = await import("@/lib/pdf-export");
    await exportIPDPSessionPDF(session);
  };

  const filteredLessons = lessonPlans.filter(p =>
    search === "" ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.form.subject || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.form.topic || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredIPDP = ipdpSessions.filter(s =>
    search === "" || s.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalSaved = lessonPlans.length + ipdpSessions.length;

  return (
    <div className="p-8 pb-24">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Saved Plans</h1>
              <p className="text-slate-500 text-sm">{totalSaved} item{totalSaved !== 1 ? "s" : ""} saved — export any as a formatted PDF.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={loadData} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {totalSaved === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto mt-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-slate-300" />
          </div>
          <h2 className="text-lg font-semibold text-slate-700 mb-2">No Saved Plans Yet</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">Create a lesson plan or complete an IPDP session, then click "Save" to store it here. You can export any saved item as a PDF at any time.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/lesson-plan"><Button className="bg-indigo-600 hover:bg-indigo-700 gap-2"><FileText className="h-4 w-4" /> Create Lesson Plan</Button></Link>
            <Link href="/ipdp"><Button variant="outline" className="gap-2"><BookOpen className="h-4 w-4" /> Open IPDP Assistant</Button></Link>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Search by name, subject, or topic..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="lessons">📝 Lesson Plans <Badge variant="secondary" className="ml-2 text-xs">{lessonPlans.length}</Badge></TabsTrigger>
              <TabsTrigger value="ipdp">📋 IPDP Sessions <Badge variant="secondary" className="ml-2 text-xs">{ipdpSessions.length}</Badge></TabsTrigger>
            </TabsList>

            <TabsContent value="lessons">
              {filteredLessons.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{search ? `No lesson plans matching "${search}"` : "No lesson plans saved yet."}</p>
                  {!search && <Link href="/lesson-plan"><Button variant="outline" size="sm" className="mt-3 gap-2"><FileText className="h-3.5 w-3.5" /> Create One</Button></Link>}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {filteredLessons.map(plan => (
                      <LessonPlanCard key={plan.id} plan={plan} onDelete={handleDeleteLesson} onExport={handleExportLesson} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>

            <TabsContent value="ipdp">
              {filteredIPDP.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{search ? `No IPDP sessions matching "${search}"` : "No IPDP sessions saved yet."}</p>
                  {!search && <Link href="/ipdp"><Button variant="outline" size="sm" className="mt-3 gap-2"><BookOpen className="h-3.5 w-3.5" /> Open IPDP Assistant</Button></Link>}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {filteredIPDP.map(session => (
                      <IPDPSessionCard key={session.id} session={session} onDelete={handleDeleteIPDP} onExport={handleExportIPDP} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
