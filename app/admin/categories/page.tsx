'use client'

import { Button } from '@/components/ui/button'
import { CategoriesTable } from '@/components/admin/categories/categories-table'
import { useSupabase } from '@/components/providers/supabase-provider'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'
import { useEffect, useState } from 'react'

export default function AdminCategoriesPage() {
  const { t } = useLanguage()
  const { supabase } = useSupabase()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        // Get categories with product count
        const { data, error } = await supabase
          .from('categories')
          .select(`
            *,
            products:products(count)
          `)
          .order('name', { ascending: true })
        
        if (error) {
          throw error
        }
        
        // Transform data to include product count
        const categoriesWithCount = data?.map(category => ({
          ...category,
          product_count: category.products.length
        })) || []
        
        setCategories(categoriesWithCount)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategories()
  }, [supabase])
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('categories')}</h1>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            {t('addNewCategory')}
          </Link>
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-10">{t('loading')}</div>
      ) : (
        <CategoriesTable categories={categories} />
      )}
    </div>
  )
}

