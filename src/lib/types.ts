// lib/types.ts
export interface Profile {
  id: string
  email: string
  role: 'user' | 'admin'
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  service_type: string
  date: string
  time_slot: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  address: string | null
  description: string | null
  surface_area: number | null
  price_estimate: number | null
  created_at: string
  profiles?: {
    email: string
    full_name: string | null
    phone: string | null
  }
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'booking' | 'quote' | 'reminder' | 'info'
  read: boolean
  created_at: string
}

export interface QuoteRequest {
  id: string
  user_id: string
  service_type: string
  surface_area: number | null
  description: string | null
  preferred_date: string | null
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  created_at: string
}

export interface DashboardStats {
  totalUsers: number
  totalBookings: number
  pendingBookings: number
  todayBookings: number
  totalMessages: number
  unreadNotifications: number
  monthlyRevenue: number
}