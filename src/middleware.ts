import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Creiamo una risposta base
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Inizializziamo il client Supabase specifico per SSR
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Aggiorniamo i cookie sia nella richiesta che nella risposta
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

  // Usiamo getUser() per sicurezza, ma ricorda che è una chiamata di rete
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  // Controllo per le rotte Admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log("--- DEBUG ADMIN ---")
    console.log("Utente trovato:", user?.email)
    
    if (authError) {
      console.log("Errore Auth:", authError.message)
    }

    // 1. Se l'utente non è loggato -> Login
    if (!user) {
      console.log("Redirect a /login: User non autenticato")
      const url = new URL('/login', request.url)
      // Aggiungiamo un parametro per tornare qui dopo il login (opzionale)
      url.searchParams.set('next', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // 2. Recuperiamo il profilo
    const { data: profile, error: dbError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    console.log("Ruolo trovato nel DB:", profile?.role)
    if (dbError) console.log("Errore DB:", dbError.message)

    // 3. Se non è admin -> 403
    if (!profile || profile.role !== 'admin') {
      console.log("Accesso Negato: Reindirizzamento a /403")
      return NextResponse.redirect(new URL('/forbidden', request.url))
    }
    
    console.log("Accesso Consentito ✅")
  }

  return response
}

// Il matcher deve escludere i file statici per non appesantire il server
export const config = {
  matcher: [
    '/admin/:path*',
    /*
     * Opzionale: puoi aggiungere altre rotte da proteggere qui
     */
  ],
}