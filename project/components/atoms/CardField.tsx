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
  height: "100%",
});

const CardContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  margin: "5px",
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
  addCardPositions: (card: CardCoordinates, player: boolean) => void;
  attackedCard?: CardCoordinates;
  enemyAttackingCard?: Card;
  enemyAttackingFinished: (card: any) => void;
  alreadyAttackedCards?: any[];
  changeCardStance: (card: CardStance) => void;
  attackingEnemyFinished: () => void;
  cardDied: (isAttacking: boolean) => void;
  playerCardToDie: Card;
  enemyCardToDie: Card;
  showCard: (card: Card) => void;
  playerIconPos: number[];
  currentFightingCard: Card;
}> = ({
  isPlayer,
  cards,
  gameState,
  setSelectedCard,
  fightCard,
  enemySelectedCard,
  setSelectedCardCoordinates,
  selectedCard,
  addCardPositions,
  attackedCard,
  enemyAttackingCard,
  enemyAttackingFinished,
  alreadyAttackedCards,
  changeCardStance,
  attackingEnemyFinished,
  playerCardToDie,
  enemyCardToDie,
  cardDied,
  showCard,
  playerIconPos,
  currentFightingCard,
}) => {
  function getAnimation(key, x, y) {
    if (
      (playerCardToDie && playerCardToDie.key === key) ||
      (enemyCardToDie && enemyCardToDie.key === key)
    ) {
      return {
        opacity: 0,
        transition: { duration: 1 },
      };
    } else if (
      (enemyAttackingCard && attackedCard) ||
      (selectedCard && enemySelectedCard)
    ) {
      return {
        x: [0, x, x, 0],
        y: [0, y, y, 0],
        zIndex: [0, 1, 1, 0],
        scale: [1, 1.2, 1, 1],
        transition: { duration: 1, bounce: 0.5 },
      };
    } else {
      console.log("player icon pos");
      console.log(playerIconPos);
      return {
        x: [
          0,
          playerIconPos[0] - enemyAttackingCard.coordinates.x,
          playerIconPos[0] - enemyAttackingCard.coordinates.x,
          0,
        ],
        y: [
          0,
          playerIconPos[1] - enemyAttackingCard.coordinates.y,
          playerIconPos[1] - enemyAttackingCard.coordinates.y,
          0,
        ],
        zIndex: [0, 1, 1, 0],
        scale: [1, 1.2, 1, 1],
      };
    }
  }
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
                key={card.key + index}
                animate={
                  (enemySelectedCard.length > 0 &&
                    selectedCard.key === card.key &&
                    currentFightingCard &&
                    currentFightingCard.key === card.key &&
                    card.stance === "attack" &&
                    card.playedStance !== "hidden") ||
                  (playerCardToDie && playerCardToDie.key === card.key)
                    ? getAnimation(
                        card.key,
                        enemySelectedCard[0],
                        enemySelectedCard[1]
                      )
                    : {}
                }
                onAnimationComplete={() => {
                  if (playerCardToDie && playerCardToDie.key === card.key) {
                    console.log("player card died");
                    cardDied(true);
                  } else {
                    attackingEnemyFinished();
                  }
                }}
                ref={(e) => {
                  if (e) {
                    addCardPositions(
                      {
                        key: card.key,
                        x: e.getBoundingClientRect().x,
                        y: e.getBoundingClientRect().y,
                      },
                      true
                    );
                  }
                }}
              >
                <Draggable
                  draggableId={card.key}
                  index={index}
                  key={card.key + "field"}
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
                        if (
                          gameState === GameState.PLAYER_FIGHTS &&
                          !alreadyAttackedCards.includes(card.key) &&
                          card.playedStance !== "hidden" &&
                          card.stance === "attack"
                        ) {
                          setSelectedCard(card);
                          setSelectedCardCoordinates([e.clientX, e.clientY]);
                        } else if (
                          gameState === GameState.PLAYER_DRAWS ||
                          gameState === GameState.PLAYER_PLAYS
                        ) {
                          if (card.playedStance !== "hidden") {
                            card.stance =
                              card.stance === "attack" ? "defense" : "attack";
                            changeCardStance({
                              key: card.key,
                              stance: card.stance,
                              playedStance: card.playedStance,
                              trapped: card.trapped,
                            });
                          }
                        }
                      }}
                    >
                      {card.playedStance === "open" ? (
                        <CardFront
                          cardStance={card.stance}
                          card={card}
                          trapped={card.trapped}
                          sizeVariant={SizeVariants.MEDIUM}
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
            key={card.key + "field"}
            animate={
              (enemyAttackingCard && enemyAttackingCard.key === card.key) ||
              (enemyCardToDie && enemyCardToDie.key === card.key)
                ? getAnimation(
                    card.key,
                    attackedCard ? attackedCard.x : 0,
                    attackedCard ? attackedCard.y : 0
                  )
                : {}
            }
            onAnimationComplete={() => {
              console.log(enemyCardToDie);
              console.log(card.key);
              if (enemyCardToDie && enemyCardToDie.key === card.key) {
                cardDied(false);
                console.log("enemy card died");
              } else {
                enemyAttackingFinished(card);
              }
            }}
            ref={(e) => {
              if (e) {
                addCardPositions(
                  {
                    key: card.key,
                    x: e.getBoundingClientRect().x,
                    y: e.getBoundingClientRect().y,
                  },
                  false
                );
                console.log("addedCardPositions");
              }
            }}
          >
            <CardContainer
              onClick={(e) => {
                if (gameState === GameState.PLAYER_FIGHTS) {
                  if (enemyCardToDie && enemyCardToDie.key === card.key) return;
                  fightCard(card, e);
                }
              }}
            >
              {card.playedStance === "open" ? (
                <CardFront
                  card={card}
                  sizeVariant={SizeVariants.MEDIUM}
                  cardStance={card.stance}
                  trapped={card.trapped}
                  showCard={showCard}
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
