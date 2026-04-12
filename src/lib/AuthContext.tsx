import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { signUp, signIn, signOut as amplifySignOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth'

interface User {
  email: string
  username: string
  isPremium: boolean
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  isPremium: boolean
  signUp: (email: string, password: string, username: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updatePremium: (email: string, isPremium: boolean) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// Fallback admin checks (used if Cognito groups not available in token)
const ADMIN_USERNAMES = (import.meta.env.VITE_ADMIN_USERNAMES || 'Quickfit_admin').split(',')
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || 'michael.j.reed218@gmail.com').split(',')

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing user on mount
  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      await getCurrentUser() // Ensure user is authenticated
      const session = await fetchAuthSession()
      const payload = session.tokens?.idToken?.payload
      const email = payload?.email as string || ''
      const preferredUsername = payload?.['preferred_username'] as string || ''

      // Check Cognito groups from token (set by Cognito admin if user is in Admin group)
      const cognitoGroups = payload?.['cognito:groups'] as string[] | undefined
      const isAdminFromGroup = cognitoGroups?.includes('Admin') || false

      // Also allow env var based admins for backwards compatibility
      const isAdminFromEnv = ADMIN_USERNAMES.includes(preferredUsername) || ADMIN_EMAILS.includes(email)

      const isAdmin = isAdminFromGroup || isAdminFromEnv

      // Check premium status - temporarily allow all logged-in users premium access
      const isPremium = true // TEMP: all users premium

      setUser({
        email,
        username: preferredUsername || email.split('@')[0],
        isPremium,
        isAdmin,
      })
    } catch (err) {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (email: string, password: string, username: string) => {
    await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          preferred_username: username,
        },
      },
    })

    // Store user info locally (in real app, create DynamoDB record)
    localStorage.setItem(`user_${email}`, JSON.stringify({ email, username, isPremium: false }))
    localStorage.setItem(`premium_${email}`, 'false')
  }

  const handleSignIn = async (email: string, password: string) => {
    console.log('handleSignIn: starting sign in process')
    try {
      await signIn({
        username: email,
        password,
      })
      console.log('handleSignIn: Amplify signIn completed, checking user')
      await checkUser()
      console.log('handleSignIn: checkUser completed')
    } catch (err) {
      console.error('handleSignIn error:', err)
      throw err
    }
  }

  const handleSignOut = async () => {
    await amplifySignOut()
    setUser(null)
  }

  const updatePremium = (email: string, isPremium: boolean) => {
    localStorage.setItem(`premium_${email}`, isPremium.toString())
    if (user?.email === email) {
      setUser(prev => prev ? { ...prev, isPremium } : null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin: user?.isAdmin || false,
        isPremium: user?.isPremium || false,
        signUp: handleSignUp,
        signIn: handleSignIn,
        signOut: handleSignOut,
        updatePremium,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
