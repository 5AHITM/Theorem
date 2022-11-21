import { styled } from "@stitches/react";
import Image from "next/image";
import { relative } from "node:path/win32";
import CardHiddenSVG from "./svg/CardHiddenSVG";

const CardContainer = styled("div", {
  display: "flex",
  width: "100%",
  position: "relative",
  aspectRatio:"1105/1556",
});

export const CardHidden: React.FC<{}> = ({}) => {

  return (
    <CardContainer>
      <CardHiddenSVG></CardHiddenSVG>
    </CardContainer>
  );
};
