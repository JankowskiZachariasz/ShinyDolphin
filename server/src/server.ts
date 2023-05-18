import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import { CreateHTTPContextOptions, createHTTPServer } from '@trpc/server/adapters/standalone';
import { CreateWSSContextFnOptions, applyWSSHandler } from '@trpc/server/adapters/ws';
import { observable } from '@trpc/server/observable';
import { PrismaClient } from '@prisma/client'
import PGPubsub  from 'pg-pubsub';
import ws from 'ws';
import { z } from 'zod';
import cors from 'cors';


export const pubsubInstance = new PGPubsub('postgresql://postgres:postgres@localhost:5455/postgres');
export const prisma = new PrismaClient()

pubsubInstance.addChannel('channelName', function (channelPayload) {
  console.log(channelPayload);
});


// This is how you initialize a context for the server
function createContext(opts: CreateHTTPContextOptions | CreateWSSContextFnOptions,) {return {};}
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const publicProcedure = t.procedure;
const router = t.router;

const greetingRouter = router({
  objects: router({
    Account: publicProcedure.input(z.object({name: z.string()}),)
            .query(async ({ input }) => {

              await prisma.$transaction(async (tx) => {
                // 1. Decrement amount from the sender.
                await tx.user.create({
                  data: {email: `${input.name}@prisma.com` },
                });
                
              })
              await prisma.$disconnect()
            
              return `Hello, ${input.name}!`})
  }),
  hello: publicProcedure
    .input(z.object({name: z.string()}),)
    .query(({ input }) => `Hello, ${input.name}!`),
  xd: publicProcedure
  .input(
    z.object({
      xdMaByc: z.string(),
    }),
  )
  .query(({ input }) => `xdMaByc, ${input.xdMaByc}!`)
});

const postRouter = router({
  createPost: publicProcedure
    .input(
      z.object({
        title: z.string(),
        text: z.string(),
      }),
    )
    .mutation(({ input }) => {
      // imagine db call here
      return {
        id: `${Math.random()}`,
        ...input,
      };
    }),
  randomNumber: publicProcedure.subscription(() => {
    return observable<{ randomNumber: number }>((emit) => {
      const timer = setInterval(() => {
        // emits a number every second
        emit.next({ randomNumber: Math.random() });
      }, 200);

      return () => {
        clearInterval(timer);
      };
    });
  }),
});

// Merge routers together
const appRouter = router({
  greeting: greetingRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;

// http server
const { server, listen } = createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext,
});

// ws server
const wss = new ws.Server({ server });
applyWSSHandler<AppRouter>({
  wss,
  router: appRouter,
  createContext,
});

listen(2022);
