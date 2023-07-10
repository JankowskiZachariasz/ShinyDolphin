import { httpBatchLink, TRPCLink, createTRPCProxyClient  } from '@trpc/client';
import { AnyRouter } from '@trpc/server';
import { createTRPCNext } from '@trpc/next';
import { wsLink, createWSClient } from '@trpc/client/links/wsLink';
import type { AppRouter } from '../../../server/src/server';
import { NextPageContext } from 'next';
import { observable } from '@trpc/server/observable';
import BackendTokenProvider from './backendTokenProvider'

export const SESSION_COOKIE_NAME = 'next-auth.session-token'

export const trpc_server_side = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      //@ts-ignore
      url: process.env.NEXT_PUBLIC_TRPC_SERVER_URL,
        headers: () => {
          return {
            authorization: BackendTokenProvider.authorizationToken,
          };
        },
    }),
  ],
});