import { useEffect, useState } from "react";
import { useGame } from "../GameContext";
import type { GameSetup } from "../gameData";

const INTERVIEW_DURATION_MS = 5 * 60 * 1000; // 5 minutes

function useCountdown(startTime: number | null) {
  const [remaining, setRemaining] = useState<number>(INTERVIEW_DURATION_MS);

  useEffect(() => {
    if (!startTime) return;

    const update = () => {
      const elapsed = Date.now() - startTime;
      const left = Math.max(0, INTERVIEW_DURATION_MS - elapsed);
      setRemaining(left);
    };

    update();
    const id = setInterval(update, 250);
    return () => clearInterval(id);
  }, [startTime]);

  return remaining;
}

function formatTime(ms: number): string {
  const totalSecs = Math.ceil(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function TimerDisplay({ remaining }: { remaining: number }) {
  const isWarning = remaining < 60_000;
  const isCritical = remaining < 20_000;

  const colorClass = isCritical
    ? "timer-critical text-red-500"
    : isWarning
    ? "timer-warning text-amber-400"
    : "text-amber-100";

  return (
    <div
      className={`font-mono text-6xl font-bold tracking-widest ${colorClass}`}
    >
      {formatTime(remaining)}
    </div>
  );
}

function InvestigatorInterview({
  setup,
  remaining,
}: {
  setup: GameSetup;
  remaining: number;
}) {
  const { submitVerdict } = useGame();
  const [checkedPrompts, setCheckedPrompts] = useState<Set<number>>(new Set());

  const togglePrompt = (i: number) => {
    setCheckedPrompts((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  };

  const isExpired = remaining === 0;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center p-4 pt-6">
      <div className="w-full max-w-xl">
        {/* Timer */}
        <div className="text-center mb-6">
          <div className="text-zinc-600 text-xs tracking-widest uppercase mb-2">
            Interview Timer
          </div>
          <TimerDisplay remaining={remaining} />
          {isExpired && (
            <div className="text-red-400 text-sm tracking-widest uppercase mt-2 blink">
              TIME EXPIRED — MAKE YOUR VERDICT
            </div>
          )}
        </div>

        {/* Module */}
        <div className="border border-amber-900/50 bg-zinc-900 px-4 py-3 mb-4">
          <span className="text-amber-700 text-xs tracking-widest uppercase">
            Module:{" "}
          </span>
          <span className="text-amber-200 text-sm font-bold">
            {setup.module.name.toUpperCase()}
          </span>
        </div>

        {/* Prompts checklist */}
        <div className="border border-zinc-700 bg-zinc-900 p-4 mb-4">
          <div className="text-zinc-500 text-xs tracking-widest uppercase mb-3">
            Interview Prompts — tick when asked
          </div>
          <div className="space-y-3">
            {setup.selectedPrompts.map((prompt, i) => (
              <label
                key={i}
                className="flex gap-3 cursor-pointer group"
                onClick={() => togglePrompt(i)}
              >
                <div
                  className={`w-5 h-5 border flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors ${
                    checkedPrompts.has(i)
                      ? "bg-red-900 border-red-700"
                      : "border-zinc-600 group-hover:border-zinc-400"
                  }`}
                >
                  {checkedPrompts.has(i) && (
                    <span className="text-amber-200 text-xs">✓</span>
                  )}
                </div>
                <span
                  className={`text-sm leading-relaxed transition-colors ${
                    checkedPrompts.has(i) ? "text-zinc-500 line-through" : "text-zinc-300"
                  }`}
                >
                  {prompt}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Subject background quick ref */}
        <div className="border border-zinc-800 bg-zinc-950 px-4 py-3 mb-6 text-xs text-zinc-600">
          <span className="text-zinc-500">Subject: </span>
          {setup.background.subjectName} · {setup.background.occupation}
        </div>

        {/* Deliberation controls — always visible for investigator */}
        {!isExpired ? (
          <div className="mt-6">
            <div className="text-zinc-600 text-xs text-center tracking-widest uppercase mb-3">
              Early Verdict
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => submitVerdict("human")}
                className="flex-1 border border-green-900 text-green-700 px-4 py-2 text-xs font-bold tracking-widest hover:bg-green-950/40 transition-colors uppercase"
              >
                STAMP HUMAN
              </button>
              <button
                onClick={() => submitVerdict("robot")}
                className="flex-1 border border-red-900 text-red-700 px-4 py-2 text-xs font-bold tracking-widest hover:bg-red-950/40 transition-colors uppercase"
              >
                STAMP ROBOT
              </button>
            </div>
          </div>
        ) : (
          <div className="border border-red-900 bg-red-950/20 p-4 text-center">
            <div className="text-zinc-400 text-sm mb-4">
              The interview has concluded. Make your determination.
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => submitVerdict("human")}
                className="flex-1 border-4 border-green-800 text-green-600 py-4 text-lg font-bold tracking-widest hover:bg-green-950/40 transition-colors uppercase"
              >
                HUMAN
              </button>
              <button
                onClick={() => submitVerdict("robot")}
                className="flex-1 border-4 border-red-800 text-red-600 py-4 text-lg font-bold tracking-widest hover:bg-red-950/40 transition-colors uppercase"
              >
                ROBOT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SuspectInterview({
  setup,
  remaining,
}: {
  setup: GameSetup;
  remaining: number;
}) {
  const { suspectRole, penalty } = setup;
  const isExpired = remaining === 0;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center p-4 pt-6">
      <div className="w-full max-w-xl">
        {/* Timer */}
        <div className="text-center mb-6">
          <div className="text-zinc-600 text-xs tracking-widest uppercase mb-2">
            Interview Timer
          </div>
          <TimerDisplay remaining={remaining} />
          {isExpired && (
            <div className="text-zinc-400 text-sm tracking-widest uppercase mt-2">
              AWAITING INVESTIGATOR'S VERDICT
            </div>
          )}
        </div>

        {/* Role reminder */}
        <div
          className={`border p-4 mb-4 ${
            suspectRole.kind === "human"
              ? "border-green-900 bg-green-950/20"
              : suspectRole.card.type === "patient"
              ? "border-blue-900 bg-blue-950/20"
              : "border-red-900 bg-red-950/20"
          }`}
        >
          <div
            className={`text-xs tracking-widest uppercase mb-1 ${
              suspectRole.kind === "human"
                ? "text-green-700"
                : suspectRole.card.type === "patient"
                ? "text-blue-700"
                : "text-red-700"
            }`}
          >
            You Are:{" "}
            {suspectRole.kind === "human"
              ? "Human"
              : suspectRole.card.type === "patient"
              ? "Patient Robot"
              : "Violent Robot"}
          </div>
          <div className="text-amber-100 font-bold text-lg mb-2">
            {suspectRole.kind === "human"
              ? suspectRole.card.name
              : suspectRole.card.name}
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed">
            {suspectRole.kind === "human"
              ? suspectRole.card.description
              : suspectRole.card.malfunction}
          </p>

          {suspectRole.kind === "robot" &&
            suspectRole.card.type === "violent" && (
              <div className="mt-3 pt-3 border-t border-red-900/50">
                <span className="text-red-600 text-xs tracking-widest uppercase">
                  Kill Condition:{" "}
                </span>
                <span className="text-red-300 text-sm">
                  {suspectRole.card.killCondition}
                </span>
              </div>
            )}
        </div>

        {/* Penalty reminder (robots only) */}
        {suspectRole.kind === "robot" && (
          <div className="border border-zinc-700 bg-zinc-900 p-4 mb-4">
            <div className="text-zinc-500 text-xs tracking-widest uppercase mb-2">
              Your Penalty (if caught)
            </div>
            <p className="text-amber-200 text-sm leading-relaxed">
              {penalty.action}
            </p>
          </div>
        )}

        {/* Module reminder */}
        <div className="border border-zinc-800 bg-zinc-950 px-4 py-3 text-xs text-zinc-600">
          <span className="text-zinc-500">Module: </span>
          {setup.module.name}
        </div>
      </div>
    </div>
  );
}

export function InterviewScreen() {
  const { state } = useGame();
  const remaining = useCountdown(state.interviewStartTime);

  if (!state.gameSetup) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500 text-sm blink">Loading...</div>
      </div>
    );
  }

  if (state.playerRole === "investigator") {
    return (
      <InvestigatorInterview setup={state.gameSetup} remaining={remaining} />
    );
  }
  return <SuspectInterview setup={state.gameSetup} remaining={remaining} />;
}
