import { styled } from "@stitches/react";
import { GameState } from "../../utils/Enum";

const UtilityAreaLayout = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "end",
  height: "100%",
  width: "100%",
  gap: "3vh",
});

const TurnButton = styled("button", {
  justifyContent: "center",
  width: "80%",
  backgroundColor: "red",
  color: "white",
  fontSize: "1.5rem",
  fontWeight: "bold",
  "&:hover:enabled": {
    backgroundColor: "darkred",
    cursor: "pointer",
  },
  padding: "0.5rem",
  borderRadius: "0.5rem",
});

const CurrentGameStatus = styled("h2", {
  fontSize: "1.5rem",
  fontWeight: "bold",
  padding: "0.5rem",
  color: "white",
});

const HealthBar = styled("h3", {
  color: "red",
  fontSize: "1.5rem",
  fontWeight: "bold",
  padding: "0.5rem",
});

const ManaBar = styled("h3", {
  color: "blue",
  fontSize: "1.5rem",
  fontWeight: "bold",
  padding: "0.5rem",
});

const EnemyHealthBar = styled("h3", {
  color: "red",
  fontSize: "1.5rem",
  fontWeight: "bold",
  padding: "0.5rem",
});

const InfoBox = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%",
  borderRadius: "0.5rem",
});

const ConvertManaButtonsLayout = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%",
  borderRadius: "0.5rem",
  gap: "0.5rem",
});

const ConvertManaButton = styled("button", {
  backgroundColor: "blue",
  color: "white",
  fontSize: "1.5rem",
  fontWeight: "bold",
  "&:hover:enabled": {
    backgroundColor: "darkblue",
    cursor: "pointer",
  },
  padding: "0.5rem",
  borderRadius: "0.5rem",
});

const ManaConversionTag = styled("h3", {
  color: "white",
  fontSize: "1.5rem",
  fontWeight: "bold",
  padding: "0.5rem",
});

export const PlayerUtilities: React.FC<{
  gameState: GameState;
  changeGameState: () => void;
  health: number;
  mana: number;
  enemyHealth: number;
  convertMana: (mana: number) => void;
  manaConversionAllowed: boolean;
}> = ({
  gameState,
  changeGameState,
  health,
  mana,
  enemyHealth,
  convertMana,
  manaConversionAllowed,
}) => {
  return (
    <UtilityAreaLayout>
      <InfoBox>
        <EnemyHealthBar>Enemy Health: {enemyHealth}</EnemyHealthBar>
        <ManaBar>Mana: {mana}</ManaBar>
        <HealthBar>Health: {health}</HealthBar>
      </InfoBox>
      <InfoBox>
        <CurrentGameStatus>Current state:</CurrentGameStatus>
        <CurrentGameStatus>{gameState}</CurrentGameStatus>
      </InfoBox>
      <TurnButton
        onClick={() => {
          changeGameState();
        }}
        disabled={gameState === GameState.ENEMY_TURN ? true : false}
      >
        Next Phase
      </TurnButton>

      <ConvertManaButtonsLayout>
        <ManaConversionTag>Mana Conversion</ManaConversionTag>
        <ConvertManaButton
          onClick={() => {
            convertMana(1);
          }}
          disabled={
            !manaConversionAllowed ||
            1 >= health ||
            gameState === GameState.ENEMY_TURN ||
            gameState === GameState.PLAYER_FIGHTS
              ? true
              : false
          }
        >
          1
        </ConvertManaButton>
        <ConvertManaButton
          onClick={() => {
            convertMana(1);
          }}
          disabled={
            !manaConversionAllowed ||
            2 >= health ||
            gameState === GameState.ENEMY_TURN ||
            gameState === GameState.PLAYER_FIGHTS
              ? true
              : false
          }
        >
          2
        </ConvertManaButton>
        <ConvertManaButton
          onClick={() => {
            convertMana(1);
          }}
          disabled={
            !manaConversionAllowed ||
            3 >= health ||
            gameState === GameState.ENEMY_TURN ||
            gameState === GameState.PLAYER_FIGHTS
              ? true
              : false
          }
        >
          3
        </ConvertManaButton>
      </ConvertManaButtonsLayout>
    </UtilityAreaLayout>
  );
};
