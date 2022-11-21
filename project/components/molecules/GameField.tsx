import { styled } from "@stitches/react";
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
}> = ({ playerCards, enemyCards }) => {
  return (
    <GameSideLayout>
      <CardField isPlayer={false} cards={enemyCards}></CardField>
      <CardField isPlayer={true} cards={playerCards}></CardField>
    </GameSideLayout>
  );
};
