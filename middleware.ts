import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Если уже есть язык — ничего не делаем
  if (
    pathname.startsWith('/ru') ||
    pathname.startsWith('/en') ||
    pathname.startsWith('/kz')
  ) {
    return
  }

  // Редиректим всё остальное на /ru
  return NextResponse.redirect(new URL(`/ru${pathname}`, request.url))
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}