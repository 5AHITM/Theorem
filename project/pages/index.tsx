import { styled } from "../stitches.config";
import { useState } from "react";
import { DetailArea } from "../components/DetailArea";
import { GameArea } from "../components/GameArea";
import { UtilityArea } from "../components/UtilityArea";
import { resetServerContext } from "react-beautiful-dnd";
import { InferGetServerSidePropsType } from "next/types";

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

export default function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [cardDeck, setCardDeck] = useState([]);

  const [pos, setPos] = useState([0]);

  function getCoordiantes(e: HTMLElement) {
    setPos([e.getBoundingClientRect().x, e.getBoundingClientRect().y]);
  }

  return (
    <Layout>
      <DetailArea
        setCardDeck={setCardDeck}
        cardDeck={cardDeck}
        pos={pos}
      ></DetailArea>
      <GameArea getCoordiantes={getCoordiantes}></GameArea>
      <UtilityArea></UtilityArea>
    </Layout>
  );
}

export const getServerSideProps = async () => {
  resetServerContext();

  // Fetch data from external API
  const data = [];

  // Pass data to the page via props
  return { props: { data } };
};
