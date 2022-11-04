import { styled } from "@stitches/react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  FluidDragActions,
  SensorAPI,
} from "react-beautiful-dnd";
import { CardHidden } from "./atoms/CardHidden";
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

export const DetailArea: React.FC<{
  cardDeck: string[];
  drawCard: () => void;
}> = ({ cardDeck, drawCard }) => {
  return (
    <DetailAreaLayout>
      <ZoomCardArea>
        <h2>Zoom Card Area</h2>
      </ZoomCardArea>
      <CardDeckArea>
        <CardButton
          onClick={() => {
            drawCard();
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
      </CardDeckArea>
    </DetailAreaLayout>
  );
};
