import { styled } from "@stitches/react";
import { CardHand } from "./atoms/CardHand";
import { GameField } from "./molecules/GameField";
import {
  DragDropContext,
  PreDragActions,
  SensorAPI,
  SnapDragActions,
} from "react-beautiful-dnd";

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

function mySimpleSensor(api: SensorAPI) {
  const preDrag: PreDragActions = api.tryGetLock("item  -1");
  // Could not get lock
  if (!preDrag) {
    return;
  }

  const drag: SnapDragActions = preDrag.snapLift();

  drag.moveDown();
  drag.moveDown();
  drag.moveDown();

  drag.drop();
}

const onDragEnd = (result) => {};

export const GameArea: React.FC<{}> = () => {
  return (
    <GameAreaLayout>
      <CardHand isEnemy={true}></CardHand>

      <GameField></GameField>
      <DragDropContext onDragEnd={onDragEnd}>
        <CardHand isEnemy={false}></CardHand>
      </DragDropContext>
    </GameAreaLayout>
  );
};
