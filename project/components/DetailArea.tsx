import { styled } from "@stitches/react";
import { CardHidden } from "./atoms/CardHidden";
import CardHiddenSVG from "./atoms/svg/CardHiddenSVG";

const DetailAreaLayout = styled("div", {
  display: "flex",
  flexDirection: "column",
  flex: 2,
  height: "100%",
});

const ZoomCardArea = styled("div", {
  flex: "1",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "white",
  border: "1px solid black",
  borderRadius: "5px",
});

const CardDeckArea = styled("div", {
  flex: "1",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "white",
  border: "1px solid black",
  borderRadius: "5px",
});

const CardButton = styled("button", {
  backgroundColor: "white",
  border: "1px solid black",
  borderRadius: "5px",
  width: "50%",
});

export const DetailArea: React.FC<{ drawCardEvent: () => void }> = ({
  drawCardEvent,
}) => {
  return (
    <DetailAreaLayout>
      <ZoomCardArea>
        <h2>Zoom Card Area</h2>
      </ZoomCardArea>
      <CardDeckArea>
        <CardButton onClick={drawCardEvent}>
          <CardHidden></CardHidden>
        </CardButton>
      </CardDeckArea>
    </DetailAreaLayout>
  );
};
