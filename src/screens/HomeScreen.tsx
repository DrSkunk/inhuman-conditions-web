import { useState } from "react";
import { useGame } from "../GameContext";

export function HomeScreen() {
  const { createGame, joinGame, state } = useGame();
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");

  const handleJoin = async () => {
    const code = joinCode.trim().toLowerCase();
    if (code.length !== 6) {
      setJoinError("Room code must be 6 characters.");
      return;
    }
    setJoinError("");
    await joinGame(code);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-12 flicker">
        <div className="text-red-700 text-xs tracking-widest mb-3 uppercase">
          BUREAU OF SYNTHETIC RELATIONS — FORM IC-1
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-amber-100 tracking-tight leading-none mb-2">
          INHUMAN
        </h1>
        <h1 className="text-5xl md:text-7xl font-bold text-amber-100 tracking-tight leading-none mb-4">
          CONDITIONS
        </h1>
        <div className="h-px w-64 bg-red-800 mx-auto mb-4" />
        <p className="text-zinc-500 text-sm tracking-widest uppercase">
          Two-Player Interrogation Protocol
        </p>
      </div>

      {/* Error banner */}
      {state.peerError && (
        <div className="w-full max-w-md bg-red-950 border border-red-800 text-red-300 text-sm p-3 mb-6 text-center">
          ⚠ {state.peerError}
        </div>
      )}

      {/* Cards */}
      <div className="w-full max-w-md space-y-4">
        {/* Create Game */}
        <div className="border border-zinc-700 bg-zinc-900 p-6">
          <div className="text-zinc-500 text-xs tracking-widest uppercase mb-3">
            New Session
          </div>
          <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
            Generate a new interrogation session and share the link with the
            Suspect. You will be assigned the role of{" "}
            <span className="text-amber-300">Investigator</span>.
          </p>
          <button
            onClick={createGame}
            className="w-full bg-red-900 hover:bg-red-800 text-amber-100 py-3 px-6 text-sm tracking-widest uppercase transition-colors border border-red-700"
          >
            CREATE GAME
          </button>
        </div>

        {/* Join Game */}
        <div className="border border-zinc-700 bg-zinc-900 p-6">
          <div className="text-zinc-500 text-xs tracking-widest uppercase mb-3">
            Join Session
          </div>
          <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
            Enter a room code to join an existing session. You will be assigned
            the role of <span className="text-amber-300">Suspect</span>.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => {
                setJoinCode(e.target.value.toLowerCase());
                setJoinError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder="room code"
              maxLength={6}
              className="flex-1 bg-zinc-800 border border-zinc-600 text-amber-100 px-3 py-2 text-sm font-mono tracking-widest uppercase placeholder-zinc-600 focus:outline-none focus:border-amber-700"
            />
            <button
              onClick={handleJoin}
              className="bg-zinc-700 hover:bg-zinc-600 text-amber-100 py-2 px-4 text-sm tracking-wider uppercase transition-colors border border-zinc-600"
            >
              JOIN
            </button>
          </div>
          {joinError && (
            <p className="text-red-400 text-xs mt-2">{joinError}</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-zinc-700 text-xs text-center space-y-1">
        <p>BASED ON THE GAME BY TOMMY MARANGES & CARLY NANCE</p>
        <p>robots.management</p>
        <p>
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-500"
          >
            CC BY-NC-SA 4.0
          </a>
        </p>
      </div>
    </div>
  );
}
