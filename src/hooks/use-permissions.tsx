import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'
import { supabase } from '@/lib/supabase/client'

export function usePermissions() {
  const { user } = useAuth()
  const [role, setRole] = useState<string>('consultor')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    let isMounted = true
    supabase
      .from('profiles')
      .select('role_id, role')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (isMounted) {
          setRole((data?.role_id || data?.role || 'consultor').toLowerCase())
          setLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [user])

  const can = (action: string) => {
    if (role === 'admin') return true
    if (role === 'contador') {
      return ['create_empresa', 'edit_empresa', 'delete_empresa', 'edit_timeline'].includes(action)
    }
    return false
  }

  return { role, can, loading }
}
