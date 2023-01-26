import { styled } from "../stitches.config";
import { useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const Layout = styled("div", {
  background: "linear-gradient(180deg, #000000 0%, #2c2c2c 100%)",
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
  backgroundColor: "black",
  border: "1px solid white",
  borderRadius: "0.5rem",
  padding: "0.5rem",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  color: "white",
  textDecoration: "none",
  "&:hover": {
    backgroundColor: "white",
    color: "black",
  },
});

const StyledButton = styled("button", {
  backgroundColor: "black",
  border: "2px solid white",
  borderRadius: "0.5rem",
  padding: "0.5rem",
  fontSize: "4rem",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  color: "white",
  textDecoration: "none",
  "&:hover": {
    backgroundColor: "white",
    color: "black",
  },
});

const StyledInput = styled("input", {
  backgroundColor: "white",
  border: "2px solid white",
  borderRadius: "0.5rem",
  padding: "0.5rem",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  color: "black",
  textDecoration: "none",
  "&:hover": {
    border: "3px solid white",
  },
});

export default function Home() {
  const [roomNumber, setRoomNumber] = useState("");

  return (
    <Layout>
      <StyledButton
        onClick={() => {
          if (document.documentElement.requestFullscreen)
            document.documentElement.requestFullscreen();
        }}
      >
        Go Fullscreenmode
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
