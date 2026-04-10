import { useGame } from "../GameContext";
import type { GameSetup } from "../gameData";

function InvestigatorSetup({ setup }: { setup: GameSetup }) {
  const { startInterview } = useGame();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-start p-6 pt-10">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="text-zinc-600 text-xs tracking-widest uppercase mb-2">
            INVESTIGATOR DOSSIER
          </div>
          <h2 className="text-amber-100 text-2xl font-bold tracking-wide">
            INTERVIEW BRIEFING
          </h2>
          <div className="h-px w-48 bg-zinc-700 mx-auto mt-3" />
        </div>

        {/* Module Card */}
        <div className="border border-amber-900 bg-zinc-900 p-5 mb-4">
          <div className="text-amber-700 text-xs tracking-widest uppercase mb-2">
            Interview Module
          </div>
          <div className="text-amber-200 font-bold text-lg mb-2">
            {setup.module.name.toUpperCase()}
          </div>
          <p className="text-zinc-400 text-sm italic">{setup.module.description}</p>
        </div>

        {/* Subject background */}
        <div className="border border-zinc-700 bg-zinc-900 p-5 mb-4">
          <div className="text-zinc-500 text-xs tracking-widest uppercase mb-3">
            Subject Background
          </div>
          <div className="text-amber-100 font-bold">{setup.background.subjectName}</div>
          <div className="text-zinc-400 text-sm">{setup.background.occupation}</div>
          <div className="text-zinc-500 text-sm mt-2 italic">
            "{setup.background.detail}"
          </div>
        </div>

        {/* Prompts */}
        <div className="border border-zinc-700 bg-zinc-900 p-5 mb-6">
          <div className="text-zinc-500 text-xs tracking-widest uppercase mb-3">
            Interview Prompts
          </div>
          <p className="text-zinc-500 text-xs mb-4">
            Use these prompts to guide the interview. Ask follow-up questions as needed. You have 5 minutes.
          </p>
          <ol className="space-y-3">
            {setup.selectedPrompts.map((prompt, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-red-700 text-sm font-bold flex-shrink-0 w-5">
                  {i + 1}.
                </span>
                <span className="text-zinc-300 text-sm leading-relaxed">{prompt}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Instructions */}
        <div className="border border-zinc-800 bg-zinc-950 p-4 mb-6 text-xs text-zinc-600 space-y-2">
          <p>
            <span className="text-zinc-500">OBJECTIVE:</span> Determine whether
            the Subject is Human or a Robot.
          </p>
          <p>
            <span className="text-zinc-500">TIMER:</span> You have exactly five minutes. Ask your
            prompts and any follow-up questions you need.
          </p>
          <p>
            <span className="text-zinc-500">VERDICT:</span> At the end, you will
            stamp the subject HUMAN or ROBOT.
          </p>
        </div>

        <button
          onClick={startInterview}
          className="w-full bg-red-900 hover:bg-red-800 text-amber-100 py-4 px-6 text-sm tracking-widest uppercase transition-colors border border-red-700 font-bold"
        >
          START INTERVIEW
        </button>
      </div>
    </div>
  );
}

function SuspectSetup({ setup }: { setup: GameSetup }) {
  const { signalGuestReady, state } = useGame();
  const { suspectRole, background, penalty } = setup;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-start p-6 pt-10">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="text-zinc-600 text-xs tracking-widest uppercase mb-2">
            SUSPECT INTAKE FORM
          </div>
          <h2 className="text-amber-100 text-2xl font-bold tracking-wide">
            YOUR ASSIGNMENT
          </h2>
          <div className="h-px w-48 bg-zinc-700 mx-auto mt-3" />
        </div>

        {/* Role Card */}
        <div
          className={`border p-5 mb-4 ${
            suspectRole.kind === "human"
              ? "border-green-900 bg-green-950/20"
              : suspectRole.card.type === "patient"
              ? "border-blue-900 bg-blue-950/20"
              : "border-red-900 bg-red-950/20"
          }`}
        >
          <div
            className={`text-xs tracking-widest uppercase mb-2 ${
              suspectRole.kind === "human"
                ? "text-green-700"
                : suspectRole.card.type === "patient"
                ? "text-blue-700"
                : "text-red-700"
            }`}
          >
            {suspectRole.kind === "human"
              ? "Human"
              : suspectRole.card.type === "patient"
              ? "Patient Robot"
              : "Violent Robot"}
          </div>
          <div className="text-amber-100 font-bold text-xl mb-3">
            {suspectRole.card.name}
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed">
            {suspectRole.kind === "human"
              ? suspectRole.card.description
              : suspectRole.card.malfunction}
          </p>

          {suspectRole.kind === "robot" &&
            suspectRole.card.type === "violent" && (
              <div className="mt-4 pt-4 border-t border-red-900/50">
                <div className="text-red-600 text-xs tracking-widest uppercase mb-2">
                  Kill Condition
                </div>
                <p className="text-red-300 text-sm leading-relaxed">
                  {suspectRole.card.killCondition}
                </p>
                {suspectRole.card.strategy && (
                  <p className="text-zinc-500 text-xs mt-2 italic">
                    Strategy: {suspectRole.card.strategy}
                  </p>
                )}
              </div>
            )}
        </div>

        {/* Background Card */}
        <div className="border border-zinc-700 bg-zinc-900 p-5 mb-4">
          <div className="text-zinc-500 text-xs tracking-widest uppercase mb-3">
            Your Background (You Are Playing As...)
          </div>
          <div className="text-amber-100 font-bold">{background.subjectName}</div>
          <div className="text-zinc-400 text-sm">{background.occupation}</div>
          <div className="text-zinc-500 text-sm mt-2 italic">
            "{background.detail}"
          </div>
          <p className="text-zinc-600 text-xs mt-3">
            You may use this background or not. It is here for flavor.
          </p>
        </div>

        {/* Penalty Card (robots only) */}
        {suspectRole.kind === "robot" && (
          <div className="border border-zinc-700 bg-zinc-900 p-5 mb-4">
            <div className="text-zinc-500 text-xs tracking-widest uppercase mb-2">
              Penalty
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              If the Investigator catches you breaking your malfunction rule, you
              must perform the following penalty action:
            </p>
            <div className="mt-3 p-3 bg-zinc-800 border border-zinc-700">
              <p className="text-amber-200 text-sm leading-relaxed">
                {penalty.action}
              </p>
            </div>
          </div>
        )}

        {/* Module info */}
        <div className="border border-zinc-800 bg-zinc-950 p-4 mb-6 text-xs text-zinc-600">
          <p>
            <span className="text-zinc-500">MODULE:</span>{" "}
            {setup.module.name} — {setup.module.description}
          </p>
        </div>

        <button
          onClick={signalGuestReady}
          disabled={state.guestReady}
          className="w-full bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-amber-100 py-4 px-6 text-sm tracking-widest uppercase transition-colors border border-zinc-600 font-bold"
        >
          {state.guestReady ? "READY — WAITING FOR INVESTIGATOR ✓" : "I AM READY"}
        </button>
      </div>
    </div>
  );
}

export function SetupScreen() {
  const { state } = useGame();

  if (!state.gameSetup) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500 text-sm blink">Loading...</div>
      </div>
    );
  }

  if (state.playerRole === "investigator") {
    return <InvestigatorSetup setup={state.gameSetup} />;
  }
  return <SuspectSetup setup={state.gameSetup} />;
}
