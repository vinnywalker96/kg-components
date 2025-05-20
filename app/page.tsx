import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function HomePage() {
  const supabase = createClient()
  
  // Get featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name)
    `)
    .limit(4)
  
  // Get categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .limit(5)
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-muted/40">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Quality Electronic Components for Your Projects
              </h1>
              <p className="text-xl text-muted-foreground">
                From hobbyists to professionals, we provide the electronic components you need to bring your ideas to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/account">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/about">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
            <div className="bg-muted rounded-lg aspect-square md:aspect-video overflow-hidden">
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                Hero Image
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our wide selection of electronic components, tools, and accessories.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories?.map((category) => (
              <Link
                key={category.id}
                href={`/account?category=${category.id}`}
                className="group block"
              >
                <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3 transition-transform group-hover:scale-105">
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    {category.name}
                  </div>
                </div>
                <h3 className="font-medium text-center">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button variant="outline" asChild>
              <Link href="/account">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts?.map((product) => (
              <div key={product.id} className="border rounded-lg overflow-hidden bg-card">
                <div className="aspect-square bg-muted">
                  {product.image_url ? (
                    <div 
                      className="h-full w-full bg-cover bg-center" 
                      style={{ backgroundImage: `url(${product.image_url})` }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="mb-2">
                    <div className="font-medium line-clamp-1">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {product.category?.name}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="font-bold">${product.price.toFixed(2)}</div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/product/${product.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose KG-Components</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing quality components and exceptional service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-muted-foreground">
                All our components are tested and guaranteed to meet specifications.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-muted-foreground">
                Quick processing and shipping to get your components to you faster.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-muted-foreground">
                Our team of experts is ready to help with any questions or issues.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Browse our extensive catalog of electronic components and find exactly what you need.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/account">
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

