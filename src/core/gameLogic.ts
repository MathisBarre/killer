import { Player, GameState, Mission } from "../models/types";
import { MISSION_LIST } from "./missions";

/**
 * Génère une liste de missions pour le jeu
 */
export const generateMissions = (): Mission[] => {
  return MISSION_LIST;
};

/**
 * Initialise un nouveau joueur avec un ID unique
 */
export const createPlayer = (name: string): Player => {
  return {
    id: crypto.randomUUID(),
    name,
    targetId: null,
    mission: null,
    isEliminated: false,
    lastCounterKillTime: null,
    missionChangesCount: 0,
    killCount: 0,
  };
};

/**
 * Attribue des cibles et des missions à tous les joueurs
 */
export const assignTargetsAndMissions = (
  players: Player[],
  missions: Mission[]
): Player[] => {
  if (players.length < 2) return players;

  // Copie des joueurs pour ne pas modifier l'original directement
  const updatedPlayers = [...players];

  // Mélange des joueurs pour l'attribution des cibles
  const shuffledIndices = shuffleArray([...Array(players.length).keys()]);

  // Attribution des cibles circulaires (A -> B -> C -> A)
  for (let i = 0; i < shuffledIndices.length; i++) {
    const currentIndex = shuffledIndices[i];
    const targetIndex = shuffledIndices[(i + 1) % shuffledIndices.length];
    updatedPlayers[currentIndex] = {
      ...updatedPlayers[currentIndex],
      targetId: updatedPlayers[targetIndex].id,
    };
  }

  // Attribution des missions - sélection aléatoire pour chaque joueur
  const availableMissions = [...missions];

  updatedPlayers.forEach((player, index) => {
    if (availableMissions.length > 0) {
      // Sélection aléatoire d'une mission
      const randomMissionIndex = Math.floor(
        Math.random() * availableMissions.length
      );
      const selectedMission = availableMissions[randomMissionIndex];

      // Mise à jour du joueur avec la mission
      updatedPlayers[index] = {
        ...player,
        mission: selectedMission.description,
      };

      // Retrait de la mission attribuée
      availableMissions.splice(randomMissionIndex, 1);

      // Si toutes les missions sont épuisées, on recharge la liste
      if (availableMissions.length === 0 && index < updatedPlayers.length - 1) {
        availableMissions.push(...missions);
      }
    }
  });

  return updatedPlayers;
};

/**
 * Permute les éléments d'un tableau de manière aléatoire (algorithme de Fisher-Yates)
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Élimine un joueur cible et réattribue sa cible à l'éliminateur
 */
export const eliminateTarget = (
  players: Player[],
  eliminatorId: string,
  targetId: string
): Player[] => {
  // Trouver l'éliminateur et la cible
  const eliminator = players.find((p) => p.id === eliminatorId);
  const target = players.find((p) => p.id === targetId);

  if (!eliminator || !target) {
    return players; // Impossible d'éliminer
  }

  return players.map((player) => {
    if (player.id === targetId) {
      // Marquer la cible comme éliminée
      return { ...player, isEliminated: true };
    } else if (player.id === eliminatorId) {
      // L'éliminateur reçoit la cible et mission de sa victime
      return {
        ...player,
        targetId: target.targetId,
        mission: target.mission,
        killCount: player.killCount + 1,
      };
    }
    return player;
  });
};

/**
 * Vérifie si un contre-assassinat est possible
 */
export const canCounterKill = (player: Player): boolean => {
  if (!player.lastCounterKillTime) return true;

  const now = Date.now();
  const timeSinceLastCounterKill = now - player.lastCounterKillTime;
  const twentyMinutesInMs = 20 * 60 * 1000;

  return timeSinceLastCounterKill >= twentyMinutesInMs;
};

/**
 * Exécute un contre-assassinat
 */
export const executeCounterKill = (
  players: Player[],
  defenderId: string,
  attackerId: string
): Player[] => {
  const defender = players.find((p) => p.id === defenderId);

  if (!defender || !canCounterKill(defender)) {
    return players;
  }

  const updatedPlayers = players.map((player) => {
    if (player.id === defenderId) {
      // Mettre à jour le timestamp du dernier counter-kill
      return {
        ...player,
        lastCounterKillTime: Date.now(),
      };
    }
    return player;
  });

  // Éliminer l'attaquant comme dans une élimination normale
  return eliminateTarget(updatedPlayers, defenderId, attackerId);
};

/**
 * Vérifie si le jeu est terminé (un seul joueur non éliminé reste)
 */
export const checkGameCompletion = (players: Player[]): string | null => {
  const activePlayers = players.filter((p) => !p.isEliminated);

  if (activePlayers.length === 1) {
    return activePlayers[0].id;
  }

  return null;
};

/**
 * Initialise un nouveau jeu
 */
export const initializeGame = (playerNames: string[]): GameState => {
  if (playerNames.length < 2) {
    throw new Error("Il faut au moins 2 joueurs pour commencer une partie");
  }

  // Créer les joueurs
  const players = playerNames.map((name) => createPlayer(name));

  // Générer des missions
  const missions = generateMissions();

  // Assigner des cibles et des missions
  const playersWithTargets = assignTargetsAndMissions(players, missions);

  return {
    status: "in_progress",
    players: playersWithTargets,
    winner: null,
  };
};

/**
 * Check if a player can change their mission
 */
export const canChangeMission = (player: Player): boolean => {
  return (
    !player.isEliminated &&
    player.missionChangesCount < 2 &&
    player.killCount === 0
  );
};

/**
 * Get available missions for a player
 */
const getAvailableMissions = (
  players: Player[],
  currentPlayer: Player,
  missions: Mission[]
): Mission[] => {
  // Get missions already assigned to other players
  const assignedMissions = players
    .filter((p) => p.id !== currentPlayer.id && p.mission)
    .map((p) => p.mission);

  // Filter out current mission and already assigned missions
  return missions.filter(
    (m) =>
      m.description !== currentPlayer.mission &&
      !assignedMissions.includes(m.description)
  );
};

/**
 * Change a player's mission if allowed
 * @returns updated players array if mission was changed, null otherwise
 */
export const changeMission = (
  players: Player[],
  playerId: string,
  missions: Mission[]
): Player[] | null => {
  const player = players.find((p) => p.id === playerId);
  if (!player || !canChangeMission(player)) {
    return null;
  }

  // Get available missions
  const availableMissions = getAvailableMissions(players, player, missions);
  if (availableMissions.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableMissions.length);
  const newMission = availableMissions[randomIndex];

  // Update the player's mission and increment the change counter
  return players.map((p) => {
    if (p.id === playerId) {
      return {
        ...p,
        mission: newMission.description,
        missionChangesCount: p.missionChangesCount + 1,
      };
    }
    return p;
  });
};
