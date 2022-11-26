import { styled } from "../stitches.config";
import { useState, useEffect } from "react";
import { DetailArea } from "../components/DetailArea";
import { GameArea } from "../components/GameArea";
import { UtilityArea } from "../components/UtilityArea";
import {
  DragDropContext,
  FluidDragActions,
  resetServerContext,
  SensorAPI,
} from "react-beautiful-dnd";
import { InferGetServerSidePropsType } from "next/types";
import * as tweenFunctions from "tween-functions";
import io from "socket.io-client";
import { Background } from "../components/atoms/Background";
import Link from "next/link";

const Layout = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100vw",
  minHeight: "100%",
  gap: "1rem",
});

const StyledLink = styled(Link, {
  backgroundColor: "white",
  border: "1px solid black",
  borderRadius: "0.5rem",
  padding: "0.5rem",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  color: "black",
  textDecoration: "none",
  "&:hover": {
    backgroundColor: "black",
    color: "white",
  },
});

const StyledButton = styled("button", {
  backgroundColor: "white",
  border: "1px solid black",
  borderRadius: "0.5rem",
  padding: "0.5rem",
  fontSize: "4rem",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  color: "black",
  textDecoration: "none",
  "&:hover": {
    backgroundColor: "black",
    color: "white",
  },
});

const StyledInput = styled("input", {
  backgroundColor: "white",
  border: "1px solid black",
  borderRadius: "0.5rem",
  padding: "0.5rem",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  color: "black",
  textDecoration: "none",
  "&:hover": {
    border: "3px solid black",
  },
});

export default function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [roomNumber, setRoomNumber] = useState("");

  return (
    <Layout>
      <StyledButton
        onClick={() => {
          if (document.documentElement.requestFullscreen)
            document.documentElement.requestFullscreen();
        }}
      >
        Go Fullscrenmode
      </StyledButton>

      <label htmlFor="roomNumber">Room Number:</label>
      <StyledInput
        type="text"
        name="roomNumber"
        value={roomNumber}
        onChange={(v) => setRoomNumber(v.target.value)}
      />

      <StyledLink href={"/game?roomNumber=" + roomNumber}>Join Room</StyledLink>

      <StyledLink href="/game?isPrivate=true">Create Room</StyledLink>

      <StyledLink href="/game">Search</StyledLink>
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
