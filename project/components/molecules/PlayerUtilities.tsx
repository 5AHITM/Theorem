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
  backgroundColor: "white",
  borderRadius: "0.5rem",
});

export const PlayerUtilities: React.FC<{
  gameState: GameState;
  changeGameState: () => void;
  health: number;
  mana: number;
  enemyHealth: number;
}> = ({ gameState, changeGameState, health, mana, enemyHealth }) => {
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
    </UtilityAreaLayout>
  );
};
