import { styled } from "@stitches/react";
import Image from "next/image";

//set as background image
const BackgroundLayout = styled("div", {
  height: "100vh",
  width: "100vw",
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: -1,
  margin: 0,
  padding: 0,
  overflow: "hidden",
});

export const GameFieldBackground: React.FC = () => {
  return (
    <BackgroundLayout>
      <Image
        alt={"Background"}
        src={"/img/HintergrundMitte.png"}
        fill
        draggable={false}
      />
    </BackgroundLayout>
  );
};
