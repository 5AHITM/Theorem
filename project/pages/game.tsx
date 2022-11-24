import { styled } from "../stitches.config";
import { useState, useEffect } from "react";
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
import { GameState } from "../utils/Enum";

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
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100vw",
  minHeight: "100%",
});

let socket;

export default function Game({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const [gameState, setGameState] = useState<GameState>(GameState.ENEMY_TURN);

  const [roomFound, setRoomFound] = useState(false);

  const [roomNumber, setRoomNumber] = useState("");

  const [cardDeck, setCardDeck] = useState(["0"]);

  const [pos, setPos] = useState([0]);

  const [playerCards, setPlayerCards] = useState([]);

  const [playerFieldCards, setPlayerFieldCards] = useState([]);

  const [enemyFieldCards, setEnemyFieldCards] = useState([]);

  const [enemyCards, setEnemyCards] = useState([]);

  const [health, setHealth] = useState(20);

  const [enemyHealth, setEnemyHealth] = useState(20);

  const [mana, setMana] = useState(0);

  const [selectedCard, setSelectedCard] = useState();

  const [enemySelectedCardCoordinates, setEnemySelectedCard] = useState([]);

  const [selectedCardCoordinates, setSelectedCardCoordinates] = useState([]);

  //check if fullscreen
  const [screenModeSet, setScreenModeSet] = useState(false);

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
    setScreenModeSet(!window.screenTop && !window.screenY);
  }, [router.query]);

  useEffect(() => {
    console.log(roomNumber);
  }, [roomNumber]);

  useEffect(() => {
    console.log(playerCards);
  }, [playerCards]);

  useEffect(() => {
    console.log(gameState);
  }, [gameState]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("gameRoomID", (roomId) => {
      setRoomNumber(roomId);
    });

    socket.on("startGame", (starting: boolean) => {
      setRoomFound(true);
      if (starting) {
        setGameState(GameState.PLAYER_DRAWS);
        setMana(1);
      }
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    socket.on("cardDrawn", (id) => {
      setEnemyCards([id, ...enemyCards]);
      console.log("card drawn");
    });

    socket.on("playerPlaysCard", (card) => {
      console.log(card);
      setEnemyCards(enemyCards.slice(1));
      setEnemyFieldCards([...enemyFieldCards, card]);
    });

    socket.on("changeTurn", (turn) => {
      setGameState(GameState.PLAYER_DRAWS);
      mana + turn < 10 ? setMana(mana + turn) : setMana(10);
    });

    socket.on("nextCard", (card) => {
      let newPlayerCards = [card, ...playerCards];
      setPlayerCards(newPlayerCards);
    });
  }, [enemyCards, enemyFieldCards, mana, playerCards]);

  function getCoordiantes(e: HTMLElement) {
    if (pos.length === 1) {
      setPos([
        e.getBoundingClientRect().x - e.getClientRects()[0].x * 0.15,
        e.getClientRects()[0].y * 0.12,
      ]);
    }
  }

  function getNextCard() {
    socket.emit("drawCard", roomNumber);
  }

  function playCard(id: number) {
    socket.emit("playerPlaysCard", roomNumber, id);
  }

  function changeTurn() {
    socket.emit("changeTurn", roomNumber);
  }

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    console.log(result);

    if (!destination && source.droppableId != "cardDeck") {
      return;
    }
    if (destination?.droppableId === source.droppableId) {
      return;
    }
    if (source.droppableId == "cardDeck" && playerCards.length < 7) {
      getNextCard();
      setCardDeck(["" + (Number.parseInt(draggableId) + 1)]);
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
        playCard(card.key);
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

  function fightCard(card, e) {
    if (selectedCard) {
      console.log(card);
      console.log(e);
      setEnemySelectedCard([
        e.clientX - selectedCardCoordinates[0],
        e.clientY - selectedCardCoordinates[1],
      ]);
      socket.emit("playerAttacks", roomNumber, card.key, selectedCard.key);
    }
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

  if (roomFound && screenModeSet) {
    return (
      <Layout>
        <DragDropContext
          onDragEnd={onDragEnd}
          onDragStart={(result) => {}}
          sensors={[useMyCoolSensor]}
        >
          <Background></Background>
          <DetailArea
            gameState={gameState}
            cardDeck={cardDeck}
            drawCard={drawCard}
          ></DetailArea>
          <GameArea
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
          ></GameArea>
          <UtilityArea
            gameState={gameState}
            cards={[]}
            changeGameState={changeGameState}
            mana={mana}
            health={health}
            enemyHealth={enemyHealth}
          ></UtilityArea>
        </DragDropContext>
      </Layout>
    );
  } else {
    return (
      <WaitingScreenLayout>
        {roomFound ? (
          <h1>Room Found</h1>
        ) : (
          <h1>Waiting for other player to join</h1>
        )}
        <button
          onClick={() => {
            if (document.documentElement.requestFullscreen)
              document.documentElement.requestFullscreen();
            setScreenModeSet(true);
          }}
        >
          Go Fullscrenmode
        </button>
      </WaitingScreenLayout>
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
