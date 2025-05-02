
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ShoppingBag, Box, Star } from "lucide-react"
import { ProductWithCategory } from "@/types"

interface FeaturedProductsSlideshowProps {
  products: ProductWithCategory[];
  title: string;
  description?: string;
}

const FeaturedProductsSlideshow = ({ products, title, description }: FeaturedProductsSlideshowProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">{title}</h2>
          {description && <p className="text-gray-600 mt-2">{description}</p>}
        </div>
        
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {products.map((product) => (
                <CarouselItem key={product.id} className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <Link to={`/product/${product.id}`} className="block h-full group">
                    <Card className="overflow-hidden h-full border border-gray-100 shadow-sm hover:shadow-md transition-all">
                      <div className="h-52 bg-gray-50 flex items-center justify-center overflow-hidden relative">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Box className="h-12 w-12 text-gray-300" />
                          </div>
                        )}
                        
                        {/* Tag for special products */}
                        {product.id && typeof product.id === 'number' && product.id % 3 === 0 && (
                          <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                            BEST SELLER
                          </div>
                        )}
                        
                        {/* Quick add button overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <Button variant="secondary" size="sm" className="w-full bg-white hover:bg-blue-50 text-blue-700 gap-2">
                            <ShoppingBag className="h-4 w-4" /> Quick Add
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-1">
                          <div className="text-xs text-blue-600 uppercase font-semibold">
                            {product.category?.name || "Component"}
                          </div>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium ml-1">{4 + Math.random().toFixed(1)}</span>
                          </div>
                        </div>
                        <h3 className="font-medium mb-2 group-hover:text-blue-700 transition-colors line-clamp-2 h-12">
                          {product.name}
                        </h3>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-gray-900">${Number(product.price).toFixed(2)}</p>
                            {product.id && typeof product.id === 'number' && product.id % 2 === 0 && (
                              <p className="text-xs text-gray-500 line-through">${(Number(product.price) * 1.2).toFixed(2)}</p>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" className="p-0 h-8 w-8 rounded-full bg-blue-50 hover:bg-blue-100">
                            <ShoppingBag className="h-4 w-4 text-blue-700" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </Carousel>
        </div>
        
        <div className="text-center mt-8">
          <Link to="/shop">
            <Button className="bg-blue-700 hover:bg-blue-800">View All Products</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProductsSlideshow
