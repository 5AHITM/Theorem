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
  backgroundColor: "black",
});

export const UtilityArea: React.FC<{
  gameState: GameState;
  cards: any[];
  changeGameState: () => void;
  health: number;
  enemyHealth: number;
  mana: number;
  convertMana: (mana: number) => void;
  manaConversionAllowed: boolean;
}> = ({
  gameState,
  cards,
  changeGameState,
  health,
  mana,
  enemyHealth,
  manaConversionAllowed,
  convertMana,
}) => {
  return (
    <UtilityAreaLayout>
      <PlayerUtilities
        gameState={gameState}
        changeGameState={changeGameState}
        health={health}
        mana={mana}
        enemyHealth={enemyHealth}
        manaConversionAllowed={manaConversionAllowed}
        convertMana={convertMana}
      ></PlayerUtilities>
      <CardGraveyard cards={[]}></CardGraveyard>
    </UtilityAreaLayout>
  );
};
