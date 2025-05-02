
import { useState, useEffect } from "react"
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
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="w-full relative">
      <Carousel
        opts={{
          loop: true,
          duration: 50,
          startIndex: currentSlide,
        }}
        className="w-full"
        // Fix: Change the onSelect handler to correctly handle the number index
        onSelect={(index: number) => setCurrentSlide(index)}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-[600px] overflow-hidden">
                <img 
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover hero-image transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/60 to-transparent flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl text-white">
                      <h2 className="text-4xl md:text-5xl font-bold mb-4 hero-title">{slide.title}</h2>
                      <p className="text-xl mb-8 text-white/90 hero-description">{slide.description}</p>
                      <Link to={slide.buttonLink} className="hero-button">
                        <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50 px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
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
        <CarouselPrevious className="left-4 z-10" />
        <CarouselNext className="right-4 z-10" />
      </Carousel>
      
      {/* Slide indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, index) => (
          <div 
            key={index} 
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-12 rounded-full cursor-pointer transition-colors duration-300 ${
              index === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlideshow
