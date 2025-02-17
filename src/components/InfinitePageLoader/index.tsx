import { useRouter } from "next/router";
import { useEffect } from "react";

import { LoadingBar, endLoadingBar, startLoadingBar } from "./LoadingBar";

export const InfinitePageLoader: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChangeStart = () => {
      startLoadingBar();
    };
    const handleRouteChangeComplete = () => {
      endLoadingBar();
    };
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router]);
  return <LoadingBar />;
};
