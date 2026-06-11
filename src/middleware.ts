import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const { searchParams } = request.nextUrl

  // 0. SE È IL WEBHOOK DI STRIPE, PASSA OLTRE SENZA TOCCARE NULLA 🚀
  if (path.startsWith('/api/webhooks/stripe')) {
    return NextResponse.next()
  }

  // 1. Escludiamo subito la pagina di coming-soon per evitare loop infiniti
  if (path === '/coming-soon') {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 2. Controlliamo l'utente su Supabase
  const { data: { user } } = await supabase.auth.getUser()

  // 3. LOGICA DI ACCESSO "PORTA SUL RETRO" (Cookie Bypass)
  const adminSecret = 'caristia_admin'
  const hasAdminQuery = searchParams.get('access') === adminSecret
  const hasAdminCookie = request.cookies.has('admin_bypass')

  if (hasAdminQuery) {
    const redirectResponse = NextResponse.redirect(new URL('/', request.url))
    redirectResponse.cookies.set('admin_bypass', 'true', {
      maxAge: 60 * 60 * 24 * 30, // 30 giorni
      path: '/',
    })
    return redirectResponse
  }

  // 4. VERIFICA RUOLO ADMIN DAL DATABASE DI SUPABASE
  let isDbAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'admin') {
      isDbAdmin = true
    }
  }

  // 5. BLOCCO COMING SOON
  if (!isDbAdmin && !hasAdminCookie && path !== '/login') {
    return NextResponse.redirect(new URL('/coming-soon', request.url))
  }

  // Se non loggato e prova ad andare in zone protette
  if (!user && (path.startsWith('/profilo') || path.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se loggato e va su /login
  if (user && path === '/login') {
    return NextResponse.redirect(new URL('/profilo', request.url))
  }

  // Se prova ad andare su /admin ma non è admin nel DB
  if (path.startsWith('/admin') && !isDbAdmin) {
    return NextResponse.redirect(new URL('/profilo', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\.jpg$|.*\\.jpeg$|.*\\.png$|.*\\.svg$|.*\\.webp$|.*\\.ico$).*)'
  ],
}