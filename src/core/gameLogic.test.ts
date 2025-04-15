import { describe, test, expect, vi } from "vitest";
import {
  createPlayer,
  assignTargetsAndMissions,
  eliminateTarget,
  canCounterKill,
  executeCounterKill,
  checkGameCompletion,
  initializeGame,
  generateMissions,
  canChangeMission,
  changeMission,
} from "./gameLogic";
import { Player } from "../models/types";

// Mock crypto.randomUUID pour des tests déterministes
vi.stubGlobal("crypto", {
  randomUUID: vi
    .fn()
    .mockReturnValueOnce("player-1")
    .mockReturnValueOnce("player-2")
    .mockReturnValueOnce("player-3")
    .mockReturnValueOnce("player-4"),
});

describe("Game Logic", () => {
  describe("createPlayer", () => {
    test("devrait créer un joueur avec le nom fourni et un ID unique", () => {
      const player = createPlayer("Alice");
      expect(player).toEqual({
        id: "player-1",
        name: "Alice",
        targetId: null,
        mission: null,
        isEliminated: false,
        lastCounterKillTime: null,
        missionChangesCount: 0,
        killCount: 0,
      });
    });
  });

  describe("assignTargetsAndMissions", () => {
    test("devrait assigner des cibles et des missions à tous les joueurs", () => {
      const players: Player[] = [
        {
          id: "player-1",
          name: "Alice",
          targetId: null,
          mission: null,
          isEliminated: false,
          lastCounterKillTime: null,
          missionChangesCount: 0,
          killCount: 0,
        },
        {
          id: "player-2",
          name: "Bob",
          targetId: null,
          mission: null,
          isEliminated: false,
          lastCounterKillTime: null,
          missionChangesCount: 0,
          killCount: 0,
        },
        {
          id: "player-3",
          name: "Charlie",
          targetId: null,
          mission: null,
          isEliminated: false,
          lastCounterKillTime: null,
          missionChangesCount: 0,
          killCount: 0,
        },
      ];

      const missions = [
        { id: "1", description: "Mission 1" },
        { id: "2", description: "Mission 2" },
        { id: "3", description: "Mission 3" },
      ];

      const result = assignTargetsAndMissions(players, missions);

      // Vérifier que chaque joueur a une cible et une mission
      for (const player of result) {
        expect(player.targetId).not.toBeNull();
        expect(player.mission).not.toBeNull();
      }

      // Vérifier l'attribution circulaire
      const targetIds = result.map((p) => p.targetId);
      const uniqueTargets = new Set(targetIds);

      // Tous les joueurs devraient avoir une cible différente
      expect(uniqueTargets.size).toBe(players.length);

      // Vérifier que personne n'est sa propre cible
      for (let i = 0; i < result.length; i++) {
        expect(result[i].targetId).not.toBe(result[i].id);
      }
    });
  });

  describe("eliminateTarget", () => {
    test("devrait éliminer la cible et réattribuer sa cible à l'éliminateur", () => {
      const players: Player[] = [
        {
          id: "player-1",
          name: "Alice",
          targetId: "player-2",
          mission: "Mission A",
          isEliminated: false,
          lastCounterKillTime: null,
          missionChangesCount: 0,
          killCount: 0,
        },
        {
          id: "player-2",
          name: "Bob",
          targetId: "player-3",
          mission: "Mission B",
          isEliminated: false,
          lastCounterKillTime: null,
          missionChangesCount: 0,
          killCount: 0,
        },
        {
          id: "player-3",
          name: "Charlie",
          targetId: "player-1",
          mission: "Mission C",
          isEliminated: false,
          lastCounterKillTime: null,
          missionChangesCount: 0,
          killCount: 0,
        },
      ];

      const result = eliminateTarget(players, "player-1", "player-2");

      // Vérifier que la cible est éliminée
      expect(result.find((p) => p.id === "player-2")?.isEliminated).toBe(true);

      // Vérifier que l'éliminateur a récupéré la cible et la mission de sa victime
      const eliminator = result.find((p) => p.id === "player-1");
      expect(eliminator?.targetId).toBe("player-3");
      expect(eliminator?.mission).toBe("Mission B");
      expect(eliminator?.killCount).toBe(1);
    });
  });

  describe("canCounterKill", () => {
    test("devrait retourner true si le joueur n'a jamais fait de contre-assassinat", () => {
      const player: Player = {
        id: "player-1",
        name: "Alice",
        targetId: "player-2",
        mission: "Mission A",
        isEliminated: false,
        lastCounterKillTime: null,
        missionChangesCount: 0,
        killCount: 0,
      };

      expect(canCounterKill(player)).toBe(true);
    });

    test("devrait retourner false si le dernier contre-assassinat a été fait il y a moins de 20 minutes", () => {
      const now = Date.now();
      vi.spyOn(Date, "now").mockReturnValue(now);

      const player: Player = {
        id: "player-1",
        name: "Alice",
        targetId: "player-2",
        mission: "Mission A",
        isEliminated: false,
        lastCounterKillTime: now - 10 * 60 * 1000, // 10 minutes ago
        missionChangesCount: 0,
        killCount: 0,
      };

      expect(canCounterKill(player)).toBe(false);
    });

    test("devrait retourner true si le dernier contre-assassinat a été fait il y a plus de 20 minutes", () => {
      const now = Date.now();
      vi.spyOn(Date, "now").mockReturnValue(now);

      const player: Player = {
        id: "player-1",
        name: "Alice",
        targetId: "player-2",
        mission: "Mission A",
        isEliminated: false,
        lastCounterKillTime: now - 21 * 60 * 1000, // 21 minutes ago
        missionChangesCount: 0,
        killCount: 0,
      };

      expect(canCounterKill(player)).toBe(true);
    });
  });

  describe("checkGameCompletion", () => {
    test("devrait retourner null si plusieurs joueurs sont encore actifs", () => {
      const players: Player[] = [
        {
          id: "player-1",
          name: "Alice",
          targetId: "player-2",
          mission: "Mission A",
          isEliminated: false,
          lastCounterKillTime: null,
          missionChangesCount: 0,
          killCount: 0,
        },
        {
          id: "player-2",
          name: "Bob",
          targetId: "player-3",
          mission: "Mission B",
          isEliminated: false,
          lastCounterKillTime: null,
          missionChangesCount: 0,
          killCount: 0,
        },
      ];

      expect(checkGameCompletion(players)).toBeNull();
    });

    test("devrait retourner l'ID du vainqueur quand un seul joueur reste", () => {
      const players: Player[] = [
        {
          id: "player-1",
          name: "Alice",
          targetId: "player-2",
          mission: "Mission A",
          isEliminated: false,
          lastCounterKillTime: null,
          missionChangesCount: 0,
          killCount: 0,
        },
        {
          id: "player-2",
          name: "Bob",
          targetId: "player-3",
          mission: "Mission B",
          isEliminated: true,
          lastCounterKillTime: null,
          missionChangesCount: 0,
          killCount: 0,
        },
        {
          id: "player-3",
          name: "Charlie",
          targetId: "player-1",
          mission: "Mission C",
          isEliminated: true,
          lastCounterKillTime: null,
          missionChangesCount: 0,
          killCount: 0,
        },
      ];

      expect(checkGameCompletion(players)).toBe("player-1");
    });
  });

  describe("initializeGame", () => {
    test("devrait créer un jeu avec des joueurs, des cibles et des missions", () => {
      const playerNames = ["Alice", "Bob", "Charlie"];

      const game = initializeGame(playerNames);

      expect(game.status).toBe("in_progress");
      expect(game.players.length).toBe(3);
      expect(game.winner).toBeNull();

      // Vérifier que chaque joueur a une cible et une mission
      for (const player of game.players) {
        expect(player.targetId).not.toBeNull();
        expect(player.mission).not.toBeNull();
        expect(player.isEliminated).toBe(false);
        expect(player.missionChangesCount).toBe(0);
        expect(player.killCount).toBe(0);
      }
    });

    test("devrait lever une erreur si moins de 2 joueurs sont fournis", () => {
      expect(() => initializeGame(["Alice"])).toThrow();
    });
  });

  describe("generateMissions", () => {
    test("devrait générer une liste de missions", () => {
      const missions = generateMissions();
      expect(missions.length).toBeGreaterThan(0);
      expect(missions[0]).toHaveProperty("id");
      expect(missions[0]).toHaveProperty("description");
    });
  });

  describe("executeCounterKill", () => {
    test("devrait permettre au défenseur d'éliminer l'attaquant", () => {
      const now = Date.now();
      vi.spyOn(Date, "now").mockReturnValue(now);

      const players: Player[] = [
        {
          id: "player-1",
          name: "Alice",
          targetId: "player-3",
          mission: "Mission A",
          isEliminated: false,
          lastCounterKillTime: null,
          missionChangesCount: 0,
          killCount: 0,
        },
        {
          id: "player-2",
          name: "Bob",
          targetId: "player-1",
          mission: "Mission B",
          isEliminated: false,
          lastCounterKillTime: null,
          missionChangesCount: 0,
          killCount: 0,
        },
        {
          id: "player-3",
          name: "Charlie",
          targetId: "player-2",
          mission: "Mission C",
          isEliminated: false,
          lastCounterKillTime: null,
          missionChangesCount: 0,
          killCount: 0,
        },
      ];

      // Bob (player-2) attaque Alice (player-1), Alice se défend avec un contre-assassinat
      const result = executeCounterKill(players, "player-1", "player-2");

      // Vérifier que l'attaquant est éliminé
      expect(result.find((p) => p.id === "player-2")?.isEliminated).toBe(true);

      // Vérifier que le défenseur a récupéré la cible et la mission de sa victime
      const defender = result.find((p) => p.id === "player-1");
      expect(defender?.targetId).toBe("player-1"); // La cible de Bob était Alice
      expect(defender?.mission).toBe("Mission B");
      expect(defender?.killCount).toBe(1);

      // Vérifier que le timestamp du contre-kill a été mis à jour
      expect(defender?.lastCounterKillTime).toBe(now);
    });

    test("ne devrait pas permettre le contre-assassinat si le délai n'est pas écoulé", () => {
      const now = Date.now();
      vi.spyOn(Date, "now").mockReturnValue(now);

      const players: Player[] = [
        {
          id: "player-1",
          name: "Alice",
          targetId: "player-3",
          mission: "Mission A",
          isEliminated: false,
          lastCounterKillTime: now - 10 * 60 * 1000, // Il y a 10 minutes
          missionChangesCount: 0,
          killCount: 0,
        },
        {
          id: "player-2",
          name: "Bob",
          targetId: "player-1",
          mission: "Mission B",
          isEliminated: false,
          lastCounterKillTime: null,
          missionChangesCount: 0,
          killCount: 0,
        },
      ];

      const result = executeCounterKill(players, "player-1", "player-2");

      // Aucun changement ne devrait être apporté
      expect(result).toEqual(players);
    });
  });

  describe("Mission Change", () => {
    test("canChangeMission should return true for eligible player", () => {
      const player: Player = {
        id: "player-1",
        name: "Alice",
        targetId: "player-2",
        mission: "Mission A",
        isEliminated: false,
        lastCounterKillTime: null,
        missionChangesCount: 0,
        killCount: 0,
      };

      expect(canChangeMission(player)).toBe(true);
    });

    test("canChangeMission should return false for eliminated player", () => {
      const player: Player = {
        id: "player-1",
        name: "Alice",
        targetId: "player-2",
        mission: "Mission A",
        isEliminated: true,
        lastCounterKillTime: null,
        missionChangesCount: 0,
        killCount: 0,
      };

      expect(canChangeMission(player)).toBe(false);
    });

    test("canChangeMission should return false for player with max changes", () => {
      const player: Player = {
        id: "player-1",
        name: "Alice",
        targetId: "player-2",
        mission: "Mission A",
        isEliminated: false,
        lastCounterKillTime: null,
        missionChangesCount: 2,
        killCount: 0,
      };

      expect(canChangeMission(player)).toBe(false);
    });

    test("canChangeMission should return false for player with kills", () => {
      const player: Player = {
        id: "player-1",
        name: "Alice",
        targetId: "player-2",
        mission: "Mission A",
        isEliminated: false,
        lastCounterKillTime: null,
        missionChangesCount: 0,
        killCount: 1,
      };

      expect(canChangeMission(player)).toBe(false);
    });

    test("changeMission should not allow change if player has kills", () => {
      const players: Player[] = [
        {
          id: "player-1",
          name: "Alice",
          targetId: "player-2",
          mission: "Mission A",
          isEliminated: false,
          lastCounterKillTime: null,
          missionChangesCount: 0,
          killCount: 1,
        },
        {
          id: "player-2",
          name: "Bob",
          targetId: "player-1",
          mission: "Mission B",
          isEliminated: false,
          lastCounterKillTime: null,
          missionChangesCount: 0,
          killCount: 0,
        },
      ];

      const missions = [
        { id: "1", description: "Mission A" },
        { id: "2", description: "Mission B" },
        { id: "3", description: "Mission C" },
      ];

      const result = changeMission(players, "player-1", missions);
      expect(result).toBeNull();
    });

    test("changeMission should not assign mission already taken by another player", () => {
      const players: Player[] = [
        {
          id: "player-1",
          name: "Alice",
          targetId: "player-2",
          mission: "Mission A",
          isEliminated: false,
          lastCounterKillTime: null,
          missionChangesCount: 0,
          killCount: 0,
        },
        {
          id: "player-2",
          name: "Bob",
          targetId: "player-1",
          mission: "Mission B",
          isEliminated: false,
          lastCounterKillTime: null,
          missionChangesCount: 0,
          killCount: 0,
        },
      ];

      const missions = [
        { id: "1", description: "Mission A" },
        { id: "2", description: "Mission B" },
        { id: "3", description: "Mission C" },
      ];

      const result = changeMission(players, "player-1", missions);
      expect(result).not.toBeNull();
      if (result) {
        const updatedPlayer = result.find((p) => p.id === "player-1");
        expect(updatedPlayer?.mission).toBe("Mission C");
      }
    });
  });
});
