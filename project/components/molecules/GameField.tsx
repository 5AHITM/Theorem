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
}> = ({ playerCards, enemyCards, gameState }) => {
  return (
    <GameSideLayout>
      <CardField
        isPlayer={false}
        cards={enemyCards}
        gameState={gameState}
      ></CardField>
      <CardField
        isPlayer={true}
        cards={playerCards}
        gameState={gameState}
      ></CardField>
    </GameSideLayout>
  );
};
