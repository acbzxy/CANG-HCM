import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { User, LoginCredentials } from '../types'

// Auth state type
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Auth actions
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }

// Auth context type
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  clearError: () => void
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    default:
      return state
  }
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const savedUser = sessionStorage.getItem('user')
        const isLoggedIn = sessionStorage.getItem('isLoggedIn')
        
        if (isLoggedIn === 'true' && savedUser) {
          const user: User = JSON.parse(savedUser)
          dispatch({ type: 'LOGIN_SUCCESS', payload: user })
        }
      } catch (error) {
        console.error('Error checking existing session:', error)
        // Clear invalid session data
        sessionStorage.clear()
      }
    }

    checkExistingSession()
  }, [])

  // Login function
  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' })

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Check for dev credentials
      if (credentials.username === 'devadmin' && credentials.password === 'dev123456') {
        const devUser: User = {
          id: 'dev-001',
          username: 'devadmin',
          email: 'dev@example.com',
          fullName: 'Dev Administrator',
          companyName: 'Development Company',
          taxCode: '0109844160',
          phone: '1900 1234',
          address: 'TP. Hồ Chí Minh',
          userType: 'dev',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        }

        // Save to session storage
        sessionStorage.setItem('user', JSON.stringify(devUser))
        sessionStorage.setItem('isLoggedIn', 'true')
        sessionStorage.setItem('loginTime', new Date().toISOString())
        sessionStorage.setItem('userType', 'dev')

        dispatch({ type: 'LOGIN_SUCCESS', payload: devUser })
        return
      }

      // Check for custom user credentials (user/123456)
      if (credentials.username === 'user' && credentials.password === '123456') {
        const customUser: User = {
          id: 'custom-001',
          username: 'user',
          email: 'user@example.com',
          fullName: 'Người dùng tùy chỉnh',
          companyName: 'Công ty tùy chỉnh',
          taxCode: 'USER123456',
          phone: '1900 1286',
          address: 'TP. Hồ Chí Minh',
          userType: 'custom',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        }

        // Save to session storage
        sessionStorage.setItem('user', JSON.stringify(customUser))
        sessionStorage.setItem('isLoggedIn', 'true')
        sessionStorage.setItem('loginTime', new Date().toISOString())
        sessionStorage.setItem('userType', 'custom')

        dispatch({ type: 'LOGIN_SUCCESS', payload: customUser })
        return
      }

      // Check for admin user credentials (admin/123456)
      if (credentials.username === 'admin' && credentials.password === '123456') {
        const adminUser: User = {
          id: 'admin-001',
          username: 'admin',
          email: 'admin@example.com',
          fullName: 'Quản trị viên tùy chỉnh',
          companyName: 'Công ty Quản trị',
          taxCode: 'ADMIN123456',
          phone: '1900 1286',
          address: 'TP. Hồ Chí Minh',
          userType: 'admin_custom',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        }

        // Save to session storage
        sessionStorage.setItem('user', JSON.stringify(adminUser))
        sessionStorage.setItem('isLoggedIn', 'true')
        sessionStorage.setItem('loginTime', new Date().toISOString())
        sessionStorage.setItem('userType', 'admin_custom')

        dispatch({ type: 'LOGIN_SUCCESS', payload: adminUser })
        return
      }

      // For other credentials, simulate authentication
      if (credentials.username && credentials.password) {
        const user: User = {
          id: 'user-001',
          username: credentials.username,
          email: 'user@example.com',
          fullName: 'Công ty Demo TPHCM',
          companyName: 'Công ty Demo TPHCM',
          taxCode: credentials.username,
          phone: '1900 1286',
          address: 'TP. Hồ Chí Minh',
          userType: 'enterprise',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        }

        // Save to session storage
        sessionStorage.setItem('user', JSON.stringify(user))
        sessionStorage.setItem('isLoggedIn', 'true')
        sessionStorage.setItem('loginTime', new Date().toISOString())
        sessionStorage.setItem('userType', 'enterprise')

        dispatch({ type: 'LOGIN_SUCCESS', payload: user })
        return
      }

      throw new Error('Tài khoản hoặc mật khẩu không đúng')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại'
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage })
      throw error
    }
  }

  // Logout function
  const logout = () => {
    // Clear session storage
    sessionStorage.clear()
    
    // Clear auth state
    dispatch({ type: 'LOGOUT' })
  }

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
