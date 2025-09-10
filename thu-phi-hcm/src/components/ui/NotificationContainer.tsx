import React from 'react'
import { useNotification } from '../../context/NotificationContext'
import Toast from './Toast'

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification()

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          id={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={notification.duration || 5000}
          onClose={removeNotification}
        />
      ))}
    </div>
  )
}

export default NotificationContainer
