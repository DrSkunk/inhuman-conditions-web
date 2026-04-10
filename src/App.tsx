import { useEffect } from "react";
import { GameProvider, useGame } from "./GameContext";
import { HomeScreen } from "./screens/HomeScreen";
import { ConnectingScreen } from "./screens/ConnectingScreen";
import { LobbyScreen } from "./screens/LobbyScreen";
import { SetupScreen } from "./screens/SetupScreen";
import { InterviewScreen } from "./screens/InterviewScreen";
import { ResultScreen } from "./screens/ResultScreen";

function AppRoutes() {
  const { state, joinGame } = useGame();

  // On mount, check URL for room parameter and auto-join as guest
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get("room");
    if (room && state.phase === "idle") {
      joinGame(room);
    }
    // We only want this to run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  switch (state.phase) {
    case "idle":
      return <HomeScreen />;
    case "connecting":
      return <ConnectingScreen />;
    case "lobby":
      return <LobbyScreen />;
    case "setup":
      return <SetupScreen />;
    case "interview":
      return <InterviewScreen />;
    case "result":
      return <ResultScreen />;
    default:
      return <HomeScreen />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <AppRoutes />
    </GameProvider>
  );
}
