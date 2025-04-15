import { FullScreenContainer } from "./FullScreenContainer";
import { Button } from "./Button";
import { useGameStore } from "../store/gameStore";
import { PlusIcon, StopIcon } from "@heroicons/react/16/solid";

interface PlayerListProps {
  onSelectPlayer: (playerId: string) => void;
  onResetGame: () => void;
}

export const PlayerList = ({
  onSelectPlayer,
  onResetGame,
}: PlayerListProps) => {
  const { players, winner, status } = useGameStore();

  const activePlayers = players.filter((p) => !p.isEliminated);
  const eliminatedPlayers = players.filter((p) => p.isEliminated);

  const isGameCompleted = status === "completed";

  return (
    <FullScreenContainer>
      {/* Header */}
      <div className="p-4 bg-gray-50 shadow-sm relative">
        <h1 className="text-2xl font-bold text-center">Joueurs</h1>

        {!isGameCompleted && (
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Êtes-vous sûr de vouloir arrêter la partie ? Toute progression sera perdue."
                )
              ) {
                onResetGame();
              }
            }}
            className="flex items-center absolute top-1/2 -translate-y-1/2 left-4 bg-red-600 text-white hover:bg-red-700 active:bg-red-800 p-2 rounded-full gap-2"
          >
            <>
              <StopIcon className="h-5 w-5" />
              <span className="text-sm mr-1">Stop</span>
            </>
          </button>
        )}
      </div>

      {/* Main content with scroll */}
      <div className="flex-1 overflow-y-auto p-4 bg-white flex flex-col">
        {isGameCompleted && winner && (
          <div className="mb-6 p-4 bg-green-100 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-green-800 mb-2">
              Partie terminée !
            </h2>
            <p className="text-green-700">
              <span className="font-medium">
                {players.find((p) => p.id === winner)?.name || "Inconnu"}
              </span>{" "}
              a remporté la partie !
            </p>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-medium mb-3">
            Joueurs actifs ({activePlayers.length})
          </h2>
          {activePlayers.length === 0 ? (
            <p className="text-gray-500 italic text-center py-4">
              Aucun joueur actif
            </p>
          ) : (
            <ul className="bg-gray-50 rounded-lg divide-y divide-gray-100 overflow-hidden shadow-sm">
              {activePlayers.map((player) => (
                <li
                  key={player.id}
                  className="flex justify-between items-center p-3 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => onSelectPlayer(player.id)}
                >
                  <span className="font-medium">{player.name}</span>
                  <span className="text-sm text-gray-500">
                    {player.killCount > 0 && `Kills: ${player.killCount}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {eliminatedPlayers.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-3">
              Joueurs éliminés ({eliminatedPlayers.length})
            </h2>
            <ul className="bg-gray-50 rounded-lg divide-y divide-gray-100 overflow-hidden shadow-sm opacity-60">
              {eliminatedPlayers.map((player) => (
                <li key={player.id} className="p-3 flex justify-between">
                  <span className="font-medium line-through">
                    {player.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {player.killCount > 0 && `Kills: ${player.killCount}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Fixed footer with actions */}
      {isGameCompleted && (
        <div className="p-4 bg-gray-50 shadow-sm">
          <Button
            onClick={() => {
              if (isGameCompleted) {
                return onResetGame();
              }
            }}
            variant="primary"
            fullWidth
            className="flex items-center justify-center shadow-sm"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouvelle partie
          </Button>
        </div>
      )}
    </FullScreenContainer>
  );
};
