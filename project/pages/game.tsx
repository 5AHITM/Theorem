import { styled } from "../stitches.config";
import { useState, useEffect, SetStateAction } from "react";
import { DetailArea } from "../components/DetailArea";
import { GameArea } from "../components/GameArea";
import { UtilityArea } from "../components/UtilityArea";
import {
  DragDropContext,
  FluidDragActions,
  resetServerContext,
  SensorAPI,
} from "react-beautiful-dnd";
import { InferGetServerSidePropsType } from "next/types";
import * as tweenFunctions from "tween-functions";
import io from "socket.io-client";
import { Background } from "../components/atoms/Background";
import { useRouter } from "next/router";
import { GameState, PlayerAttackable, StandardEffects } from "../utils/Enum";
import { Card, CardCoordinates, CardStance, Result } from "../utils/Types";

const Layout = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100vw",
  minHeight: "100%",
});

const WaitingScreenLayout = styled("div", {
  background: "linear-gradient(180deg, #000000 0%, #000000 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100vw",
  minHeight: "100%",
  gap: "1rem",
});

const StyledButton = styled("button", {
  color: "white",
  fontSize: "2rem",
  backgroundColor: "black",
  border: "2px solid white",
  borderRadius: "0.5rem",
  padding: "0.5rem",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: "white",
    color: "black",
  },
});

const StyledHeading = styled("h1", {
  color: "white",
  fontSize: "4rem",
});

let socket;

export default function Game({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  // What turn it is, also used for managing drag and drop disabled
  const [gameState, setGameState] = useState<GameState>(GameState.ENEMY_TURN);

  // If a room has been found and the game can start
  const [roomFound, setRoomFound] = useState(false);

  // roomNumber for socket io
  const [roomNumber, setRoomNumber] = useState("");

  // A draggable placeholder for the card deck to draw
  const [cardDeck, setCardDeck] = useState(["0"]);

  // The position of the card hand
  const [pos, setPos] = useState([0]);

  // The cards the player has in hand
  const [playerCards, setPlayerCards] = useState<Card[]>([]);

  // The cards the player has on the field
  const [playerFieldCards, setPlayerFieldCards] = useState<Card[]>([]);

  // The cards the enemy has on the field
  const [enemyFieldCards, setEnemyFieldCards] = useState<Card[]>([]);

  // The cards the enemy has in hand
  const [enemyCards, setEnemyCards] = useState([]);

  const [health, setHealth] = useState(20);

  const [enemyHealth, setEnemyHealth] = useState(20);

  const [mana, setMana] = useState(0);

  // the card that has been selected for the players game field to attack with
  const [selectedCard, setSelectedCard] = useState<Card>();

  // the card that has been selected from the enemy game field to attack
  const [enemySelectedCardCoordinates, setEnemySelectedCard] = useState<
    number[]
  >([]);

  // the coordinates of the selected card
  const [selectedCardCoordinates, setSelectedCardCoordinates] = useState([]);

  //positions of the cards in the player field with the key
  const [cardPositions, setCardPositions] = useState<CardCoordinates[]>([]);

  //card that is being attacked by the enemy
  const [attackedCard, setAttackedCard] = useState<CardCoordinates>();

  //card that is the attacker
  const [enemyAttackingCard, setEnemyAttackingCard] = useState<Card>();

  //cards that have already attacked
  const [alreadyAttackedCards, setAlreadyAttackedCards] = useState([]);

  //card stances
  const [cardStances, setCardStances] = useState<CardStance[]>([]);

  const [result, setResult] = useState<Result>();

  //Card that dies after a fight
  const [playerCardToDie, setPlayerCardToDie] = useState<Card>();

  const [enemyCardToDie, setEnemyCardToDie] = useState<Card>();

  const [showPlayerIcon, setShowPlayerIcon] = useState<PlayerAttackable>(
    PlayerAttackable.GAME_START
  );

  const [showEnemyIcon, setShowEnemyIcon] = useState<PlayerAttackable>(
    PlayerAttackable.GAME_START
  );

  const [hasWon, setHasWon] = useState<"won" | "lost" | "undecided">(
    "undecided"
  );

  const [firstDraw, setFirstDraw] = useState(true);

  const [zoomCard, setZoomCard] = useState<Card>();

  const [manaConversionAllowed, setManaConversionAllowed] = useState(true);

  //set up socket io connection
  useEffect(() => {
    const socketInitializer = async () => {
      //get query params
      const { roomNumber, isPrivate } = router.query;

      //if roomNumber is not undefined, then we are joining a room

      const query = {
        token: "WEB",
        roomId: roomNumber,
        isPrivate: isPrivate,
      };

      // We just call it because we don't need anything else out of it
      socket = io("http://localhost:4000", {
        query,
        withCredentials: true,
      });
    };
    socketInitializer();
  }, [router.query]);

  useEffect(() => {
    console.log("playerFieldCards", playerFieldCards);
    console.log("enemyFieldCards", enemyFieldCards);
  }, [enemyFieldCards, playerFieldCards]);

  useEffect(() => {
    console.log("playerCardToDie", playerCardToDie);
    console.log("enemyCardToDie", enemyCardToDie);
  }, [playerCardToDie, enemyCardToDie]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("gameRoomID", (roomId: string) => {
      setRoomNumber(roomId);
    });

    socket.on("startGame", (starting: boolean) => {
      setRoomFound(true);
      if (starting) {
        setGameState(GameState.PLAYER_DRAWS);
        setMana(1);
        setShowPlayerIcon(PlayerAttackable.ATTACKABLE);
      } else {
        setShowEnemyIcon(PlayerAttackable.ATTACKABLE);
      }
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    socket.on("cardDrawn", (key: string) => {
      setEnemyCards([key, ...enemyCards]);
      console.log("card drawn");
    });

    socket.on("playerPlaysCard", (card: Card) => {
      setEnemyCards(enemyCards.slice(1));
      setEnemyFieldCards([...enemyFieldCards, card]);
      setCardStances([
        ...cardStances,
        {
          key: card.key,
          stance: card.stance,
          playedStance: card.playedStance,
          trapped: card.trapped,
        },
      ]);
      if (card.playedStance === "hidden" || card.stance === "defense") {
        setShowEnemyIcon(PlayerAttackable.NOT_ATTACKABLE);
      }
    });

    socket.on(
      "changeTurn",
      (
        turn: number,
        enemyCards: Card[],
        playerCards: Card[],
        manaConversionAllowed: boolean
      ) => {
        setManaConversionAllowed(manaConversionAllowed);
        if (showPlayerIcon === PlayerAttackable.GAME_START) {
          setShowPlayerIcon(PlayerAttackable.ATTACKABLE);
        }
        setEnemyFieldCards(enemyCards);

        setPlayerFieldCards(playerCards);

        setGameState(GameState.PLAYER_DRAWS);
        turn < 7 ? setMana(turn) : setMana(7);
        setAlreadyAttackedCards([]);
        setSelectedCard(undefined);
        setEnemySelectedCard([]);
        setResult(undefined);
        setPlayerCardToDie(undefined);
        setEnemyCardToDie(undefined);
      }
    );

    socket.on("nextCard", (card: Card) => {
      let newPlayerCards = [card, ...playerCards];
      setPlayerCards(newPlayerCards);
      setCardStances([
        ...cardStances,
        {
          key: card.key,
          stance: card.stance,
          playedStance: card.playedStance,
          trapped: false,
        },
      ]);
    });

    socket.on("drawForFirstTime", (cards: Card[]) => {
      setPlayerCards(cards);
      let c: CardStance[] = cardStances;
      cards.forEach((card) => {
        c.push({
          key: card.key,
          stance: card.stance,
          playedStance: card.playedStance,
          trapped: false,
        });
      });
      setCardStances(c);
    });

    socket.on("enemyDrawForFirstTime", (cards: Card[]) => {
      setEnemyCards(cards.map((card) => card.key));
    });

    socket.on(
      "changeStance",
      (stance: "attack" | "defense", cardKey: string) => {
        let newCardStances = cardStances.map((card) => {
          if (card.key === cardKey) {
            card.stance = stance;
          }
          return card;
        });

        setCardStances(newCardStances);

        if (stance === "defense") {
          setShowEnemyIcon(PlayerAttackable.NOT_ATTACKABLE);
        } else {
          enemyFieldCards.find((card) => card.stance === "defense")
            ? setShowEnemyIcon(PlayerAttackable.NOT_ATTACKABLE)
            : setShowEnemyIcon(PlayerAttackable.ATTACKABLE);
        }
      }
    );

    socket.on("playerAttacksPlayer", (cardKey: string, health: number) => {
      let attackingCard = enemyFieldCards.find((card) => card.key === cardKey);
      if (attackingCard) {
        setEnemyAttackingCard(attackingCard);
      }
      setHealth(health);
      //change Card stance to open
    });

    socket.on(
      "playerAttacks",
      (result: Result, playerHealth: number, enemyHealth: number) => {
        let newCardStances = cardStances.map((card: Card) => {
          if (card.key === result.defendingCardKey) {
            card.playedStance = "open";
          }
          return card;
        });
        setCardStances(newCardStances);

        if (cardPositions) {
          let attackedCardCoordinates = cardPositions.find(
            (card) => card.key === result.defendingCardKey
          );
          let attackingCardCoordinates = cardPositions.find(
            (card) => card.key === result.attackingCardKey
          );
          if (attackedCardCoordinates && attackingCardCoordinates) {
            attackingCardCoordinates.x =
              attackedCardCoordinates.x - attackingCardCoordinates.x;

            console.log(attackingCardCoordinates);

            attackingCardCoordinates.y =
              attackedCardCoordinates.y - attackingCardCoordinates.y;
            setAttackedCard(attackingCardCoordinates);
          }
        }
        let attackingCard = enemyFieldCards.find(
          (card) => card.key === result.attackingCardKey
        );
        if (attackingCard) {
          setEnemyAttackingCard(attackingCard);
        }

        setHealth(playerHealth);
        setEnemyHealth(enemyHealth);

        setResult(result);
      }
    );

    socket.on(
      "attackResult",
      (result: Result, playerHealth: number, enemyHealth: number) => {
        setResult(result);
        setHealth(playerHealth);
        setEnemyHealth(enemyHealth);
      }
    );

    socket.on("gameOver", (hasWon: "won" | "lost" | "undecided") => {
      setHasWon(hasWon);
    });
  }, [
    cardPositions,
    cardStances,
    enemyCards,
    enemyFieldCards,
    health,
    mana,
    playerCards,
    result,
    showEnemyIcon,
    showPlayerIcon,
  ]);

  function convertMana(manaToAdd: number) {
    setMana(mana + manaToAdd);
    setHealth(health - manaToAdd);
    setManaConversionAllowed(false);
    socket.emit("convertMana", roomNumber, manaToAdd);
  }

  function showCard(card) {
    setZoomCard(card);
  }

  //after the enemy attack finished
  function enemyAttackingFinished() {
    evaluateResult(false);
  }

  //after the player attack animation finished
  function attackingEnemyFinished() {
    evaluateResult(true);
  }

  function evaluateResult(playerAttacked: boolean) {
    if (result) {
      if (result.attackingCard.trapped) {
        //change stance to trapped true
        setCardStances(
          cardStances.map((card) => {
            if (card.key === result.attackingCard.key) {
              card.trapped = true;
            }
            return card;
          })
        );
      }
      //replace defending and attacking card
      if (playerAttacked) {
        if (result.attackingCardDies) {
          setPlayerCardToDie(result.attackingCard);
          console.log("attacking card dies");
        }

        if (result.defendingCardDies) {
          setEnemyCardToDie(result.defendingCard);
          console.log("defending card dies");
        }
        // if player Attacked replace the attacking card in the player field
        if (!result.attackingCardDies) {
          let newPlayerFieldCards = playerFieldCards.map((card) => {
            if (card.key === result.attackingCard.key) {
              card = result.attackingCard;
            }
            return card;
          });
          setPlayerFieldCards(newPlayerFieldCards);
        } else {
          let newPlayerFieldCards = playerFieldCards.filter(
            (card) => card.key !== result.attackingCard.key
          );
          setPlayerFieldCards(newPlayerFieldCards);
        }
        if (!result.defendingCardDies) {
          // replace the defending card in the enemy card field
          let newEnemyFieldCards = enemyFieldCards.map((card) => {
            if (card.key === result.defendingCard.key) {
              card = result.defendingCard;
            }
            return card;
          });
          setEnemyFieldCards(newEnemyFieldCards);
        } else {
          let newEnemyFieldCards = enemyFieldCards.filter(
            (card) => card.key !== result.defendingCard.key
          );
          setEnemyFieldCards(newEnemyFieldCards);
        }

        setAttackedCard(undefined);
        setEnemyAttackingCard(undefined);
      } else {
        if (result.attackingCardDies) {
          setEnemyCardToDie(result.attackingCard);
          console.log("attacking card dies");
        }
        if (result.defendingCardDies) {
          setPlayerCardToDie(result.defendingCard);
          console.log("attacking card dies");
        }
        // if enemy Attacked replace the attacking card in the enemy field
        if (!result.attackingCardDies) {
          let newEnemyFieldCards = enemyFieldCards.map((card) => {
            if (card.key === result.attackingCard.key) {
              card = result.attackingCard;
            }
            return card;
          });
          setEnemyFieldCards(newEnemyFieldCards);
        } else {
          let newEnemyFieldCards = enemyFieldCards.filter(
            (card) => card.key !== result.attackingCard.key
          );
          setEnemyFieldCards(newEnemyFieldCards);
        }
        if (!result.defendingCardDies) {
          // replace the defending card in the player card field
          let newPlayerFieldCards = playerFieldCards.map((card) => {
            if (card.key === result.defendingCard.key) {
              card = result.defendingCard;
            }
            return card;
          });
          setPlayerFieldCards(newPlayerFieldCards);
        } else {
          let newPlayerFieldCards = playerFieldCards.filter(
            (card) => card.key !== result.defendingCard.key
          );
          setPlayerFieldCards(newPlayerFieldCards);
        }

        setEnemySelectedCard([]);
        setSelectedCard(undefined);
      }
    }
  }

  function cardDied(playerCard: boolean) {
    if (playerCard) {
      console.log("player card deletion time");

      if (playerFieldCards.find((card) => card.key === playerCardToDie.key)) {
        let newPlayerFieldCards = playerFieldCards.filter(
          (card) => card.key !== playerCardToDie.key
        );
        setPlayerFieldCards(newPlayerFieldCards);
        newPlayerFieldCards.find((card) => card.stance === "defense")
          ? setShowPlayerIcon(PlayerAttackable.NOT_ATTACKABLE)
          : setShowPlayerIcon(PlayerAttackable.ATTACKABLE);

        setPlayerCardToDie(undefined);
        console.log("player card deleted");
      }
    } else {
      console.log("enemy card deletion time");
      if (enemyFieldCards.find((card) => card.key === enemyCardToDie.key)) {
        let newEnemyFieldCards = enemyFieldCards.filter(
          (card) => card.key !== enemyCardToDie.key
        );
        setEnemyFieldCards(newEnemyFieldCards);
        newEnemyFieldCards.find((card) => card.stance === "defense")
          ? setShowEnemyIcon(PlayerAttackable.NOT_ATTACKABLE)
          : setShowEnemyIcon(PlayerAttackable.ATTACKABLE);

        setEnemyCardToDie(undefined);
        console.log("enemy card deleted");
      }
    }
  }

  function getCoordiantes(e: HTMLElement) {
    if (pos.length === 1) {
      setPos([
        e.getBoundingClientRect().x - e.getClientRects()[0].x * 0.15,
        e.getClientRects()[0].y * 0.12,
      ]);
    }
  }

  function getNextCard() {
    if (firstDraw) {
      socket.emit("drawForFirstTime", roomNumber);
      setFirstDraw(false);
    } else {
      socket.emit("drawCard", roomNumber);
    }
  }

  function playCard(key: string, stance: "open" | "hidden") {
    socket.emit("playerPlaysCard", roomNumber, key, stance);
  }

  function changeTurn() {
    socket.emit("changeTurn", roomNumber);
    if (showEnemyIcon === PlayerAttackable.GAME_START) {
      setShowEnemyIcon(PlayerAttackable.ATTACKABLE);
    }
  }

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination && source.droppableId != "cardDeck") {
      return;
    }
    if (destination?.droppableId === source.droppableId) {
      return;
    }
    if (source.droppableId == "cardDeck" && playerCards.length < 7) {
      getNextCard();
      setCardDeck(["carddeck" + Number.parseInt(draggableId)]);
      if (GameState.PLAYER_DRAWS) {
        setGameState(GameState.PLAYER_PLAYS);
      }
      //copy array
    } else if (
      destination.droppableId == "playerField" &&
      source.droppableId == "playerHand" &&
      playerFieldCards.length < 5
    ) {
      //get card out of playerCards with the key equals to the draggableId
      let card = playerCards.find((card) => card.key == draggableId);
      //remove card from playerCards
      if (card.mana <= mana) {
        setMana(mana - card.mana);
        let newPlayerCards = playerCards.filter(
          (card) => card.key != draggableId
        );
        //add card to playerFieldCards
        let newPlayerFieldCards = [...playerFieldCards, card];
        //set state
        setPlayerCards(newPlayerCards);
        setPlayerFieldCards(newPlayerFieldCards);

        playCard(card.key, card.playedStance);
      }
    }
  };

  let api: SensorAPI;

  const useMyCoolSensor = (value: SensorAPI) => {
    api = value;
  };

  function moveStepByStep(drag: FluidDragActions, values: any[]) {
    requestAnimationFrame(() => {
      const newPosition = values.shift();
      drag.move(newPosition);

      if (values.length) {
        moveStepByStep(drag, values);
      } else {
        drag.drop();
      }
    });
  }

  function drawCard() {
    if (playerCards.length < 7) {
      startDrag();
    }
  }

  function changeGameState() {
    if (gameState === GameState.PLAYER_DRAWS) {
      setGameState(GameState.PLAYER_PLAYS);
    }
    if (gameState === GameState.PLAYER_PLAYS) {
      setGameState(GameState.PLAYER_FIGHTS);
    }
    if (gameState === GameState.PLAYER_FIGHTS) {
      setGameState(GameState.ENEMY_TURN);
      changeTurn();
    }
  }

  function fightCard(card: Card, e) {
    setAlreadyAttackedCards([...alreadyAttackedCards, selectedCard.key]);
    setEnemySelectedCard([
      e.clientX - selectedCardCoordinates[0],
      e.clientY - selectedCardCoordinates[1],
    ]);
    socket.emit("playerAttacks", roomNumber, card.key, selectedCard.key);

    //change card stance to open
    let newCardStances = cardStances.map((cardn: Card) => {
      if (card.key === cardn.key) {
        cardn.playedStance = "open";
      }
      return cardn;
    });
    setCardStances(newCardStances);
  }

  function attackPlayer(e) {
    if (selectedCard && !alreadyAttackedCards.includes(selectedCard.key)) {
      setAlreadyAttackedCards([...alreadyAttackedCards, selectedCard.key]);
      setEnemySelectedCard([
        e.clientX - selectedCardCoordinates[0],
        e.clientY - selectedCardCoordinates[1],
      ]);
      socket.emit("playerAttacksPlayer", roomNumber, selectedCard.key);
      setEnemyHealth(enemyHealth - selectedCard.attack);
    }
  }

  function addCardPositions(cardPositionsN: CardCoordinates) {
    setCardPositions([...cardPositions, cardPositionsN]);
  }

  function changeCardStance(cardStance: CardStance) {
    if (cardStance.playedStance !== "hidden") {
      socket.emit(
        "changeStance",
        roomNumber,
        cardStance.stance,
        cardStance.key
      );
      setCardStances(
        cardStances.map((card) => {
          return card.key === cardStance.key ? cardStance : card;
        })
      );
    }
  }

  function changeIntialCardStance(cardStance: CardStance) {
    setCardStances(
      cardStances.map((card) => {
        return card.key === cardStance.key ? cardStance : card;
      })
    );
  }

  const startDrag = function start() {
    const preDrag = api.tryGetLock(cardDeck[0]);

    if (!preDrag && pos.length > 0) {
      return;
    }

    const endX = pos[0];

    const endY = pos[1];

    const start = { x: 0, y: 0 };
    const end = { x: endX, y: endY };
    const drag = preDrag.fluidLift(start);

    const points = [];

    for (let i = 0; i < 20; i++) {
      points.push({
        x: tweenFunctions.easeOutCirc(i, start.x, end.x, 20),
        y: tweenFunctions.easeOutCirc(i, start.y, end.y, 20),
      });
    }
    moveStepByStep(drag, points);
  };

  if (hasWon !== "undecided") {
    return (
      <WaitingScreenLayout>
        <StyledHeading>You have {hasWon}!</StyledHeading>
      </WaitingScreenLayout>
    );
  } else {
    if (roomFound) {
      return (
        <Layout>
          <DragDropContext
            onDragEnd={onDragEnd}
            onDragStart={(result) => {}}
            sensors={[useMyCoolSensor]}
          >
            <DetailArea
              gameState={gameState}
              cardDeck={cardDeck}
              drawCard={drawCard}
              zoomCard={zoomCard}
            ></DetailArea>
            <GameArea
              showCard={showCard}
              getCoordiantes={getCoordiantes}
              playerCards={playerCards}
              playerFieldCards={playerFieldCards}
              enemyFieldCards={enemyFieldCards}
              enemyCards={enemyCards}
              gameState={gameState}
              setSelectedCard={setSelectedCard}
              fightCard={fightCard}
              enemySelectedCard={enemySelectedCardCoordinates}
              setEnemySelectedCard={setEnemySelectedCard}
              setSelectedCardCoordinates={setSelectedCardCoordinates}
              selectedCard={selectedCard}
              addCardPositions={addCardPositions}
              attackedCard={attackedCard}
              enemyAttackingCard={enemyAttackingCard}
              enemyAttackingFinished={enemyAttackingFinished}
              alreadyAttackedCards={alreadyAttackedCards}
              changeCardStance={changeCardStance}
              changeIntialCardStance={changeIntialCardStance}
              cardStances={cardStances}
              attackingEnemyFinished={attackingEnemyFinished}
              playerCardToDie={playerCardToDie}
              enemyCardToDie={enemyCardToDie}
              cardDied={cardDied}
              showEnemyIcon={showEnemyIcon}
              showPlayerIcon={showPlayerIcon}
              attackPlayer={attackPlayer}
            ></GameArea>
            <UtilityArea
              gameState={gameState}
              cards={[]}
              changeGameState={changeGameState}
              mana={mana}
              health={health}
              enemyHealth={enemyHealth}
              convertMana={convertMana}
              manaConversionAllowed={manaConversionAllowed}
            ></UtilityArea>
          </DragDropContext>
        </Layout>
      );
    } else {
      return (
        <WaitingScreenLayout>
          {roomFound ? (
            <StyledHeading>Room Found</StyledHeading>
          ) : (
            <StyledHeading>Waiting for other player to join</StyledHeading>
          )}
          <StyledButton
            onClick={() => {
              //copy roomnumber to clipboard
              navigator.clipboard.writeText(roomNumber);
            }}
          >
            Room number: {roomNumber}
          </StyledButton>
        </WaitingScreenLayout>
      );
    }
  }
}

export const getServerSideProps = async () => {
  resetServerContext();

  // Fetch data from external API
  const data = [];

  // Pass data to the page via props
  return { props: { data } };
};
