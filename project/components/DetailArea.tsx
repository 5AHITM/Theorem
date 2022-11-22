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
import { CardFront } from "./atoms/CardFront";

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
});

const CardDeckArea = styled("div", {
  flex: "1",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
});

const CardButton = styled("button", {
  width: "50%",
  overflow: "hidden",
});

const CardDeckContainer = styled("div", {
  position: "fixed",
  width: "12%",
  bottom: "12%",
});

export const DetailArea: React.FC<{
  cardDeck: string[];
  drawCard: () => void;
}> = ({ cardDeck, drawCard }) => {
  function getStyle(style, snapshot) {
    if (!snapshot.isDropAnimating) {
      return style;
    }

    const { moveTo, curve, duration } = snapshot.dropAnimation;
    const translate = `translate(${moveTo.x / 0.7}px, ${moveTo.y / 0.7}px)`;

    // patching the existing style
    return {
      ...style,
      transformOrigin: "top left",
      transform: `scale(0.7) ${translate}`,
      // slowing down the drop because we can
      transition: `all ${curve} ${duration}s`,
    };
  }
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
          <Droppable droppableId="cardDeck">
            {(provided) => (
              <div ref={provided.innerRef}>
                {cardDeck.map((card, index) => (
                  <Draggable draggableId={card} index={index} key={card}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getStyle(
                          provided.draggableProps.style,
                          snapshot
                        )}
                      >
                        <CardHidden></CardHidden>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </CardButton>
      </CardDeckArea>
    </DetailAreaLayout>
  );
};
