import { styled } from "@stitches/react";
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
}> = ({
  getCoordiantes,
  playerCards,
  playerFieldCards,
  enemyFieldCards,
  enemyCards,
}) => {
  return (
    <GameAreaLayout>
      <CardHand
        isEnemy={true}
        getCoordiantes={() => {}}
        cards={enemyCards}
      ></CardHand>

      <GameField
        playerCards={playerFieldCards}
        enemyCards={enemyFieldCards}
      ></GameField>
      <CardHand
        isEnemy={false}
        getCoordiantes={getCoordiantes}
        cards={playerCards}
      ></CardHand>
    </GameAreaLayout>
  );
};
