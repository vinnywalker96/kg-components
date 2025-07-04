'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useSupabase } from '@/components/providers/supabase-provider'
import { toast } from '@/components/ui/use-toast'
import { useLanguage } from '@/lib/i18n/language-context'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Trash2 } from 'lucide-react'

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage()
  const router = useRouter()
  const { supabase } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [productCount, setProductCount] = useState(0)

  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('categories')
          .select(`
            *,
            products:products(count)
          `)
          .eq('id', params.id)
          .single()

        if (error) {
          throw error
        }

        if (data) {
          setFormData({
            name: data.name,
            description: data.description || ''
          })
          setProductCount(data.products.length)
        }
      } catch (error: any) {
        toast({
          title: t('error'),
          description: error.message || 'Failed to load category.',
          variant: 'destructive',
          duration: 3000,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategory()
  }, [params.id, supabase, t])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('categories')
        .update(formData)
        .eq('id', params.id)

      if (error) {
        throw error
      }

      toast({
        title: t('success'),
        description: 'Category has been updated successfully.',
        duration: 3000,
      })

      router.push('/admin/categories')
      router.refresh()
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || 'Failed to update category.',
        variant: 'destructive',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', params.id)

      if (error) {
        throw error
      }

      toast({
        title: t('success'),
        description: 'Category has been deleted successfully.',
        duration: 3000,
      })

      router.push('/admin/categories')
      router.refresh()
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || 'Failed to delete category.',
        variant: 'destructive',
        duration: 3000,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('editCategory')}</h1>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isDeleting || productCount > 0}>
              <Trash2 className="mr-2 h-4 w-4" />
              {t('delete')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('confirmDeletion')}</AlertDialogTitle>
              <AlertDialogDescription>
                {productCount > 0 
                  ? `This category cannot be deleted because it contains ${productCount} products. Please reassign or delete these products first.`
                  : 'Are you sure you want to delete this category? This action cannot be undone.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
              {productCount === 0 && (
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? t('loading') : t('delete')}
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('categoryDetails')}</CardTitle>
          <CardDescription>
            Edit your product category
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
                {isLoading ? t('loading') : t('save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

