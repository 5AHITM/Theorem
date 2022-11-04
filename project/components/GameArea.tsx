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

export const GameArea: React.FC<{
  getCoordiantes: (e: HTMLElement) => void;
  playerCards: any[];
}> = ({ getCoordiantes, playerCards }) => {
  return (
    <GameAreaLayout>
      <CardHand isEnemy={true} getCoordiantes={() => {}} cards={[]}></CardHand>

      <GameField></GameField>
      <CardHand
        isEnemy={false}
        getCoordiantes={getCoordiantes}
        cards={playerCards}
      ></CardHand>
    </GameAreaLayout>
  );
};
