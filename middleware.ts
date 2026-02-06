import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { languages } from './i18n/settings'

const intlMiddleware = createMiddleware({
  locales: ['uz', 'uz-Cyrl', 'en', 'ru'],
  defaultLocale: 'uz',
})

function normalizePath(pathname: string) {
  if (pathname === '/') return '/'
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

function matchRoute(pattern: string, pathname: string) {
  // "/:lng/books/:slug" -> "^/[^/]+/books/[^/]+/?$"
  const regex = new RegExp(`^${pattern.replace(/:\w+/g, '[^/]+')}/?$`)
  return regex.test(pathname)
}

export async function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || ''
  const rawPathname = req.nextUrl.pathname
  const pathname = normalizePath(rawPathname)

  const intlResponse = intlMiddleware(req)
  const location = intlResponse.headers.get('Location')
  if (location) return intlResponse

  const seg = pathname.split('/')[1] || ''
  const locale = languages.includes(seg) ? seg : 'uz'

  const isNotFoundPage = pathname === `/${locale}/not-found` || pathname === `/${locale}/not-found/`
  const isRootPage = pathname === `/${locale}` || pathname === `/${locale}/`

  const publicRoutes = [
    '/', 
    '/:lng',
    '/:lng/about',
    '/:lng/contribute',
    '/:lng/books',
    '/:lng/books/:slug',
    '/:lng/favorites',
    '/:lng/contact',
    '/:lng/essentialbook',
    '/:lng/not-found',
    '/:lng/profile',
    '/:lng/statistics',
    '/:lng/intro',
  ]

  const isPublic = publicRoutes.some(route => matchRoute(route, pathname))

  let libraryId = req.cookies.get('library_id')?.value

  if (!libraryId) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/account/library/${hostname}/`,
        { cache: 'no-store' }
      )

      if (!res.ok) {
        return NextResponse.redirect(new URL(`/${locale}/intro`, req.url))
      }

      const data = await res.json()
      libraryId = data?.library

      if (!libraryId) {
        return NextResponse.redirect(new URL(`/${locale}/intro`, req.url))
      }
    } catch {
      return NextResponse.redirect(new URL(`/${locale}/intro`, req.url))
    }
  }

  if (!req.cookies.get('library_id') && libraryId) {
    intlResponse.cookies.set('library_id', libraryId, {
      path: '/',
      sameSite: 'lax',
    })
  }

  if (!libraryId && !isRootPage) {
    return NextResponse.redirect(new URL(`/${locale}`, req.url))
  }

  if (!isPublic && !isNotFoundPage) {
    return NextResponse.redirect(new URL(`/${locale}/not-found`, req.url))
  }

  return intlResponse
}

export const config = {
  matcher: ['/((?!.*\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}