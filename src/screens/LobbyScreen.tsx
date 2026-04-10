import { useGame } from "../GameContext";

export function LobbyScreen() {
  const { state, startGame, signalGuestReady, resetGame } = useGame();
  const isInvestigator = state.playerRole === "investigator";

  const shareUrl = state.roomCode
    ? `${window.location.origin}${window.location.pathname}?room=${state.roomCode}`
    : "";

  const copyUrl = () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-zinc-600 text-xs tracking-widest uppercase mb-3">
            {isInvestigator ? "INVESTIGATOR TERMINAL" : "SUSPECT INTAKE"}
          </div>
          <div className="text-green-500 text-sm tracking-widest uppercase mb-2 flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
            CONNECTION ESTABLISHED
          </div>
          <div className="h-px w-48 bg-zinc-700 mx-auto" />
        </div>

        {/* Role card */}
        <div className="border border-zinc-700 bg-zinc-900 p-6 mb-4">
          <div className="text-zinc-500 text-xs tracking-widest uppercase mb-3">
            Your Role
          </div>
          <div className="text-amber-200 text-xl font-bold tracking-wide mb-2">
            {isInvestigator ? "INVESTIGATOR" : "SUSPECT"}
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {isInvestigator
              ? "You will conduct the interview. It is your job to determine whether the Suspect is Human or a Robot."
              : "You will be interviewed. You may be Human, a Patient Robot, or a Violent Robot. Your role is assigned at game start."}
          </p>
        </div>

        {/* Share link (investigator) */}
        {isInvestigator && (
          <div className="border border-zinc-700 bg-zinc-900 p-6 mb-4">
            <div className="text-zinc-500 text-xs tracking-widest uppercase mb-3">
              Invite Link
            </div>
            <div className="bg-zinc-800 border border-zinc-700 p-3 mb-3 break-all">
              <span className="text-amber-200 text-xs font-mono">{shareUrl}</span>
            </div>
            <button
              onClick={copyUrl}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-amber-100 py-2 px-4 text-sm tracking-widest uppercase transition-colors border border-zinc-600"
            >
              COPY LINK
            </button>
          </div>
        )}

        {/* Guest ready / Host start */}
        {isInvestigator ? (
          <div className="border border-zinc-700 bg-zinc-900 p-6 mb-4">
            <div className="flex items-center gap-3 mb-4">
              {state.guestReady ? (
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block flex-shrink-0" />
              ) : (
                <span className="w-2 h-2 bg-zinc-600 rounded-full inline-block flex-shrink-0 blink" />
              )}
              <span className="text-zinc-400 text-sm">
                {state.guestReady
                  ? "Suspect is ready."
                  : "Waiting for Suspect to ready up..."}
              </span>
            </div>
            <button
              onClick={startGame}
              disabled={!state.guestReady}
              className="w-full bg-red-900 hover:bg-red-800 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-amber-100 py-3 px-6 text-sm tracking-widest uppercase transition-colors border border-red-700 disabled:border-zinc-700"
            >
              BEGIN INTERROGATION
            </button>
          </div>
        ) : (
          <div className="border border-zinc-700 bg-zinc-900 p-6 mb-4">
            <p className="text-zinc-400 text-sm mb-4">
              Signal that you are ready. The Investigator will start the
              session.
            </p>
            <button
              onClick={signalGuestReady}
              disabled={state.guestReady}
              className="w-full bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-amber-100 py-3 px-6 text-sm tracking-widest uppercase transition-colors border border-zinc-600"
            >
              {state.guestReady ? "READY ✓" : "READY"}
            </button>
            {state.guestReady && (
              <p className="text-zinc-500 text-xs text-center mt-3">
                Waiting for Investigator to begin...
              </p>
            )}
          </div>
        )}

        <div className="text-center mt-4">
          <button
            onClick={resetGame}
            className="text-zinc-600 hover:text-zinc-400 text-xs tracking-widest uppercase transition-colors"
          >
            LEAVE SESSION
          </button>
        </div>
      </div>
    </div>
  );
}
