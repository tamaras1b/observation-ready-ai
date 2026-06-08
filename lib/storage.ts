// ─── Types ───────────────────────────────────────────────────────────────────

export interface LessonForm {
  teacher: string; subject: string; gradeLevel: string; date: string; duration: string;
  topic: string; standards: string; objectives: string; materials: string;
  hook: string; instruction: string; guidedPractice: string; independentPractice: string;
  closure: string; assessment: string; ell: string; iep: string; gifted: string;
  anticipatedChallenges: string;
}

export interface SavedLessonPlan {
  id: string;
  name: string;
  savedAt: string;
  form: LessonForm;
}

export interface SavedIPDPSession {
  id: string;
  name: string;
  savedAt: string;
  responses: Record<string, string>;
  smartGoals: string[];
}

// ─── Keys ────────────────────────────────────────────────────────────────────

const LESSON_PLANS_KEY = "obs_ready_lesson_plans";
const IPDP_SESSIONS_KEY = "obs_ready_ipdp_sessions";

// ─── Lesson Plans ─────────────────────────────────────────────────────────────

export function getSavedLessonPlans(): SavedLessonPlan[] {
  try {
    const raw = localStorage.getItem(LESSON_PLANS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLessonPlan(name: string, form: LessonForm): SavedLessonPlan {
  const plans = getSavedLessonPlans();
  const plan: SavedLessonPlan = {
    id: crypto.randomUUID(),
    name,
    savedAt: new Date().toISOString(),
    form,
  };
  const updated = [plan, ...plans];
  localStorage.setItem(LESSON_PLANS_KEY, JSON.stringify(updated));
  return plan;
}

export function deleteLessonPlan(id: string): void {
  const plans = getSavedLessonPlans().filter((p) => p.id !== id);
  localStorage.setItem(LESSON_PLANS_KEY, JSON.stringify(plans));
}

export function renameLessonPlan(id: string, name: string): void {
  const plans = getSavedLessonPlans().map((p) => (p.id === id ? { ...p, name } : p));
  localStorage.setItem(LESSON_PLANS_KEY, JSON.stringify(plans));
}

// ─── IPDP Sessions ────────────────────────────────────────────────────────────

export function getSavedIPDPSessions(): SavedIPDPSession[] {
  try {
    const raw = localStorage.getItem(IPDP_SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveIPDPSession(name: string, responses: Record<string, string>, smartGoals: string[]): SavedIPDPSession {
  const sessions = getSavedIPDPSessions();
  const session: SavedIPDPSession = {
    id: crypto.randomUUID(),
    name,
    savedAt: new Date().toISOString(),
    responses,
    smartGoals,
  };
  const updated = [session, ...sessions];
  localStorage.setItem(IPDP_SESSIONS_KEY, JSON.stringify(updated));
  return session;
}

export function deleteIPDPSession(id: string): void {
  const sessions = getSavedIPDPSessions().filter((s) => s.id !== id);
  localStorage.setItem(IPDP_SESSIONS_KEY, JSON.stringify(sessions));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
