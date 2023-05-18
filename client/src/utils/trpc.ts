import { httpBatchLink, TRPCLink, createTRPCProxyClient  } from '@trpc/client';

import { AnyRouter } from '@trpc/server';
import { createTRPCNext } from '@trpc/next';
import { wsLink, createWSClient } from '@trpc/client/links/wsLink';
import type { AppRouter } from '../../../server/src/server';

import { NextPageContext } from 'next';
import { observable } from '@trpc/server/observable';

function customLink<TRouter extends AnyRouter = AnyRouter>(): TRPCLink<AppRouter> {
  return (runtime) => {
    return ({op, next}) => {
      if(op.type === 'subscription' && typeof window !== 'undefined'){
        const client = createWSClient({
          url: 'ws://localhost:2022',
        });
        return wsLink<AppRouter>({
          client,
        })(runtime)({op, next});
      }
      return httpBatchLink({
        url: 'http://localhost:2022',
      })(runtime)({op, next});
    }
  }
}

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        customLink()
      ],
    };
  },
  ssr: true,
});
