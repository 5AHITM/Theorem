import { styled } from "@stitches/react";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const Headline = styled("h1", {
    fontSize: "4rem",
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "5vh",
});

const GameList = styled("div", {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "white",
    padding: "1rem",
    marginBottom: "1rem",
});

const Game = styled("a", {
    fontSize: "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "20%",
    height: "20%",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
    padding: "1rem",
    margin: "1rem",
    color: "black",
    textDecoration: "none",
    "&:hover": {
        cursor: "pointer",
        boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.75)",
    },
});

const AdditionalStatsWrapper = styled("div", {
    width: "60%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "1rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
});

const AdditionalStats = styled("p", {
    fontSize: "0.8rem",
    color: "grey",
});

const ReloadIcon = styled("p", {
    fontSize: "0.8rem",
    color: "grey",
    cursor: "pointer",
    "&:hover": {
        color: "red",
    },
});

const Line = styled("hr", {
    width: "60%",
    marginLeft: "auto",
    marginRight: "auto",
});

const HealthWrapper = styled("div", {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
});

let socket: Socket<any>;

export default function Spectate() {

    const [runningGames, setRunningGames] = useState([]);

    useEffect(() => {

        const socketInitializer = async () => {
            const query = {
                token: "WEB",
                spectator: "true"
            };
            socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL, {
            query,
            withCredentials: true,
        })};
        socketInitializer();
    }, []);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("connected");
        });
        socket.on("disconnect", () => {
            console.log("disconnected");
        });
        socket.on("runningGames", (games: any) => {
            setRunningGames([]);
            setRunningGames(games);
        });
    }, []);

    useEffect(() => {
        getRunningGames();
        //update every 10 seconds
        // const interval = setInterval(() => {
        //     getRunningGames();
        // }, 10000);
    }, []);

    function reload() {
        getRunningGames();
    }

    function getRunningGames() {
        console.log("requesting running games")
        socket.emit("runningGames");
    }

    return (
        <>
            <Headline>Spectate</Headline>
            <AdditionalStatsWrapper>
                <AdditionalStats>Currently {runningGames.length} games running.</AdditionalStats>
                <ReloadIcon onClick={reload}>↻</ReloadIcon>
            </AdditionalStatsWrapper>
            <Line />
            <GameList>
                {runningGames.map((game) => {
                    return (
                        <Game key={game._gameroomId} href={"/game?roomNumber=" + game._gameroomId + "?spectator=true"}>
                            <h1>{game._gameroomId}</h1>
                            <p>Turn: {game.turn}</p>
                            <HealthWrapper>
                                <p>❤ {game._player1Utilities.health}</p>
                                <p>❤ {game._player2Utilities.health}</p>
                            </HealthWrapper>
                        </Game>
                    );
                })}
            </GameList>
        </>
    );
}