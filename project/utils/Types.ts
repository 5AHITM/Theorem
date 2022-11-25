import { StandardEffects } from "./Enum";

export interface Card {
  key: string;
  id: string;
  name: string;
  mana: number;
  religion_type: string;
  attack: number;
  defense: number;
  text: string;
  img: string;
  effect: StandardEffects[];
  stance: "attack" | "defense";
  playedStance: "open" | "hidden";
  trapped: boolean;
}

export interface Result {
  defendingCardDies: boolean;
  attackingCardDies: boolean;
  defendingCardsPlayerDamage: number;
  attackingCardsPlayerDamage: number;
  attackingCardDamage: number;
  defendingCardDamage: number;
  effectsHittingAttackingCard: StandardEffects[];
  effectsUsedByDefendingCard: StandardEffects[];
}

export interface CardCoordinates {
  x: number;
  y: number;
  key: string;
}