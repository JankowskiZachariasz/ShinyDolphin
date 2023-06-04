import * as dotenv from 'dotenv'
dotenv.config()
import NextAuth from 'next-auth';
import {JWT, JWTEncodeParams, JWTDecodeParams} from 'next-auth/jwt';
var jwt = require('jsonwebtoken');
import { AppProviders } from 'next-auth/providers';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';

let providers = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {},
    async authorize(credentials, req) {
      //@ts-ignore
      if(!credentials?.token){
        return null;
      }
      //@ts-ignore
      return  { id: "1", token: credentials?.token, email: credentials?.email, name: 'Zacharek'};
    },
  }),

]

let pages = {
  signIn: '/auth/signin',
}

export default NextAuth({
  // Configure one or more authentication providers
  providers,
  secret: process.env.NEXT_PUBLIC_SECRET,
  pages,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'Lax',
        domain: 'metabase.pl',
        path: '/',
        secure: false,
      }
  }
},
  jwt: {
    async encode(params: JWTEncodeParams): Promise<string> {
      //@ts-ignore
      const JWT_KEY_PRIVATE = process.env.JWT_KEY_PRIVATE.replace(/\\n/g, '\n');
      return jwt.sign(params.token, JWT_KEY_PRIVATE, { algorithm: 'RS256', allowInsecureKeySizes: true });
    },
    async decode(params: JWTDecodeParams): Promise<JWT | null> {
      //@ts-ignore
      const JWT_KEY_PUBLIC = process.env.JWT_KEY_PUBLIC.replace(/\\n/g, '\n');
      return jwt.verify(params.token, JWT_KEY_PUBLIC,  { algorithm: 'RS256', allowInsecureKeySizes: true });
    },
  }
});
