
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Category } from "@/types"

interface CategoriesSlideshowProps {
  categories: Category[];
  title: string;
  description?: string;
}

const CategoriesSlideshow = ({ categories, title, description }: CategoriesSlideshowProps) => {
  return (
    <section className="py-16 bg-gray-50">
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
              {categories.map((category) => (
                <CarouselItem key={category.id} className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                  <Link
                    to={`/shop?category=${category.name}`}
                    className="transform transition-transform hover:scale-105 hover:shadow-lg block h-full"
                  >
                    <Card className="overflow-hidden h-full border-none shadow-md">
                      <div className="h-32 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                        <div className="text-xl font-semibold text-white">
                          {category.name}
                        </div>
                      </div>
                      <CardContent className="p-4 bg-white">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {category.description || `Browse our selection of ${category.name.toLowerCase()}`}
                        </p>
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

export default CategoriesSlideshow
