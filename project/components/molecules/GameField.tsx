import { styled } from "@stitches/react";
import { CardField } from "../atoms/CardField";
import { CardHand } from "../atoms/CardHand";

const GameSideLayout = styled("div", {
  display: "flex",
  flexDirection: "column",
  border: "1px solid black",
  borderRadius: "5px",
  width: "100%",
  height: "100%",
});

export const GameField: React.FC<{}> = () => {
  return (
    <GameSideLayout>
      <CardField></CardField>
      <CardField></CardField>
    </GameSideLayout>
  );
};
