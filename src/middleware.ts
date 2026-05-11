import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // LOG DI PARTENZA: Monitoriamo ogni richiesta
  console.log(`--- [MIDDLEWARE] Richiesta per: ${path} ---`)

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

  // 1. Controlliamo l'utente
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.log(`❌ [AUTH ERROR]: ${error.message}`)
  }

  if (user) {
    console.log(`✅ [UTENTE LOGGATO]: ${user.email}`)
  } else {
    console.log(`👤 [UTENTE]: Anonimo / Non loggato`)
  }

  // --- LOGICA DI REINDIRIZZAMENTO CON LOG ---

  // Se non loggato e prova ad andare in zone protette
  if (!user && (path.startsWith('/profilo') || path.startsWith('/admin'))) {
    console.log(`🚫 [REDIRECT]: Accesso negato a ${path}. Rimando a /login`)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se loggato e va su /login
  if (user && path === '/login') {
    console.log(`🔄 [REDIRECT]: Utente già loggato. Da /login a /profilo`)
    return NextResponse.redirect(new URL('/profilo', request.url))
  }

  // Se loggato e va su /admin (Controllo Ruolo)
  if (user && path.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    console.log(`👑 [ROLE CHECK]: Ruolo rilevato: ${profile?.role || 'nessuno'}`)

    if (profile?.role !== 'admin') {
      console.log(`⚠️ [REDIRECT]: Utente non admin prova ad accedere a ${path}. Rimando a /profilo`)
      return NextResponse.redirect(new URL('/profilo', request.url))
    }
  }

  console.log(`🏁 [MIDDLEWARE FINITO]: Caricamento regolare di ${path}`)
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
}