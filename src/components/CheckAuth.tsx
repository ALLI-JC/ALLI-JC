import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function CheckAuth() {
  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Session actuelle:', session)
      console.log('localStorage isAuthenticated:', localStorage.getItem('isAuthenticated'))
    }
    check()
  }, [])
  
  return null
}