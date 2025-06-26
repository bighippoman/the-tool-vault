import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/integrations/supabase/client'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle OAuth errors first
  if (error) {
    console.error('❌ OAuth error:', error, errorDescription)
    const errorMessage = encodeURIComponent(errorDescription || 'Authentication failed')
    return NextResponse.redirect(`${requestUrl.origin}/auth?error=oauth_error&message=${errorMessage}`)
  }

  if (code) {
    try {
      // Exchange the code for a session using the simple client
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('❌ Code exchange error:', exchangeError)
        const errorMessage = encodeURIComponent('Failed to complete authentication')
        return NextResponse.redirect(`${requestUrl.origin}/auth?error=exchange_error&message=${errorMessage}`)
      }

      if (data.session) {
        console.log('✅ Authentication successful for user:', data.user?.email)
        // Redirect to account page on successful authentication
        return NextResponse.redirect(`${requestUrl.origin}/account`)
      }
    } catch (error) {
      console.error('❌ Unexpected error during authentication:', error)
      const errorMessage = encodeURIComponent('Authentication failed unexpectedly')
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=unexpected_error&message=${errorMessage}`)
    }
  }

  // If no code or session, redirect to auth page
  console.log('⚠️ No code provided in callback')
  return NextResponse.redirect(`${requestUrl.origin}/auth`)
}
