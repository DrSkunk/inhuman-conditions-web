import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { GamePeer, type PeerStatus, type GameMessage } from "./peer";
import { buildGameSetup } from "./gameSetup";
import { generateRoomCode } from "./rng";
import type { GameSetup } from "./gameData";

// ─── Types ───────────────────────────────────────────────────────────────────

export type GamePhase =
  | "idle"
  | "connecting"
  | "lobby"
  | "setup"
  | "interview"
  | "result";

export type PlayerRole = "investigator" | "suspect";

export interface GameState {
  phase: GamePhase;
  playerRole: PlayerRole | null;
  roomCode: string | null;
  peerStatus: PeerStatus | null;
  peerError: string | null;
  gameSetup: GameSetup | null;
  guestReady: boolean;
  interviewStartTime: number | null; // ms timestamp
  verdict: "human" | "robot" | null;
}

type Action =
  | { type: "SET_PHASE"; phase: GamePhase }
  | { type: "SET_ROLE"; role: PlayerRole }
  | { type: "SET_ROOM"; roomCode: string }
  | { type: "SET_PEER_STATUS"; status: PeerStatus }
  | { type: "SET_PEER_ERROR"; error: string }
  | { type: "SET_GAME_SETUP"; setup: GameSetup }
  | { type: "SET_GUEST_READY"; ready: boolean }
  | { type: "SET_INTERVIEW_START"; timestamp: number }
  | { type: "SET_VERDICT"; verdict: "human" | "robot" }
  | { type: "RESET" };

const initialState: GameState = {
  phase: "idle",
  playerRole: null,
  roomCode: null,
  peerStatus: null,
  peerError: null,
  gameSetup: null,
  guestReady: false,
  interviewStartTime: null,
  verdict: null,
};

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.phase };
    case "SET_ROLE":
      return { ...state, playerRole: action.role };
    case "SET_ROOM":
      return { ...state, roomCode: action.roomCode };
    case "SET_PEER_STATUS":
      return { ...state, peerStatus: action.status };
    case "SET_PEER_ERROR":
      return { ...state, peerError: action.error, phase: "idle" };
    case "SET_GAME_SETUP":
      return { ...state, gameSetup: action.setup };
    case "SET_GUEST_READY":
      return { ...state, guestReady: action.ready };
    case "SET_INTERVIEW_START":
      return {
        ...state,
        phase: "interview",
        interviewStartTime: action.timestamp,
      };
    case "SET_VERDICT":
      return { ...state, verdict: action.verdict, phase: "result" };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface GameContextValue {
  state: GameState;
  createGame: () => Promise<void>;
  joinGame: (roomCode: string) => Promise<void>;
  startGame: () => void;
  signalGuestReady: () => void;
  startInterview: () => void;
  submitVerdict: (verdict: "human" | "robot") => void;
  playAgain: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const peerRef = useRef<GamePeer | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      peerRef.current?.destroy();
    };
  }, []);

  const handleMessage = useCallback(
    (msg: GameMessage) => {
      switch (msg.type) {
        case "startGame": {
          // Guest receives this: load game setup
          const roomCode = peerRef.current?.roomCode;
          if (!roomCode) return;
          const setup = buildGameSetup(roomCode);
          dispatch({ type: "SET_GAME_SETUP", setup });
          dispatch({ type: "SET_PHASE", phase: "setup" });
          break;
        }
        case "guestReady":
          dispatch({ type: "SET_GUEST_READY", ready: true });
          break;
        case "startInterview":
          dispatch({ type: "SET_INTERVIEW_START", timestamp: msg.timestamp });
          break;
        case "verdict":
          dispatch({ type: "SET_VERDICT", verdict: msg.verdict });
          break;
        case "playAgain": {
          const setup = buildGameSetup(msg.roomCode);
          dispatch({ type: "RESET" });
          dispatch({ type: "SET_ROOM", roomCode: msg.roomCode });
          dispatch({ type: "SET_ROLE", role: "suspect" });
          dispatch({ type: "SET_PEER_STATUS", status: "connected" });
          dispatch({ type: "SET_GAME_SETUP", setup });
          dispatch({ type: "SET_PHASE", phase: "setup" });
          break;
        }
      }
    },
    []
  );

  const handleStatus = useCallback((status: PeerStatus) => {
    dispatch({ type: "SET_PEER_STATUS", status });
    if (status === "connected") {
      dispatch({ type: "SET_PHASE", phase: "lobby" });
    } else if (status === "error") {
      dispatch({
        type: "SET_PEER_ERROR",
        error: "Connection failed. Check the room code and try again.",
      });
    } else if (status === "disconnected") {
      dispatch({ type: "SET_PEER_ERROR", error: "Opponent disconnected." });
    }
  }, []);

  const createGame = useCallback(async () => {
    peerRef.current?.destroy();
    const roomCode = generateRoomCode();
    dispatch({ type: "SET_ROOM", roomCode });
    dispatch({ type: "SET_ROLE", role: "investigator" });
    dispatch({ type: "SET_PHASE", phase: "connecting" });

    const gamePeer = new GamePeer("host", roomCode, handleMessage, handleStatus);
    peerRef.current = gamePeer;

    try {
      await gamePeer.init();
      // URL update
      const url = new URL(window.location.href);
      url.searchParams.set("room", roomCode);
      window.history.replaceState({}, "", url.toString());
    } catch {
      dispatch({
        type: "SET_PEER_ERROR",
        error: "Could not connect to peer network. Please try again.",
      });
    }
  }, [handleMessage, handleStatus]);

  const joinGame = useCallback(
    async (roomCode: string) => {
      peerRef.current?.destroy();
      dispatch({ type: "SET_ROOM", roomCode });
      dispatch({ type: "SET_ROLE", role: "suspect" });
      dispatch({ type: "SET_PHASE", phase: "connecting" });

      const gamePeer = new GamePeer(
        "guest",
        roomCode,
        handleMessage,
        handleStatus
      );
      peerRef.current = gamePeer;

      try {
        await gamePeer.init();
      } catch {
        dispatch({
          type: "SET_PEER_ERROR",
          error: "Could not connect to host. Check the room code and try again.",
        });
      }
    },
    [handleMessage, handleStatus]
  );

  const startGame = useCallback(() => {
    if (!state.roomCode) return;
    const setup = buildGameSetup(state.roomCode);
    dispatch({ type: "SET_GAME_SETUP", setup });
    dispatch({ type: "SET_PHASE", phase: "setup" });
    // Tell guest to start too
    peerRef.current?.send({ type: "startGame" });
  }, [state.roomCode]);

  const signalGuestReady = useCallback(() => {
    peerRef.current?.send({ type: "guestReady" });
  }, []);

  const startInterview = useCallback(() => {
    const timestamp = Date.now();
    dispatch({ type: "SET_INTERVIEW_START", timestamp });
    peerRef.current?.send({ type: "startInterview", timestamp });
  }, []);

  const submitVerdict = useCallback((verdict: "human" | "robot") => {
    dispatch({ type: "SET_VERDICT", verdict });
    peerRef.current?.send({ type: "verdict", verdict });
  }, []);

  const playAgain = useCallback(() => {
    const newRoomCode = generateRoomCode();
    const setup = buildGameSetup(newRoomCode);
    peerRef.current?.send({ type: "playAgain", roomCode: newRoomCode });

    const url = new URL(window.location.href);
    url.searchParams.set("room", newRoomCode);
    window.history.replaceState({}, "", url.toString());

    dispatch({ type: "RESET" });
    dispatch({ type: "SET_ROOM", roomCode: newRoomCode });
    dispatch({ type: "SET_ROLE", role: "investigator" });
    dispatch({ type: "SET_PEER_STATUS", status: "connected" });
    dispatch({ type: "SET_GAME_SETUP", setup });
    dispatch({ type: "SET_PHASE", phase: "setup" });

    // Update peer's room code for future messages
    if (peerRef.current) {
      peerRef.current.roomCode = newRoomCode;
    }
  }, []);

  const resetGame = useCallback(() => {
    peerRef.current?.destroy();
    peerRef.current = null;
    const url = new URL(window.location.href);
    url.searchParams.delete("room");
    window.history.replaceState({}, "", url.toString());
    dispatch({ type: "RESET" });
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        createGame,
        joinGame,
        startGame,
        signalGuestReady,
        startInterview,
        submitVerdict,
        playAgain,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
