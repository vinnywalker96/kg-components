'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n/language-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'

export default function LanguageSettingsPage() {
  const { language, setLanguage, t } = useLanguage()
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'pt'>(language)

  const handleSaveLanguage = () => {
    setLanguage(selectedLanguage)
    toast({
      title: t('success'),
      description: `Language has been updated to ${selectedLanguage === 'en' ? 'English' : 'Portuguese'}.`,
      duration: 3000,
    })
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{t('language')} {t('settings')}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('language')} {t('settings')}</CardTitle>
          <CardDescription>
            Choose the default language for the site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedLanguage}
            onValueChange={(value) => setSelectedLanguage(value as 'en' | 'pt')}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="en" id="en" />
              <Label htmlFor="en">🇺🇸 English (en)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pt" id="pt" />
              <Label htmlFor="pt">🇧🇷 Português (pt)</Label>
            </div>
          </RadioGroup>
          
          <div className="mt-6 space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Current language: <span className="font-medium">{language}</span></p>
              <p className="mt-1">This setting will apply to all pages and will be saved for your next visit.</p>
            </div>
            
            <Button 
              onClick={handleSaveLanguage} 
            >
              {t('save')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

