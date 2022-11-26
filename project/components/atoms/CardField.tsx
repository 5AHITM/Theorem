import { styled } from "@stitches/react";
import { motion } from "framer-motion";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { GameState, SizeVariants } from "../../utils/Enum";
import { Card, CardCoordinates, CardStance } from "../../utils/Types";
import { CardFront } from "./CardFront";
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

export const CardField: React.FC<{
  isPlayer?: boolean;
  cards: Card[];
  gameState: GameState;
  setSelectedCard?: (card: Card) => void;
  fightCard?: (card: Card, e: any) => void;
  enemySelectedCard: number[];
  setEnemySelectedCard: (card: number[]) => void;
  setSelectedCardCoordinates: (e: any) => void;
  selectedCard?: Card;
  addCardPositions: (card: CardCoordinates) => void;
  attackedCard?: any;
  enemyAttackingCard?: any;
  enemyAttackingFinished: (card: any) => void;
  alreadyAttackedCards?: any[];
  changeCardStance: (card: CardStance) => void;
  cardStances: CardStance[];
}> = ({
  isPlayer,
  cards,
  gameState,
  setSelectedCard,
  fightCard,
  enemySelectedCard,
  setEnemySelectedCard,
  setSelectedCardCoordinates,
  selectedCard,
  addCardPositions,
  attackedCard,
  enemyAttackingCard,
  enemyAttackingFinished,
  alreadyAttackedCards,
  changeCardStance,
  cardStances,
}) => {
  if (isPlayer) {
    return (
      <Droppable
        droppableId="playerField"
        direction="horizontal"
        isDropDisabled={
          gameState === GameState.ENEMY_TURN ||
          gameState === GameState.PLAYER_FIGHTS
        }
      >
        {(provided) => (
          <CardFieldLayout ref={provided.innerRef}>
            {cards.map((card, index) => (
              <motion.div
                key={card.key}
                animate={
                  enemySelectedCard.length > 0 &&
                  selectedCard.key === card.key &&
                  cardStances.find((stance) => stance.key === card.key)
                    ?.stance === "attack" &&
                  cardStances.find((stance) => stance.key === card.key)
                    ?.playedStance !== "hidden"
                    ? {
                        x: [0, enemySelectedCard[0], 0],
                        y: [0, enemySelectedCard[1], 0],
                        transition: { duration: 0.5 },
                      }
                    : {}
                }
                onAnimationComplete={() => {
                  setEnemySelectedCard([]);
                  setSelectedCard(undefined);
                }}
                ref={(e) => {
                  if (e) {
                    addCardPositions({
                      key: card.key,
                      x: e.getBoundingClientRect().x,
                      y: e.getBoundingClientRect().y,
                    });
                  }
                }}
              >
                <Draggable
                  draggableId={card.key}
                  index={index}
                  key={card.key}
                  isDragDisabled={
                    gameState === GameState.ENEMY_TURN ||
                    gameState === GameState.PLAYER_FIGHTS
                  }
                >
                  {(provided) => (
                    <CardContainer
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={(e) => {
                        let stance = cardStances.find(
                          (stance) => stance.key === card.key
                        );

                        if (
                          gameState === GameState.PLAYER_FIGHTS &&
                          !alreadyAttackedCards.includes(card.key) &&
                          stance.playedStance !== "hidden"
                        ) {
                          setSelectedCard(card);
                          setSelectedCardCoordinates([e.clientX, e.clientY]);
                        } else if (
                          gameState === GameState.PLAYER_DRAWS ||
                          gameState === GameState.PLAYER_PLAYS
                        ) {
                          if (stance.playedStance !== "hidden") {
                            card.stance =
                              card.stance === "attack" ? "defense" : "attack";
                            changeCardStance({
                              key: card.key,
                              stance: card.stance,
                              playedStance: card.playedStance,
                            });
                          }
                        }
                      }}
                    >
                      {cardStances.find((stance) => stance.key === card.key)
                        .playedStance === "open" ? (
                        <CardFront
                          cardStance={cardStances.find(
                            (stance) => stance.key === card.key
                          )}
                          card={card}
                          sizeVariant={SizeVariants.MEDIUM}
                        ></CardFront>
                      ) : (
                        <CardHidden></CardHidden>
                      )}
                    </CardContainer>
                  )}
                </Draggable>
              </motion.div>
            ))}
            {provided.placeholder}
          </CardFieldLayout>
        )}
      </Droppable>
    );
  } else {
    return (
      <CardFieldLayout>
        {cards.map((card, index) => (
          <motion.div
            key={card.key}
            animate={
              enemyAttackingCard &&
              attackedCard &&
              enemyAttackingCard.key === card.key
                ? {
                    x: [0, attackedCard.x, 0],
                    y: [0, attackedCard.y, 0],
                    transition: { duration: 0.5 },
                  }
                : {}
            }
            onAnimationComplete={() => {
              enemyAttackingFinished(card);
            }}
          >
            <CardContainer
              key={card.key}
              onClick={(e) => {
                if (gameState === GameState.PLAYER_FIGHTS) {
                  fightCard(card, e);
                }
              }}
            >
              {card.playedStance === "open" ? (
                <CardFront
                  card={card}
                  sizeVariant={SizeVariants.MEDIUM}
                  cardStance={cardStances.find((c) => c.key === card.key)}
                ></CardFront>
              ) : (
                <CardHidden></CardHidden>
              )}
            </CardContainer>
          </motion.div>
        ))}
      </CardFieldLayout>
    );
  }
};
