import { styled } from "@stitches/react";

const GraveYardLayout = styled("div", {
  height: "100%",
});

export const CardGraveyard: React.FC<{
  cards: number[];
}> = ({ cards }) => {
  return <GraveYardLayout></GraveYardLayout>;
};
