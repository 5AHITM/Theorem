import { styled } from "@stitches/react";

const CardFieldLayout = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid black",
  borderRadius: "5px",
  width: "100%",
  height: "35vh",
});

const CardContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid black",
  borderRadius: "5px",

  margin: "5px",
});

export const CardField: React.FC<{}> = () => {
  return (
    <CardFieldLayout>
      <CardContainer></CardContainer>
      <CardContainer></CardContainer>
      <CardContainer></CardContainer>
      <CardContainer></CardContainer>
      <CardContainer></CardContainer>
    </CardFieldLayout>
  );
};
