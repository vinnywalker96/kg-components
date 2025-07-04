'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/language-context"

export default function HomePage() {
  const { t } = useLanguage()
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('/images/hero.jpg')] bg-cover bg-center" />
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-white/80 mb-8">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/shop">
                  {t('shopNow')}
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/20" asChild>
                <Link href="/about">
                  {t('learnMore')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('browseByCategory')}</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* This will be populated from the database */}
            {Array.from({ length: 6 }).map((_, i) => {
              const categoryKey = i === 0 ? 'tools' : 
                                  i === 1 ? 'accessories' : 
                                  i === 2 ? 'components' : 
                                  i === 3 ? 'powerProducts' : 
                                  i === 4 ? 'testMeasurements' : 'kits';
              
              return (
                <Link 
                  key={i} 
                  href={`/shop?category=${t(categoryKey)}`}
                  className="group"
                >
                  <Card className="overflow-hidden h-full transition-all group-hover:shadow-lg">
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      <div className="w-16 h-16 text-primary/20">
                        {/* Placeholder icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                      </div>
                    </div>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-medium group-hover:text-primary transition-colors">
                        {t(categoryKey)}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/shop">
                {t('viewAllCategories')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('featuredProducts')}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* This will be populated from the database */}
            {Array.from({ length: 3 }).map((_, i) => {
              const categoryKey = i === 0 ? 'tools' : 
                                  i === 1 ? 'components' : 'accessories';
              
              return (
                <Card key={i} className="overflow-hidden h-full">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      {t('productImage')} {i + 1}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <div className="font-medium">{t('featuredProduct')} {i + 1}</div>
                      <div className="text-sm text-muted-foreground">
                        {t(categoryKey)}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="font-bold">${(19.99 + i * 10).toFixed(2)}</div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/product/${i + 1}`}>
                          {t('viewDetails')}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/shop">
                {t('shopAllProducts')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('whyChooseUs')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-background">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{t('qualityGuaranteed')}</h3>
                <p className="text-muted-foreground">
                  {t('qualityGuaranteedDesc')}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{t('fastShipping')}</h3>
                <p className="text-muted-foreground">
                  {t('fastShippingDesc')}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{t('expertSupport')}</h3>
                <p className="text-muted-foreground">
                  {t('expertSupportDesc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">{t('stayUpdated')}</h2>
            <p className="mb-6">
              {t('newsletterDesc')}
            </p>
            
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder={t('emailPlaceholder')}
                className="flex-grow px-4 py-2 rounded-md text-foreground"
                required
              />
              <Button variant="secondary">
                {t('subscribe')}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

