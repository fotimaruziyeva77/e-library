import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { languages } from './i18n/settings'

const intlMiddleware = createMiddleware({
  locales: ['uz', 'uz-Cyrl', 'en', 'ru'],
  defaultLocale: 'uz',
  localeDetection: false // Avtomatik locale detection o'chirish
})

function normalizePath(pathname: string) {
  return pathname.replace(/\/+$/, '') || '/'
}

export async function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || ''
  const rawPathname = req.nextUrl.pathname
  const pathname = normalizePath(rawPathname)

  // 1. Avval next-intl middleware ni ishlatish
  const intlResponse = intlMiddleware(req)
  
  // Agar next-intl redirect qilayotgan bo'lsa, uni qaytarish
  if (intlResponse.headers.get('Location')) {
    return intlResponse
  }

  // 2. Localeni aniqlash
  const seg = pathname.split('/')[1] || ''
  const locale = languages.includes(seg) ? seg : 'uz'

  // 3. Maxsus pagelarni aniqlash
  const isNotFoundPage = pathname === `/${locale}/not-found`
  const isRootPage = pathname === `/${locale}` || pathname === '/'
  // const isIntroPage = pathname === `/${locale}/intro`
  
  // 4. Public route patternlarini aniqlash
  const publicPatterns = [
    /^\/?$/, // root
    new RegExp(`^/${locale}/?$`), // locale root
    new RegExp(`^/${locale}/about/?$`),
    new RegExp(`^/${locale}/contribute/?$`),
    new RegExp(`^/${locale}/books/?$`),
    new RegExp(`^/${locale}/books/[^/]+/?$`),
    new RegExp(`^/${locale}/favorites/?$`),
    new RegExp(`^/${locale}/contact/?$`),
    new RegExp(`^/${locale}/essentialbook/?$`),
    new RegExp(`^/${locale}/not-found/?$`),
    new RegExp(`^/${locale}/profile/?$`),
    new RegExp(`^/${locale}/statistics/?$`),
    // new RegExp(`^/${locale}/intro/?$`),
  ]

  const isPublic = publicPatterns.some(pattern => pattern.test(pathname))

  console.log('Middleware debug:', {
    pathname,
    locale,
    isPublic,
    isNotFoundPage,
    isRootPage,
    // isIntroPage
  })

  // 5. Library ID ni tekshirish
  let libraryId = req.cookies.get('library_id')?.value

  // Agar library_id bo'lmasa, API dan so'rash
  if (!libraryId) {
    console.log('No library_id cookie found, fetching from API...')
    
    // Agar intro yoki root page bo'lsa, library_id siz ham davom ettirish mumkin
    if ( isRootPage) {
      console.log('Intro or root page, skipping library check')
      return intlResponse
    }

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/account/library/${hostname}/`
      console.log('Fetching library from:', apiUrl)
      
      const res = await fetch(apiUrl, { 
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      })

      console.log('API response status:', res.status)

      if (!res.ok) {
        console.log('Library API failed, redirecting to intro')
        // Intro page ga redirect
        const url = new URL(`/${locale}/`, req.url)
        const response = NextResponse.redirect(url)
        
        // Agar oldin cookie bo'lsa, uni tozalash
        if (req.cookies.get('library_id')) {
          response.cookies.delete('library_id')
        }
        
        return response
      }

      const data = await res.json()
      libraryId = data?.library
      console.log('Library ID from API:', libraryId)

      if (!libraryId) {
        console.log('No library ID in response, redirecting to intro')
        const url = new URL(`/${locale}/`, req.url)
        const response = NextResponse.redirect(url)
        response.cookies.delete('library_id')
        return response
      }

      // Yangi response yaratish va cookie o'rnatish
      const response = NextResponse.next()
      response.cookies.set('library_id', libraryId, {
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 kun
        secure: process.env.NODE_ENV === 'production',
      })
      
      return response

    } catch (error) {
      console.error('Library fetch error:', error)
      
      // Intro page ga redirect
      const url = new URL(`/${locale}/`, req.url)
      const response = NextResponse.redirect(url)
      response.cookies.delete('library_id')
      return response
    }
  } else {
    console.log('Library ID from cookie:', libraryId)
    
    // Agar library_id bor, lekin route public emas va not-found emas bo'lsa
    if (!isPublic && !isNotFoundPage) {
      console.log('Route not found, redirecting to 404')
      const url = new URL(`/${locale}/not-found`, req.url)
      return NextResponse.redirect(url)
    }
    
    // Har bir request uchun cookie ni yangilash (muddati uzaytirish)
    const response = NextResponse.next()
    response.cookies.set('library_id', libraryId, {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === 'production',
    })
    
    return response
  }

  // Default holatda next-intl response ni qaytarish
  return intlResponse
}

export const config = {
  matcher: [
    // Barcha yo'llar, lekin static fayllarni chetlab o'tish
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/'
  ],
}