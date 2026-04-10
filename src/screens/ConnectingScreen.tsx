import { useGame } from "../GameContext";

export function ConnectingScreen() {
  const { state, resetGame } = useGame();
  const isHost = state.playerRole === "investigator";
  const status = state.peerStatus;

  const statusText = () => {
    if (isHost) {
      if (status === "initializing") return "Connecting to relay network...";
      if (status === "waiting_for_guest")
        return "Waiting for Suspect to join...";
      if (status === "connected") return "Suspect connected!";
      return "Connecting...";
    } else {
      if (status === "initializing" || status === "connecting_to_host")
        return "Connecting to Investigator...";
      if (status === "connected") return "Connected to Investigator!";
      return "Connecting...";
    }
  };

  const shareUrl =
    isHost && state.roomCode
      ? `${window.location.origin}${window.location.pathname}?room=${state.roomCode}`
      : null;

  const copyUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-zinc-600 text-xs tracking-widest uppercase mb-4">
            {isHost ? "INVESTIGATOR TERMINAL" : "SUSPECT INTAKE"}
          </div>
          <div className="text-amber-100 text-2xl font-bold tracking-wide mb-2">
            {isHost ? "SESSION INITIATED" : "JOINING SESSION"}
          </div>
          <div className="h-px w-48 bg-zinc-700 mx-auto" />
        </div>

        {/* Status */}
        <div className="border border-zinc-700 bg-zinc-900 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-amber-400 rounded-full blink flex-shrink-0" />
            <span className="text-amber-200 text-sm tracking-wide">
              {statusText()}
            </span>
          </div>

          {state.roomCode && (
            <div className="border-t border-zinc-800 pt-4">
              <div className="text-zinc-500 text-xs tracking-widest uppercase mb-2">
                Room Code
              </div>
              <div className="text-amber-100 font-mono text-2xl tracking-widest uppercase">
                {state.roomCode}
              </div>
            </div>
          )}
        </div>

        {/* Share URL (host only) */}
        {shareUrl && status === "waiting_for_guest" && (
          <div className="border border-zinc-700 bg-zinc-900 p-6 mb-6">
            <div className="text-zinc-500 text-xs tracking-widest uppercase mb-3">
              Share This Link With The Suspect
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

        {/* Instructions */}
        <div className="text-zinc-600 text-xs text-center space-y-1">
          {isHost ? (
            <p>
              The Suspect must open the shared link to establish a peer-to-peer
              connection.
            </p>
          ) : (
            <p>Establishing secure peer-to-peer connection...</p>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={resetGame}
            className="text-zinc-600 hover:text-zinc-400 text-xs tracking-widest uppercase transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
