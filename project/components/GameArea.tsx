import { styled } from "@stitches/react";
import { GameState } from "../utils/Enum";
import { Card } from "../utils/Types";
import { CardHand } from "./atoms/CardHand";
import { GameField } from "./molecules/GameField";

const GameAreaLayout = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: 6,
  height: "100%",
});

export const GameArea: React.FC<{
  getCoordiantes: (e: HTMLElement) => void;
  playerCards: Card[];
  playerFieldCards: Card[];
  enemyFieldCards: Card[];
  enemyCards: number[];
  gameState: GameState;
  setSelectedCard: (card: any) => void;
  fightCard: (card: Card, e: any) => void;
  enemySelectedCard: number[];
  setEnemySelectedCard?: (card: number[]) => void;
  setSelectedCardCoordinates: (e: any) => void;
  selectedCard?: Card;
  addCardPositions: (card: any) => void;
  attackedCard: Card;
  enemyAttackingCard: any;
  enemyAttackingFinished: (card: any) => void;
  alreadyAttackedCards?: any[];
}> = ({
  getCoordiantes,
  playerCards,
  playerFieldCards,
  enemyFieldCards,
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
    <GameAreaLayout>
      <CardHand
        gameState={gameState}
        isEnemy={true}
        getCoordiantes={() => {}}
        cards={enemyCards}
      ></CardHand>

      <GameField
        playerCards={playerFieldCards}
        enemyCards={enemyFieldCards}
        gameState={gameState}
        setSelectedCard={setSelectedCard}
        fightCard={fightCard}
        enemySelectedCard={enemySelectedCard}
        setEnemySelectedCard={setEnemySelectedCard}
        setSelectedCardCoordinates={setSelectedCardCoordinates}
        selectedCard={selectedCard}
        addCardPositions={addCardPositions}
        attackedCard={attackedCard}
        enemyAttackingCard={enemyAttackingCard}
        enemyAttackingFinished={enemyAttackingFinished}
        alreadyAttackedCards={alreadyAttackedCards}
      ></GameField>
      <CardHand
        gameState={gameState}
        isEnemy={false}
        getCoordiantes={getCoordiantes}
        cards={playerCards}
      ></CardHand>
    </GameAreaLayout>
  );
};
