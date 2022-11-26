import { styled } from "@stitches/react";
import Image from "next/image";

const Icon = styled("div", {
  width: "100%",
  height: "100%",
});

export const PlayerIcon: React.FC<{}> = () => {
  return (
    <Icon>
      <Image src="/img/icons/user_icon.png" fill alt={"PlayerIcon"} />
    </Icon>
  );
};
