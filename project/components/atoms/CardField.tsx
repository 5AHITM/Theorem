import { styled } from "@stitches/react";
import { motion } from "framer-motion";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { GameState } from "../../utils/Enum";
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
  cardStances
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
                  enemySelectedCard.length > 0 && selectedCard.key === card.key && cardStances.find((stance) => stance.key === card.key)?.stance === "attack"
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
                        if (
                          gameState === GameState.PLAYER_FIGHTS &&
                          !alreadyAttackedCards.includes(card.key)
                        ) {
                          setSelectedCard(card);
                          setSelectedCardCoordinates([e.clientX, e.clientY]);
                        }
                      }}
                    >
                      <CardFront
                        name={card.name}
                        text={card.text}
                        attack={card.attack}
                        defense={card.defense}
                        mana={card.mana}
                        type={card.religion_type}
                        effects={card.effect}
                        image={card.img}
                        key={card.key}
                      ></CardFront>
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
      // <CardFieldLayout>
      //   {cards.map((card, index) => {
      //     return (
      //       <CardFront
      //         name={card.name}
      //         text={card.text}
      //         attack={card.attack}
      //         defense={card.defense}
      //         mana={card.mana}
      //         type={card.type}
      //         effects={card.effect}
      //         image={card.img}
      //         key={card.key}
      //       ></CardFront>
      //     );
      //   })}
      // </CardFieldLayout>

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
              <CardFront
                name={card.name}
                text={card.text}
                attack={card.attack}
                defense={card.defense}
                mana={card.mana}
                type={card.religion_type}
                effects={card.effect}
                image={card.img}
                key={card.key}
              ></CardFront>
            </CardContainer>
          </motion.div>
        ))}
      </CardFieldLayout>
    );
  }
};
