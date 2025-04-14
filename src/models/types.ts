export interface Player {
  id: string;
  name: string;
  targetId: string | null;
  mission: string | null;
  isEliminated: boolean;
  lastCounterKillTime: number | null;
}

export interface GameState {
  status: "not_started" | "setup" | "in_progress" | "completed";
  players: Player[];
  winner: string | null;
}

export interface Mission {
  id: string;
  description: string;
}
