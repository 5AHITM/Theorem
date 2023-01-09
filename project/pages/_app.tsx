import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { globalCss } from "../stitches.config";
import { ReactQueryDevtools } from "react-query/devtools";
import { SessionProvider } from "next-auth/react";

const globalStyles = globalCss({
  "*": {
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
  },
  body: {
    fontWeight: "$regular",
    overflowX: "hidden",
    backgroundColor: "$background",
    minHeight: "100vh",
  },
});

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  globalStyles();

  const router = useRouter();

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </SessionProvider>
  );
}

export default App;
