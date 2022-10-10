import { styled } from "@stitches/react";

const CardHandLayout = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

export const CardHand: React.FC<{}> = () => {
  return (
    <CardHandLayout>
      <h1>Card Hand</h1>
    </CardHandLayout>
  );
};
