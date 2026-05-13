export type StudyRoutineStepId = "read" | "run" | "observe" | "explain";
export type PracticeLoopStepId = "build" | "break" | "observe" | "explain" | "proof";

export type LearningLoopStep<TId extends string = string> = {
  id: TId;
  label: string;
  detail: string;
};

export const studyRoutineSteps = [
  {
    id: "read",
    label: "Read the story",
    detail: "Start with why the idea exists and what problem forced engineers to solve."
  },
  {
    id: "run",
    label: "Run one thing",
    detail: "Use the smallest example that proves the concept before jumping into a project."
  },
  {
    id: "observe",
    label: "Watch the evidence",
    detail: "Look at logs, thread names, offsets, indexes, latency, or container state."
  },
  {
    id: "explain",
    label: "Explain it back",
    detail: "Close the page only when you can say the idea, the failure, and the fix simply."
  }
] as const satisfies readonly LearningLoopStep<StudyRoutineStepId>[];

export const practiceLoopSteps = [
  { id: "build", label: "Build", detail: "Make the smallest working version." },
  { id: "break", label: "Break safely", detail: "Force the failure while it is safe." },
  { id: "observe", label: "Observe", detail: "Collect proof from logs, metrics, or behavior." },
  { id: "explain", label: "Explain", detail: "Say the reason in your own words." },
  { id: "proof", label: "Proof", detail: "Keep one clear check that shows the idea is yours." }
] as const satisfies readonly LearningLoopStep<PracticeLoopStepId>[];
