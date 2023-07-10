import NextAuth, { DefaultSession, User } from "next-auth"
import type { SessionTokenPayload } from './shared'

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  export interface User extends UserObject  {
    id : String | undefined
    firstName : String | undefined
    lastName : String | undefined
    email : String | undefined
    authProvider : String | undefined
    role : String | undefined
    picture : String | undefined | null
    token? : String
    sessionId? : String
  }

  export interface DefaultJWT extends Record<string, unknown> {
    id : String | undefined
    firstName : String | undefined
    lastName : String | undefined
    email : String | undefined
    authProvider : String | undefined
    role : String | undefined
    picture : String | undefined | null
    token? : String
  }
}