import { styled } from "@stitches/react";
import {
  Draggable,
  DraggableStateSnapshot,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import { GameState, SizeVariants } from "../../utils/Enum";
import { Card, CardStance } from "../../utils/Types";
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
  gameState: GameState;
  changeCardStance: (cardStance: CardStance) => void;
  cardStances: CardStance[];
}> = ({
  isEnemy,
  getCoordiantes,
  cards,
  gameState,
  changeCardStance,
  cardStances,
}) => {
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
      <Droppable
        droppableId="playerHand"
        direction="horizontal"
        isDropDisabled={
          gameState === GameState.PLAYER_FIGHTS ||
          gameState === GameState.ENEMY_TURN
        }
      >
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
              {cards.map((card: Card, index) => (
                <Draggable
                  draggableId={card.key}
                  index={index}
                  key={card.key}
                  isDragDisabled={
                    gameState === GameState.PLAYER_FIGHTS ||
                    gameState === GameState.ENEMY_TURN
                  }
                  ref={(e) => {
                    if (!e) {
                      return;
                    }
                  }}
                >
                  {(provided, snapshot) => (
                    <CardContainer
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getStyle(provided.draggableProps.style, snapshot)}
                      onClick={(e) => {
                        card.stance =
                          card.stance === "attack" ? "defense" : "attack";
                        if (card.stance === "defense") {
                          card.playedStance = "hidden";
                        }
                        changeCardStance({
                          key: card.key,
                          stance: card.stance,
                          playedStance: card.playedStance,
                        });
                      }}
                    >
                      {cardStances.find((c) => c.key === card.key).stance ===
                      "attack" ? (
                        <CardFront
                          card={card}
                          sizeVariant={SizeVariants.SMALL}
                        ></CardFront>
                      ) : (
                        <CardHidden></CardHidden>
                      )}
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
