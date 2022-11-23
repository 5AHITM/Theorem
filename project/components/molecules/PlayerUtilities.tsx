import { styled } from "@stitches/react";

const UtilityAreaLayout = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "end",
  height: "100%",
  width: "100%",
});

const TurnButton = styled("div", {
  display: "flex",
  justifyContent: "center",
  width: "100%",
  backgroundColor: "red",
  color: "white",
  fontSize: "1.5rem",
  fontWeight: "bold",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "darkred",
  },
  padding: "0.5rem",
});

export const PlayerUtilities: React.FC<{}> = () => {
  return (
    <UtilityAreaLayout>
      <TurnButton>End Turn</TurnButton>
    </UtilityAreaLayout>
  );
};
