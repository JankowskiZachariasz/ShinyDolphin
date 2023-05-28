import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string, 
      token: string, 
      email: string, 
      name: string
    }
  }
  interface DefaultJWT extends Record<string, unknown> {
    name?: string | null
    email?: string | null
    picture?: string | null
    sub?: string
    token?: string
  }
}