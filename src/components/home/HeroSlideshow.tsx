
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

interface Slide {
  imageUrl: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

interface HeroSlideshowProps {
  slides: Slide[];
}

const HeroSlideshow = ({ slides }: HeroSlideshowProps) => {
  return (
    <div className="w-full relative">
      <Carousel
        opts={{
          loop: true,
          duration: 50,
        }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-[500px]">
                <img 
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl text-white">
                      <h2 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h2>
                      <p className="text-xl mb-8 text-white/90">{slide.description}</p>
                      <Link to={slide.buttonLink}>
                        <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50 px-8 py-6 text-base font-semibold">
                          {slide.buttonText} <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      
      {/* Slide indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <div 
            key={index} 
            className="h-2 w-12 rounded-full bg-white/50 hover:bg-white/80 cursor-pointer transition-colors"
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlideshow
