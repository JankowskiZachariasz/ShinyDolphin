import { httpBatchLink, TRPCLink, createTRPCProxyClient  } from '@trpc/client';

import { AnyRouter } from '@trpc/server';
import { createTRPCNext } from '@trpc/next';
import { wsLink, createWSClient } from '@trpc/client/links/wsLink';
import type { AppRouter } from '../../../server/src/server';

import { NextPageContext } from 'next';
import { observable } from '@trpc/server/observable';

function customLink(): TRPCLink<AppRouter> {
  return (runtime) => {
    return ({op, next}) => {
      // if(op.type === 'subscription' && typeof window !== 'undefined'){
      //   const client = createWSClient({
      //     url: 'ws://109.95.171.200:2022',
      //   });
      //   return wsLink<AppRouter>({
      //     client,
      //   })(runtime)({op, next});
      // }
      return httpBatchLink({
        url: 'http://109.95.171.200:2022',
        //@ts-ignore
        headers: () => {
          return {
            Authorization: op.context.token,
          };
        },
      })(runtime)({op, next});
    }
  }
}

export const trpc = createTRPCNext<AppRouter>({
  config({ctx}) {
    return {
      links: [
        customLink()
      ]
    };
  },
  ssr: true,
});
