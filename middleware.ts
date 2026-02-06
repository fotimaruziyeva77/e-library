import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { languages } from './i18n/settings'

const intlMiddleware = createMiddleware({
  locales: ['uz', 'uz-Cyrl', 'en', 'ru'],
  defaultLocale: 'uz',
})

function normalizePath(pathname: string) {
  return pathname.replace(/\/+$/, '') || '/'
}

function matchRoute(pattern: string, pathname: string) {
  // Patternni regex-ga o'girish
  const regexPattern = pattern
    .replace(/:\w+/g, '[^/]+')
    .replace(/\//g, '\\/')
  
  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(pathname)
}

export async function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || ''
  const rawPathname = req.nextUrl.pathname
  const pathname = normalizePath(rawPathname)

  // Avval locale borligini tekshirish
  const seg = pathname.split('/')[1] || ''
  const locale = languages.includes(seg) ? seg : 'uz'

  // Agar locale bo'lmasa, avval next-intl middleware ga yo'naltirish
  if (!languages.includes(seg) && seg !== '') {
    return intlMiddleware(req)
  }

  const isNotFoundPage = pathname === `/${locale}/not-found`
  const isRootPage = pathname === `/${locale}` || pathname === '/'
  const isIntroPage = pathname === `/${locale}/intro`

  const publicRoutes = [
    '/', 
    `/${locale}`,
    `/${locale}/about`,
    `/${locale}/contribute`,
    `/${locale}/books`,
    `/${locale}/books/[^/]+`,
    `/${locale}/favorites`,
    `/${locale}/contact`,
    `/${locale}/essentialbook`,
    `/${locale}/not-found`,
    `/${locale}/profile`,
    `/${locale}/statistics`,
    `/${locale}/intro`,
  ]

  const isPublic = publicRoutes.some(route => {
    const regex = new RegExp(`^${route}$`)
    return regex.test(pathname)
  })

  // Debug uchun
  console.log('Path:', pathname, 'IsPublic:', isPublic, 'Locale:', locale)

  // Agar public route bo'lsa va not-found bo'lmasa
  if (isPublic && !isNotFoundPage) {
    // Library ID ni tekshirish va o'rnatish
    await ensureLibraryId(req, hostname, locale)
    return NextResponse.next()
  }

  // Library ID ni tekshirish
  let libraryId = req.cookies.get('library_id')?.value

  if (!libraryId) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/account/library/${hostname}/`,
        { 
          cache: 'no-store',
          headers: {
            'Accept': 'application/json',
          }
        }
      )

      if (!res.ok) {
        console.log('Library not found, redirecting to intro')
        // Agar intro page bo'lmasa, intro ga yo'naltirish
        if (!isIntroPage && !isRootPage) {
          const url = new URL(`/${locale}/intro`, req.url)
          return NextResponse.redirect(url)
        }
        return NextResponse.next()
      }

      const data = await res.json()
      libraryId = data?.library

      if (!libraryId) {
        if (!isIntroPage && !isRootPage) {
          const url = new URL(`/${locale}/intro`, req.url)
          return NextResponse.redirect(url)
        }
        return NextResponse.next()
      }

      // Cookie ni o'rnatish
      const response = NextResponse.next()
      response.cookies.set('library_id', libraryId, {
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      })
      return response

    } catch (error) {
      console.error('Library fetch error:', error)
      if (!isIntroPage && !isRootPage) {
        const url = new URL(`/${locale}/intro`, req.url)
        return NextResponse.redirect(url)
      }
      return NextResponse.next()
    }
  }

  // Agar library_id bor lekin route public emas va not-found emas
  if (!isPublic && !isNotFoundPage) {
    const url = new URL(`/${locale}/not-found`, req.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

async function ensureLibraryId(req: NextRequest, hostname: string, locale: string) {
  if (!req.cookies.get('library_id')) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/account/library/${hostname}/`,
        { cache: 'no-store' }
      )
      
      if (res.ok) {
        const data = await res.json()
        const libraryId = data?.library
        
        if (libraryId) {
          const response = NextResponse.next()
          response.cookies.set('library_id', libraryId, {
            path: '/',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
          })
          return response
        }
      }
    } catch (error) {
      console.error('Failed to get library ID:', error)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\..*).*)', // Barcha yo'llar, lekin static fayllarni chetlab o'tish
    '/'
  ],
}