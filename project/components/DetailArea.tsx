import { styled } from "@stitches/react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { CardHidden } from "./atoms/CardHidden";
import { CardFront } from "./atoms/CardFront";
import { GameState, SizeVariants } from "../utils/Enum";
import { Card } from "../utils/Types";

const DetailAreaLayout = styled("div", {
  display: "flex",
  flexDirection: "column",
  flex: 2,
  height: "100%",
  backgroundColor: "black",
});

const ZoomCardArea = styled("div", {
  flex: "1",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
});

const CardContainer = styled("div", {
  width: "80%",
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
  gameState: GameState;
  zoomCard: Card;
}> = ({ cardDeck, drawCard, gameState, zoomCard }) => {
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
        <CardContainer>
          {zoomCard ? (
            <CardFront
              card={zoomCard}
              sizeVariant={SizeVariants.LARGE}
              showCard={() => {}}
            ></CardFront>
          ) : (
            <CardHidden></CardHidden>
          )}
        </CardContainer>
      </ZoomCardArea>
      <CardDeckArea>
        <CardButton
          onClick={() => {
            if (gameState === GameState.PLAYER_DRAWS) {
              drawCard();
            }
          }}
        >
          <Droppable droppableId="cardDeck" isDropDisabled={true}>
            {(provided) => (
              <div ref={provided.innerRef}>
                {cardDeck.map((card, index) => (
                  <Draggable
                    draggableId={card}
                    index={index}
                    key={card}
                    isDragDisabled={!(gameState === GameState.PLAYER_DRAWS)}
                  >
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
