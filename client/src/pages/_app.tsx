import { SessionProvider } from "next-auth/react";
import type { AppProps } from 'next/app';
import { trpc } from '../utils/trpc';
import { useEffect, useContext } from "react";
import { AppContext } from "../utils/context";
import '../styles/global.css';
import { ContextProvider } from '../utils/context'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ContextProvider>
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </ContextProvider>
  );
};
//@ts-ignore
export default trpc.withTRPC(MyApp);
