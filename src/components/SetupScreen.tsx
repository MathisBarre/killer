import { useState } from "react";
import { Button } from "./Button";
import { TextField } from "./TextField";
import { useGameStore } from "../store/gameStore";
import { FullScreenContainer } from "./FullScreenContainer";

interface SetupScreenProps {
  onStartGame: () => void;
  onBack: () => void;
}

export const SetupScreen = ({ onStartGame, onBack }: SetupScreenProps) => {
  const [playerName, setPlayerName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { players, addPlayer, removePlayer, startGame } = useGameStore();

  const handleAddPlayer = () => {
    const trimmedName = playerName.trim();

    if (!trimmedName) {
      setErrorMessage("Veuillez entrer un nom");
      return;
    }

    if (players.some((p) => p.name === trimmedName)) {
      setErrorMessage("Ce nom existe déjà");
      return;
    }

    addPlayer(trimmedName);
    setPlayerName("");
    setErrorMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddPlayer();
    }
  };

  const handleRemovePlayer = (id: string) => {
    removePlayer(id);
  };

  const handleStartGame = () => {
    if (players.length < 3) {
      setErrorMessage(
        "Il faut au moins 3 joueurs pour une partie intéressante"
      );
      return;
    }

    try {
      startGame();
      onStartGame();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Une erreur est survenue");
      }
    }
  };

  return (
    <FullScreenContainer>
      {/* Header */}
      <div className="p-4 border-b">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800"
          aria-label="Retour"
        >
          ← Retour
        </button>
        <h1 className="text-2xl font-bold text-center mt-2">
          Configuration du jeu
        </h1>
      </div>

      {/* Main content with scroll */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <div className="flex gap-2 mb-2">
            <TextField
              label="Nom du joueur"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Entrez un nom ou surnom"
              error={errorMessage}
              className="flex-1"
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-medium mb-3">
            Joueurs ({players.length})
          </h2>
          {players.length === 0 ? (
            <p className="text-gray-500 italic text-center py-4">
              Aucun joueur ajouté
            </p>
          ) : (
            <ul className="border rounded-lg divide-y overflow-hidden">
              {players.map((player) => (
                <li
                  key={player.id}
                  className="flex justify-between items-center p-3 hover:bg-gray-50"
                >
                  <span>{player.name}</span>
                  <button
                    onClick={() => handleRemovePlayer(player.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Supprimer"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Fixed footer with actions */}
      <div className="p-4 border-t bg-white">
        <div className="flex flex-col gap-3">
          <Button onClick={handleAddPlayer} variant="secondary" fullWidth>
            Ajouter un joueur
          </Button>
          <Button
            onClick={handleStartGame}
            disabled={players.length < 2}
            fullWidth
          >
            Commencer la partie
          </Button>
        </div>
      </div>
    </FullScreenContainer>
  );
};
