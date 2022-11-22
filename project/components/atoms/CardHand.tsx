import { styled } from "@stitches/react";
import { MutableRefObject, useRef } from "react";
import {
  Draggable,
  DraggableStateSnapshot,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
  PreDragActions,
  SensorAPI,
  SnapDragActions,
} from "react-beautiful-dnd";
import { CardFront } from "./CardFront";
import { CardHidden } from "./CardHidden";

const CardHandLayout = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",

  overflow: "hidden",
});

const CardContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "80%",
  overflow: "hidden",
  transition: "all 0.2s ease-in-out",
});

const CardHandLayoutWrapper = styled("div", {
  width: "100%",
  overflow: "hidden",
  variants: {
    isEnemy: {
      true: {
        height: "17vh",
        minheight: "17vh",
      },
      false: {
        height: "30vh",
        minheight: "30vh",
      },
    },
  },
});

export const CardHand: React.FC<{
  isEnemy: boolean;
  getCoordiantes: (e: HTMLElement) => void;
  cards: any[];
}> = ({ isEnemy, getCoordiantes, cards }) => {
  function getStyle(
    style: DraggingStyle | NotDraggingStyle,
    snapshot: DraggableStateSnapshot
  ) {
    if (!snapshot.isDropAnimating) {
      return style;
    }

    const { moveTo, curve, duration } = snapshot.dropAnimation;
    const translate = `translate(${moveTo.x}px, ${moveTo.y}px)`;

    // patching the existing style
    return {
      ...style,
      transformOrigin: "top left",
      transform: `${translate} scale(1.65)`,
      // slowing down the drop because we can
      transition: `all ${curve} ${duration + 1}s`,
    };
  }

  if (isEnemy) {
    return (
      <CardHandLayoutWrapper isEnemy={isEnemy}>
        <CardHandLayout>
          {cards.map((card, index) => {
            return (
              <CardContainer key={card}>
                <CardHidden></CardHidden>
              </CardContainer>
            );
          })}
        </CardHandLayout>
      </CardHandLayoutWrapper>
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
                <Draggable draggableId={card.key} index={index} key={card.key}>
                  {(provided, snapshot) => (
                    <CardContainer
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getStyle(provided.draggableProps.style, snapshot)}
                    >
                      <CardFront
                        name={card.name}
                        text={card.text}
                        attack={card.attack}
                        defense={card.defense}
                        mana={card.mana}
                        type={card.type}
                        effects={card.effect}
                        image={card.img}
                        key={card.key}
                      ></CardFront>
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
