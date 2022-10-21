import { styled } from "@stitches/react";
import { CardHand } from "./atoms/CardHand";
import { GameField } from "./molecules/GameField";
import { DragDropContext } from "react-beautiful-dnd";

const GameAreaLayout = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: 6,
  height: "100%",
});

const onDragEnd = (result) => {};

const pos = [];

export const GameArea: React.FC<{
  getCoordiantes: (e: HTMLElement) => void;
}> = (getCoordiantes) => {
  return (
    <GameAreaLayout>
      <CardHand isEnemy={true}></CardHand>

      <GameField></GameField>
      <DragDropContext onDragEnd={onDragEnd}>
        <CardHand isEnemy={false} getCoordiantes={getCoordiantes}></CardHand>
      </DragDropContext>
    </GameAreaLayout>
  );
};
