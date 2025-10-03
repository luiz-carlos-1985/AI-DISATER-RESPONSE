import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

interface NotificationSystemProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
}

const colors = {
  success: 'from-green-500 to-emerald-500',
  error: 'from-red-500 to-pink-500',
  warning: 'from-yellow-500 to-orange-500',
  info: 'from-blue-500 to-cyan-500'
}

export default function NotificationSystem({ notifications, onRemove }: NotificationSystemProps) {
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    
    notifications.forEach(notification => {
      if (notification.duration) {
        const timer = setTimeout(() => {
          onRemove(notification.id)
        }, notification.duration)
        timers.push(timer)
      }
    })
    
    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [notifications, onRemove])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = icons[notification.type]
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.3 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
              className="glass rounded-lg p-4 shadow-lg"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${colors[notification.type]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <p className="text-xs text-gray-300 mt-1">{notification.message}</p>
                </div>
                <button
                  onClick={() => onRemove(notification.id)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}`
    setNotifications(prev => [...prev, { ...notification, id }])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const showSuccess = (title: string, message: string, duration = 5000) => {
    addNotification({ type: 'success', title, message, duration })
  }

  const showError = (title: string, message: string, duration = 7000) => {
    addNotification({ type: 'error', title, message, duration })
  }

  const showWarning = (title: string, message: string, duration = 6000) => {
    addNotification({ type: 'warning', title, message, duration })
  }

  const showInfo = (title: string, message: string, duration = 5000) => {
    addNotification({ type: 'info', title, message, duration })
  }

  return {
    notifications,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}