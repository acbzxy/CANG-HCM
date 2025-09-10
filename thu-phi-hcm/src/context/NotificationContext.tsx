import React, { createContext, useContext, useReducer, useCallback } from 'react'
import type { Notification, NotificationType } from '../types'

// Notification state
interface NotificationState {
  notifications: Notification[]
}

// Notification actions
type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL' }

// Notification context type
interface NotificationContextType {
  notifications: Notification[]
  addNotification: (
    message: string,
    type?: NotificationType,
    title?: string,
    options?: Partial<Notification>
  ) => string
  removeNotification: (id: string) => void
  clearAll: () => void
  showSuccess: (message: string, title?: string) => string
  showError: (message: string, title?: string) => string
  showWarning: (message: string, title?: string) => string
  showInfo: (message: string, title?: string) => string
}

// Initial state
const initialState: NotificationState = {
  notifications: [],
}

// Notification reducer
const notificationReducer = (
  state: NotificationState,
  action: NotificationAction
): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      }
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        ),
      }
    case 'CLEAR_ALL':
      return {
        ...state,
        notifications: [],
      }
    default:
      return state
  }
}

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Notification provider component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState)

  // Add notification
  const addNotification = useCallback(
    (
      message: string,
      type: NotificationType = 'info',
      title?: string,
      options: Partial<Notification> = {}
    ): string => {
      const id = generateId()
      const notification: Notification = {
        id,
        type,
        message,
        title,
        duration: 5000,
        autoClose: true,
        ...options,
      }

      dispatch({ type: 'ADD_NOTIFICATION', payload: notification })

      // Auto remove notification if autoClose is enabled
      if (notification.autoClose && notification.duration) {
        setTimeout(() => {
          dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
        }, notification.duration)
      }

      return id
    },
    []
  )

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
  }, [])

  // Clear all notifications
  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' })
  }, [])

  // Convenience methods
  const showSuccess = useCallback(
    (message: string, title?: string) => addNotification(message, 'success', title),
    [addNotification]
  )

  const showError = useCallback(
    (message: string, title?: string) => addNotification(message, 'error', title),
    [addNotification]
  )

  const showWarning = useCallback(
    (message: string, title?: string) => addNotification(message, 'warning', title),
    [addNotification]
  )

  const showInfo = useCallback(
    (message: string, title?: string) => addNotification(message, 'info', title),
    [addNotification]
  )

  const value: NotificationContextType = {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

// Custom hook to use notification context
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
