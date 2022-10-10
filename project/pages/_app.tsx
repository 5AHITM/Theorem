import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { globalCss } from "../stitches.config";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

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

function App({ Component, pageProps }: AppProps) {
  globalStyles();

  const router = useRouter();
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
