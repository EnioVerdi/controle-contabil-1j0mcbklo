// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

// Import the supabase client like this:
// import { supabase } from "@/lib/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: async (url, options) => {
      // Intercept HEAD requests to prevent JSON parse errors in the sandbox network interceptor.
      // Changing the method to GET with limit=1 ensures a valid JSON body is returned,
      // while Supabase client will still correctly extract the exact count from the headers.
      if (options?.method === 'HEAD') {
        const urlObj = new URL(url.toString())
        urlObj.searchParams.set('limit', '1')
        return fetch(urlObj.toString(), {
          ...options,
          method: 'GET',
        })
      }
      return fetch(url, options)
    },
  },
})
