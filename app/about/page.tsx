import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About KG-Components",
  description: "Learn about KG-Components, your trusted source for electronic components and tools.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">About KG-Components</h1>
          <p className="text-muted-foreground">
            Your trusted source for electronic components and tools
          </p>
        </div>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="mb-4">
              KG-Components was founded in 2023 with a simple mission: to provide electronics enthusiasts, 
              makers, and professionals with high-quality components at competitive prices. What started as 
              a small operation has grown into a comprehensive electronic components supplier serving 
              customers worldwide.
            </p>
            <p>
              We understand the frustration of working on a project only to discover you&apos;re missing a 
              critical component or receiving poor-quality parts that don&apos;t work as expected. That&apos;s why 
              we&apos;ve built our business around reliability, quality, and excellent customer service.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p>
              Our mission is to empower creators and innovators by providing reliable electronic 
              components, tools, and resources. We believe that everyone should have access to the 
              components they need to bring their ideas to life, whether they&apos;re a hobbyist working 
              on their first Arduino project or a professional engineer developing cutting-edge technology.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">What Sets Us Apart</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">Quality Assurance</h3>
                <p>
                  Every component we sell undergoes rigorous quality testing to ensure it meets our 
                  high standards. We source directly from reputable manufacturers and authorized 
                  distributors to guarantee authenticity.
                </p>
              </div>
              
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">Extensive Selection</h3>
                <p>
                  From resistors and capacitors to microcontrollers and development boards, we offer 
                  a comprehensive range of components for all your electronic needs. Our catalog is 
                  constantly expanding to include the latest technologies.
                </p>
              </div>
              
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">Expert Support</h3>
                <p>
                  Our team consists of electronics enthusiasts and professionals who understand your 
                  needs. We&apos;re always ready to help you find the right components for your project 
                  or answer any technical questions.
                </p>
              </div>
              
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">Fast Shipping</h3>
                <p>
                  We know that waiting for components can delay your entire project. That&apos;s why we 
                  process orders quickly and offer expedited shipping options to get your components 
                  to you as soon as possible.
                </p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="mb-4">
              Behind KG-Components is a team of passionate electronics enthusiasts, engineers, and 
              customer service professionals dedicated to providing you with the best possible experience.
            </p>
            <p>
              Our team members bring diverse backgrounds and expertise in electronics, from analog 
              circuit design to embedded systems programming. This collective knowledge allows us to 
              better understand and serve the needs of our customers.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Sustainability Commitment</h2>
            <p className="mb-4">
              We&apos;re committed to reducing our environmental impact. We use eco-friendly packaging 
              materials whenever possible and are continuously working to optimize our operations 
              for sustainability.
            </p>
            <p>
              Additionally, we offer resources on proper electronic waste disposal and participate 
              in recycling programs for electronic components and devices.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
            <p className="mb-4">
              KG-Components is more than just a supplier—we&apos;re a community of makers, creators, and 
              innovators. Follow us on social media to stay updated on new products, technical tips, 
              and inspiring projects from our community.
            </p>
            <p>
              We also regularly publish tutorials, project ideas, and technical articles on our blog 
              to help you make the most of your electronic components.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

