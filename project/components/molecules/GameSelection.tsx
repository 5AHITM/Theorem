import { styled } from "../../stitches.config";
import Image from "next/image";
import { Background } from "../atoms/Background";
import { useState, useEffect } from "react";



const QuickPlay = styled("a", {
    display: "flex",
    position: "absolute",
    top: "-65vh",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c6a7cf",
    width: "100%",
    height: "20vh",
    fontSize: "200%",
    textDecoration: "none",
    color: "#373737",
    "&:active": {
        backgroundColor: "#353534",
        color: "white"
    }
});

const CreateRoom = styled("a", {
    color: "white",
    fontWeight: "bold",
    position: "absolute",
    top: "-25vh",
    height: "7vh",
    width: "50%",
    backgroundColor: "#565656",
    transition: "width 1s",
    borderStyle: "none",
    fontSize: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    textDecoration: "none",
    paddingLeft: "auto",
    paddingRight: "auto",
    "&:active": {
        backgroundColor: "LightGray",
        color: "Black"
    }
});

const PlayBot = styled("a", {
    color: "white",
    fontWeight: "bold",
    position: "absolute",
    top: "-15vh",
    height: "7vh",
    width: "50%",
    backgroundColor: "#565656",
    transition: "width 1s",
    borderStyle: "none",
    fontSize: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    textDecoration: "none",
    paddingLeft: "auto",
    paddingRight: "auto",
    "&:active": {
        backgroundColor: "LightGray",
        color: "Black"
    }
});

const PrivateMatchCode = styled("input", {
    width: "100%",
    height: "7vh",
    backgroundColor: "#white",
    color: "black",
    borderStyle: "solid",
    borderColor: "#565656",
    paddingLeft: "20px"
});

const ConfirmCode = styled("a", {
    height: "7vh",
    width: "10vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#565656",
    color: "White",
    textDecoration: "none",
    fontWeight: "$bold",
    borderStyle: "none",
    borderTopRightRadius: "0.2rem",
    "&:active": {
        backgroundColor: "LightGray",
    }
})

const Wrapper = styled("div", {
    position: "absolute",
    top: "-10vh",
    left: "20%",
    display: "flex",
    flexDicetion: "row",
    justifyContent: "left",
    width: "40%",
})

const WrappForm = styled("div", {
    display: "flex",
    position: "absolute",
    top: "-37vh",
    flexDirection: "row",
    width: "50%"
})

const Form = styled("form", {
    width: "100%"
})

const OverlayBox = styled("div", {
    position: "absolute",
    top: "-70vh",
    left: "-2.5vw",
    width: "3vw",
    height: "67vh",
    backgroundColor: "white",
    boxShadow: "14px 0px 19px -10px rgba(0,0,0,0.5)"
})

export const GameSelection: React.FC = () => {

    const [roomNumber, setRoomNumber] = useState("");

    return (
        <>

            <Wrapper>
                <QuickPlay href="/game">
                    <h1>Quick Play</h1>
                </QuickPlay>
                <WrappForm>
                    <Form>
                        <PrivateMatchCode
                            placeholder="Private Match Code"
                            type="text"
                            name="roomNumber"
                            value={roomNumber}
                            onChange={(v) => setRoomNumber(v.target.value)}
                        >
                        </PrivateMatchCode>
                    </Form>
                    <ConfirmCode
                        href={"/game?roomNumber=" + roomNumber}
                    >
                        Join Room
                    </ConfirmCode>
                </WrappForm>
                <CreateRoom href="/game?isPrivate=true">Create Room</CreateRoom>
                <PlayBot href="/game?isPrivate=true&botEnemy=true">Play against the Bot</PlayBot>
                <OverlayBox></OverlayBox>
            </Wrapper>
        </>
    )
}