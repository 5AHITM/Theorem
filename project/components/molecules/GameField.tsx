import { styled } from "@stitches/react";
import { GameState } from "../../utils/Enum";
import { CardField } from "../atoms/CardField";
import { CardHand } from "../atoms/CardHand";

const GameSideLayout = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
});

export const GameField: React.FC<{
  playerCards: number[];
  enemyCards: number[];
  gameState: GameState;
  setSelectedCard: (card: any) => void;
  fightCard: (card: any, e: any) => void;
  enemySelectedCard: number[];
  setEnemySelectedCard?: (card: any) => void;
  setSelectedCardCoordinates: (e: any) => void;
}> = ({
  playerCards,
  enemyCards,
  gameState,
  setSelectedCard,
  fightCard,
  enemySelectedCard,
  setEnemySelectedCard,
  setSelectedCardCoordinates,
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
      ></CardField>
      <CardField
        isPlayer={true}
        cards={playerCards}
        gameState={gameState}
        setSelectedCard={setSelectedCard}
        enemySelectedCard={enemySelectedCard}
        setEnemySelectedCard={setEnemySelectedCard}
        setSelectedCardCoordinates={setSelectedCardCoordinates}
      ></CardField>
    </GameSideLayout>
  );
};
