import { styled } from "@stitches/react";
import BackgroundSVG from "./svg/BackgroundSVG";

//set as background image
const BackgroundLayout = styled("div", {
  height: "100vh",
  width: "100%",
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: -1,
  margin: 0,
  padding: 0,
  overflow: "hidden",
});

export const Background: React.FC = () => {
  return (
    <BackgroundLayout>
      <BackgroundSVG></BackgroundSVG>
    </BackgroundLayout>
  );
};
