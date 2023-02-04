export interface PlayedCard {
    id: string
    key: string
    name: string
    attack: number
    defense: number
    stance: Stance
}

export interface AvailableCard {
    id: string
    key: string
    name: string
    attack: number
    defense: number
    mana: number
}

export enum Stance {
    ATTACK,
    DEFENSE
}

export interface Result {
    attackingCardKey: string
    defendingCardKey: string
    defendingCardDies: boolean
    attackingCardDies: boolean
    defendingCardsPlayerDamage: number
    attackingCardsPlayerDamage: number
    attackingCardDamage: number
    defendingCardDamage: number
    attackingCard?: PlayedCard
    defendingCard?: PlayedCard
}