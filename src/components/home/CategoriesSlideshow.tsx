
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Category } from "@/types"
import { Button } from "@/components/ui/button"

interface CategoriesSlideshowProps {
  categories: Category[];
  title: string;
  description?: string;
}

const categoryBackgrounds = [
  "from-blue-600 to-blue-800",
  "from-indigo-600 to-indigo-800",
  "from-purple-600 to-purple-800",
  "from-cyan-600 to-cyan-800",
  "from-teal-600 to-teal-800",
  "from-green-600 to-green-800",
]

const CategoryIcon = ({ category }: { category: string }) => {
  // Simplified icon selection based on category name
  const iconPath = () => {
    switch (category.toLowerCase()) {
      case "tools":
        return "M13 10V3L4 14h7v7l9-11h-7z";
      case "components":
        return "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z";
      case "test and measurements":
        return "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z";
      case "accessories":
        return "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z";
      default:
        return "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z";
    }
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-10 w-10 text-white opacity-80"
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d={iconPath()}
      />
    </svg>
  );
};

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
              {categories.map((category, index) => (
                <CarouselItem key={category.id} className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                  <Link
                    to={`/shop?category=${category.name}`}
                    className="block h-full transform transition-all hover:scale-105 duration-300"
                  >
                    <Card className="overflow-hidden h-full border-none shadow-md">
                      <div className={`h-40 bg-gradient-to-br ${categoryBackgrounds[index % categoryBackgrounds.length]} flex flex-col items-center justify-center p-6 text-center`}>
                        <CategoryIcon category={category.name} />
                        <div className="text-xl font-semibold text-white mt-4">
                          {category.name}
                        </div>
                      </div>
                      <CardContent className="p-4 bg-white">
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {category.description || `Browse our selection of ${category.name.toLowerCase()}`}
                        </p>
                        <Button variant="outline" size="sm" className="w-full text-blue-700 border-blue-200 hover:bg-blue-50">
                          View Products
                        </Button>
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
