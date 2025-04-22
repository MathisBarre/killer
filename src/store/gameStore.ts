import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { GameState, Player } from "../models/types";
import {
  assignTargetsAndMissions,
  eliminateTarget,
  executeCounterKill,
  checkGameCompletion,
  generateMissions,
  createPlayer,
  changeMission,
} from "../core/gameLogic";

// État initial du jeu
const initialState: GameState = {
  status: "not_started",
  players: [],
  winner: null,
};

// Création du store avec Zustand, immer pour les mises à jour immutables,
// et persist pour sauvegarder dans le localStorage
export const useGameStore = create<GameStateStore>()(
  persist(
    immer((set, get) => ({
      // État initial
      ...initialState,

      // Actions
      resetGame: () => {
        set((state) => {
          state.status = initialState.status;
          state.winner = initialState.winner;
          // Keep players list
        });
      },

      resetPlayers: () => {
        set((state) => {
          state.players = [];
        });
      },

      setStatus: (status) => {
        set((state) => {
          state.status = status;
        });
      },

      addPlayer: (name: string) => {
        set((state) => {
          state.players.push(createPlayer(name));
        });
      },

      removePlayer: (id: string) => {
        set((state) => {
          state.players = state.players.filter((player) => player.id !== id);
        });
      },

      startGame: () => {
        set((state) => {
          const playerNames = state.players.map((p) => p.name);

          if (playerNames.length < 2) {
            throw new Error(
              "Il faut au moins 2 joueurs pour commencer une partie"
            );
          }

          // Générer des missions
          const missions = generateMissions();

          // Assigner des cibles et des missions
          state.players = assignTargetsAndMissions(state.players, missions);
          state.status = "in_progress";
          state.winner = null;
        });
      },

      eliminatePlayer: (eliminatorId: string, targetId: string) => {
        set((state) => {
          // Éliminer la cible
          state.players = eliminateTarget(
            state.players,
            eliminatorId,
            targetId
          );

          // Vérifier si le jeu est terminé
          const winnerId = checkGameCompletion(state.players);
          if (winnerId) {
            state.winner = winnerId;
            state.status = "completed";
          }
        });
      },

      performCounterKill: (defenderId: string, attackerId: string) => {
        set((state) => {
          // Exécuter le contre-assassinat
          state.players = executeCounterKill(
            state.players,
            defenderId,
            attackerId
          );

          // Vérifier si le jeu est terminé
          const winnerId = checkGameCompletion(state.players);
          if (winnerId) {
            state.winner = winnerId;
            state.status = "completed";
          }
        });
      },

      getPlayerById: (id: string): Player | undefined => {
        return get().players.find((player) => player.id === id);
      },

      getTargetForPlayer: (playerId: string): Player | undefined => {
        const player = get().players.find((p) => p.id === playerId);
        if (!player || !player.targetId) return undefined;

        return get().players.find((p) => p.id === player.targetId);
      },

      getWinner: (): Player | undefined => {
        const { winner } = get();
        if (!winner) return undefined;

        return get().players.find((p) => p.id === winner);
      },

      getRemainingPlayers: (): Player[] => {
        return get().players.filter((p) => !p.isEliminated);
      },

      changeMission: (playerId: string) => {
        set((state) => {
          const missions = generateMissions();
          const updatedPlayers = changeMission(
            state.players,
            playerId,
            missions
          );
          if (updatedPlayers) {
            state.players = updatedPlayers;
          }
        });
      },
    })),
    {
      name: "killer-game-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Interface pour le Store
interface GameStateStore extends GameState {
  // Actions pour manipuler l'état
  resetGame: () => void;
  resetPlayers: () => void;
  setStatus: (status: GameState["status"]) => void;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  startGame: () => void;
  eliminatePlayer: (eliminatorId: string, targetId: string) => void;
  performCounterKill: (defenderId: string, attackerId: string) => void;
  changeMission: (playerId: string) => void;

  // Sélecteurs
  getPlayerById: (id: string) => Player | undefined;
  getTargetForPlayer: (playerId: string) => Player | undefined;
  getWinner: () => Player | undefined;
  getRemainingPlayers: () => Player[];
}
