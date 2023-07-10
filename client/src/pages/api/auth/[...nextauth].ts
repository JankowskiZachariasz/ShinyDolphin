import * as dotenv from 'dotenv'
dotenv.config()
import NextAuth from 'next-auth';
import {JWT, JWTEncodeParams, JWTDecodeParams} from 'next-auth/jwt';
var jwt = require('jsonwebtoken');
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import type { ProvisionUserTokenPayload } from '../../../../types/shared'
import { SESSION_COOKIE_NAME } from '../../../utils/trpc';
import { trpc_server_side } from '../../../utils/trpx_server';

const JWT_TOKEN_VALIDITY = 35 * 24 * 60 * 60 //35 days
const JWT_TOKEN_REFRESH_OFFSET = 30 * 24 * 60 * 60

let providers = [
  GoogleProvider({
    clientId: '227287437561-3s1mg3p7fmuuub5q9vimc2sjaicf9v8m.apps.googleusercontent.com',
    clientSecret: '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',
    authorization: { params: { scope: "openid email profile", prompt: 'select_account' } },
  }),
  CredentialsProvider({
    name: "Credentials",
    credentials: {},
    //@ts-ignore
    async authorize(credentials : {token : string}, req) {
      if(!credentials?.token || !process.env.JWT_KEY_PUBLIC){
        return null;
      }
      const JWT_KEY_PUBLIC = process.env.JWT_KEY_PUBLIC.replace(/\\n/g, '\n');
      let encodedData = jwt.verify(credentials.token, JWT_KEY_PUBLIC,  { algorithm: 'RS256', allowInsecureKeySizes: true })
      if(encodedData.claims !== 'JWT_CLAIM_AUTHENTICATED'){
        return null;
      }
      return { ...encodedData, token: credentials.token };
    }
  }),

]                                                           

let pages = {
  signIn: '/auth/signin',
}

export default NextAuth({
  providers,
  callbacks:{
    async session(props) {
      props.session.user = props.token;
      return props.session
    },
    //@ts-ignore
    async jwt(props) {
      if(props.trigger ==="signIn"){
        switch (props.account?.provider){
          case('credentials'): {
            return {
              id : props.user.id,
              firstName : props.user.firstName,
              lastName : props.user.lastName,
              email : props.user.email,
              authProvider : props.account?.provider.toUpperCase(),
              role : props.user.role,
              picture : props.user.picture,
              sessionId : props.user.sessionId
            }
          }
          case('google'): {

            let oAuthData :any = {};
            oAuthData.id = null;
            oAuthData.email = props.user.email;
            oAuthData.authProvider = props.account.provider.toUpperCase();
            //@ts-ignore
            oAuthData.firstName = props.profile?.given_name;
            //@ts-ignore
            oAuthData.lastName = props.profile?.family_name;
            //@ts-ignore
            oAuthData.picture = props.profile?.picture;

            let provisioniedUser = await trpc_server_side.authentication.provisionUserAndSession.mutate({user: oAuthData});
            return {
              id : provisioniedUser.id,
              firstName : provisioniedUser.firstName,
              lastName : provisioniedUser.lastName,
              email : provisioniedUser.email,
              authProvider : provisioniedUser.authProvider,
              role : provisioniedUser.role,
              picture : provisioniedUser.picture,
              //@ts-ignore
              sessionId : provisioniedUser.sessions[0].id
            }
          }
          default:{
            return {...props.user}
          }
        }
      }
      else if(props.trigger === "update"){
        props.token.exp = 0;
      }
      return {...props.token}
    }
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
  pages,
  events:{
    signOut: async (message) => {
      //@ts-ignore
      await trpc_server_side.authentication.logout.mutate({sessionId : message.token.sessionId, userId : message.token.id});
    }
  },
  cookies: {
    sessionToken: {
      name: SESSION_COOKIE_NAME,
      options: {
        httpOnly: true,
        sameSite: 'Lax',
        domain: process.env.HOSTNAME,
        path: '/',
        secure: false,
      }
  }
  },
  session:{
    strategy: 'jwt'
  },
  jwt: {
    async encode(params: JWTEncodeParams): Promise<string> {
      //@ts-ignore
      const JWT_KEY_PRIVATE = process.env.JWT_KEY_PRIVATE.replace(/\\n/g, '\n');
      //@ts-ignore - refreshing token
      if(params.token && (params.token.exp - JWT_TOKEN_REFRESH_OFFSET) < Math.round(Date.now()/1000)){
        //@ts-ignore 
        delete params.token.exp; delete params.token.iat;
        //@ts-ignore 
        const updatedUser = await trpc_server_side.authentication.refreshSession.mutate({sessionId : params.token.sessionId, userId: params.token.id});
        params.token.firstName = updatedUser.firstName;
        params.token.lastName = updatedUser.lastName;
        params.token.role = updatedUser.role;
        params.token.picture = updatedUser.picture;
      }
      const options : any = { algorithm: 'RS256', allowInsecureKeySizes: true, expiresIn: JWT_TOKEN_VALIDITY};
      //@ts-ignore
      if(params.token.exp){
        delete options.expiresIn;
      }
      return jwt.sign(params.token, JWT_KEY_PRIVATE, options);
    },
    async decode(params: JWTDecodeParams): Promise<JWT | null> {
      //@ts-ignore
      const JWT_KEY_PUBLIC = process.env.JWT_KEY_PUBLIC.replace(/\\n/g, '\n');
      return jwt.verify(params.token, JWT_KEY_PUBLIC,  { algorithm: 'RS256', allowInsecureKeySizes: true });
    },
  }
});
