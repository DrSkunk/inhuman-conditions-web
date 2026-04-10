import { useGame } from "../GameContext";

function determineOutcome(
  verdict: "human" | "robot" | null,
  actualRole: "human" | "robot",
  isViolentRobot: boolean
): { winner: string; description: string; color: string } {
  if (verdict === "human" && actualRole === "human") {
    return {
      winner: "BOTH PLAYERS WIN",
      description:
        "The Investigator correctly identified the Subject as Human. The Subject successfully proved their humanity.",
      color: "text-green-400",
    };
  }
  if (verdict === "robot" && actualRole === "robot") {
    return {
      winner: "INVESTIGATOR WINS",
      description:
        "The Investigator correctly identified the Subject as a Robot. The Robot has been decommissioned.",
      color: "text-amber-400",
    };
  }
  if (verdict === "human" && actualRole === "robot") {
    return {
      winner: "ROBOT WINS",
      description: isViolentRobot
        ? "The Violent Robot successfully deceived the Investigator and achieved its objective."
        : "The Patient Robot successfully passed as human. The Investigator was fooled.",
      color: "text-red-400",
    };
  }
  // verdict === "robot" && actualRole === "human"
  return {
    winner: "BOTH PLAYERS LOSE",
    description:
      "The Investigator incorrectly stamped an innocent Human as a Robot. A grave error.",
    color: "text-zinc-400",
  };
}

export function ResultScreen() {
  const { state, playAgain, resetGame } = useGame();

  if (!state.gameSetup || !state.verdict) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500 text-sm blink">Loading...</div>
      </div>
    );
  }

  const { gameSetup, verdict, playerRole } = state;
  const { suspectRole, background } = gameSetup;

  const actualRole: "human" | "robot" =
    suspectRole.kind === "human" ? "human" : "robot";
  const isViolentRobot =
    suspectRole.kind === "robot" && suspectRole.card.type === "violent";

  const outcome = determineOutcome(verdict, actualRole, isViolentRobot);

  const verdictCorrect = verdict === actualRole;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-start p-6 pt-10">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-zinc-600 text-xs tracking-widest uppercase mb-3">
            CASE FILE CLOSED
          </div>
          <h2 className="text-amber-100 text-2xl font-bold tracking-wide mb-4">
            INVESTIGATION COMPLETE
          </h2>
          <div className="h-px w-48 bg-zinc-700 mx-auto" />
        </div>

        {/* Verdict stamp */}
        <div className="border border-zinc-700 bg-zinc-900 p-6 mb-4 text-center">
          <div className="text-zinc-500 text-xs tracking-widest uppercase mb-3">
            Investigator's Verdict
          </div>
          <div
            className={`stamp inline-block ${
              verdict === "human" ? "stamp-human" : "stamp-robot"
            }`}
          >
            {verdict.toUpperCase()}
          </div>
        </div>

        {/* Actual role reveal */}
        <div className="border border-zinc-700 bg-zinc-900 p-6 mb-4">
          <div className="text-zinc-500 text-xs tracking-widest uppercase mb-3">
            Subject's True Nature
          </div>
          <div
            className={`text-xl font-bold mb-2 ${
              actualRole === "human" ? "text-green-400" : "text-red-400"
            }`}
          >
            {suspectRole.kind === "human"
              ? "HUMAN"
              : suspectRole.card.type === "patient"
              ? "PATIENT ROBOT"
              : "VIOLENT ROBOT"}
          </div>
          {suspectRole.kind !== "human" && (
            <>
              <div className="text-amber-200 font-bold mb-2">
                {suspectRole.card.name}
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {suspectRole.card.malfunction}
              </p>
              {suspectRole.card.type === "violent" && (
                <div className="mt-3 pt-3 border-t border-zinc-700">
                  <span className="text-red-600 text-xs tracking-widest uppercase">
                    Kill Condition:{" "}
                  </span>
                  <span className="text-red-300 text-sm">
                    {suspectRole.card.killCondition}
                  </span>
                </div>
              )}
            </>
          )}
          {suspectRole.kind === "human" && (
            <>
              <div className="text-amber-200 font-bold mb-2">
                {suspectRole.card.name}
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {suspectRole.card.description}
              </p>
            </>
          )}
        </div>

        {/* Subject info */}
        <div className="border border-zinc-700 bg-zinc-900 p-4 mb-4">
          <div className="text-zinc-500 text-xs tracking-widest uppercase mb-2">
            Subject
          </div>
          <div className="text-amber-100 font-bold">{background.subjectName}</div>
          <div className="text-zinc-400 text-sm">{background.occupation}</div>
        </div>

        {/* Outcome */}
        <div
          className={`border p-6 mb-6 text-center ${
            verdictCorrect && actualRole === "human"
              ? "border-green-800 bg-green-950/20"
              : verdictCorrect && actualRole === "robot"
              ? "border-amber-800 bg-amber-950/20"
              : "border-red-800 bg-red-950/20"
          }`}
        >
          <div className={`text-2xl font-bold mb-3 ${outcome.color}`}>
            {outcome.winner}
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {outcome.description}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {playerRole === "investigator" && (
            <button
              onClick={playAgain}
              className="w-full bg-red-900 hover:bg-red-800 text-amber-100 py-3 px-6 text-sm tracking-widest uppercase transition-colors border border-red-700"
            >
              PLAY AGAIN (SWAP ROLES)
            </button>
          )}
          {playerRole === "suspect" && (
            <div className="text-center text-zinc-500 text-sm py-3">
              Waiting for Investigator to start a new game...
            </div>
          )}
          <button
            onClick={resetGame}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 py-3 px-6 text-sm tracking-widest uppercase transition-colors border border-zinc-700"
          >
            RETURN TO MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}
