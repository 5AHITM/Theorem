import { styled } from "@stitches/react";
import { MutableRefObject, useRef } from "react";
import {
  Draggable,
  Droppable,
  PreDragActions,
  SensorAPI,
  SnapDragActions,
} from "react-beautiful-dnd";
import { CardHidden } from "./CardHidden";

const CardHandLayout = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid black",
  borderRadius: "5px",
  width: "100%",
  height: "100%",

  overflow: "hidden",
});

const CardContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid black",
  borderRadius: "5px",
  width: "80%",
});

const CardHandLayoutWrapper = styled("div", {
  width: "100%",
  variants: {
    isEnemy: {
      true: {
        height: "10vh",
      },
      false: {
        height: "30vh",
      },
    },
  },
});

export const CardHand: React.FC<{
  isEnemy: boolean;
  getCoordiantes: (e: HTMLElement) => void;
  cards: any[];
}> = ({ isEnemy, getCoordiantes, cards }) => {
  if (isEnemy) {
    return (
      <CardHandLayout>
        <CardContainer>
          <CardHidden></CardHidden>
        </CardContainer>
        <CardContainer>
          <CardHidden></CardHidden>
        </CardContainer>
        <CardContainer>
          <CardHidden></CardHidden>
        </CardContainer>
        <CardContainer>
          <CardHidden></CardHidden>
        </CardContainer>
        <CardContainer>
          <CardHidden></CardHidden>
        </CardContainer>
        <CardContainer>
          <CardHidden></CardHidden>
        </CardContainer>
        <CardContainer>
          <CardHidden></CardHidden>
        </CardContainer>
      </CardHandLayout>
    );
  } else {
    return (
      <Droppable droppableId="playerHand" direction="horizontal">
        {(provided) => (
          <CardHandLayoutWrapper ref={provided.innerRef} isEnemy="false">
            <CardHandLayout
              ref={(e) => {
                if (!e) {
                  return;
                }

                getCoordiantes(e);
              }}
            >
              {cards.map((card, index) => (
                <Draggable
                  draggableId={`item${index}`}
                  index={index}
                  key={`item${index}`}
                >
                  {(provided) => (
                    <CardContainer
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <CardHidden></CardHidden>
                    </CardContainer>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </CardHandLayout>
          </CardHandLayoutWrapper>
        )}
      </Droppable>
    );
  }
};
