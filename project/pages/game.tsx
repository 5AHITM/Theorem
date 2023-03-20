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
import io, { Socket } from "socket.io-client";
import { useRouter } from "next/router";
import { GameState, PlayerAttackable } from "../utils/Enum";
import { Card, CardCoordinates, CardStance, Result } from "../utils/Types";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { connect } from "../utils/socket";
import Link from "next/link";

const Layout = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100vw",
  minHeight: "100%",
});

const StyledLink = styled(Link, {
  backgroundColor: "black",
  border: "1px solid white",
  borderRadius: "0.5rem",
  padding: "0.5rem",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  color: "white",
  textDecoration: "none",
  "&:hover": {
    backgroundColor: "white",
    color: "black",
  },
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

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

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

  // The position of the card hand
  const [pos, setPos] = useState([0]);

  const [playerIconPos, setPlayerIconPos] = useState([0]);

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

  // the card that has been selected by the enemy to be attacked
  const [enemySelectedCardCoordinates, setEnemySelectedCard] = useState<
    number[]
  >([]);

  // the coordinates of the selected card
  const [selectedCardCoordinates, setSelectedCardCoordinates] = useState([]);

  //card that is being attacked by the enemy
  const [attackedCard, setAttackedCard] = useState<CardCoordinates>();

  //card that is the attacker
  const [enemyAttackingCard, setEnemyAttackingCard] = useState<Card>();

  //cards that have already attacked
  const [alreadyAttackedCards, setAlreadyAttackedCards] = useState([]);

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

  const [botEnemy, setBotEnemy] = useState(false);

  const [currentFightingCard, setCurrentFightingCard] = useState<Card>();

  //set up socket io connection only once
  useEffect(() => {
    const socketInitializer = async () => {
      //get query params
      const { roomNumber, isPrivate, botEnemy } = router.query;
      if (botEnemy) {
        setBotEnemy(true);
      }
      const query = {
        token: "WEB",
        roomId: roomNumber,
        isPrivate: isPrivate,
      };
      socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL, {
        query,
        withCredentials: true,
      });
    };
    socketInitializer();
  }, [router.query]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("gameRoomID", (roomId: string) => {
      setRoomNumber(roomId);
      if (botEnemy) {
        connect(roomId);
      }
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

    //if enemy draws a card
    socket.on("cardDrawn", (key: string) => {
      setEnemyCards([key, ...enemyCards]);
    });

    //if enemy plays a card
    socket.on("playerPlaysCard", (card: Card) => {
      setEnemyCards(enemyCards.slice(1));
      card.coordinates = { x: 0, y: 0 };
      setEnemyFieldCards([...enemyFieldCards, card]);
      if (card.playedStance === "hidden" || card.stance === "defense") {
        setShowEnemyIcon(PlayerAttackable.NOT_ATTACKABLE);
      }
    });

    //if the enemy changes turn
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

        enemyCards.map((card) => {
          card.coordinates = enemyFieldCards.find(
            (enemyCard) => card.key === enemyCard.key
          )
            ? enemyFieldCards.find((enemyCard) => card.key === enemyCard.key)
                ?.coordinates
            : (card.coordinates = {
                x: 0,
                y: 0,
              });
        });

        playerCards.map((card) => {
          card.coordinates = playerFieldCards.find(
            (enemyCard) => card.key === enemyCard.key
          )
            ? playerFieldCards.find((enemyCard) => card.key === enemyCard.key)
                ?.coordinates
            : (card.coordinates = {
                x: 0,
                y: 0,
              });
        });

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

    //server sends the next card from the deck
    socket.on("nextCard", (card: Card) => {
      card.coordinates = {
        x: 0,
        y: 0,
      };
      let newPlayerCards = [card, ...playerCards];
      setPlayerCards(newPlayerCards);
    });

    //server sends the first 5 card from the deck
    socket.on("drawForFirstTime", (cards: Card[]) => {
      cards.map((card) => {
        card.coordinates = {
          x: 0,
          y: 0,
        };
      });
      setPlayerCards(cards);
    });

    //server sends the first 5 card from the deck for the enemy
    socket.on("enemyDrawForFirstTime", (cards: Card[]) => {
      setEnemyCards(cards.map((card) => card.key));
    });

    //enemy changes the stance of a card
    socket.on(
      "changeStance",
      (stance: "attack" | "defense", cardKey: string) => {
        let newEnemyFieldCards = enemyFieldCards.map((card) => {
          if (card.key === cardKey) {
            card.stance = stance;
          }
          return card;
        });

        setEnemyFieldCards(newEnemyFieldCards);

        if (stance === "defense") {
          setShowEnemyIcon(PlayerAttackable.NOT_ATTACKABLE);
        } else {
          newEnemyFieldCards.find((card) => card.stance === "defense")
            ? setShowEnemyIcon(PlayerAttackable.NOT_ATTACKABLE)
            : setShowEnemyIcon(PlayerAttackable.ATTACKABLE);
        }
      }
    );

    //enemy attacks a player directly
    socket.on("playerAttacksPlayer", (cardKey: string, health: number) => {
      let attackingCard = enemyFieldCards.find((card) => card.key === cardKey);
      if (attackingCard) {
        setEnemyAttackingCard(attackingCard);
      }
      setHealth(health);
      //change Card stance to open
    });

    //enemy attacks a card
    socket.on(
      "playerAttacks",
      (result: Result, playerHealth: number, enemyHealth: number) => {
        let newPlayerFieldCards = playerFieldCards.map((card: Card) => {
          if (card.key === result.defendingCardKey) {
            card.playedStance = "open";
          }
          return card;
        });

        let attackedCardCoordinates = playerFieldCards.find(
          (card) => card.key === result.defendingCardKey
        );
        let attackingCardCoordinates = enemyFieldCards.find(
          (card) => card.key === result.attackingCardKey
        );

        if (attackedCardCoordinates && attackingCardCoordinates) {
          console.log(attackedCardCoordinates);
          console.log(attackingCardCoordinates);

          let distanceX =
            attackedCardCoordinates.coordinates.x -
            attackingCardCoordinates.coordinates.x;

          let distanceY =
            attackedCardCoordinates.coordinates.y -
            attackingCardCoordinates.coordinates.y;

          let attackedCard = {
            key: result.defendingCardKey,
            x: distanceX,
            y: distanceY,
          };

          console.log("attacked Card", attackedCard);
          setPlayerFieldCards(newPlayerFieldCards);
          setAttackedCard(attackedCard);
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

    //the attack result of a fight
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

    socket.on("enemyConvertMana", (mana) => {
      setEnemyHealth(enemyHealth - mana);
    });
  }, [
    botEnemy,
    enemyCards,
    enemyFieldCards,
    enemyHealth,
    health,
    mana,
    playerCards,
    playerFieldCards,
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

    setAttackedCard(undefined);
    setEnemyAttackingCard(undefined);
  }

  //after the player attack animation finished
  function attackingEnemyFinished() {
    evaluateResult(true);

    setEnemySelectedCard([]);
    setSelectedCard(undefined);
  }

  function afterFightAnimation(playerAttacked: boolean) {
    if (result) {
      let newPlayerFieldCards = playerFieldCards;
      let newEnemyFieldCards = enemyFieldCards;

      newPlayerFieldCards = newPlayerFieldCards.map((card) => {
        if (card.key == result.attackingCardKey) {
          result.attackingCard.coordinates = card.coordinates;
          console.log("result.attackingCard", result.attackingCard);
          card = result.attackingCard;
          if (result.attackingCard.trapped) {
            card.trapped = true;
          }
        }
        if (card.key == result.defendingCardKey) {
          result.defendingCard.coordinates = card.coordinates;
          console.log("result.defendingCard", result.defendingCard);
          card = result.defendingCard;
        }

        return card;
      });

      newEnemyFieldCards = newEnemyFieldCards.map((card) => {
        if (card.key == result.attackingCardKey) {
          result.attackingCard.coordinates = card.coordinates;
          console.log("result.attackingCard", result.attackingCard);
          card = result.attackingCard;
          if (result.attackingCard.trapped) {
            card.trapped = true;
          }
        }
        if (card.key == result.defendingCardKey) {
          result.defendingCard.coordinates = card.coordinates;
          console.log("result.defendingCard", result.defendingCard);
          card = result.defendingCard;
        }
        return card;
      });

      if (result.attackingCardDies) {
        newPlayerFieldCards = newPlayerFieldCards.filter(
          (card) => card.key != result.attackingCardKey
        );
      } else {
        newPlayerFieldCards = newPlayerFieldCards.filter(
          (card) => card.key != result.defendingCardKey
        );
      }

      if (result.attackingCardDies) {
        newEnemyFieldCards = newEnemyFieldCards.filter(
          (card) => card.key != result.attackingCardKey
        );
      } else {
        newEnemyFieldCards = newEnemyFieldCards.filter(
          (card) => card.key != result.defendingCardKey
        );
      }

      let enemyAttackable = newEnemyFieldCards.find(
        (card) => card.stance === "defense"
      )
        ? false
        : true;

      let playerAttackable = newPlayerFieldCards.find(
        (card) => card.stance === "defense"
      )
        ? false
        : true;

      if (enemyAttackable) {
        setShowEnemyIcon(PlayerAttackable.ATTACKABLE);
      } else {
        setShowEnemyIcon(PlayerAttackable.NOT_ATTACKABLE);
      }

      if (playerAttackable) {
        setShowPlayerIcon(PlayerAttackable.ATTACKABLE);
      } else {
        setShowPlayerIcon(PlayerAttackable.NOT_ATTACKABLE);
      }

      setPlayerFieldCards(newPlayerFieldCards);
      setEnemyFieldCards(newEnemyFieldCards);
    }
  }

  //after the player attack animation finished
  function evaluateResult(playerAttacked: boolean) {
    console.log("playerAttacked: ", playerAttacked);
    console.log(result);
    if (result) {
      //replace defending and attacking card
      if (playerAttacked) {
        if (result.attackingCardDies) {
          setPlayerCardToDie(result.attackingCard);
        }

        if (result.defendingCardDies) {
          setEnemyCardToDie(result.defendingCard);
        }
      } else {
        if (result.attackingCardDies) {
          setEnemyCardToDie(result.attackingCard);
        }
        if (result.defendingCardDies) {
          setPlayerCardToDie(result.defendingCard);
        }
      }
    }
  }

  //obsolete function
  function getCoordiantes(e: HTMLElement) {
    if (pos.length === 1) {
      setPos([
        e.getBoundingClientRect().x - e.getClientRects()[0].x * 0.15,
        e.getClientRects()[0].y * 0.12,
      ]);
    }
  }

  function getPlayerIconCoordiantes(e: HTMLElement) {
    if (playerIconPos.length === 1) {
      setPlayerIconPos([
        e.getBoundingClientRect().x,
        e.getBoundingClientRect().y,
      ]);
    }
  }

  //get the next card to draw
  function getNextCard() {
    if (firstDraw) {
      socket.emit("drawForFirstTime", roomNumber);
      setFirstDraw(false);
    } else {
      socket.emit("drawCard", roomNumber);
    }
  }

  //play a card from the hand
  function playCard(key: string, stance: "open" | "hidden") {
    socket.emit("playerPlaysCard", roomNumber, key, stance);
  }

  //change the turn
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
    if (
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

        if (card.playedStance === "hidden") {
          setShowPlayerIcon(PlayerAttackable.NOT_ATTACKABLE);
        }

        playCard(card.key, card.playedStance);
      }
    }
  };

  //used for beatiful dnd drawing
  let api: SensorAPI;
  const useMyCoolSensor = (value: SensorAPI) => {
    api = value;
  };

  //draw a card
  function drawCard() {
    if (playerCards.length < 7) {
      getNextCard();
      if (GameState.PLAYER_DRAWS) {
        setGameState(GameState.PLAYER_PLAYS);
      }
    }
  }

  // Change the game state from drawing to playing to fighting to enemy turn.
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

  //fight a card
  function fightCard(card: Card, e) {
    if (enemySelectedCardCoordinates.length === 0) {
      setAlreadyAttackedCards([...alreadyAttackedCards, selectedCard.key]);
      setEnemySelectedCard([
        e.clientX - selectedCardCoordinates[0],
        e.clientY - selectedCardCoordinates[1],
      ]);
      socket.emit("playerAttacks", roomNumber, card.key, selectedCard.key);

      setCurrentFightingCard(selectedCard);

      //change card stance to open
      let newCardStances = enemyFieldCards.map((cardn: Card) => {
        if (card.key === cardn.key) {
          cardn.playedStance = "open";
        }
        return cardn;
      });
      setEnemyFieldCards(newCardStances);
    }
  }

  //attack the enemy directly
  function attackPlayer(e) {
    if (selectedCard && !alreadyAttackedCards.includes(selectedCard.key)) {
      setAlreadyAttackedCards([...alreadyAttackedCards, selectedCard.key]);
      setEnemySelectedCard([
        e.clientX - selectedCardCoordinates[0],
        e.clientY - selectedCardCoordinates[1],
      ]);
      socket.emit("playerAttacksPlayer", roomNumber, selectedCard.key);
      setCurrentFightingCard(selectedCard);

      setEnemyHealth(enemyHealth - selectedCard.attack);
    }
  }

  //tracks all the card positions that are on both gamefields for animation
  function addCardPositions(cardPositionsN: CardCoordinates, player: boolean) {
    if (player) {
      let newPlayerFieldCards = playerFieldCards.map((card) => {
        if (card.key === cardPositionsN.key) {
          card.coordinates.x = cardPositionsN.x;
          card.coordinates.y = cardPositionsN.y;
        }
        return card;
      });

      setPlayerFieldCards(newPlayerFieldCards);
    } else {
      let newEnemyFieldCards = enemyFieldCards.map((card) => {
        if (card.key === cardPositionsN.key) {
          card.coordinates.x = cardPositionsN.x;
          card.coordinates.y = cardPositionsN.y;
        }
        return card;
      });

      setEnemyFieldCards(newEnemyFieldCards);
    }
  }

  //changes card stance through an enemy attack
  function changeCardStance(cardStance: CardStance) {
    if (cardStance.playedStance !== "hidden") {
      socket.emit(
        "changeStance",
        roomNumber,
        cardStance.stance,
        cardStance.key
      );

      let newPlayerFieldCards = playerFieldCards.map((card) => {
        if (card.key === cardStance.key) {
          card.stance = cardStance.stance;
        }
        return card;
      });

      setPlayerFieldCards(newPlayerFieldCards);
    } else {
      let newPlayerFieldCards = playerFieldCards.map((card) => {
        if (card.key === cardStance.key) {
          card.stance = "defense";
          card.playedStance = "open";
        }
        return card;
      });

      //TODO send to server
      setPlayerFieldCards(newPlayerFieldCards);
    }
  }

  //changes the card stance if its played hidden or open
  function changeIntialCardStance(cardStance: CardStance) {
    let newPlayerHandCards = playerCards.map((card) => {
      if (card.key === cardStance.key) {
        card.playedStance == cardStance.playedStance;
      }
      return card;
    });
    setPlayerCards(newPlayerHandCards);
  }

  if (hasWon !== "undecided") {
    return (
      <WaitingScreenLayout>
        <StyledHeading>You have {hasWon}!</StyledHeading>
        <StyledLink href={"/"}> Back to the Homepage</StyledLink>
      </WaitingScreenLayout>
    );
  } else {
    return (
      <Layout>
        <DragDropContext
          onDragEnd={onDragEnd}
          onDragStart={(result) => {}}
          sensors={[useMyCoolSensor]}
        >
          <DetailArea
            gameState={gameState}
            drawCard={drawCard}
            zoomCard={zoomCard}
          ></DetailArea>
          <GameArea
            playerIconPos={playerIconPos}
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
            attackingEnemyFinished={attackingEnemyFinished}
            playerCardToDie={playerCardToDie}
            enemyCardToDie={enemyCardToDie}
            cardDied={afterFightAnimation}
            showEnemyIcon={showEnemyIcon}
            showPlayerIcon={showPlayerIcon}
            attackPlayer={attackPlayer}
            getPlayerIconCoordiantes={getPlayerIconCoordiantes}
            currentFightingCard={currentFightingCard}
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
  }
}

export const getServerSideProps = async () => {
  resetServerContext();

  // Fetch data from external API
  const data = [];

  // Pass data to the page via props
  return { props: { data } };
};
