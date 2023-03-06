import { io, Socket } from "socket.io-client";
import { AvailableCard, PlayedCard, Result, Stance } from "./model";
import { KI_attackCard, KI_playCard, randomNumber } from "./ki";

let socket!: Socket;
let gameRoomID: string;
let drawedForFirstTime: boolean = false;

let availableCards: AvailableCard[] = [];
let played: PlayedCard[] = [];
let enemyPlayed: PlayedCard[] = [];
let enemyHealth = 20;
let myHealth = 20;
let round = 1;

export function connect(room: string = "") {
  if (room != "") {
    gameRoomID = room;
  }

  const query = {
    token: "WEB",
    roomId: gameRoomID,
    isPrivate: true,
  };

  socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL, {
    query,
    withCredentials: true,
  });

  // ============== basic socket events ==============
  socket.on("connect", () => {
    console.log("Connected to server");
  });
  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });
  socket.on("gameOver", (result: string) => {
    console.log("game ended: KI " + result);
    socket.disconnect();
  });

  // ============== before game start events ==============
  socket.on("gameRoomID", (gameroomId: string) => {
    console.log("Game Room ID: " + gameroomId);
    gameRoomID = gameroomId;
  });
  socket.on("startGame", (start: boolean) => {
    console.log("Start Game: " + start);
    if (start && !drawedForFirstTime) {
      drawForFirstTime();
    }
  });

  // ============== game events ==============
  socket.on("drawForFirstTime", (cards: AvailableCard[]) => {
    console.log("Draw for first time: " + cards);
    drawedForFirstTime = true;
    availableCards = cards;
    logAvailableCards();

    //play one card if possible
    setTimeout(() => {
      let tupel = KI_playCard(
        enemyPlayed,
        played,
        availableCards,
        round,
        myHealth,
        enemyHealth
      );
      let cardToPlay = tupel?.[0];
      let stance = tupel?.[1];
      if (cardToPlay != null) {
        if (stance == Stance.DEFENSE) {
          let playedCard = playCard(cardToPlay, Stance.DEFENSE);
          changeStance(playedCard, Stance.DEFENSE);
        } else {
          playCard(cardToPlay);
        }
      } else {
        console.log("No card to play");
      }

      setTimeout(() => {
        changeTurn();
      }, 1000);
    }, 1000);
    logEnemyPlayedCards("socket: drawForFirstTime");
  });
  socket.on("changeTurn", (turn: number) => {
    console.log("Change Turn: " + turn);
    if (!drawedForFirstTime) {
      drawForFirstTime();
    } else {
      drawCard();
    }
    logEnemyPlayedCards("socket: changeTurn");
  });
  socket.on("nextCard", (card: AvailableCard) => {
    console.log("Next Card: " + card);
    availableCards.push(card);

    round++;
    //play multiple cards if possible
    let random = randomNumber(1, 4);
    console.log("[ki] plays " + random + " cards");
    for (let i = 0; i < random; i++) {
      setTimeout(() => {
        let tupel = KI_playCard(
          enemyPlayed,
          played,
          availableCards,
          round,
          myHealth,
          enemyHealth
        );
        let cardToPlay = tupel?.[0];
        let stance = tupel?.[1];
        if (cardToPlay != null) {
          if (stance == Stance.DEFENSE) {
            let playedCard = playCard(cardToPlay, Stance.DEFENSE);
            changeStance(playedCard, Stance.DEFENSE);
          } else {
            playCard(cardToPlay);
          }
        } else {
          console.log("No card to play");
        }

        if (i == random - 1) {
          setTimeout(() => {
            logEnemyPlayedCards();
            let attacks: [PlayedCard, PlayedCard | null][] | null =
              KI_attackCard(enemyPlayed, played, myHealth, enemyHealth);
            if (attacks != null) {
              attacks.forEach((attack) => {
                let attackingCard = attack[0];
                let defendingCard = attack[1];
                if (defendingCard != null) {
                  attackWith(attackingCard, defendingCard);
                } else {
                  attackWith(attackingCard, null);
                }
              });
            } else {
              console.log("Not attacking");
            }
          }, 1000);

          setTimeout(() => {
            changeTurn();
          }, 5000);
        }
      }, 1000);
      logEnemyPlayedCards("socket: nextCard");
    }
  });
  socket.on("playerPlaysCard", (card: PlayedCard) => {
    console.log("[enemy] plays card: " + card + " with stance: " + card.stance);
    enemyPlayed.push(card);
    logEnemyPlayedCards("socket: playerPlaysCard");
  });
  socket.on("playerAttacks", (result: Result, myH: number, enemyH: number) => {
    enemyHealth = enemyH;
    myHealth = myH;
    let attackingCardKey = result.attackingCardKey;
    let defendingCardKey = result.defendingCardKey;
    if (result.attackingCardDies) {
      enemyPlayed = enemyPlayed.filter((card) => card.key != attackingCardKey);
    }
    if (result.defendingCardDies) {
      played = played.filter((card) => card.key != defendingCardKey);
    }
    console.log(
      "Attack Result: " +
      result +
      ", my health: " +
      myHealth +
      ", enemy health: " +
      enemyHealth
    );
    logEnemyPlayedCards("socket: playerAttacks");
    logPlayedCards();
  });
  socket.on("attackResult", (result: Result, myH: number, enemyH: number) => {
    console.log("I AM ATTACKING");

    enemyHealth = enemyH;
    myHealth = myH;
    let attackingCardKey = result.attackingCardKey;
    let defendingCardKey = result.defendingCardKey;
    if (result.defendingCardDies) {
      enemyPlayed = enemyPlayed.filter((card) => card.key != defendingCardKey);
    }
    if (result.attackingCardDies) {
      played = played.filter((card) => card.key != attackingCardKey);
    }
    console.log(
      "Attack Result: " +
      result +
      ", my health: " +
      myHealth +
      ", enemy health: " +
      enemyHealth
    );
    logEnemyPlayedCards("socket: attackResult");
    logPlayedCards();
  });
  socket.on("playerAttacksPlayer", (attackingCardKey: string, myH: number) => {
    myHealth = myH;
    console.log(
      "Player attacks player: " + attackingCardKey + ", my health: " + myHealth
    );
    logEnemyPlayedCards("socket: playerAttacksPlayer");
  });
  socket.on("changeStance", (stance: string, cardKey: string) => {
    console.log(
      "[enemy] stance change: card:" + cardKey + " to stance " + stance
    );
    let card = enemyPlayed.find((card) => card.key == cardKey);
    if (card != null) {
      if (stance == "attack") {
        card.stance = Stance.ATTACK;
      } else {
        card.stance = Stance.DEFENSE;
      }
    }
    logEnemyPlayedCards("socket: changeStance");
  });
}

//draw for first time (usually 5 cards)
function drawForFirstTime() {
  socket.emit("drawForFirstTime", gameRoomID);
  logEnemyPlayedCards("drawForFirstTime");
}
//draw one card
function drawCard() {
  socket.emit("drawCard", gameRoomID);
  logEnemyPlayedCards("drawCard");
}
function playCard(card: AvailableCard, stance: Stance = Stance.ATTACK) {
  socket.emit("playerPlaysCard", gameRoomID, card.key, "open");
  availableCards = availableCards.filter((card) => card.key != card.key);
  let playedCard = {
    id: card.id,
    key: card.key,
    name: card.name,
    attack: card.attack,
    defense: card.defense,
    stance: stance,
  };
  played.push(playedCard);
  console.log("[ki] played card: " + card.id + " with stance: " + stance);
  logEnemyPlayedCards("playCard");
  return playedCard;
}
function changeTurn() {
  socket.emit("changeTurn", gameRoomID);
  logEnemyPlayedCards("changeTurn");
}
function changeStance(card: PlayedCard, stance: Stance) {
  let stanceString = "";
  if (Stance.ATTACK) {
    stanceString = "attack";
  } else {
    stanceString = "defense";
  }
  socket.emit("changeStance", gameRoomID, stanceString, card.key);
  console.log("[ki] stance change: card:" + card.key + " to stance " + stance);
  logEnemyPlayedCards("changeStance");
}
function attackWith(
  attackingCard: PlayedCard,
  defendingCard: PlayedCard | null = null
) {
  if (defendingCard != null) {
    socket.emit(
      "playerAttacks",
      gameRoomID,
      defendingCard.key,
      attackingCard.key
    );
    console.log(
      "Attacking card: " + attackingCard.id + " with card: " + defendingCard.id
    );
  } else {
    socket.emit("playerAttacksPlayer", gameRoomID, attackingCard.key);
    console.log("Attacking player with card " + attackingCard.id);
  }
  logEnemyPlayedCards("attackWith");
}

// ============== start ==============
// rl.question('RoomID: ', (answer) => {
//     gameRoomID = answer;
//     console.log("Connecting to server...");
//     connect()
//     rl.close();
// });

// ============== help functions ==============
function logAvailableCards() {
  availableCards.forEach((card) => {
    console.log(card.name + " " + card.attack + "/" + card.defense);
  });
}
function logPlayedCards() {
  played.forEach((card) => {
    console.log(card.name + " " + card.attack + "/" + card.defense);
  });
}
function logEnemyPlayedCards(method: string = "") {
  console.log("=================" + method + "=====================");
  enemyPlayed.forEach((card) => {
    console.log(
      card.name +
      " " +
      card.attack +
      "/" +
      card.defense +
      " stance: " +
      card.stance
    );
  });
  console.log("======================================");
}
