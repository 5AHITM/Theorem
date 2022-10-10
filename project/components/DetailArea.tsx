import { styled } from "@stitches/react";

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

export const DetailArea: React.FC<{}> = () => {
  return (
    <DetailAreaLayout>
      <h1>Detail Area</h1>
      <ZoomCardArea>
        <h2>Zoom Card Area</h2>
      </ZoomCardArea>
      <CardDeckArea>
        <h2>Card Deck Area</h2>
      </CardDeckArea>
    </DetailAreaLayout>
  );
};
