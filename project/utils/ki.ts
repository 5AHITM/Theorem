import { AvailableCard, PlayedCard, Stance } from "./model"

export function KI_playCard(enemyPlayed: PlayedCard[], played: PlayedCard[], available: AvailableCard[], mana: number, health: number, enemyHealth: number): [AvailableCard, Stance] | null {
    
    //filter all available cards so that only those remain which don't cost too much
    available = available.filter((card) => card.mana <= mana)

    if (available.length == 0) {
        return null;
    }

    //calc the max total damage which can be done when playing the strongest card
    let maxTotalDamage = 0
    for (const card of played) {
        if (card.stance == Stance.ATTACK) {
            maxTotalDamage += card.attack
        }
    }
    let strongestAvailableCard = available.sort((a, b) => a.attack - b.attack)[0]
    maxTotalDamage += strongestAvailableCard.attack


    //check if enemy has a defense card played if not then check health of enemy
    if (enemyPlayed.find((card) => card.stance == Stance.DEFENSE) == undefined) {
        if (enemyHealth <= maxTotalDamage) {
            //enemy is beatable in this round
            //play strongest card and attack
            return [strongestAvailableCard, Stance.ATTACK];
        }else {
            if (randomNumber(0, 1) == 0) {
                //play strongest card
                return [strongestAvailableCard, Stance.ATTACK];
            }
        }
    }

    //check own defense
    let noOfDefenseCards = 0
    for (const card of played) {
        if (card.stance == Stance.DEFENSE) {
            noOfDefenseCards++
        }
    }

    //sort all available cards by defense value
    available = available.sort((a, b) => a.defense - b.defense)
    //find card with highest defense value
    let mostProtectiveCard = available[available.length - 1]
    //check if there is a card with lower attack value but same defense value
    for (const card of available) {
        if (card.defense == mostProtectiveCard.defense && card.attack < mostProtectiveCard.attack) {
            mostProtectiveCard = card
        }
    }

    //defense too weak
    if (noOfDefenseCards < randomNumber(0, 2)) {
        //play most protective card in defense stance
        if (mostProtectiveCard.defense + 1 < mostProtectiveCard.attack) {
            return [mostProtectiveCard, Stance.ATTACK];
        }
        return [mostProtectiveCard, Stance.DEFENSE];
    }

    if (strongestAvailableCard.attack == 0) {
        return [mostProtectiveCard, Stance.DEFENSE];
    }

    //play card strongest card in attack stance
    return [strongestAvailableCard, Stance.ATTACK];

}

export function KI_attackCard(enemyPlayed: PlayedCard[], played: PlayedCard[], health: number, enemyHealth: number): [PlayedCard, PlayedCard | null][] | null {

    //log all cards played by the enemy
    console.log("enemys cards: " + enemyPlayed.length)
    for (const card of enemyPlayed) {
        console.table(card)
    }

    //all defense cards of enemy
    let enemyDefenseCards = enemyPlayed.filter((card) => card.stance == Stance.DEFENSE)

    //all attack cards played by me
    let myAttackCards = played.filter((card) => card.stance == Stance.ATTACK)

    //check if enemy has a defense card played if not then attack player with every card in attack stance
    console.log("enemys defense cards: " + enemyDefenseCards.length)
    if (enemyDefenseCards.length == 0) {
        let arr: [PlayedCard, PlayedCard | null][] = []
        for (const card of myAttackCards) {
            arr.push([card, null])
        }
        return arr
    }

    //damage which can be done by all my attack cards
    let totalDamage = 0
    for (const card of myAttackCards) {
        totalDamage += card.attack
    }

    //sort all defense cards of enemy by defense value
    enemyDefenseCards = enemyDefenseCards.sort((a, b) => a.defense - b.defense)


    //look for the strongest defense card which can be beaten
    let strongestDefenseCard = enemyDefenseCards[0]
    for (const card of enemyDefenseCards) {
        if (card.defense <= totalDamage) {
            strongestDefenseCard = card
        }
    }

    //check if strongest defense card can be beaten
    if (strongestDefenseCard.defense <= totalDamage) {
        //attack strongest defense card with all attack cards needed
        let arr: [PlayedCard, PlayedCard | null][] = []
        let damage = 0
        for (const card of myAttackCards) {
            arr.push([card, strongestDefenseCard])
            damage += card.attack
            if (damage >= strongestDefenseCard.defense) {
                break
            }
        }
        return arr
    }

    //check if strongest attack card can be beaten
    let strongestAttackCard = enemyPlayed.sort((a, b) => a.attack - b.attack)[0]
    //sort myAttackCards by attack value
    myAttackCards = myAttackCards.sort((a, b) => a.attack - b.attack)
    if (myAttackCards.length > 0 && strongestAttackCard.attack <= myAttackCards[0].attack) {
        //attack strongest attack card with strongest attack card
        return [[myAttackCards[0], strongestAttackCard]]
    }

    return null
}

//random number between min and max (inclusive)
export function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
