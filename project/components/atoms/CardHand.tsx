import { styled } from "@stitches/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Draggable,
  DraggableStateSnapshot,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import { GameState, PlayerAttackable, SizeVariants } from "../../utils/Enum";
import { Card, CardStance } from "../../utils/Types";
import { CardFront } from "./CardFront";
import { CardHidden } from "./CardHidden";
import { PlayerIcon } from "./PlayerIcon";

const CardHandLayout = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  overflow: "hidden",
});

const CardContainer = styled("div", {
  margin: "0 auto",
  alignItems: "center",
  justifyContent: "center",
  alignSelf: "end",
  width: "85%",
  overflow: "hidden",
  transition: "all 0.2s ease-in-out",
  variants: {
    rotated: {
      ["true"]: {
        transform: "rotate(180deg)",
        paddingTop: "30%",
      },
    },
  },
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

const IconDiv = styled("div", {
  position: "absolute",
  zIndex: 2,
  width: "5vw",
  aspectRatio: 1 / 1,
  left: "45vw",
  variants: {
    isEnemy: {
      true: {
        top: "5%",
      },
      false: {
        bottom: "5%",
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
  showIcon: PlayerAttackable;
  attackPlayer: (e) => void;
  showCard: (card: Card) => void;
}> = ({
  isEnemy,
  getCoordiantes,
  cards,
  gameState,
  changeCardStance,
  showIcon,
  attackPlayer,
  showCard,
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
        <AnimatePresence>
          {(gameState == GameState.ENEMY_TURN ||
            gameState == GameState.PLAYER_FIGHTS) &&
            showIcon === PlayerAttackable.ATTACKABLE && (
              <motion.div
                key="enemyIcon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <IconDiv
                  isEnemy="true"
                  onClick={(event) => {
                    attackPlayer(event);
                  }}
                >
                  <PlayerIcon />
                </IconDiv>
              </motion.div>
            )}
        </AnimatePresence>
        <CardHandLayout>
          {cards.map((card, index) => {
            return (
              <CardContainer key={card} rotated="true">
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
            <AnimatePresence>
              {(gameState == GameState.ENEMY_TURN ||
                gameState == GameState.PLAYER_FIGHTS) &&
                showIcon === PlayerAttackable.ATTACKABLE && (
                  <motion.div
                    key="playerIcon"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <IconDiv isEnemy="false">
                      <PlayerIcon />
                    </IconDiv>
                  </motion.div>
                )}
            </AnimatePresence>
            <CardHandLayout
              ref={(e) => {
                if (!e) {
                  return;
                }
                getCoordiantes(e);
              }}
            >
              <AnimatePresence>
                {cards.map((card: Card, index) => (
                  <motion.div
                    key={card.key + "motion"}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <Draggable
                      draggableId={card.key}
                      index={index}
                      key={card.key + "hand"}
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
                          style={getStyle(
                            provided.draggableProps.style,
                            snapshot
                          )}
                          onClick={() => {
                            card.stance =
                              card.stance === "attack" ? "defense" : "attack";
                            if (card.stance === "defense") {
                              card.playedStance = "hidden";
                            } else {
                              card.playedStance = "open";
                            }
                            changeCardStance({
                              key: card.key,
                              stance: card.stance,
                              playedStance: card.playedStance,
                              trapped: card.trapped,
                            });
                          }}
                        >
                          {cards.find((c) => c.key === card.key).stance ===
                          "attack" ? (
                            <CardFront
                              card={card}
                              sizeVariant={SizeVariants.SMALL}
                              cardStance={card.stance}
                              trapped={card.trapped}
                              showCard={showCard}
                            ></CardFront>
                          ) : (
                            <CardHidden></CardHidden>
                          )}
                        </CardContainer>
                      )}
                    </Draggable>
                  </motion.div>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </CardHandLayout>
          </CardHandLayoutWrapper>
        )}
      </Droppable>
    );
  }
};
