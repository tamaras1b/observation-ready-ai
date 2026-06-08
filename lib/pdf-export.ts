import type { LessonForm, SavedIPDPSession } from "./storage";

// ─── Color palette (RGB) ──────────────────────────────────────────────────────
const BRAND   = [79,  70, 229] as [number, number, number]; // indigo-600
const DARK    = [15,  23,  42] as [number, number, number]; // slate-900
const MUTED   = [100,116,139] as [number, number, number];  // slate-500
const LIGHT   = [241,245,249] as [number, number, number];  // slate-100
const WHITE   = [255,255,255] as [number, number, number];
const EMERALD = [16, 185,129] as [number, number, number];  // emerald-500
const LINE    = [226,232,240] as [number, number, number];  // slate-200

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getJsPDF() {
  const { jsPDF } = await import("jspdf");
  return jsPDF;
}

const PAGE_W = 210; // A4 mm
const PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;

function splitLines(doc: InstanceType<Awaited<ReturnType<typeof getJsPDF>>>, text: string, maxWidth: number): string[] {
  if (!text) return [];
  return doc.splitTextToSize(text, maxWidth) as string[];
}

function checkNewPage(
  doc: InstanceType<Awaited<ReturnType<typeof getJsPDF>>>,
  y: number,
  needed: number
): number {
  if (y + needed > PAGE_H - 20) {
    doc.addPage();
    return 22;
  }
  return y;
}

// ─── Lesson Plan PDF ──────────────────────────────────────────────────────────

export async function exportLessonPlanPDF(form: LessonForm, planName: string): Promise<void> {
  const JsPDF = await getJsPDF();
  const doc = new JsPDF({ unit: "mm", format: "a4" });

  let y = 0;

  // ── Header band ──
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, PAGE_W, 32, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...WHITE);
  doc.text("Observation Ready AI", MARGIN, 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(199, 210, 254); // indigo-200
  doc.text("AI-Powered Educator Tools  •  Lesson Plan", MARGIN, 20);

  // Plan name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...WHITE);
  const title = planName || form.topic || "Lesson Plan";
  doc.text(title.length > 60 ? title.slice(0, 60) + "…" : title, MARGIN, 28);

  y = 40;

  // ── Meta row ──
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  const metaParts = [
    form.subject && `Subject: ${form.subject}`,
    form.gradeLevel && `Grade: ${form.gradeLevel}`,
    form.date && `Date: ${form.date}`,
    form.duration && `Duration: ${form.duration} min`,
    form.teacher && `Teacher: ${form.teacher}`,
  ].filter(Boolean) as string[];
  doc.text(metaParts.join("   |   "), MARGIN, y);
  y += 3;

  // ── Horizontal rule ──
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 7;

  // ── Section printer ──
  const section = (label: string, content: string, accent: [number,number,number] = BRAND) => {
    if (!content?.trim()) return;
    y = checkNewPage(doc, y, 18);

    // Label pill
    doc.setFillColor(...accent);
    doc.roundedRect(MARGIN, y - 4, CONTENT_W, 7, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...WHITE);
    doc.text(label.toUpperCase(), MARGIN + 3, y + 0.5);
    y += 8;

    // Content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...DARK);
    const lines = splitLines(doc, content, CONTENT_W);
    lines.forEach((line) => {
      y = checkNewPage(doc, y, 6);
      doc.text(line, MARGIN, y);
      y += 5.2;
    });
    y += 4;
  };

  const phaseSection = (emoji: string, label: string, time: string, content: string, bg: [number,number,number]) => {
    if (!content?.trim()) return;
    y = checkNewPage(doc, y, 20);

    // Phase header
    doc.setFillColor(...bg);
    doc.roundedRect(MARGIN, y - 4, CONTENT_W, 7.5, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...DARK);
    doc.text(`${emoji}  ${label}`, MARGIN + 3, y + 0.8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(time, PAGE_W - MARGIN - doc.getTextWidth(time), y + 0.8);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...DARK);
    const lines = splitLines(doc, content, CONTENT_W - 4);
    lines.forEach((line) => {
      y = checkNewPage(doc, y, 6);
      doc.text(line, MARGIN + 2, y);
      y += 5.2;
    });
    y += 5;
  };

  // ── Content ──
  section("Standards Alignment", form.standards);
  section("Learning Objectives", form.objectives);
  section("Materials & Resources", form.materials);

  // Lesson Sequence header
  y = checkNewPage(doc, y, 12);
  doc.setFillColor(...DARK);
  doc.rect(MARGIN, y - 4, CONTENT_W, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...WHITE);
  doc.text("LESSON SEQUENCE", MARGIN + 3, y + 0.5);
  y += 11;

  phaseSection("🔥", "Opening / Hook", "5–10 min", form.hook, [255, 237, 213]);
  phaseSection("📖", "Direct Instruction", "10–15 min", form.instruction, [219, 234, 254]);
  phaseSection("🤝", "Guided Practice", "10–15 min", form.guidedPractice, [224, 231, 255]);
  phaseSection("✏️", "Independent Practice", "10–15 min", form.independentPractice, [237, 233, 254]);
  phaseSection("🎯", "Closure / Wrap-Up", "5 min", form.closure, [209, 250, 229]);

  section("Assessment Strategy", form.assessment, EMERALD);

  // Differentiation header
  if (form.ell || form.iep || form.gifted) {
    y = checkNewPage(doc, y, 12);
    doc.setFillColor(...DARK);
    doc.rect(MARGIN, y - 4, CONTENT_W, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...WHITE);
    doc.text("DIFFERENTIATION STRATEGIES", MARGIN + 3, y + 0.5);
    y += 11;
    section("ELL / Language Support", form.ell, [16, 185, 129]);
    section("IEP / Special Needs Support", form.iep, [99, 102, 241]);
    section("Enrichment / Gifted", form.gifted, [245, 158, 11]);
  }

  section("Anticipated Challenges & Solutions", form.anticipatedChallenges, [100, 116, 139]);

  // ── Footer on every page ──
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, PAGE_H - 12, PAGE_W - MARGIN, PAGE_H - 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text("Observation Ready AI  •  observationreadyai.com", MARGIN, PAGE_H - 7);
    doc.text(`Page ${p} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 7, { align: "right" });
  }

  const filename = (planName || form.topic || "lesson-plan").replace(/[^a-zA-Z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
  doc.save(`${filename}.pdf`);
}

// ─── IPDP Session PDF ─────────────────────────────────────────────────────────

const IPDP_QUESTIONS_MAP: Record<string, string> = {
  q1: "What is your primary professional development goal for this school year?",
  q2: "How does your goal align with school and district improvement priorities?",
  q3: "What professional learning will you pursue to achieve your goal?",
  q4: "How will you measure the impact of your professional growth on student learning?",
  q5: "Reflect on your professional strengths and areas for growth.",
  q6: "How have you contributed to your school community beyond your classroom?",
  q7: "What evidence will you collect to document your professional growth?",
  q8: "How do you collaborate with colleagues to improve instructional practice?",
};

export async function exportIPDPSessionPDF(session: SavedIPDPSession): Promise<void> {
  const JsPDF = await getJsPDF();
  const doc = new JsPDF({ unit: "mm", format: "a4" });

  let y = 0;

  // ── Header ──
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, PAGE_W, 32, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...WHITE);
  doc.text("Observation Ready AI", MARGIN, 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(199, 210, 254);
  doc.text("Individual Professional Development Plan (IPDP)  •  My Responses", MARGIN, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...WHITE);
  const sname = session.name || "IPDP Session";
  doc.text(sname.length > 60 ? sname.slice(0, 60) + "…" : sname, MARGIN, 28);

  y = 40;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(`Saved: ${new Date(session.savedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, MARGIN, y);
  y += 4;
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 8;

  // ── AI Disclosure Notice ──
  doc.setFillColor(254, 243, 199);  // amber-100
  doc.roundedRect(MARGIN, y, CONTENT_W, 14, 2, 2, "F");
  doc.setDrawColor(251, 191, 36);   // amber-400
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, y, CONTENT_W, 14, 2, 2, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(146, 64, 14);    // amber-800
  doc.text("⚠  AI-Generated Content Notice", MARGIN + 4, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(180, 83, 9);     // amber-700
  doc.text(
    "Responses were generated or assisted by Observation Ready AI. Review, edit, and personalize all content before official submission.",
    MARGIN + 4, y + 10,
    { maxWidth: CONTENT_W - 8 }
  );
  y += 20;

  // ── SMART Goals ──
  if (session.smartGoals?.length > 0) {
    y = checkNewPage(doc, y, 12);
    doc.setFillColor(...BRAND);
    doc.roundedRect(MARGIN, y - 4, CONTENT_W, 7, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...WHITE);
    doc.text("MY SMART GOALS", MARGIN + 3, y + 0.5);
    y += 9;
    session.smartGoals.forEach((goal, i) => {
      y = checkNewPage(doc, y, 10);
      doc.setFillColor(...LIGHT);
      const goalLines = splitLines(doc, goal, CONTENT_W - 10);
      const blockH = Math.max(12, goalLines.length * 5.5 + 6);
      doc.roundedRect(MARGIN, y - 3, CONTENT_W, blockH, 1, 1, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...BRAND);
      doc.text(`Goal ${i + 1}`, MARGIN + 3, y + 2);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...DARK);
      goalLines.forEach((line) => {
        y = checkNewPage(doc, y, 6);
        doc.text(line, MARGIN + 3, y);
        y += 5.2;
      });
      y += 6;
    });
    y += 4;
  }

  // ── Responses ──
  const responseEntries = Object.entries(session.responses).filter(([, v]) => v.trim());
  if (responseEntries.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(...MUTED);
    doc.text("No responses recorded in this session.", MARGIN, y);
  } else {
    responseEntries.forEach(([qId, answer], i) => {
      y = checkNewPage(doc, y, 24);

      const questionText = IPDP_QUESTIONS_MAP[qId] || qId;
      const qLines = splitLines(doc, `Q${i + 1}: ${questionText}`, CONTENT_W);
      const qBlockH = qLines.length * 5 + 8;

      doc.setFillColor(238, 242, 255); // indigo-50
      doc.roundedRect(MARGIN, y - 3, CONTENT_W, qBlockH, 1.5, 1.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...BRAND);
      qLines.forEach((line, li) => {
        y = checkNewPage(doc, y, 6);
        doc.text(line, MARGIN + 3, y + (li === 0 ? 0 : 5 * li));
      });
      y += qBlockH + 2;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...DARK);
      const aLines = splitLines(doc, answer, CONTENT_W - 4);
      aLines.forEach((line) => {
        y = checkNewPage(doc, y, 6);
        doc.text(line, MARGIN + 2, y);
        y += 5.2;
      });
      y += 6;
      doc.setDrawColor(...LINE);
      doc.setLineWidth(0.3);
      doc.line(MARGIN, y, PAGE_W - MARGIN, y);
      y += 6;
    });
  }

  // ── Footers ──
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, PAGE_H - 12, PAGE_W - MARGIN, PAGE_H - 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text("Observation Ready AI  •  observationreadyai.com", MARGIN, PAGE_H - 7);
    doc.text(`Page ${p} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 7, { align: "right" });
  }

  const filename = (session.name || "ipdp-session").replace(/[^a-zA-Z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
  doc.save(`${filename}.pdf`);
}
