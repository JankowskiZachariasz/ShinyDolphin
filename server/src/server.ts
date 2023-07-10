import { inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server';
import { CreateHTTPContextOptions, createHTTPServer } from './_openforce/TrpcStandaloneServer'
import { CreateWSSContextFnOptions, applyWSSHandler } from '@trpc/server/adapters/ws';
import { User } from './_openforce/Models'
import { SESSION_COOKIE_NAME } from '../../client/src/utils/trpc'
import PGPubsub  from 'pg-pubsub';
import ws from 'ws';
var cookie = require('cookie');
import cors from 'cors';
import * as dotenv from 'dotenv'; 
dotenv.config();

const AUTHORIZATION_HEADER_KEY = 'authorization';

if(typeof process.env.DATABASE_URL !== 'string'){
  process.exit(0);
}

export const pubsubInstance = new PGPubsub(process.env.DATABASE_URL);
pubsubInstance.addChannel('channelName', function (channelPayload) {
  console.log(channelPayload);
});


function createContext(opts: CreateHTTPContextOptions | CreateWSSContextFnOptions):{token : string | null, user? : User} {
  if(Object.keys(opts.req.headers).includes(AUTHORIZATION_HEADER_KEY)){
    //@ts-ignore
    const token :string = opts.req.headers[AUTHORIZATION_HEADER_KEY];
    return {token};
  }
  if(typeof opts.req.headers.cookie !== 'string'){
    return {token : null};
  }
  const cookies = cookie.parse(opts.req.headers.cookie);
  if(Object.keys(cookies).includes(SESSION_COOKIE_NAME)){
    let token = cookies[SESSION_COOKIE_NAME];
    return {token};
  }
  return {token : null};
}

type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const router = t.router;


import { UserAuthenticationController } from './_openforce/UserAuthenticationController'
import { CarController } from './classes/CarController'


const greetingRouter = router({
  objects: router({
    login : UserAuthenticationController
  })
});

// Merge routers together
const appRouter = router({
  greeting: greetingRouter,
  authentication: UserAuthenticationController,
  car: CarController
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
