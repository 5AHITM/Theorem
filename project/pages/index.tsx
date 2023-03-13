import { styled } from "../stitches.config";
import { useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Logo } from "../components/atoms/Logo";

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

const LayoutBox = styled("div", {
  height: "fit-content",
});

const StyledLabel = styled("label", {
  color: "white",
});

const StyledSection = styled("section", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
});

export default function Home() {
  const [roomNumber, setRoomNumber] = useState("");

  //const { data: session } = useSession();

  const test = true;

  if (test) {
    return (
      <Layout>
        <LayoutBox>
          <Logo></Logo>
        </LayoutBox>
        <StyledSection>
          <StyledButton
            onClick={() => {
              if (document.documentElement.requestFullscreen)
                document.documentElement.requestFullscreen();
            }}
          >
            Go Fullscreenmode
          </StyledButton>
        </StyledSection>

        <StyledSection>
          <StyledInput
            type="text"
            name="roomNumber"
            value={roomNumber}
            onChange={(v) => setRoomNumber(v.target.value)}
            placeholder="Room Number"
          />
          <StyledLink href={"/game?roomNumber=" + roomNumber}>
            Join Room
          </StyledLink>
        </StyledSection>

        <StyledSection>
          <StyledLink href="/game?isPrivate=true">Create Room</StyledLink>
        </StyledSection>

        <StyledSection>
          <StyledLink href="/game?isPrivate=true&botEnemy=true">
            Play against the Bot
          </StyledLink>
        </StyledSection>

        <StyledLink href="/game">Search</StyledLink>
        {/* {!test && <button onClick={() => signOut()}>Sign out</button>} */}
      </Layout>
    );
  } else {
    // return (
    //   <Layout>
    //     <button onClick={() => signIn("google")}>Sign in with Google</button>
    //   </Layout>
    // );
  }
}
