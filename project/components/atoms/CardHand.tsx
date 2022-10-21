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

export const CardHand: React.FC<{
  isEnemy: boolean;
  getCoordiantes?: (e: HTMLElement) => void;
}> = ({ isEnemy, getCoordiantes }) => {
  if (isEnemy) {
    return (
      <CardHandLayout isEnemy="true">
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
          <CardHandLayout
            isEnemy="false"
            ref={(e) => {
              console.log(e);
              console.log(typeof getCoordiantes);
              if (!e) {
                return;
              }
              if (getCoordiantes) {
                console.log(e);
                getCoordiantes(e);
              }
            }}
          >
            <div ref={provided.innerRef}>
              <Draggable draggableId="item1" index={0} key="item1">
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
            </div>
          </CardHandLayout>
        )}
      </Droppable>
    );
  }
};
