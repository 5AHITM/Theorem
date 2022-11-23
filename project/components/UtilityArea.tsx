import { styled } from "@stitches/react";
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

export const UtilityArea: React.FC<{}> = () => {
  return (
    <UtilityAreaLayout>
      <PlayerUtilities></PlayerUtilities>
      <CardGraveyard cards={[]}></CardGraveyard>
    </UtilityAreaLayout>
  );
};
