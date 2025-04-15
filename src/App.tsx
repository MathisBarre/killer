import { LandingScreen } from "./components/LandingScreen";
import { SetupScreen } from "./components/SetupScreen";
import { PlayerList } from "./components/PlayerList";
import { PlayerDetails } from "./components/PlayerDetails";
import { useGameStore } from "./store/gameStore";
import { useLocalStorage } from "./utils/useLocalStorage";
import { Analytics } from "@vercel/analytics/react";

type AppScreen = "landing" | "setup" | "player-list" | "player-details";

function App() {
  const [currentScreen, setCurrentScreen] = useLocalStorage<AppScreen>(
    "currentScreen",
    "landing"
  );

  const [selectedPlayerId, setSelectedPlayerId] = useLocalStorage<
    string | null
  >("selectedPlayerId", null);

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
    <>
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
            onBack={() => setCurrentScreen("setup")}
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
      <Analytics />
    </>
  );
}

export default App;
