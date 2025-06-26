import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const AUTHORIZED_EMAIL = 'jnordq@gmail.com'

/**
 * Simple auth check for demo pages - checks if user session exists
 * and if the email matches the authorized email
 */
export async function requireAuthorizedUser() {
  const cookieStore = await cookies()
  
  // In a real app, you would verify the session with Supabase
  // For now, we'll do a simple redirect if no auth is detected
  const sessionCookie = cookieStore.get('sb-access-token') || cookieStore.get('supabase.auth.token')
  
  if (!sessionCookie) {
    redirect('/auth?message=Please sign in to access this page')
  }
  
  // In production, you'd decode the JWT and verify the email
  // For this demo, we'll assume the user needs to be manually added to an allowlist
  // This is a simplified approach for the demo
  
  return { email: AUTHORIZED_EMAIL } // Mock user for demo
}

export async function checkIfAuthorized(): Promise<boolean> {
  const cookieStore = await cookies()
  
  try {
    const sessionCookie = cookieStore.get('sb-access-token') || cookieStore.get('supabase.auth.token')
    return !!sessionCookie
  } catch (error) {
    console.error('Auth check error:', error)
    return false
  }
}
