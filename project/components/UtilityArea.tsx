import { styled } from "@stitches/react";

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
      <h1>Utility Area</h1>
    </UtilityAreaLayout>
  );
};
