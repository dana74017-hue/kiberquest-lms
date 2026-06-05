import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['ru', 'en', 'kz']
const defaultLocale = 'ru'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Пропускаем API и служебные файлы
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return
  }

  // Проверяем, есть ли язык в начале пути
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Редиректим на /ru + текущий путь
  const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url)
  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}