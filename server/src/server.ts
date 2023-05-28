import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import { CreateHTTPContextOptions, createHTTPServer } from '@trpc/server/adapters/standalone';
import { CreateWSSContextFnOptions, applyWSSHandler } from '@trpc/server/adapters/ws';
import { observable } from '@trpc/server/observable';
import { PrismaClient } from '@prisma/client'
import PGPubsub  from 'pg-pubsub';
import ws from 'ws';
import { z } from 'zod';
import cors from 'cors';
var jwt = require('jsonwebtoken');
import * as dotenv from 'dotenv'; 
dotenv.config();

import { TriggerMaster } from './_openforce/TriggerMaster';

export const pubsubInstance = new PGPubsub(process.env.DATABASE_URL);
export const prisma = new PrismaClient()
export const SESSION_COOKIE_NAME = 'next-auth.session-token='


pubsubInstance.addChannel('channelName', function (channelPayload) {
  console.log(channelPayload);
});


prisma.$use(TriggerMaster.runTriggers)

// This is how you initialize a context for the server
function createContext(opts: CreateHTTPContextOptions | CreateWSSContextFnOptions):{prisma: PrismaClient, user : any} {
  let user;
  console.log('opts.req.headers.cookie', opts.req.headers.cookie);
  if(typeof opts.req.headers.cookie == 'string'){
    opts.req.headers.cookie.split(' ').forEach(cookie => {
      if(cookie.startsWith(SESSION_COOKIE_NAME)){
        let token = cookie.substring(SESSION_COOKIE_NAME.length, cookie.length);
        const JWT_KEY_PUBLIC = process.env.JWT_KEY_PUBLIC?.replace(/\\n/g, '\n');
        user = jwt.verify(token, JWT_KEY_PUBLIC,  { algorithm: 'RS256', allowInsecureKeySizes: true });
        console.log('token',token);
        console.log('user',user);
        return {prisma, user};
      }
    })
  }
  console.log('user',user);
  //@ts-ignore
  return {prisma, user};
}
type Context = inferAsyncReturnType<typeof createContext>;
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
type PrismaTx = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use">;
const t = initTRPC.context<Context>().create();

export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const router = t.router;

import AuthorizationHandler from './_openforce/AuthorizationHandler'

const greetingRouter = router({
  objects: router({
    login : AuthorizationHandler,
    Account: publicProcedure.input(z.object({name: z.string()}),)
            .query(async ({input,ctx:{user, prisma}}) => {
              try{
                prisma.$transaction(async (tx) =>{
                  //@ts-ignore
                  let _tx: never = tx;
                  let r = await tx.user.create({_tx, data: {email: 'VW', password: 'XD', role: 'XD' }})
                  console.log(r);
                })
              }
              catch(e){
                console.log(e);
                prisma.$disconnect;
              }
              finally{
                prisma.$disconnect;
              }
              return 'done';
            })
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
      }, 20000);

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
