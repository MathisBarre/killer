import { useState } from "react";
import { LandingScreen } from "./components/LandingScreen";
import { SetupScreen } from "./components/SetupScreen";
import { PlayerList } from "./components/PlayerList";
import { PlayerDetails } from "./components/PlayerDetails";
import { useGameStore } from "./store/gameStore";

type AppScreen = "landing" | "setup" | "player-list" | "player-details";

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("landing");
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const { resetGame, setStatus } = useGameStore();

  const handleStartGame = () => {
    setCurrentScreen("setup");
    setStatus("setup");
  };

  const handleSetupComplete = () => {
    setCurrentScreen("player-list");
  };

  const handleSelectPlayer = (playerId: string) => {
    setSelectedPlayerId(playerId);
    setCurrentScreen("player-details");
  };

  const handleBackToPlayerList = () => {
    setSelectedPlayerId(null);
    setCurrentScreen("player-list");
  };

  const handleResetGame = () => {
    resetGame();
    setCurrentScreen("landing");
  };

  return (
    <div className="bg-white min-h-screen text-gray-900">
      {currentScreen === "landing" && (
        <LandingScreen onStartGame={handleStartGame} />
      )}

      {currentScreen === "setup" && (
        <SetupScreen
          onStartGame={handleSetupComplete}
          onBack={() => setCurrentScreen("landing")}
        />
      )}

      {currentScreen === "player-list" && (
        <PlayerList
          onSelectPlayer={handleSelectPlayer}
          onResetGame={handleResetGame}
        />
      )}

      {currentScreen === "player-details" && selectedPlayerId && (
        <PlayerDetails
          playerId={selectedPlayerId}
          onBack={handleBackToPlayerList}
          onEliminate={handleBackToPlayerList}
        />
      )}
    </div>
  );
}

export default App;
