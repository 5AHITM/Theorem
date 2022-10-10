import { styled } from "@stitches/react";
import { GameSide } from "./molecules/GameSide";

const GameAreaLayout = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "white",
  border: "1px solid black",
  flex: 6,
  height: "100%",
});

export const GameArea: React.FC<{}> = () => {
  return (
    <GameAreaLayout>
      <GameSide></GameSide>
      <GameSide></GameSide>
    </GameAreaLayout>
  );
};
