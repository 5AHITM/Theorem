import { styled } from "../stitches.config";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/router";
import { DetailArea } from "../components/DetailArea";
import { GameArea } from "../components/GameArea";
import { UtilityArea } from "../components/UtilityArea";

const Layout = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "white",
  height: "100vh",
  width: "100vw",
  minHeight: "100%",
});

function drawCard() {}

export default function Home() {
  return (
    <Layout>
      <DetailArea drawCardEvent={drawCard}></DetailArea>
      <GameArea></GameArea>
      <UtilityArea></UtilityArea>
    </Layout>
  );
}
