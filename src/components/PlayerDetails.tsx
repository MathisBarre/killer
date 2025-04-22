import { useState } from "react";
import { Container } from "./Container";
import { Button } from "./Button";
import { useGameStore } from "../store/gameStore";
import { canCounterKill, canChangeMission } from "../core/gameLogic";
import { Player } from "../models/types";
import { FullScreenContainer } from "./FullScreenContainer";

interface PlayerDetailsProps {
  playerId: string;
  onBack: () => void;
  onEliminate: () => void;
}

export const PlayerDetails = ({
  playerId,
  onBack,
  onEliminate,
}: PlayerDetailsProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [counterKillAttempted, setCounterKillAttempted] = useState(false);

  const {
    getPlayerById,
    getTargetForPlayer,
    eliminatePlayer,
    performCounterKill,
    players,
    changeMission,
  } = useGameStore();

  const player = getPlayerById(playerId);
  const target = player ? getTargetForPlayer(playerId) : undefined;

  if (!player) {
    return (
      <Container className="text-center">
        <h1 className="text-2xl font-bold mb-4">Joueur non trouvé</h1>
        <Button onClick={onBack} variant="secondary" className="w-full">
          Retour
        </Button>
      </Container>
    );
  }

  const handleEliminateTarget = () => {
    if (player && target) {
      if (
        window.confirm(
          `Êtes-vous sûr d'avoir réussi à éliminer ${target.name} ?`
        )
      ) {
        eliminatePlayer(player.id, target.id);
        onEliminate();
      }
    }
  };

  const handleCounterKill = (attackerId: string) => {
    if (player) {
      const attacker = players.find((p) => p.id === attackerId);
      if (!attacker) return;

      const canPerformCounterKill = canCounterKill(player);
      setCounterKillAttempted(true);

      if (canPerformCounterKill) {
        if (
          window.confirm(
            `Êtes-vous sûr d'avoir contre-assassiné ${attacker.name} ?`
          )
        ) {
          performCounterKill(player.id, attackerId);
          onEliminate();
        }
      }
    }
  };

  const formatTimeRemaining = (lastCounterKillTime: number) => {
    const now = Date.now();
    const elapsed = now - lastCounterKillTime;
    const twentyMinutes = 20 * 60 * 1000;
    const remaining = twentyMinutes - elapsed;

    if (remaining <= 0) return "0m";

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    return `${minutes}m ${seconds}s`;
  };

  return (
    <>
      {!showDetails ? (
        // Vue: boutons de choix
        <FullScreenContainer className="flex flex-col h-full">
          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-blue-600 text-white">
            <div className="flex flex-col items-center justify-center flex-1">
              <h1 className="text-3xl font-bold">{player.name}</h1>
              <p className="text-blue-100 mb-8">Que souhaitez-vous faire ?</p>
            </div>
            <Button
              onClick={() => setShowDetails(true)}
              variant="secondary"
              className="text-xl flex-1 w-full"
            >
              Voir mes informations
            </Button>
          </div>
          <Button
            onClick={onBack}
            variant="secondary"
            className="rounded-none py-6 text-xl w-full"
          >
            Retour à la liste
          </Button>
        </FullScreenContainer>
      ) : (
        // Vue: détails du joueur
        <div className="flex-1 flex flex-col p-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{player.name}</h1>
            <p className="text-gray-500">
              {player.isEliminated ? "Éliminé" : "En jeu"}
            </p>
          </div>

          {!player.isEliminated && (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-medium mb-2">Votre cible</h2>
                {target ? (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-medium text-lg">{target.name}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Pas de cible</p>
                )}
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-medium mb-2">Votre mission</h2>
                {player.mission ? (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p>{player.mission}</p>
                    {canChangeMission(player) && (
                      <div className="mt-4">
                        <Button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Êtes-vous sûr de vouloir changer de mission ?`
                              )
                            ) {
                              changeMission(player.id);
                            }
                          }}
                          variant="secondary"
                          className="w-full"
                        >
                          Changer de mission ({2 - player.missionChangesCount}{" "}
                          restants)
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Pas de mission</p>
                )}
              </div>

              {target && (
                <div className="mb-8">
                  <Button
                    onClick={handleEliminateTarget}
                    variant="success"
                    className="w-full"
                  >
                    J'ai éliminé ma cible
                  </Button>
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-xl font-medium mb-3">Contre-assassinat</h2>
                <div className="bg-yellow-50 p-4 rounded-lg mb-3">
                  <p className="mb-2">
                    Si quelqu'un tente de vous éliminer, vous pouvez essayer de
                    le contre-assassiner en devinant sa mission.
                  </p>

                  {player.lastCounterKillTime && !canCounterKill(player) ? (
                    <p className="text-yellow-800">
                      Temps restant avant de pouvoir contre-assassiner :
                      {formatTimeRemaining(player.lastCounterKillTime)}
                    </p>
                  ) : counterKillAttempted ? (
                    <p className="text-green-600 font-medium">
                      Contre-assassinat disponible !
                    </p>
                  ) : null}
                </div>

                {player.mission && (
                  <div className="space-y-2">
                    <p className="font-medium">
                      Qui avez-vous contre-assassiné ?
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {players
                        .filter(
                          (p: Player) => !p.isEliminated && p.id !== player.id
                        )
                        .map((p: Player) => (
                          <Button
                            key={p.id}
                            onClick={() => handleCounterKill(p.id)}
                            variant="danger"
                            disabled={
                              player.lastCounterKillTime !== null &&
                              !canCounterKill(player)
                            }
                          >
                            {p.name}
                          </Button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="mt-auto">
            <Button
              onClick={() => {
                setShowDetails(false);
                onBack();
              }}
              variant="secondary"
              className="w-full"
            >
              Cacher mes informations
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
