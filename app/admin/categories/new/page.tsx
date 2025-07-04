'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useSupabase } from '@/components/providers/supabase-provider'
import { toast } from '@/components/ui/use-toast'
import { useLanguage } from '@/lib/i18n/language-context'

export default function NewCategoryPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { supabase } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([formData])
        .select()

      if (error) {
        throw error
      }

      toast({
        title: t('success'),
        description: 'Category has been created successfully.',
        duration: 3000,
      })

      router.push('/admin/categories')
      router.refresh()
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || 'Failed to create category.',
        variant: 'destructive',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{t('addNewCategory')}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('categoryDetails')}</CardTitle>
          <CardDescription>
            Add a new product category to your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t('categoryName')}</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Electronics, Tools, Components"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">{t('description')}</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe this category..."
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                disabled={isLoading}
              >
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('loading') : t('createCategory')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

