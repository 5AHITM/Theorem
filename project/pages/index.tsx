import { styled } from "../stitches.config";
import { useState } from "react";
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

const Layout = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "white",
  height: "100vh",
  width: "100vw",
  minHeight: "100%",
});

export default function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [cardDeck, setCardDeck] = useState([]);

  const [pos, setPos] = useState([0]);

  const [playerCards, setPlayerCards] = useState([]);

  function getCoordiantes(e: HTMLElement) {
    if (pos.length === 1) {
      setPos([e.getBoundingClientRect().x + 50, 20]);
    }
  }
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId) {
      return;
    }
    if (destination.droppableId == "playerHand") {
      setCardDeck([]);
      setPlayerCards([...playerCards, draggableId]);
      console.log("playerCards");
      console.log(playerCards);
      console.log("cardDeck");
      console.log(cardDeck);
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

  let itteration = 0;

  function drawCard() {
    setCardDeck(["card " + itteration + 1]);
    startDrag();
  }

  const startDrag = function start() {
    const preDrag = api.tryGetLock("cardDeckItem");

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

  return (
    <Layout>
      <DragDropContext
        onDragEnd={onDragEnd}
        onDragStart={() => {}}
        sensors={[useMyCoolSensor]}
      >
        <DetailArea cardDeck={cardDeck} drawCard={drawCard}></DetailArea>
        <GameArea
          getCoordiantes={getCoordiantes}
          playerCards={playerCards}
        ></GameArea>
        <UtilityArea></UtilityArea>
      </DragDropContext>
    </Layout>
  );
}

export const getServerSideProps = async () => {
  resetServerContext();

  // Fetch data from external API
  const data = [];

  // Pass data to the page via props
  return { props: { data } };
};
