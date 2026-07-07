// context/NotificationContext.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Notification } from '../lib/types'

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Récupérer l'utilisateur courant
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id)
        fetchNotifications(data.user.id)
      }
    })

    // Écouter les nouvelles notifications en temps réel
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          if (payload.new.user_id === userId) {
            setNotifications(prev => [payload.new as Notification, ...prev])
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  async function fetchNotifications(userId: string) {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)
    
    setNotifications(data || [])
  }

  async function markAsRead(id: string) {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
    
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  async function markAllAsRead() {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
    
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  async function addNotification(notification: Omit<Notification, 'id' | 'created_at' | 'read'>) {
    await supabase
      .from('notifications')
      .insert(notification)
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}