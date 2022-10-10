import { styled } from "@stitches/react";
import CardHiddenSVG from "./svg/CardHiddenSVG";

const CardContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
});

export const CardHidden: React.FC<{}> = ({}) => {
  return (
    <CardContainer>
      <CardHiddenSVG></CardHiddenSVG>
    </CardContainer>
  );
};
