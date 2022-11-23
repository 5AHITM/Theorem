import { styled } from "@stitches/react";
import { GameState } from "../utils/Enum";
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
  playerCards: any[];
  playerFieldCards: any[];
  enemyFieldCards: any[];
  enemyCards: any[];
  gameState: GameState;
  setSelectedCard: (card: any) => void;
  fightCard: (card: any, e: any) => void;
  enemySelectedCard: any;
  setEnemySelectedCard?: (card: any) => void;
  setSelectedCardCoordinates: (e: any) => void;
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
