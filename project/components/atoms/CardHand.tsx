import { styled } from "@stitches/react";
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
        height: "40%",
      },
      false: {
        height: "60%",
      },
    },
  },
});

const CardContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid black",
  borderRadius: "5px",
  height: "100%",
  width: "80%",
});

export const CardHand: React.FC<{ isEnemy: boolean }> = ({ isEnemy }) => {
  if (isEnemy) {
    return (
      <CardHandLayout isEnemy="true">
        <CardContainer></CardContainer>
        <CardContainer></CardContainer>
        <CardContainer></CardContainer>
        <CardContainer></CardContainer>
        <CardContainer></CardContainer>
        <CardContainer></CardContainer>
        <CardContainer></CardContainer>
      </CardHandLayout>
    );
  } else {
    return (
      <Droppable droppableId="playerHand" direction="horizontal">
        {(provided) => (
          <CardHandLayout isEnemy="false" ref={provided.innerRef}>
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
            <Draggable draggableId="item2" index={1} key="item2">
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
            <Draggable draggableId="item3" index={2} key="item3">
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
            <Draggable draggableId="item4" index={3} key="item4">
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
            <Draggable draggableId="item5" index={4} key="item5">
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
            {/* <Draggable draggableId="item6" index={5} key="item6">
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
            <Draggable draggableId="item7" index={6} key="item7">
              {(provided) => (
                <CardContainer
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <CardHidden></CardHidden>
                </CardContainer>
              )}
            </Draggable> */}
          </CardHandLayout>
        )}
      </Droppable>
    );
  }
};
