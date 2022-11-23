import { styled } from "@stitches/react";
import { motion } from "framer-motion";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { GameState } from "../../utils/Enum";
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
  cards: any[];
  gameState: GameState;
  setSelectedCard?: (card: any) => void;
  fightCard?: (card: any, e: any) => void;
  enemySelectedCard: number[];
  setEnemySelectedCard: (card: any) => void;
  setSelectedCardCoordinates: (e: any) => void;
}> = ({
  isPlayer,
  cards,
  gameState,
  setSelectedCard,
  fightCard,
  enemySelectedCard,
  setEnemySelectedCard,
  setSelectedCardCoordinates,
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
                  enemySelectedCard.length > 0
                    ? {
                        x: [0, enemySelectedCard[0], 0],
                        y: [0, enemySelectedCard[1], 0],
                        transition: { duration: 0.5 },
                      }
                    : {}
                }
                onAnimationComplete={() => {
                  setEnemySelectedCard([]);
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
                        if (gameState === GameState.PLAYER_FIGHTS) {
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
                        type={card.type}
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
              type={card.type}
              effects={card.effect}
              image={card.img}
              key={card.key}
            ></CardFront>
          </CardContainer>
        ))}
      </CardFieldLayout>
    );
  }
};
