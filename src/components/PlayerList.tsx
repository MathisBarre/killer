import { Container } from "./Container";
import { Button } from "./Button";
import { useGameStore } from "../store/gameStore";

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
    <Container>
      <h1 className="text-3xl font-bold mb-6 text-center">Joueurs</h1>

      {isGameCompleted && winner && (
        <div className="mb-8 p-4 bg-green-100 text-center rounded-lg">
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
          <ul className="border rounded-lg divide-y overflow-hidden">
            {activePlayers.map((player) => (
              <li
                key={player.id}
                className="hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => onSelectPlayer(player.id)}
              >
                <div className="p-4">
                  <div className="font-medium">{player.name}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {eliminatedPlayers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-3">
            Joueurs éliminés ({eliminatedPlayers.length})
          </h2>
          <ul className="border rounded-lg divide-y overflow-hidden opacity-60">
            {eliminatedPlayers.map((player) => (
              <li key={player.id} className="p-4">
                <div className="font-medium line-through">{player.name}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button onClick={onResetGame} variant="danger" fullWidth>
        {isGameCompleted ? "Nouvelle partie" : "Arrêter la partie"}
      </Button>
    </Container>
  );
};
