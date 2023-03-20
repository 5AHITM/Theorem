import Head from "next/head";
import { brotliDecompress } from "zlib";
import { styled } from "../../stitches.config";
import { Background } from "../atoms/Background";
import Image from "next/image";


const FullscreenButton = styled("button", {
    position: "absolute",
    bottom: "5vh",
    right: "5vh",
    backgroundColor: "#DADADA",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "15vh",
    height: "15vh",
    borderRadius: "2rem",
    borderStyle: "none",
    boxShadow: "rgba(0, 0, 0, 0.7) 0px 0px 30px",
    "&:active": {
        boxShadow: "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset"
    }
})

const InnerBox = styled("div", {
    position: "absolute",
    width: "10vh",
    height: "10vh",    
})

export const Fullscreen: React.FC = () => {
    return (
        <>
            <FullscreenButton
            onClick={() => {
                if (document.documentElement.requestFullscreen)
                  document.documentElement.requestFullscreen();
              }}
            >
                <InnerBox>
                    <Image
                        alt={"Background"}
                        src={"/img/icons/fullscreenIcon.png"}
                        fill
                        draggable={false}
                    />
                </InnerBox>
            </FullscreenButton>
        </>
        
    )
}