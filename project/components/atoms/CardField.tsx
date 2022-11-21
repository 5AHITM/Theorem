import { styled } from "@stitches/react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { CardHidden } from "./CardHidden";

const CardFieldLayout = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "33vh",
});

const CardContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  margin: "5px",
});

const CardHandLayoutWrapper = styled("div", {
  width: "100%",
});

export const CardField: React.FC<{ isPlayer?: boolean; cards: number[] }> = ({
  isPlayer,
  cards,
}) => {
  if (isPlayer) {
    return (
      <Droppable droppableId="playerField" direction="horizontal">
        {(provided) => (
          <CardFieldLayout ref={provided.innerRef}>
            {cards.map((card, index) => (
              <Draggable
                draggableId={`filedCard${index}`}
                index={index}
                key={`fieldCard${index}`}
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
          </CardFieldLayout>
        )}
      </Droppable>
    );
  } else {
    return (
      <CardFieldLayout>
        <CardContainer></CardContainer>
        <CardContainer></CardContainer>
        <CardContainer></CardContainer>
        <CardContainer></CardContainer>
        <CardContainer></CardContainer>
      </CardFieldLayout>
    );
  }
};
