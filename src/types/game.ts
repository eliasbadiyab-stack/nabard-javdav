export type Gender = 'male' | 'female';

export interface PlayerProfile {
  name: string;
  gender: Gender;
  title: string;
  kills: number;
  highScore: number;
  unlockedLevel: number;
}

export type GameState = 'title' | 'profile_select' | 'playing' | 'paused' | 'victory' | 'gameover' | 'level_select';

export interface MissionConfig {
  id: number;
  title: string;
  locationName: string;
  description: string;
  historicalQuote: string;
  quoteAuthor: string;
  monumentType: 'cyrus_tomb' | 'iranian_street' | 'persepolis' | 'ferdowsi_tomb';
  targetKills: number;
  bossWave: boolean;
  enemyWaves: number;
  monumentMaxHealth: number;
  skyColor: number;
  fogColor: number;
  groundTextureType: 'desert_stone' | 'cobblestone' | 'palace_marble' | 'garden_tile';
}

export interface CombatStats {
  score: number;
  kills: number;
  combo: number;
  maxCombo: number;
  damageDealt: number;
  damageTaken: number;
}
