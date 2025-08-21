import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nwzqbnofamhlnmasdvyo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53enFibm9mYW1obG5tYXNkdnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjcwNTAsImV4cCI6MjA3MTEwMzA1MH0.zr7lxImULkPATOOxm-TEuIHDQMLE6RA8wHe2VRLQ8Y0'


// Client Supabase unifié
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// =====================================================
// UTILITAIRES DE COMPATIBILITÉ (TEMPORAIRES)
// =====================================================

// Fonction pour formater les montants
export const formatAmount = (amount, currency = 'CHF') => {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: currency
  }).format(amount || 0)
}

// Configuration terminée - Le projet utilise maintenant exclusivement l'API fixedCategoriesApi