import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
export const supportedLocales = ["pl", "en",] as const
const defaultLocale = 'en'
 
export function middleware(request : NextRequest) {
  const pathname = request.nextUrl.pathname
  let supportedLocalesArray = Object.assign([], supportedLocales);
  const pathnameIsMissingLocale = supportedLocalesArray.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )
  if (pathnameIsMissingLocale) {
    let headers : any = {}
    request.headers.forEach(( v, k) => {headers[k] = v;})
    let languages = new Negotiator({ headers }).languages()
    const locale = match(languages, supportedLocalesArray, defaultLocale);
    return NextResponse.redirect(
      new URL(`/${locale}/${pathname}`, request.url)
    )
  }
}
 
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}