import { getSession, SessionProvider } from "next-auth/react";
import type { AppProps } from 'next/app';
import { trpc } from '../utils/trpc';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
     <Component {...pageProps} />
    </SessionProvider>
  );
};
//@ts-ignore
export default trpc.withTRPC(MyApp);
