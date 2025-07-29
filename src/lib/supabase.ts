import { createClient } from '@supabase/supabase-js'
import type { Product, Category, Profile, CartItem, WishlistItem, Order } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export types from centralized location
export type { Product, Category, Profile, CartItem, WishlistItem, Order }