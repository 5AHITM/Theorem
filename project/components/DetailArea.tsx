import { styled } from "@stitches/react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  SensorAPI,
} from "react-beautiful-dnd";
import { CardHidden } from "./atoms/CardHidden";
import * as tweenFunctions from "tween-functions";
import { Dispatch, MutableRefObject, SetStateAction, useRef } from "react";

const DetailAreaLayout = styled("div", {
  display: "flex",
  flexDirection: "column",
  flex: 2,
  height: "100%",
});

const ZoomCardArea = styled("div", {
  flex: "1",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "white",
  border: "1px solid black",
  borderRadius: "5px",
});

const CardDeckArea = styled("div", {
  flex: "1",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "white",
  border: "1px solid black",
  borderRadius: "5px",
});

const CardButton = styled("button", {
  backgroundColor: "white",
  border: "1px solid black",
  borderRadius: "5px",
  width: "50%",
});

const CardDeckContainer = styled("div", {
  position: "fixed",
  width: "10%",
  bottom: "10%",
});

const onDragEnd = (result) => {};

function moveStepByStep(drag, values) {
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

export const DetailArea: React.FC<{
  setCardDeck: Dispatch<SetStateAction<any[]>>;
  cardDeck: string[];
  pos: number[];
}> = ({ setCardDeck, cardDeck, pos }) => {
  let api: SensorAPI;
  const useMyCoolSensor = (value) => {
    api = value;
  };

  let itteration = 0;

  function drawCard() {
    console.log("drawCard");
    console.log("yes");
    setCardDeck(["card " + itteration]);
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
    <DetailAreaLayout>
      <ZoomCardArea>
        <h2>Zoom Card Area</h2>
      </ZoomCardArea>
      <CardDeckArea>
        <DragDropContext
          onDragEnd={onDragEnd}
          enableDefaultSensors={false}
          sensors={[useMyCoolSensor]}
        >
          <CardButton
            onClick={() => {
              drawCard();
              startDrag();
            }}
          >
            <CardDeckContainer>
              <CardHidden></CardHidden>
            </CardDeckContainer>
            <Droppable droppableId="cardDeck">
              {(provided) => (
                <div ref={provided.innerRef}>
                  <Draggable
                    draggableId="cardDeckItem"
                    index={0}
                    key="cardDeckItem"
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {cardDeck.map((card) => (
                          <CardHidden key={card}></CardHidden>
                        ))}
                      </div>
                    )}
                  </Draggable>

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </CardButton>
        </DragDropContext>
      </CardDeckArea>
    </DetailAreaLayout>
  );
};
