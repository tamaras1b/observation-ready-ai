import { NextResponse } from "next/server";

// ─── Educational Knowledge Base ─────────────────────────────────────────────

const BLOOM_VERBS: Record<string, string[]> = {
  remember: ["identify", "recall", "list", "name", "define", "recognize", "label"],
  understand: ["explain", "describe", "summarize", "paraphrase", "classify", "compare"],
  apply: ["use", "demonstrate", "solve", "illustrate", "calculate", "construct"],
  analyze: ["analyze", "differentiate", "examine", "distinguish", "investigate", "break down"],
  evaluate: ["evaluate", "judge", "justify", "critique", "defend", "assess", "argue"],
  create: ["design", "create", "compose", "develop", "produce", "formulate", "plan"],
};

const GRADE_BAND = (grade: string): "k2" | "35" | "68" | "912" => {
  if (["Kindergarten", "1st Grade", "2nd Grade"].includes(grade)) return "k2";
  if (["3rd Grade", "4th Grade", "5th Grade"].includes(grade)) return "35";
  if (["6th Grade", "7th Grade", "8th Grade"].includes(grade)) return "68";
  return "912";
};

interface SuggestionBank {
  hooks: string[];
  assessments: string[];
  ell: string[];
  iep: string[];
  gifted: string[];
  closures: string[];
}

const SUBJECT_BANKS: Record<string, SuggestionBank> = {
  "English Language Arts": {
    hooks: [
      "Show a compelling image or short video clip related to the text theme and ask students to predict what they'll be reading about.",
      "Read aloud the opening paragraph of the text with dramatic expression, then pause and ask: 'What do you think will happen next and why?'",
      "Display a provocative quote from the text and have students do a 2-minute quick write about their reaction before sharing with a partner.",
      "Use a 'word splash' — write key vocabulary from the text on the board and ask students to predict how they connect to today's topic.",
    ],
    assessments: [
      "Exit ticket: Students write 3 sentences — one main idea, one supporting detail, and one connection to their own life.",
      "Turn-and-talk synthesis: Students explain the key learning to a partner in their own words; teacher circulates to assess understanding.",
      "Sticky note response: Each student posts a sticky note with their answer to a text-dependent question on the board for a gallery walk.",
      "Annotated paragraph: Students highlight one strong piece of text evidence and write a 2-sentence explanation of how it supports the claim.",
    ],
    ell: [
      "Provide sentence frames: 'The author argues... because...' / 'One piece of evidence is...' / 'This connects to...'",
      "Pre-teach 5–7 key vocabulary words with visuals, student-friendly definitions, and native language translations where possible.",
      "Offer bilingual glossaries and allow students to process in their home language before responding in English.",
      "Use visual anchor charts with key concepts, vocabulary, and text structures displayed throughout the lesson.",
    ],
    iep: [
      "Provide graphic organizers pre-filled with key text structures and prompts to scaffold written responses.",
      "Offer audio recordings of the text so students can listen and read simultaneously.",
      "Allow extended time and reduce the length of independent writing tasks while maintaining rigor of thinking.",
      "Provide highlighters and sticky notes for annotation; allow verbal responses instead of written when appropriate.",
    ],
    gifted: [
      "Challenge students to find a second text on the same topic and write a comparative analysis.",
      "Ask students to write from the perspective of an opposing viewpoint or a character not represented in the text.",
      "Have students craft their own text-dependent questions and trade with peers to challenge each other.",
      "Invite students to identify the author's craft moves and create a brief writing piece that mimics the same technique.",
    ],
    closures: [
      "3-2-1 Exit Ticket: 3 things learned, 2 questions still wondering, 1 connection to prior knowledge.",
      "Students complete a one-sentence summary using a provided sentence stem, then share with a neighbor.",
      "Quick Socratic wrap-up: Ask one higher-order question and cold-call two students to respond and build on each other.",
    ],
  },
  "Mathematics": {
    hooks: [
      "Pose a real-world problem that creates curiosity — show a photo or video of the math in action and ask 'What do you notice? What do you wonder?'",
      "Start with a 'number talk' — show a visual representation and ask students to share multiple strategies for solving it mentally.",
      "Present an incorrect student work sample and ask: 'What did this student do? Where did they go wrong? How would you fix it?'",
      "Use a 'Estimation 180' style prompt — show a partial image and ask students to make an estimation before revealing the answer.",
    ],
    assessments: [
      "Exit ticket with 2 problems — one procedural and one that requires students to explain their reasoning in writing.",
      "Whiteboard response: Students solve on mini whiteboards and hold up at the same time so the teacher can scan for understanding.",
      "Error analysis: Provide a worked problem with a common mistake and ask students to identify and correct the error with explanation.",
      "Thumbs up/sideways/down self-assessment followed by targeted re-teaching or extension based on student responses.",
    ],
    ell: [
      "Provide a math vocabulary word wall with visual representations, symbols, and examples for each term.",
      "Use sentence frames for math talk: 'My strategy was... because...' / 'I know the answer is... because...'",
      "Incorporate visual models, manipulatives, and diagrams to reduce language barriers while maintaining mathematical rigor.",
      "Allow students to demonstrate understanding through drawing or modeling before requiring verbal or written explanation.",
    ],
    iep: [
      "Provide multiplication charts, number lines, and formula reference cards as allowed accommodations.",
      "Break multi-step problems into numbered steps with a clear workspace for each step.",
      "Use graph paper or dotted paper to help with place value alignment and spatial organization.",
      "Allow use of calculator for computation-heavy portions so students can focus on conceptual understanding.",
    ],
    gifted: [
      "Challenge students to solve the same problem using multiple strategies and justify which is most efficient.",
      "Provide an extension problem that requires applying today's concept in an unfamiliar or cross-curricular context.",
      "Ask students to create their own word problem using the target skill and write a complete solution guide.",
      "Introduce the algebraic generalization of the pattern or rule students discovered in today's lesson.",
    ],
    closures: [
      "Students write the 'Big Idea' of the lesson in one sentence and share with the class.",
      "Present a final challenge problem that requires applying the day's concept in a slightly new way.",
      "Muddiest Point: Students write the one thing they're still confused about on a sticky note for teacher review.",
    ],
  },
  "Science": {
    hooks: [
      "Conduct a short demonstration that creates a discrepant event — something unexpected — and have students write a hypothesis to explain what happened.",
      "Show a short video clip (1–2 min) of a real-world science phenomenon and pose the driving question: 'How does this happen?'",
      "Display a compelling photograph of a natural phenomenon and ask students to use prior knowledge to explain what they observe.",
      "Present a controversial or surprising science fact and have students debate: 'Do you believe this? What evidence would you need?'",
    ],
    assessments: [
      "Lab notebook exit entry: Students write an observation, an inference, and a question they still have.",
      "Claim-Evidence-Reasoning (CER) frame: Students write a claim, cite at least one piece of evidence, and explain their reasoning.",
      "Quick sketch + label: Students draw and label the key concept (cell, system, process) to check for conceptual accuracy.",
      "Digital exit ticket using a shared Google Form with one multiple choice and one open-response question.",
    ],
    ell: [
      "Provide visual glossaries with scientific vocabulary, diagrams, and native language translations where available.",
      "Use visual models, diagrams, and hands-on materials to make abstract concepts concrete and accessible.",
      "Offer CER sentence frames: 'My claim is... The evidence shows... This is because...'",
      "Allow students to label diagrams in their home language first, then translate to English scientific terminology.",
    ],
    iep: [
      "Provide pre-filled graphic organizers with key vocabulary and structural prompts for lab notes and CER writing.",
      "Pair students strategically for hands-on lab activities to provide peer support without reducing participation.",
      "Offer simplified lab procedures with numbered steps, visual cues, and check-in points for each stage.",
      "Allow oral responses or drawing to demonstrate understanding of key science concepts.",
    ],
    gifted: [
      "Pose a design challenge that extends today's concept — how would you apply this principle to solve a real-world problem?",
      "Ask students to research a related scientist or discovery and present a 2-minute 'Science Spotlight.'",
      "Provide a peer-reviewed article summary on a related topic and have students evaluate the claims and evidence.",
      "Challenge students to design an original experiment to test a related hypothesis.",
    ],
    closures: [
      "Students complete a CER exit slip answering the lesson's driving question with evidence from today's activities.",
      "Exit ticket: Students draw a diagram of the key concept and label all components with correct vocabulary.",
      "Pair-share reflection: 'What did we learn today? How does it connect to what we already knew?'",
    ],
  },
  "Social Studies": {
    hooks: [
      "Show a primary source document, photograph, or artifact and ask: 'What do you see? What do you wonder? What does this tell us about this time period?'",
      "Present a short news clip connecting today's historical topic to a current event and ask students to identify the connection.",
      "Read a compelling first-person account or letter from a historical figure and ask students to respond as if they were there.",
      "Use a map, timeline, or infographic to spark curiosity: 'What story does this tell? What questions does it raise?'",
    ],
    assessments: [
      "Perspective-taking exit ticket: Students write from the point of view of two different historical groups affected by today's event.",
      "Historical thinking checklist: Students evaluate a primary source using Sourcing, Contextualization, and Corroboration.",
      "Cause-and-effect graphic organizer completed independently and collected as a formative check.",
      "Students write a 3-sentence argument: claim, evidence from today's lesson, and reasoning connecting the two.",
    ],
    ell: [
      "Provide a visual timeline of key events and a vocabulary bank with images, dates, and student-friendly definitions.",
      "Use sentence frames for historical analysis: 'One cause of this event was... One effect was... This matters because...'",
      "Offer graphic organizers with pre-labeled sections to support note-taking during direct instruction.",
      "Use maps and visual representations to support comprehension of geographic and historical concepts.",
    ],
    iep: [
      "Provide a structured note-taking guide with key vocabulary bolded and sentence starters for each section.",
      "Offer audio recordings of primary sources and textbook passages to support reading access.",
      "Allow students to demonstrate understanding through drawings, labeled maps, or verbal responses.",
      "Use visual timelines and concept maps as alternative ways to show knowledge of sequence and causation.",
    ],
    gifted: [
      "Challenge students to evaluate historical decisions from multiple stakeholder perspectives and write a position statement.",
      "Ask students to find a modern parallel to today's historical event and write a comparative analysis.",
      "Assign a Socratic Seminar question for advanced discussion: 'Was [historical decision] justified? Why or why not?'",
      "Have students design an alternative outcome — 'What if [event] had happened differently?' — with historical evidence to support it.",
    ],
    closures: [
      "Historical significance exit ticket: 'Why does this event/person/idea still matter today? Explain in 2–3 sentences.'",
      "Students add today's events to a running class timeline and explain the connection to the unit's essential question.",
      "Pair debrief: Each pair identifies the most important takeaway and one remaining question to share with the class.",
    ],
  },
};

// Fallback for any subject not in the bank
const DEFAULT_BANK: SuggestionBank = {
  hooks: [
    "Begin with a thought-provoking essential question and give students 2 minutes to write their initial thoughts before sharing.",
    "Show a real-world connection to today's topic — an image, short clip, or news headline — and ask students to make a prediction.",
    "Use a quick poll or KWL chart to activate prior knowledge and set a purpose for learning.",
  ],
  assessments: [
    "Exit ticket with one application-level question that students must answer independently in the last 3–5 minutes.",
    "Think-Pair-Share debrief: Students discuss key concepts in pairs, then share highlights with the class.",
    "Brief written reflection: 'What did you learn today? What questions do you still have?'",
  ],
  ell: [
    "Provide sentence frames to support academic language use during discussions and written tasks.",
    "Use visual supports (images, diagrams, graphic organizers) throughout the lesson to reduce language barriers.",
    "Pre-teach key vocabulary with visual representations and allow processing time before responses.",
  ],
  iep: [
    "Provide graphic organizers and structured note-taking guides to scaffold learning.",
    "Break complex tasks into smaller steps with checkpoints throughout the lesson.",
    "Allow extended time and alternative response formats (verbal, visual, or partner-supported).",
  ],
  gifted: [
    "Provide an extension task that requires higher-order thinking — analysis, evaluation, or creation.",
    "Challenge students to apply the concept to a novel situation or real-world problem.",
    "Invite students to teach a peer or create a resource that demonstrates mastery.",
  ],
  closures: [
    "Students complete a 3-2-1 exit ticket: 3 key learnings, 2 questions, 1 real-world connection.",
    "Quick pair reflection on the lesson's essential question before dismissal.",
    "Students set one learning intention for the next class based on today's content.",
  ],
};

function getBank(subject: string): SuggestionBank {
  return SUBJECT_BANKS[subject] ?? DEFAULT_BANK;
}

function pick<T>(arr: T[], n = 2): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// ─── Objective Generator ─────────────────────────────────────────────────────

function generateObjectives(subject: string, grade: string, topic: string): string[] {
  const band = GRADE_BAND(grade);
  const verb = (level: keyof typeof BLOOM_VERBS) =>
    BLOOM_VERBS[level][Math.floor(Math.random() * BLOOM_VERBS[level].length)];

  const topicShort = topic || "the key concept";

  const templates: Record<string, string[]> = {
    k2: [
      `${verb("remember").charAt(0).toUpperCase() + verb("remember").slice(1)} and name key vocabulary related to ${topicShort} with at least 80% accuracy.`,
      `${verb("understand").charAt(0).toUpperCase() + verb("understand").slice(1)} the main idea of ${topicShort} by using pictures and words.`,
      `${verb("apply").charAt(0).toUpperCase() + verb("apply").slice(1)} what we learned about ${topicShort} during partner and group activities.`,
    ],
    "35": [
      `${verb("understand").charAt(0).toUpperCase() + verb("understand").slice(1)} the key concepts of ${topicShort} and connect them to prior knowledge.`,
      `${verb("apply").charAt(0).toUpperCase() + verb("apply").slice(1)} skills related to ${topicShort} to complete a structured task with at least 75% accuracy.`,
      `${verb("analyze").charAt(0).toUpperCase() + verb("analyze").slice(1)} examples and non-examples of ${topicShort} and explain the difference in writing.`,
    ],
    "68": [
      `${verb("analyze").charAt(0).toUpperCase() + verb("analyze").slice(1)} the relationship between key components of ${topicShort} using evidence from today's materials.`,
      `${verb("evaluate").charAt(0).toUpperCase() + verb("evaluate").slice(1)} different perspectives or approaches related to ${topicShort} and support a position with reasoning.`,
      `${verb("apply").charAt(0).toUpperCase() + verb("apply").slice(1)} understanding of ${topicShort} to solve a novel problem or answer a text-dependent question.`,
    ],
    "912": [
      `${verb("evaluate").charAt(0).toUpperCase() + verb("evaluate").slice(1)} the significance of ${topicShort} and construct a well-supported written argument.`,
      `${verb("analyze").charAt(0).toUpperCase() + verb("analyze").slice(1)} complex relationships and patterns within ${topicShort} using discipline-specific evidence.`,
      `${verb("create").charAt(0).toUpperCase() + verb("create").slice(1)} an original product or response that demonstrates mastery of ${topicShort}.`,
    ],
  };

  return templates[band] ?? templates["68"];
}

// ─── Instruction Generator ───────────────────────────────────────────────────

function generateInstruction(subject: string, grade: string, topic: string): string {
  const band = GRADE_BAND(grade);
  const topicShort = topic || "today's concept";

  const templates: Record<string, string> = {
    k2: `Use a think-aloud strategy to model ${topicShort} step by step. Display a visual anchor chart while narrating your thinking. Use simple, concrete language and check for understanding with thumbs up/thumbs down after each step. Repeat key vocabulary multiple times in context.`,
    "35": `Begin by connecting ${topicShort} to something students already know. Model the skill or concept using at least two concrete examples, thinking aloud throughout. Use the board or projected materials to display the process. Pause twice during instruction to ask checking questions ('What did you notice? What would happen if...?'). Introduce key vocabulary in context with visual supports.`,
    "68": `Open direct instruction by framing ${topicShort} within the unit's essential question. Model the skill or thinking process using a worked example, narrating your reasoning explicitly. Use strategic questioning (Socratic-style) to engage students in co-constructing understanding. Incorporate at least one primary source, visual model, or data representation. Check for understanding midway through instruction before moving to practice.`,
    "912": `Facilitate a structured inquiry into ${topicShort} using a carefully chosen anchor text, data set, or problem. Model expert thinking through a think-aloud, making your reasoning visible and challengeable. Embed 1–2 discussion protocols (cold call, numbered heads, think-pair-share) to maintain engagement. Explicitly teach academic vocabulary and discipline-specific reasoning moves. Conclude direct instruction with a comprehension check before releasing students to practice.`,
  };

  return templates[band] ?? templates["68"];
}

function generateGuidedPractice(subject: string, grade: string, topic: string): string {
  const band = GRADE_BAND(grade);
  const topicShort = topic || "today's concept";

  const templates: Record<string, string> = {
    k2: `Complete a shared practice activity together as a class. Guide students through the task step by step, pausing for responses and corrections. Use partner work or table groups to practice ${topicShort} with immediate teacher feedback. Provide a visual checklist to help students track their progress.`,
    "35": `Use a 'We Do' activity where students practice ${topicShort} with teacher guidance. Work through 2–3 examples together, gradually releasing more responsibility to students. Circulate actively to provide immediate corrective feedback. Use a think-pair-share at least once during guided practice to check understanding.`,
    "68": `Facilitate a structured collaborative task where small groups or partners practice ${topicShort}. Use a structured protocol (e.g., gallery walk, Jigsaw, fishbowl) to maintain accountability. Circulate and use targeted questioning to deepen understanding. Pause after 5–7 minutes for a brief mid-point check and whole-class debrief before continuing.`,
    "912": `Assign a collaborative or inquiry-based task where students apply ${topicShort} with peer support. Provide a structured framework or protocol to keep groups accountable. Circulate to ask probing questions and push for evidence-based reasoning. Conduct a brief mid-activity debrief to surface misconceptions before independent practice.`,
  };

  return templates[band] ?? templates["68"];
}

function generateIndependentPractice(subject: string, grade: string, topic: string): string {
  const band = GRADE_BAND(grade);
  const topicShort = topic || "today's concept";

  const templates: Record<string, string> = {
    k2: `Students complete a brief independent task (worksheet, drawing, or sorting activity) that demonstrates understanding of ${topicShort}. Teacher circulates to observe and provide individual feedback. Task should take no more than 8–10 minutes.`,
    "35": `Students complete an independent practice task (graphic organizer, written response, or skill practice page) applying ${topicShort}. Teacher circulates, conferring briefly with 2–3 students. Collect work as a formative assessment.`,
    "68": `Students independently respond to a text-dependent question, problem set, or analysis task related to ${topicShort}. Task requires students to write at least 3–4 complete sentences with evidence. Teacher circulates and notes common misconceptions for whole-class address.`,
    "912": `Students independently complete an analytical or extended writing task that demonstrates mastery of ${topicShort}. Task requires evidence-based reasoning and use of academic vocabulary. Teacher circulates, conferring with individual students and noting patterns for feedback.`,
  };

  return templates[band] ?? templates["68"];
}

// ─── IPDP Suggestion Engine ───────────────────────────────────────────────────

const IPDP_GOAL_STARTERS = [
  "By [end of school year], [X]% of my students in [subject/grade] will demonstrate proficiency in [skill] as measured by [assessment], up from [baseline]%.",
  "By [date], I will implement [strategy] in [X]% of my lessons, as evidenced by lesson plans and classroom observation feedback.",
  "By [date], I will complete [professional learning activity] and apply [#] new strategies in my classroom, documenting impact through [evidence type].",
  "By [end of year], I will increase [student group]'s [skill] by [X] growth points as measured by [assessment tool], by implementing [intervention].",
];

const IPDP_EVIDENCE_IDEAS = [
  "Lesson plans annotated with reflections on student learning",
  "Student pre- and post-assessment data charts",
  "Certificates of completion for professional development attended",
  "Classroom observation feedback from administrator or instructional coach",
  "Student work samples showing growth over time",
  "Video recording of a lesson segment with self-reflection notes",
  "Data analysis write-up from grade-level or data team meetings",
  "Reading log with notes from professional books or articles",
  "Peer observation notes and debrief reflections",
  "Parent communication logs or family engagement documentation",
];

// ─── API Handler ──────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const body = await request.json();
  const { type, subject, grade, topic, standards, focusArea, question } = body;

  const bank = getBank(subject);

  if (type === "full_lesson") {
    const objectives = generateObjectives(subject, grade, topic);
    const hooks = pick(bank.hooks, 2);
    const assessments = pick(bank.assessments, 2);
    const instruction = generateInstruction(subject, grade, topic);
    const guidedPractice = generateGuidedPractice(subject, grade, topic);
    const independentPractice = generateIndependentPractice(subject, grade, topic);
    const closures = pick(bank.closures, 2);
    const ell = pick(bank.ell, 2);
    const iep = pick(bank.iep, 2);
    const gifted = pick(bank.gifted, 2);

    return NextResponse.json({
      success: true,
      suggestions: {
        objectives: objectives.join("\n"),
        hook: hooks.join("\n\nALTERNATIVE: "),
        instruction,
        guidedPractice,
        independentPractice,
        closure: closures.join("\n\nALTERNATIVE: "),
        assessment: assessments.join("\n\nALTERNATIVE: "),
        ell: ell.join("\n• "),
        iep: iep.join("\n• "),
        gifted: gifted.join("\n• "),
      },
    });
  }

  if (type === "objectives_only") {
    return NextResponse.json({
      success: true,
      suggestions: { objectives: generateObjectives(subject, grade, topic).join("\n") },
    });
  }

  if (type === "hook_only") {
    return NextResponse.json({
      success: true,
      suggestions: { hook: pick(bank.hooks, 2).join("\n\nALTERNATIVE: ") },
    });
  }

  if (type === "differentiation_only") {
    return NextResponse.json({
      success: true,
      suggestions: {
        ell: "• " + pick(bank.ell, 2).join("\n• "),
        iep: "• " + pick(bank.iep, 2).join("\n• "),
        gifted: "• " + pick(bank.gifted, 2).join("\n• "),
      },
    });
  }

  if (type === "ipdp_goal") {
    const goals = pick(IPDP_GOAL_STARTERS, 2);
    return NextResponse.json({
      success: true,
      suggestions: {
        goals,
        evidenceIdeas: pick(IPDP_EVIDENCE_IDEAS, 5),
        focusTip: focusArea
          ? `For a goal focused on "${focusArea}", make sure to name a specific, measurable student outcome, a professional learning action you will take, and at least one form of evidence you will collect.`
          : "Make sure your goal is SMART: Specific, Measurable, Achievable, Relevant, and Time-bound.",
      },
    });
  }

  if (type === "ipdp_response") {
    const q = question || "";
    let guidance = "";
    if (q.toLowerCase().includes("goal")) {
      guidance = "Start by naming your specific goal with a measurable outcome. Then explain WHY you chose this goal — what student data or feedback prompted it. Finally, describe your plan of action and how you will know if you succeeded.";
    } else if (q.toLowerCase().includes("evidence") || q.toLowerCase().includes("document")) {
      guidance = "Name at least 3 specific forms of evidence you will collect (data charts, work samples, certificates). Explain when and how you will gather each piece. Show how the evidence connects directly to student learning.";
    } else if (q.toLowerCase().includes("reflect") || q.toLowerCase().includes("strength")) {
      guidance = "Lead with a genuine professional strength and give a specific example. Then honestly name a growth area using positive, forward-looking language ('I am developing...'). Close with a concrete action step you are already taking.";
    } else if (q.toLowerCase().includes("collaborat")) {
      guidance = "Name specific structures you participate in (PLCs, instructional rounds, co-planning). Describe your role — participant, facilitator, or leader. Give an example of how collaboration changed your practice or student outcomes.";
    } else {
      guidance = "Be specific and honest. Use data or evidence to support your claims. Connect your answer to both your professional growth and your students' learning outcomes. Avoid vague language — name specific strategies, tools, and outcomes.";
    }
    return NextResponse.json({ success: true, suggestions: { guidance } });
  }

  return NextResponse.json({ success: false, error: "Unknown suggestion type" }, { status: 400 });
}
