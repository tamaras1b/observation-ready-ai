"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, ChevronDown, ChevronUp, Copy, CheckCircle, Lightbulb,
  Target, TrendingUp, Star, RefreshCw, Zap, Loader2, HelpCircle,
  Save, Download, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SaveDialog } from "@/components/save-dialog";
import { saveIPDPSession } from "@/lib/storage";
import type { SavedIPDPSession } from "@/lib/storage";
import { cn } from "@/lib/utils";

// ─── Built-in Questions ───────────────────────────────────────────────────────
interface IPDPQuestion {
  id: string; category: string; question: string;
  guidance: string; sampleResponse: string; tips: string[];
}

const IPDP_QUESTIONS: IPDPQuestion[] = [
  { id: "q1", category: "Professional Goals",
    question: "What is your primary professional development goal for this school year?",
    guidance: "Your goal should be SMART: Specific, Measurable, Achievable, Relevant, and Time-bound. Connect it to your school's improvement plan and your students' needs.",
    sampleResponse: "My primary goal is to increase student reading comprehension scores by 15% by the end of the school year by implementing guided reading strategies and weekly formative assessments. I will track progress using monthly running records and data team analysis every 6 weeks.",
    tips: ["Reference a specific data point that inspired this goal","Include a measurable outcome (%, number of students)","Connect to a school or district priority","Specify a timeline within the school year"] },
  { id: "q2", category: "Professional Goals",
    question: "How does your goal align with school and district improvement priorities?",
    guidance: "Identify your school's SIP focus areas or district strategic plan objectives and explicitly connect your personal goal to them.",
    sampleResponse: "Our school's SIP identifies improving literacy across all content areas as a top priority. My goal to implement close reading strategies in my social studies classroom directly supports this focus. Additionally, the district's strategic plan emphasizes culturally responsive pedagogy, which I incorporate by selecting texts that reflect my students' diverse backgrounds.",
    tips: ["Name the specific SIP or district plan goals","Use language that mirrors your school's documentation","Show how your classroom work supports the bigger picture","Mention collaboration with grade-level or content-area teams"] },
  { id: "q3", category: "Professional Growth",
    question: "What professional learning will you pursue to achieve your goal?",
    guidance: "Include a mix of formal and informal professional learning: workshops, courses, PLCs, mentoring, peer observations, book studies, webinars, or conferences.",
    sampleResponse: "To support my goal, I will: (1) Participate in our school's monthly PLC focused on data-driven instruction, (2) Complete the district's 15-hour reading intervention training in October, (3) Conduct two peer observations of our reading specialist, and (4) Study 'The Reading Strategies Book' by Serravallo, implementing two new strategies per quarter.",
    tips: ["Be specific about dates, hours, or frequency","Include both school-sponsored and self-directed learning","Mention how you'll apply learning in your classroom","Reference relevant books, courses, or organizations"] },
  { id: "q4", category: "Student Impact",
    question: "How will you measure the impact of your professional growth on student learning?",
    guidance: "Describe specific data sources, assessments, and evidence you will collect to show that your professional learning is translating into improved student outcomes.",
    sampleResponse: "I will measure impact through: (1) Pre- and post-reading assessments using the district benchmark tool in September, January, and May, (2) Weekly exit tickets aligned to comprehension standards, (3) Student work samples in a portfolio system, and (4) STAR Reading scores reviewed at each data team meeting. I will adjust instruction every 3–4 weeks based on this data.",
    tips: ["Name specific assessment tools the district uses","Include both formal and informal data sources","Describe how frequently you will collect data","Explain how you will respond to the data"] },
  { id: "q5", category: "Reflection",
    question: "Reflect on your professional strengths and areas for growth.",
    guidance: "Be honest and specific. Evaluators appreciate teachers who demonstrate self-awareness. Frame growth areas as opportunities, not weaknesses.",
    sampleResponse: "Among my strengths is my ability to build strong, trusting relationships with students, which creates a safe environment for risk-taking. I am also strong in differentiated instruction. An area for continued growth is leveraging student data more strategically. This year, I am committed to becoming more data-literate by attending our district's data analysis PD and collaborating with our instructional data coach.",
    tips: ["Lead with a genuine strength, not false modesty","Be specific — avoid vague terms like 'good communicator'","Frame growth areas using 'I am developing…'","Show a plan for addressing growth areas"] },
  { id: "q6", category: "Reflection",
    question: "How have you contributed to your school community beyond your classroom?",
    guidance: "Highlight committees, leadership roles, mentoring, extracurricular involvement, parent engagement, or PLC leadership.",
    sampleResponse: "Beyond my classroom, I serve on our school's PBIS team, co-facilitate our 3rd grade PLC, and mentor two first-year teachers with bi-weekly meetings. I led our grade level's family literacy night in February, which had over 40 family members in attendance.",
    tips: ["Quantify impact (attendance, hours, teachers mentored)","Include leadership roles, even informal ones","Mention family and community engagement","Connect contributions to student outcomes"] },
  { id: "q7", category: "Evidence",
    question: "What evidence will you collect to document your professional growth?",
    guidance: "Think about artifacts, data, products, or testimonials that demonstrate your learning and its impact.",
    sampleResponse: "I will maintain a professional growth portfolio containing: annotated lesson plans with reflections, student data charts showing progress, training certificates, observation feedback forms, student work samples before and after new strategies, and written reflections from each PLC session.",
    tips: ["Organize evidence chronologically or by goal area","Include a mix of teacher artifacts and student evidence","Annotate artifacts with brief explanations","Keep digital copies in an easily accessible folder"] },
  { id: "q8", category: "Collaboration",
    question: "How do you collaborate with colleagues to improve instructional practice?",
    guidance: "Describe specific collaborative structures: PLCs, co-teaching, peer observations, curriculum mapping, or instructional rounds.",
    sampleResponse: "I actively collaborate through weekly grade-level PLCs, monthly instructional rounds, and co-planning with my ELL specialist to embed language scaffolds in all lessons. I also share resources through our shared Google Drive during common planning periods.",
    tips: ["Name specific collaborative structures","Describe your role — participant, facilitator, or leader?","Show how collaboration changed your practice","Include cross-disciplinary collaboration if applicable"] },
];

const CATEGORIES = ["All","Professional Goals","Professional Growth","Student Impact","Reflection","Evidence","Collaboration"];

const GOAL_TEMPLATES = [
  { title: "Literacy / Reading Goal",        area: "Academic Achievement",  template: "By [end date], [X%] of my [grade level] students in [subject] will demonstrate proficiency in [skill] as measured by [assessment tool], up from [current baseline]%. I will achieve this by implementing [strategy] and collecting data every [frequency]." },
  { title: "Differentiated Instruction Goal", area: "Instructional Practice", template: "By [end date], I will consistently implement [# of] differentiated instructional strategies in [X%] of my lessons, as evidenced by lesson plans and observation feedback, to better address the needs of my [ELL/IEP/gifted] learners." },
  { title: "Professional Learning Goal",      area: "Professional Growth",    template: "By [end date], I will complete [professional learning activity] totaling [# hours] and apply at least [#] new strategies in my classroom, documenting impact through [evidence type] and reflecting in my portfolio." },
  { title: "Student Engagement Goal",         area: "Classroom Environment",  template: "By [end date], I will increase active student engagement in [subject/class] by implementing [strategy/approach], with the goal of [X%] of students demonstrating on-task behavior during observations, as measured by [tool/method]." },
  { title: "Data-Driven Instruction Goal",    area: "Data & Assessment",      template: "By [end date], I will use student assessment data from [data source] to guide instructional decisions for each unit, resulting in [X%] of students meeting or exceeding grade-level benchmarks on [end-of-year assessment]." },
];

// ─── Question Card ────────────────────────────────────────────────────────────
function QuestionCard({ q, answer, onAnswerChange }: {
  q: IPDPQuestion | { id: string; category: string; question: string; guidance?: string; sampleResponse?: string; tips?: string[] };
  answer: string;
  onAnswerChange: (id: string, val: string) => void;
}) {
  const [open, setOpen]           = useState(false);
  const [copied, setCopied]       = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGuidance, setAiGuidance] = useState("");

  const copyText = (text: string) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const handleAIHelp = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai-suggest", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "ipdp_response", question: q.question }),
      });
      const data = await res.json();
      if (data.success) setAiGuidance(data.suggestions.guidance);
    } catch {}
    setAiLoading(false);
  };

  const categoryColors: Record<string, string> = {
    "Professional Goals": "bg-indigo-100 text-indigo-700",
    "Professional Growth": "bg-emerald-100 text-emerald-700",
    "Student Impact": "bg-violet-100 text-violet-700",
    "Reflection": "bg-amber-100 text-amber-700",
    "Evidence": "bg-blue-100 text-blue-700",
    "Collaboration": "bg-rose-100 text-rose-700",
    "Custom": "bg-slate-100 text-slate-600",
  };

  return (
    <Card className="border-0 shadow-sm bg-white overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full text-left p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={cn("text-xs border-0", categoryColors[q.category] || "bg-slate-100 text-slate-600")}>{q.category}</Badge>
            {answer.trim() && <Badge className="text-xs border-0 bg-emerald-100 text-emerald-700">✓ Answered</Badge>}
          </div>
          <p className="text-sm font-semibold text-slate-800 leading-relaxed">{q.question}</p>
        </div>
        <div className="flex-shrink-0 mt-0.5">{open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}</div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-5 pb-5 space-y-4">
              <Separator />
              <div className="flex items-center gap-3">
                <Button size="sm" onClick={handleAIHelp} disabled={aiLoading} className="bg-indigo-600 hover:bg-indigo-700 gap-2 text-xs">
                  {aiLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
                  {aiLoading ? "Getting AI Guidance..." : "Get AI Writing Guidance"}
                </Button>
                <span className="text-xs text-slate-400">Personalized tips for this question</span>
              </div>

              {aiGuidance && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-lg p-4 border border-indigo-100">
                  <div className="flex items-center gap-2 mb-2"><Zap className="h-4 w-4 text-indigo-600" /><span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">AI Guidance</span></div>
                  <p className="text-sm text-indigo-800 leading-relaxed">{aiGuidance}</p>
                </motion.div>
              )}

              {"guidance" in q && q.guidance && (
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <div className="flex items-center gap-2 mb-2"><Lightbulb className="h-4 w-4 text-amber-600" /><span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Guidance</span></div>
                  <p className="text-sm text-amber-800 leading-relaxed">{q.guidance}</p>
                </div>
              )}

              {"tips" in q && q.tips && q.tips.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Key Tips</p>
                  <div className="space-y-1.5">
                    {q.tips.map((tip: string, i: number) => (
                      <div key={i} className="flex gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-600">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {"sampleResponse" in q && q.sampleResponse && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Sample Strong Response</p>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1" onClick={() => copyText(q.sampleResponse!)}>
                      {copied ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-700 leading-relaxed italic">{q.sampleResponse}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Your Response</p>
                <Textarea
                  placeholder="Write your personalized response here..."
                  value={answer}
                  onChange={(e) => onAnswerChange(q.id, e.target.value)}
                  rows={5}
                  className="resize-none text-sm"
                />
                {answer && (
                  <div className="flex justify-end mt-2">
                    <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => copyText(answer)}>
                      <Copy className="h-3 w-3" /> Copy My Response
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Goal Wizard ──────────────────────────────────────────────────────────────
function GoalWizard({ onGoalSaved }: { onGoalSaved: (goal: string) => void }) {
  const [focusArea, setFocusArea] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [result, setResult] = useState<{ goals: string[]; evidenceIdeas: string[]; focusTip: string } | null>(null);

  const handleGenerate = async () => {
    if (!focusArea.trim()) return;
    setAiLoading(true);
    const res = await fetch("/api/ai-suggest", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "ipdp_goal", focusArea }),
    });
    const data = await res.json();
    if (data.success) setResult(data.suggestions);
    setAiLoading(false);
  };

  return (
    <div className="space-y-5">
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-slate-700 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center"><Zap className="h-4 w-4 text-white" /></div>
            AI Goal Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>What is your professional growth focus this year?</Label>
            <Input placeholder="e.g. improving student reading comprehension, differentiated instruction, data-driven teaching..." value={focusArea} onChange={(e) => setFocusArea(e.target.value)} />
          </div>
          <Button onClick={handleGenerate} disabled={aiLoading || !focusArea.trim()} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
            {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            {aiLoading ? "Generating..." : "Generate SMART Goal Suggestions"}
          </Button>
          {result && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2">
              <Separator />
              <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                <p className="text-xs font-bold text-indigo-700 mb-1 uppercase tracking-wide">AI Tip</p>
                <p className="text-sm text-indigo-800">{result.focusTip}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Suggested SMART Goal Starters</p>
                <div className="space-y-3">
                  {result.goals.map((goal, i) => {
                    const [c, setC] = useState(false);
                    return (
                      <div key={i} className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                        <p className="text-sm text-slate-700 leading-relaxed mb-3">{goal}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => { navigator.clipboard.writeText(goal); setC(true); setTimeout(() => setC(false), 1500); }}>
                            {c ? <><CheckCircle className="h-3 w-3 text-emerald-500" /> Copied!</> : <><Copy className="h-3 w-3" /> Copy</>}
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => onGoalSaved(goal)}>
                            <Save className="h-3 w-3" /> Save to Session
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Suggested Evidence to Collect</p>
                <div className="space-y-1.5">
                  {result.evidenceIdeas.map((idea, i) => (
                    <div key={i} className="flex gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600">{idea}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <h2 className="text-sm font-bold text-slate-700">Goal Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GOAL_TEMPLATES.map((template, i) => {
          const [customized, setCustomized] = useState(template.template);
          const [c, setC] = useState(false);
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="border-0 shadow-sm bg-white h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div><CardTitle className="text-sm text-slate-800">{template.title}</CardTitle><Badge variant="outline" className="text-xs mt-1">{template.area}</Badge></div>
                    <Target className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea value={customized} onChange={(e) => setCustomized(e.target.value)} rows={4} className="resize-none text-sm text-slate-600 bg-slate-50 mb-3" />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-2 text-xs" onClick={() => { navigator.clipboard.writeText(customized); setC(true); setTimeout(() => setC(false), 1500); }}>
                      {c ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      {c ? "Copied!" : "Copy"}
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => onGoalSaved(customized)}>
                      <Save className="h-3 w-3" /> Save to Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Checklist ────────────────────────────────────────────────────────────────
const CHECKLIST_SECTIONS = [
  { title: "Before You Begin", icon: Star, color: "text-amber-600", items: [
    { id: "c1", label: "Review last year's IPDP goals and outcomes", description: "Reflect on what you achieved and what carried over." },
    { id: "c2", label: "Review your school's SIP (School Improvement Plan)", description: "Your goals should align with school-wide priorities." },
    { id: "c3", label: "Gather student baseline data", description: "Collect assessment scores to anchor your goals." },
    { id: "c4", label: "Review your most recent observation/evaluation feedback", description: "Use evaluator feedback to identify growth areas." },
  ]},
  { title: "Writing Your Goals", icon: Target, color: "text-indigo-600", items: [
    { id: "c5", label: "Goals are SMART", description: "Specific, Measurable, Achievable, Relevant, Time-bound." },
    { id: "c6", label: "Goals connect to student learning outcomes", description: "At least one goal should show a direct link to student achievement." },
    { id: "c7", label: "Goals reference school/district priorities", description: "Show how your growth supports the bigger mission." },
    { id: "c8", label: "Growth areas are framed positively", description: "Use 'I am developing...' not 'I am weak at...'." },
  ]},
  { title: "Professional Learning Plan", icon: TrendingUp, color: "text-emerald-600", items: [
    { id: "c9", label: "Identified at least 2 professional learning activities", description: "Include formal and informal learning." },
    { id: "c10", label: "Included dates, hours, or frequency of learning", description: "Be specific about timing." },
    { id: "c11", label: "Described how learning will be applied in the classroom", description: "Bridge professional learning to student impact." },
    { id: "c12", label: "Identified a source of accountability or support", description: "Mention a coach, mentor, or collaborative partner." },
  ]},
  { title: "Evidence & Documentation", icon: CheckCircle, color: "text-violet-600", items: [
    { id: "c13", label: "Planned specific evidence to collect", description: "Data charts, work samples, certificates — plan ahead." },
    { id: "c14", label: "Identified formal and informal assessment data sources", description: "Include district benchmarks and teacher-created assessments." },
    { id: "c15", label: "Set a schedule for reviewing progress", description: "Plan check-in points every 6–9 weeks." },
    { id: "c16", label: "Plan to reflect in writing on your learning", description: "Brief written reflections strengthen your portfolio." },
  ]},
];

function IPDPChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setChecked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const total = CHECKLIST_SECTIONS.reduce((acc, s) => acc + s.items.length, 0);
  const pct = Math.round((checked.size / total) * 100);

  return (
    <div className="space-y-5">
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center justify-between mb-3">
            <div><p className="text-sm font-bold text-slate-700">IPDP Readiness</p><p className="text-xs text-slate-500">{checked.size} of {total} items completed</p></div>
            <div className="text-2xl font-bold text-indigo-600">{pct}%</div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <motion.div className="bg-indigo-500 h-2.5 rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
          </div>
          {pct === 100 && <p className="text-sm text-emerald-600 font-medium mt-3 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> You are ready to submit your IPDP!</p>}
          <div className="flex justify-end mt-3"><Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => setChecked(new Set())}><RefreshCw className="h-3 w-3" /> Reset</Button></div>
        </CardContent>
      </Card>
      {CHECKLIST_SECTIONS.map(section => (
        <Card key={section.title} className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-3"><CardTitle className="text-sm text-slate-700 flex items-center gap-2"><section.icon className={`h-4 w-4 ${section.color}`} />{section.title}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {section.items.map(item => (
              <div key={item.id} onClick={() => toggle(item.id)} className={cn("flex gap-3 p-3 rounded-lg cursor-pointer transition-all border", checked.has(item.id) ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200 hover:bg-slate-100")}>
                <div className={cn("w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center", checked.has(item.id) ? "bg-emerald-500 border-emerald-500" : "border-slate-300")}>
                  {checked.has(item.id) && <CheckCircle className="h-3 w-3 text-white fill-white" />}
                </div>
                <div>
                  <p className={cn("text-sm font-medium", checked.has(item.id) ? "text-emerald-700 line-through" : "text-slate-700")}>{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Custom Questions Tab ─────────────────────────────────────────────────────
function CustomQuestionsTab({ responses, onAnswerChange }: { responses: Record<string, string>; onAnswerChange: (id: string, val: string) => void }) {
  const [customQuestions, setCustomQuestions] = useState<{ id: string; text: string; source: string }[]>([]);
  useEffect(() => {
    try { const raw = localStorage.getItem("obs_ready_questions"); if (raw) setCustomQuestions(JSON.parse(raw)); } catch {}
  }, []);

  if (customQuestions.length === 0) {
    return (
      <div className="text-center py-16">
        <HelpCircle className="h-10 w-10 text-slate-300 mx-auto mb-4" />
        <h3 className="text-slate-600 font-semibold mb-2">No Custom Questions Yet</h3>
        <p className="text-slate-400 text-sm max-w-sm mx-auto mb-4">Upload your district's IPDP questions in "My Standards & Questions" and they'll appear here with full AI guidance.</p>
        <Button variant="outline" onClick={() => window.location.href = "/standards"} className="gap-2"><BookOpen className="h-4 w-4" /> Go to Standards & Questions</Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-4">
        <p className="text-sm text-emerald-800 font-medium">{customQuestions.length} district question{customQuestions.length > 1 ? "s" : ""} loaded from your library</p>
        <p className="text-xs text-emerald-700 mt-0.5">Your responses are saved when you click "Save Session".</p>
      </div>
      {customQuestions.map((q) => (
        <QuestionCard
          key={q.id}
          q={{ id: `custom_${q.id}`, category: "Custom", question: q.text, guidance: q.source ? `From: ${q.source}` : undefined, tips: [], sampleResponse: undefined }}
          answer={responses[`custom_${q.id}`] || ""}
          onAnswerChange={onAnswerChange}
        />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function IPDPPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [smartGoals, setSmartGoals] = useState<string[]>([]);
  const [saveOpen, setSaveOpen]   = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleAnswerChange = (id: string, val: string) =>
    setResponses(prev => ({ ...prev, [id]: val }));

  const handleGoalSaved = (goal: string) => {
    setSmartGoals(prev => prev.includes(goal) ? prev : [...prev, goal]);
  };

  const handleSave = (name: string) => {
    saveIPDPSession(name, responses, smartGoals);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportPDF = async () => {
    setPdfLoading(true);
    try {
      const { exportIPDPSessionPDF } = await import("@/lib/pdf-export");
      const session: SavedIPDPSession = {
        id: "temp", name: "IPDP Session", savedAt: new Date().toISOString(),
        responses, smartGoals,
      };
      await exportIPDPSessionPDF(session);
    } catch (e) { console.error(e); }
    setPdfLoading(false);
  };

  const answeredCount = Object.values(responses).filter(v => v.trim()).length;
  const filtered = selectedCategory === "All" ? IPDP_QUESTIONS : IPDP_QUESTIONS.filter(q => q.category === selectedCategory);

  return (
    <div className="p-8 pb-24">
      <SaveDialog open={saveOpen} onOpenChange={setSaveOpen} defaultName={`IPDP ${new Date().getFullYear()}–${new Date().getFullYear() + 1}`} onSave={handleSave} type="ipdp" />

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center"><BookOpen className="h-5 w-5 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">IPDP Assistant</h1>
              <p className="text-slate-500 text-sm">AI-guided help for your Individual Professional Development Plan.</p>
            </div>
          </div>
          <div className="flex gap-2">
            {answeredCount > 0 && (
              <Badge variant="outline" className="text-xs">{answeredCount} response{answeredCount > 1 ? "s" : ""} written</Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSaveOpen(true)}
              className={cn("gap-2", saveSuccess && "border-emerald-500 text-emerald-600")}
            >
              {saveSuccess ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <Save className="h-4 w-4" />}
              {saveSuccess ? "Saved!" : "Save Session"}
            </Button>
            <Button
              size="sm"
              onClick={handleExportPDF}
              disabled={pdfLoading || answeredCount === 0}
              className="bg-indigo-600 hover:bg-indigo-700 gap-2"
            >
              {pdfLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* AI Disclosure Banner */}
      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex gap-3 items-start">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-amber-800 text-sm mb-0.5">AI-Generated Content Notice</p>
            <p className="text-amber-700 text-xs leading-relaxed">
              Responses and suggestions generated by Observation Ready AI are produced by an automated system and are intended as a starting point only.
              Always review, edit, and personalize AI-generated content before submitting it as part of your official IPDP documentation.
              AI suggestions do not constitute professional or legal advice.{" "}
              <Link href="/terms" className="underline font-medium hover:text-amber-900">View Terms of Use</Link>
              {" · "}
              <Link href="/privacy" className="underline font-medium hover:text-amber-900">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="questions">
        <TabsList className="mb-6">
          <TabsTrigger value="questions">📋 IPDP Questions</TabsTrigger>
          <TabsTrigger value="custom">🏫 My District Questions</TabsTrigger>
          <TabsTrigger value="goals">🎯 AI Goal Builder</TabsTrigger>
          <TabsTrigger value="checklist">✅ Readiness Checklist</TabsTrigger>
        </TabsList>

        <TabsContent value="questions">
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map(cat => (
              <Button key={cat} size="sm" variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className={cn("text-xs", selectedCategory === cat ? "bg-indigo-600 hover:bg-indigo-700" : "")}>
                {cat}
              </Button>
            ))}
          </div>
          <div className="space-y-3">
            {filtered.map((q) => (
              <motion.div key={q.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                <QuestionCard q={q} answer={responses[q.id] || ""} onAnswerChange={handleAnswerChange} />
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom">
          <CustomQuestionsTab responses={responses} onAnswerChange={handleAnswerChange} />
        </TabsContent>

        <TabsContent value="goals">
          <GoalWizard onGoalSaved={handleGoalSaved} />
          {smartGoals.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Saved Goals for This Session ({smartGoals.length})</h3>
              <div className="space-y-2">
                {smartGoals.map((g, i) => (
                  <div key={i} className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700">{g}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="checklist"><IPDPChecklist /></TabsContent>
      </Tabs>
    </div>
  );
}
