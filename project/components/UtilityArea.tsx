import { styled } from "@stitches/react";
import { GameState } from "../utils/Enum";
import { CardGraveyard } from "./molecules/CardGraveyard";
import { PlayerUtilities } from "./molecules/PlayerUtilities";

const UtilityAreaLayout = styled("div", {
  flex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
});

export const UtilityArea: React.FC<{
  gameState: GameState;
  cards: any[];
  changeGameState: () => void;
  health: number;
  enemyHealth: number;
  mana: number;
}> = ({ gameState, cards, changeGameState, health, mana, enemyHealth }) => {
  return (
    <UtilityAreaLayout>
      <PlayerUtilities
        gameState={gameState}
        changeGameState={changeGameState}
        health={health}
        mana={mana}
        enemyHealth={enemyHealth}
      ></PlayerUtilities>
      <CardGraveyard cards={[]}></CardGraveyard>
    </UtilityAreaLayout>
  );
};
