import { styled } from "@stitches/react";
import { GameState } from "../../utils/Enum";
import Image from "next/image";

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
  width: "100%",
  marginLeft: "auto",
  marginRight: "auto",
  backgroundColor: "red",
  color: "white",
  fontSize: "1.5rem",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "darkred",
    cursor: "pointer",
  },
  padding: "0.5rem",
  borderRadius: "0.5rem",
  "&:disabled": {
    backgroundColor: "rgba(255,0,0,0.5)",
    cursor: "auto"
  }
});

const CurrentGameStatus = styled("h2", {
  fontSize: "1.5rem",
  fontWeight: "bold",
  padding: "0.5rem",
  color: "white",
});

const HealthBar = styled("div", {
  position: "absolute",
  top: "90vh",
  right: "7vh",
  color: "white",
  backgroundColor: "#3C3C3B",
  fontSize: "1rem",
  fontWeight: "bold",
  padding: "0.2rem",
  paddingLeft: "2rem",
  width: "13%",
  display: "flex",
  justifyContent: "left",
  borderRadius: "100rem",
});

const HealthIcon = styled("div", {
  position: "absolute",
  top: "87vh",
  right: "5vh",
  backgroundColor: "#3C3C3B",
  borderRadius: "100rem",
  height: "10vh",
  width: "10vh",
})

const ManaBar = styled("div", {
  position: "absolute",
  top: "80vh",
  right: "5vh",
  color: "black",
  backgroundColor: "white",
  fontSize: "1rem",
  fontWeight: "bold",
  padding: "0.2rem",
  paddingRight: "2rem",
  width: "13%",
  display: "flex",
  justifyContent: "right",
  borderRadius: "100rem",
});

const ManaIcon = styled("div", {
  position: "absolute",
  top: "77vh",
  right: "25vh",
  backgroundColor: "white",
  borderRadius: "100rem",
  height: "10vh",
  width: "10vh"
})

const EnemyHealthBar = styled("div", {
  position: "absolute",
  top: "7vh",
  right: "5vh",
  color: "white",
  backgroundColor: "#3C3C3B",
  fontSize: "1rem",
  fontWeight: "bold",
  padding: "0.2rem",
  paddingRight: "2rem",
  width: "13%",
  display: "flex",
  justifyContent: "right",
  borderRadius: "100rem",
});

const EnemyHealthIcon = styled("div", {
  position: "absolute",
  top: "4vh",
  right: "25vh",
  backgroundColor: "#3C3C3B",
  borderRadius: "100rem",
  height: "10vh",
  width: "10vh"
})

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
  position: "absolute",
  top: "50vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "20%",
  width: "16%",
  borderRadius: "0.5rem",
  gap: "0.5rem",
  borderStyle: "solid",
  borderColor: "white"
});

const ManaConvertionsWrapper = styled("div", {
  display: "flex",
  flexDirection: "row",
  backgroundColor: "#00B4D8",
  borderRadius: "1rem",
  width: "70%",
  justifyContent: "space-between"
})

const ConvertManaButton = styled("button", {
  color: "white",
  fontSize: "1.5rem",
  fontWeight: "bold",
  backgroundColor: "rgba(0,0,0,0)",
  borderStyle: "none",
  width: "33%",
  "&:hover": {
    backgroundColor: "#00d4ff",
    cursor: "pointer",
  },
  padding: "0.5rem",
});

const ManaConversionTag = styled("h3", {
  color: "white",
  fontSize: "1.5rem",
  fontWeight: "bold",
  padding: "0.5rem",
});

const PhaseSelection = styled("div", {
  position: "absolute",
  top: "20vh",
  width: "16%",
  height: "25%",
  borderStyle: "solid",
  borderColor: "white",
  borderRadius: "0.5rem",
  display: "flex",
  padding: "2%",
  justifyContent: "center",
  flexDirection: "column"
})

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
          <EnemyHealthBar>{enemyHealth}</EnemyHealthBar>
          <EnemyHealthIcon>
              <Image
                alt={"Background"}
                src={"/img/icons/heart.png"}
                fill
                draggable={false}
              />
          </EnemyHealthIcon>
          <ManaBar>{mana}</ManaBar>
          <ManaIcon>
            <Image
              alt={"Background"}
              src={"/img/icons/mana.png"}
              fill
              draggable={false}
            />
          </ManaIcon>
          <HealthBar>{health}</HealthBar>
          <HealthIcon>
            <Image
              alt={"Background"}
              src={"/img/icons/heart.png"}
              fill
              draggable={false}
            />
          </HealthIcon>
        </InfoBox>
        <PhaseSelection>
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
        </PhaseSelection>

        <ConvertManaButtonsLayout>
          <ManaConversionTag>Conversion</ManaConversionTag>
          <ManaConvertionsWrapper>
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
                convertMana(2);
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
                convertMana(3);
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
          </ManaConvertionsWrapper>
        </ConvertManaButtonsLayout>
      </UtilityAreaLayout>
    );
  };

