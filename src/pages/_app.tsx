import type { AppProps } from "next/app";

import { InfinitePageLoader } from "@/components/InfinitePageLoader";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <InfinitePageLoader />
      <Component {...pageProps} />
    </>
  );
}
