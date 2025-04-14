import { FullScreenContainer } from "./FullScreenContainer";
import { Button } from "./Button";
import { useGameStore } from "../store/gameStore";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface PlayerListProps {
  onSelectPlayer: (playerId: string) => void;
  onResetGame: () => void;
  onBack: () => void;
}

export const PlayerList = ({
  onSelectPlayer,
  onResetGame,
  onBack,
}: PlayerListProps) => {
  const { players, winner, status } = useGameStore();

  const activePlayers = players.filter((p) => !p.isEliminated);
  const eliminatedPlayers = players.filter((p) => p.isEliminated);

  const isGameCompleted = status === "completed";

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
        <h1 className="text-2xl font-bold text-center mt-2">Joueurs</h1>
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
                <li key={player.id} className="p-3">
                  <span className="font-medium line-through">
                    {player.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Fixed footer with actions */}
      <div className="p-4 bg-gray-50 shadow-sm">
        <Button
          onClick={() => {
            if (isGameCompleted) {
              return onResetGame();
            }

            if (
              window.confirm(
                "Êtes-vous sûr de vouloir arrêter la partie ? Toute progression sera perdue."
              )
            ) {
              onResetGame();
            }
          }}
          variant="danger"
          fullWidth
          className="flex items-center justify-center shadow-sm"
        >
          {isGameCompleted ? "Nouvelle partie" : "Arrêter la partie"}
        </Button>
      </div>
    </FullScreenContainer>
  );
};
