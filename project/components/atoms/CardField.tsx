import { styled } from "@stitches/react";

const CardFieldLayout = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

export const CardField: React.FC<{}> = () => {
  return (
    <CardFieldLayout>
      <h1>Card Field</h1>
    </CardFieldLayout>
  );
};
