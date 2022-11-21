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

const Layout = styled("div", {
  display: "flex",
  flexDirection: "row",
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

  const [roomFound, setRoomFound] = useState(false);

  const [roomNumber, setRoomNumber] = useState("");

  //set up socket io connection
  useEffect(() => {
    socketInitializer();
    setScreenModeSet(!window.screenTop && !window.screenY);
  }, []);

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

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("gameRoomID", (roomId) => {
      setRoomNumber(roomId);
      //addroomnumber to url
      router.push("/game?roomNumber=" + roomId);
    });

    socket.on("startGame", () => {
      setRoomFound(true);
    });
  };

  const [cardDeck, setCardDeck] = useState(["0"]);

  const [pos, setPos] = useState([0]);

  const [playerCards, setPlayerCards] = useState([]);

  const [playerFieldCards, setPlayerFieldCards] = useState([]);

  const [enemyFieldCards, setEnemyFieldCards] = useState([]);

  const [enemyCards, setEnemyCards] = useState([1]);

  //check if fullscreen
  const [screenModeSet, setScreenModeSet] = useState(false);

  function getCoordiantes(e: HTMLElement) {
    if (pos.length === 1) {
      setPos([
        e.getBoundingClientRect().x - e.getClientRects()[0].x * 0.15,
        e.getClientRects()[0].y * 0.12,
      ]);
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
    if (source.droppableId == "cardDeck") {
      setCardDeck(["" + (Number.parseInt(draggableId) + 1)]);
      //copy array
      const newPlayerCards = [...playerCards];
      newPlayerCards.splice(1, 0, draggableId);
      setPlayerCards(newPlayerCards);
    } else if (
      destination.droppableId == "playerField" &&
      source.droppableId == "playerHand" &&
      playerFieldCards.length < 5
    ) {
      setPlayerCards(playerCards.filter((card) => card !== draggableId));
      setPlayerFieldCards([...playerFieldCards, draggableId]);
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

  const startDrag = function start() {
    console.log(cardDeck[0]);
    const preDrag = api.tryGetLock(cardDeck[0]);

    if (!preDrag && pos.length > 0) {
      return;
    }

    const endX = pos[0];

    const endY = pos[1];

    console.log(endX, endY);

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
          onDragStart={(result) => {
            console.log(result);
          }}
          sensors={[useMyCoolSensor]}
        >
          <Background></Background>
          <DetailArea cardDeck={cardDeck} drawCard={drawCard}></DetailArea>
          <GameArea
            getCoordiantes={getCoordiantes}
            playerCards={playerCards}
            playerFieldCards={playerFieldCards}
            enemyFieldCards={enemyFieldCards}
            enemyCards={enemyCards}
          ></GameArea>
          <UtilityArea></UtilityArea>
        </DragDropContext>
      </Layout>
    );
  } else {
    return (
      <div>
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
      </div>
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
