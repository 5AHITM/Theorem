export enum GameState {
  // EnemyTurn
  ENEMY_TURN = "Enemy's Turn",
  // PlayerDraws
  PLAYER_DRAWS = "Draw a card",
  // Player plays cards
  PLAYER_PLAYS = "Playing phase",
  // Player fights
  PLAYER_FIGHTS = "Fighting phase",
}

export enum StandardEffects {
  SHIELD = "Shield",
  TAUNTING = "Taunt",
  PIERCE = "Pierce",
  BOUNTY = "Bounty",
  CAGE = "Cage",
}


export enum SizeVariants {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export enum PlayerAttackable{
  ATTACKABLE,
  NOT_ATTACKABLE,
  GAME_START ,
}