import { styled } from "@stitches/react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { CardHidden } from "./atoms/CardHidden";
import { CardFront } from "./atoms/CardFront";
import { GameState, SizeVariants } from "../utils/Enum";
import { Card } from "../utils/Types";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const DetailAreaLayout = styled("div", {
  display: "flex",
  flexDirection: "column",
  flex: 2,
  height: "100%",
  backgroundColor: "black",
});

const ZoomCardArea = styled("div", {
  flex: "1",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
});

const CardContainer = styled("div", {
  width: "80%",
});

const CardDeckArea = styled("div", {
  flex: "1",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  position: "relative",
});

const CardButton = styled("button", {
  width: "100%",
  backgroundColor: "transparent",
  border: "none",
  outline: "none",

  "&:hover": {
    cursor: "pointer",
  },
});

const CardDeckContainer = styled("div", {
  zIndex: 0,
});

const MotionDiv = styled(motion.div, {
  width: "50%",
  position: "absolute",
  zIndex: 1,
});

export const DetailArea: React.FC<{
  drawCard: () => void;
  gameState: GameState;
  zoomCard: Card;
}> = ({ drawCard, gameState, zoomCard }) => {
  const [drawCardAnimation, setDrawCardAnimation] = React.useState<
    "open" | "closed" | "hover"
  >("closed");
  const variants = {
    open: { y: ["10%", "200%", "0%"], opacity: [1, 0, 0] },
    closed: { y: 0, opacity: 1 },
    hover: { y: "10%" },
  };
  return (
    <DetailAreaLayout>
      <ZoomCardArea>
        <CardContainer>
          <AnimatePresence>
            {zoomCard ? (
              <motion.div
                key="zoomCardMotionDiv"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CardFront
                  card={zoomCard}
                  sizeVariant={SizeVariants.LARGE}
                  showCard={() => {}}
                  trapped={false}
                ></CardFront>
              </motion.div>
            ) : (
              <CardHidden></CardHidden>
            )}
          </AnimatePresence>
        </CardContainer>
      </ZoomCardArea>
      <CardDeckArea>
        <MotionDiv
          animate={drawCardAnimation}
          variants={variants}
          onAnimationComplete={(definition) => {
            console.log(definition);
            if (definition === "open") {
              setDrawCardAnimation("closed");
            }
          }}
        >
          <CardButton
            onClick={() => {
              if (gameState === GameState.PLAYER_DRAWS) {
                drawCard();
                setDrawCardAnimation("open");
              }
            }}
            onMouseEnter={() => {
              if (gameState === GameState.PLAYER_DRAWS) {
                setDrawCardAnimation("hover");
              }
            }}
            onMouseLeave={() => {
              if (gameState === GameState.PLAYER_DRAWS) {
                setDrawCardAnimation("closed");
              }
            }}
          >
            <CardHidden></CardHidden>
          </CardButton>
        </MotionDiv>
        <CardDeckContainer>
          <CardHidden></CardHidden>
        </CardDeckContainer>
      </CardDeckArea>
    </DetailAreaLayout>
  );
};
