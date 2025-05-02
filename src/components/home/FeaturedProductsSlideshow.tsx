
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ShoppingBag, Box } from "lucide-react"
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
                  <Link to={`/product/${product.id}`} className="block h-full">
                    <Card className="overflow-hidden h-full border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Box className="h-12 w-12 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="text-xs text-blue-600 mb-1 uppercase font-semibold">
                          {product.category?.name || "Component"}
                        </div>
                        <h3 className="font-medium mb-2 hover:text-blue-700 line-clamp-2 h-12">
                          {product.name}
                        </h3>
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-gray-900">${Number(product.price).toFixed(2)}</p>
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
      </div>
    </section>
  )
}

export default FeaturedProductsSlideshow
