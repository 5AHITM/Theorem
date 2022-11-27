import { StandardEffects } from "./Enum";

export interface Card {
  key: string;
  id: string;
  name: string;
  mana: number;
  religion_type: string;
  attack: number;
  current_attack: number;
  current_defense: number;
  defense: number;
  text: string;
  img: string;
  effect: StandardEffects[];
  stance: "attack" | "defense";
  playedStance: "open" | "hidden";
  trapped: boolean;
}

export interface Result {
  attackingCardKey: string;
  defendingCardKey: string;
  defendingCardDies: boolean;
  attackingCardDies: boolean;
  defendingCardsPlayerDamage: number;
  attackingCardsPlayerDamage: number;
  attackingCardDamage: number;
  defendingCardDamage: number;
  effectsHittingAttackingCard: StandardEffects[];
  effectsUsedByDefendingCard: StandardEffects[];
  attackingCard: Card;
  defendingCard: Card;
}

export interface CardCoordinates {
  x: number;
  y: number;
  key: string;
}

export interface CardStance {
  stance: "attack" | "defense";
  key: string;
  playedStance: "open" | "hidden";
  trapped: boolean;
}
