import { useState, useRef } from "react";
import { Button } from "./Button";
import { TextField } from "./TextField";
import { useGameStore } from "../store/gameStore";
import { FullScreenContainer } from "./FullScreenContainer";
import {
  ArrowLeftIcon,
  PlusIcon,
  PlayIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";

interface SetupScreenProps {
  onStartGame: () => void;
  onBack: () => void;
}

export const SetupScreen = ({ onStartGame, onBack }: SetupScreenProps) => {
  const [playerName, setPlayerName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { players, addPlayer, removePlayer, startGame, resetPlayers } =
    useGameStore();

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
    inputRef.current?.focus();
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
      <div className="p-4 bg-gray-50 shadow-sm relative">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2 absolute top-1/2 -translate-y-1/2 left-4 bg-white rounded-full p-2"
          aria-label="Retour"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-center">Configuration du jeu</h1>
      </div>

      {/* Main content with scroll */}
      <div className="flex-1 overflow-y-auto p-4 bg-white flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-medium">Joueurs ({players.length})</h2>
          <Button
            onClick={resetPlayers}
            variant="secondary"
            className="flex items-center justify-center bg-white hover:bg-red-50 text-red-600 hover:text-red-700 shadow-sm"
            disabled={players.length === 0}
          >
            <TrashIcon className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto flex justify-center items-center">
          {players.length === 0 && (
            <p className="text-gray-500 italic text-center py-4 ">
              Aucun joueur ajouté
            </p>
          )}
        </div>
        <div className="mb-6">
          {players.length !== 0 && (
            <ul className="bg-gray-50 rounded-lg divide-y divide-gray-100 overflow-hidden shadow-sm">
              {players.map((player) => (
                <li
                  key={player.id}
                  className="flex justify-between items-center p-3 hover:bg-gray-100 transition-colors"
                >
                  <span>{player.name}</span>
                  <button
                    onClick={() => handleRemovePlayer(player.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
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
      <div className="p-4 bg-gray-50 shadow-sm">
        <div className="flex flex-col gap-3">
          <TextField
            ref={inputRef}
            label="Nom du joueur"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ex: Inspecteur shadow"
            error={errorMessage}
            className="flex-1 bg-white"
          />
          <Button
            onClick={handleAddPlayer}
            variant="secondary"
            fullWidth
            className="flex items-center justify-center bg-white hover:bg-gray-50 shadow-sm"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Ajouter un joueur
          </Button>

          <Button
            onClick={handleStartGame}
            disabled={players.length < 2}
            fullWidth
            className="flex items-center justify-center shadow-sm"
          >
            <PlayIcon className="h-5 w-5 mr-2" />
            Commencer la partie
          </Button>
        </div>
      </div>
    </FullScreenContainer>
  );
};
