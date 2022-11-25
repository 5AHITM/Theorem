import { styled } from "@stitches/react";
import { GameState } from "../../utils/Enum";
import { Card, CardCoordinates } from "../../utils/Types";
import { CardField } from "../atoms/CardField";
import { CardHand } from "../atoms/CardHand";

const GameSideLayout = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
});

export const GameField: React.FC<{
  playerCards: Card[];
  enemyCards: Card[];
  gameState: GameState;
  setSelectedCard: (card: Card) => void;
  fightCard: (card: Card, e: any) => void;
  enemySelectedCard: number[];
  setEnemySelectedCard?: (card: any) => void;
  setSelectedCardCoordinates: (cardCoordinates: number[]) => void;
  selectedCard?: any;
  addCardPositions: (card: CardCoordinates) => void;
  attackedCard: any;
  enemyAttackingCard: any;
  enemyAttackingFinished: (card: any) => void;
  alreadyAttackedCards?: any[];
}> = ({
  playerCards,
  enemyCards,
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
}) => {
  return (
    <GameSideLayout>
      <CardField
        isPlayer={false}
        cards={enemyCards}
        gameState={gameState}
        fightCard={fightCard}
        enemySelectedCard={enemySelectedCard}
        setEnemySelectedCard={setEnemySelectedCard}
        setSelectedCardCoordinates={setSelectedCardCoordinates}
        addCardPositions={addCardPositions}
        attackedCard={attackedCard}
        enemyAttackingCard={enemyAttackingCard}
        enemyAttackingFinished={enemyAttackingFinished}
      ></CardField>
      <CardField
        isPlayer={true}
        cards={playerCards}
        gameState={gameState}
        setSelectedCard={setSelectedCard}
        enemySelectedCard={enemySelectedCard}
        setEnemySelectedCard={setEnemySelectedCard}
        setSelectedCardCoordinates={setSelectedCardCoordinates}
        selectedCard={selectedCard}
        addCardPositions={addCardPositions}
        enemyAttackingFinished={enemyAttackingFinished}
        alreadyAttackedCards={alreadyAttackedCards}
      ></CardField>
    </GameSideLayout>
  );
};
