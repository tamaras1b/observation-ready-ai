import { NextResponse } from "next/server";
import OpenAI from "openai";

// ─── Rate Limiter ─────────────────────────────────────────────────────────────
// Simple in-memory rate limiter: 20 requests per minute per IP
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = 60_000; // 1 minute
  const maxRequests = 20;

  const entry = rateLimitStore.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }
  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count };
}

// Clean up old entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitStore.entries()) {
    if (now > val.resetAt) rateLimitStore.delete(key);
  }
}, 300_000);

// ─── OpenAI Client ────────────────────────────────────────────────────────────
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── Grade band helper ────────────────────────────────────────────────────────
const gradeBand = (grade: string): string => {
  if (["Kindergarten", "1st Grade", "2nd Grade"].includes(grade)) return "K–2 (ages 5–8)";
  if (["3rd Grade", "4th Grade", "5th Grade"].includes(grade)) return "grades 3–5 (ages 8–11)";
  if (["6th Grade", "7th Grade", "8th Grade"].includes(grade)) return "grades 6–8 (ages 11–14)";
  return "grades 9–12 (ages 14–18)";
};

// ─── Shared system prompt ─────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert instructional coach and curriculum designer with 20+ years of experience 
supporting K–12 teachers. You specialize in writing observation-ready lesson plans that align with best practices, 
Bloom's Taxonomy, and frameworks like Danielson and Marzano. Your responses are practical, specific, 
and ready for classroom use. Always respond with valid JSON only — no markdown, no explanation outside the JSON.`;

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    // ── Rate limiting ──
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const { allowed } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { type, subject, grade, topic, standards, focusArea, question, category } = body;

    // ── API key check ──
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables." },
        { status: 500 }
      );
    }

    // ── Full lesson plan ──────────────────────────────────────────────────────
    if (type === "full_lesson") {
      const prompt = `Generate a complete, observation-ready lesson plan for the following:

Subject: ${subject}
Grade: ${grade} (${gradeBand(grade)})
Topic: ${topic}
Standards: ${standards || "General curriculum standards"}

Return ONLY this JSON structure (no markdown, no extra text):
{
  "objectives": ["string (3 SMART, Bloom's-aligned learning objectives)"],
  "hook": "string (engaging 5-minute opening activity to capture student interest)",
  "instruction": "string (clear, detailed direct instruction description — what the teacher says and does, 10–15 min)",
  "guidedPractice": "string (collaborative teacher-led practice activity description, 10–15 min)",
  "independentPractice": "string (student independent practice task description, 10–15 min)",
  "closure": "string (meaningful closure activity that checks for understanding, 5 min)",
  "assessment": "string (specific formative assessment strategy to use during the lesson)",
  "ell": "string (2–3 specific ELL/multilingual learner differentiation strategies for this lesson)",
  "iep": "string (2–3 specific strategies for students with IEPs or learning differences)",
  "gifted": "string (2–3 extension/enrichment ideas for advanced learners)",
  "materials": "string (list of specific materials, resources, and technology needed for this lesson — e.g. printed passages, manipulatives, whiteboard, Chromebooks, anchor charts)",
  "anticipatedChallenges": "string (2–3 common student misconceptions or challenges teachers should expect with this topic, plus a specific strategy to address each one)"
}

Make all suggestions specific to the topic "${topic}" — not generic. Use teacher-friendly, practical language.
Grade the complexity appropriately for ${gradeBand(grade)}.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1800,
        response_format: { type: "json_object" },
      });
      return NextResponse.json(JSON.parse(completion.choices[0].message.content || "{}"));
    }

    // ── Objectives only ───────────────────────────────────────────────────────
    if (type === "objectives_only") {
      const prompt = `Write 3 SMART learning objectives for:
Subject: ${subject}, Grade: ${grade} (${gradeBand(grade)}), Topic: ${topic}
Use Bloom's Taxonomy verbs appropriate for this grade level. Make them specific and measurable.
Return ONLY: { "objectives": ["objective 1", "objective 2", "objective 3"] }`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
        response_format: { type: "json_object" },
      });
      return NextResponse.json(JSON.parse(completion.choices[0].message.content || "{}"));
    }

    // ── Hook only ─────────────────────────────────────────────────────────────
    if (type === "hook_only") {
      const prompt = `Write one engaging lesson hook/opening activity for:
Subject: ${subject}, Grade: ${grade} (${gradeBand(grade)}), Topic: ${topic}
The hook should take 3–5 minutes, spark curiosity, and connect to students' prior knowledge or real life.
Return ONLY: { "hook": "description of the hook activity" }`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 250,
        response_format: { type: "json_object" },
      });
      return NextResponse.json(JSON.parse(completion.choices[0].message.content || "{}"));
    }

    // ── Differentiation only ──────────────────────────────────────────────────
    if (type === "differentiation_only") {
      const prompt = `Write differentiation strategies for:
Subject: ${subject}, Grade: ${grade} (${gradeBand(grade)}), Topic: ${topic}
Return ONLY:
{
  "ell": "2–3 specific ELL/multilingual learner strategies for this lesson",
  "iep": "2–3 specific strategies for students with IEPs or learning differences",
  "gifted": "2–3 extension/enrichment ideas for advanced learners"
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 400,
        response_format: { type: "json_object" },
      });
      return NextResponse.json(JSON.parse(completion.choices[0].message.content || "{}"));
    }

    // ── IPDP SMART Goal ───────────────────────────────────────────────────────
    if (type === "ipdp_goal") {
      const prompt = `You are an expert instructional coach helping a teacher write their Individual Professional 
Development Plan (IPDP). Generate SMART professional development goals and evidence ideas.

Teacher's focus area: "${focusArea}"
${grade ? `Grade level they teach: ${grade}` : ""}
${subject ? `Subject they teach: ${subject}` : ""}

Return ONLY:
{
  "goals": [
    "Complete SMART goal statement 1 (Specific, Measurable, Achievable, Relevant, Time-bound)",
    "Complete SMART goal statement 2 (alternative framing)",
    "Complete SMART goal statement 3 (focused on student impact)"
  ],
  "evidenceIdeas": [
    "Evidence idea 1", "Evidence idea 2", "Evidence idea 3", "Evidence idea 4"
  ]
}
Goals must sound like a real teacher wrote them — professional, specific, connected to classroom impact.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 600,
        response_format: { type: "json_object" },
      });
      return NextResponse.json(JSON.parse(completion.choices[0].message.content || "{}"));
    }

    // ── IPDP Response Guidance ────────────────────────────────────────────────
    if (type === "ipdp_response") {
      const prompt = `You are an expert instructional coach. A teacher needs guidance on how to answer this 
IPDP question for their formal evaluation.

Question: "${question}"
Category: "${category || "Professional Growth"}"

Return ONLY:
{
  "guidance": "2–3 paragraphs of coaching advice explaining what evaluators look for and how to structure a strong response",
  "sampleResponse": "A complete, realistic sample response (150–200 words) written in first person — professional, specific, and strong.",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4"]
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 700,
        response_format: { type: "json_object" },
      });
      return NextResponse.json(JSON.parse(completion.choices[0].message.content || "{}"));
    }

    return NextResponse.json({ error: "Unknown suggestion type" }, { status: 400 });

  } catch (error: unknown) {
    console.error("AI suggest error:", error);
    if (error && typeof error === "object" && "status" in error) {
      const apiError = error as { status: number };
      if (apiError.status === 401) return NextResponse.json({ error: "Invalid API key. Please check your OPENAI_API_KEY." }, { status: 401 });
      if (apiError.status === 429) return NextResponse.json({ error: "AI is busy right now. Please wait a moment and try again." }, { status: 429 });
      if (apiError.status === 402) return NextResponse.json({ error: "OpenAI account has insufficient credits. Please add credits at platform.openai.com." }, { status: 402 });
    }
    return NextResponse.json({ error: "Something went wrong. Please try again in a moment." }, { status: 500 });
  }
}
