import { CategoriesSection } from "@/components/home/categories-section"
import { FeaturedProductsSection } from "@/components/home/featured-products-section"
import { HeroSection } from "@/components/home/hero-section"
import { NewsletterSection } from "@/components/home/newsletter-section"
import { WhyChooseUsSection } from "@/components/home/why-choose-us-section"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <WhyChooseUsSection />
      <NewsletterSection />
    </div>
  )
}

