import { styled } from "@stitches/react";
import LogoSVG from "./svg/LogoSVG";

const LogoLayout = styled("div", {
  height: "fit-parent",
  aspectRatio: "692/390",
  margin: 0,
  padding: 0,
});

export const Logo: React.FC = () => {
  return (
    <LogoLayout>
      <LogoSVG></LogoSVG>
    </LogoLayout>
  );
};
