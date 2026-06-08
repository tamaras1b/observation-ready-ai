import { NextResponse } from "next/server";
import OpenAI from "openai";

// ─── OpenAI Client ────────────────────────────────────────────────────────────
// API key is read from OPENAI_API_KEY environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    const body = await req.json();
    const { type, subject, grade, topic, standards, focusArea, question, category } = body;

    // Check API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables." },
        { status: 500 }
      );
    }

    // ── Full lesson plan suggestions ──────────────────────────────────────────
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
  "gifted": "string (2–3 extension/enrichment ideas for advanced learners)"
}

Make all suggestions specific to the topic "${topic}" — not generic. Use teacher-friendly, practical language.
Grade the complexity appropriately for ${gradeBand(grade)}.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");
      return NextResponse.json(result);
    }

    // ── Objectives only ───────────────────────────────────────────────────────
    if (type === "objectives_only") {
      const prompt = `Write 3 SMART learning objectives for:
Subject: ${subject}, Grade: ${grade} (${gradeBand(grade)}), Topic: ${topic}

Use Bloom's Taxonomy verbs appropriate for this grade level. Make them specific and measurable.
Return ONLY: { "objectives": ["objective 1", "objective 2", "objective 3"] }`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 300,
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");
      return NextResponse.json(result);
    }

    // ── Hook only ─────────────────────────────────────────────────────────────
    if (type === "hook_only") {
      const prompt = `Write one engaging lesson hook/opening activity for:
Subject: ${subject}, Grade: ${grade} (${gradeBand(grade)}), Topic: ${topic}

The hook should take 3–5 minutes, spark curiosity, and connect to students' prior knowledge or real life.
Return ONLY: { "hook": "description of the hook activity" }`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 250,
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");
      return NextResponse.json(result);
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
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 400,
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");
      return NextResponse.json(result);
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
    "Evidence idea 1",
    "Evidence idea 2", 
    "Evidence idea 3",
    "Evidence idea 4"
  ]
}

Goals must sound like a real teacher wrote them — professional, specific, connected to classroom impact.
Each goal should include a measurable target and a timeframe within the school year.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 600,
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");
      return NextResponse.json(result);
    }

    // ── IPDP Response Guidance ────────────────────────────────────────────────
    if (type === "ipdp_response") {
      const prompt = `You are an expert instructional coach. A teacher needs guidance on how to answer this 
IPDP (Individual Professional Development Plan) question for their formal evaluation.

Question: "${question}"
Category: "${category || "Professional Growth"}"

Write guidance that helps them craft a strong, evaluator-ready response. Be specific and practical.

Return ONLY:
{
  "guidance": "2–3 paragraphs of coaching advice explaining what evaluators look for, what to include, and how to structure a strong response",
  "sampleResponse": "A complete, realistic sample response (150–200 words) written as if a teacher wrote it — professional, specific, and strong. Use first person.",
  "keyPoints": [
    "Key point 1 to include",
    "Key point 2 to include",
    "Key point 3 to include",
    "Key point 4 to include"
  ]
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 700,
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Unknown suggestion type" }, { status: 400 });

  } catch (error: unknown) {
    console.error("AI suggest error:", error);

    // Handle OpenAI-specific errors
    if (error && typeof error === "object" && "status" in error) {
      const apiError = error as { status: number; message?: string };
      if (apiError.status === 401) {
        return NextResponse.json(
          { error: "Invalid API key. Please check your OPENAI_API_KEY environment variable." },
          { status: 401 }
        );
      }
      if (apiError.status === 429) {
        return NextResponse.json(
          { error: "OpenAI rate limit reached. Please wait a moment and try again." },
          { status: 429 }
        );
      }
      if (apiError.status === 402) {
        return NextResponse.json(
          { error: "OpenAI account has insufficient credits. Please add credits at platform.openai.com." },
          { status: 402 }
        );
      }
    }

    return NextResponse.json(
      { error: "Something went wrong generating suggestions. Please try again." },
      { status: 500 }
    );
  }
}
