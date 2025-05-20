import { Separator } from "@/components/ui/separator"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | KG-Components",
  description: "Learn about KG-Components, our mission, values, and team.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About KG-Components</h1>
        <Separator className="mb-8" />

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              Founded in 2010, KG-Components started as a small electronics shop
              serving local hobbyists and professionals. Over the years, we've
              grown into a trusted online retailer of high-quality electronic
              components, tools, and test equipment. Our mission is to provide
              electronics enthusiasts, engineers, and makers with the
              components they need to bring their ideas to life.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              At KG-Components, we believe that everyone should have access to
              high-quality electronic components at fair prices. We're committed
              to supporting the maker community, educational institutions, and
              professional engineers by providing reliable components, excellent
              customer service, and technical support. Our goal is to be your
              trusted partner in all your electronic projects.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Quality Assurance</h2>
            <p className="text-gray-700 leading-relaxed">
              We understand that reliability is crucial in electronics. That's
              why we carefully select our suppliers and test our products to
              ensure they meet the highest standards. We work directly with
              manufacturers and authorized distributors to provide authentic
              components with full traceability. Our quality control process
              includes visual inspection, functional testing, and performance
              verification to ensure that every component we sell meets our
              strict quality standards.
            </p>
          </section>

          <section className="bg-blue-50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-2 text-blue-700">Quality</h3>
                <p className="text-gray-700">
                  We never compromise on the quality of our products. We source
                  from reputable manufacturers and perform rigorous testing.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-2 text-blue-700">Integrity</h3>
                <p className="text-gray-700">
                  We operate with honesty and transparency in all our business
                  practices, from pricing to product descriptions.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-2 text-blue-700">Innovation</h3>
                <p className="text-gray-700">
                  We continuously update our inventory with the latest
                  components to support cutting-edge projects.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-2 text-blue-700">Education</h3>
                <p className="text-gray-700">
                  We support learning and skill development by providing
                  resources and special pricing for educational institutions.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our team consists of passionate electronics enthusiasts,
              engineers, and customer service professionals who are dedicated to
              providing you with the best possible experience. Many of our team
              members have backgrounds in electrical engineering, computer
              science, and maker communities, bringing their expertise and
              passion to help you find the right components for your projects.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">👨‍💼</span>
                </div>
                <h3 className="font-semibold">Kevin Grant</h3>
                <p className="text-gray-600">Founder & CEO</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">👩‍🔧</span>
                </div>
                <h3 className="font-semibold">Grace Chen</h3>
                <p className="text-gray-600">Technical Director</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">👨‍🔬</span>
                </div>
                <h3 className="font-semibold">Michael Rodriguez</h3>
                <p className="text-gray-600">Quality Assurance Manager</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
            <p className="text-gray-700 leading-relaxed">
              We're more than just a store – we're a community of makers,
              engineers, and electronics enthusiasts. Follow us on social media,
              subscribe to our newsletter, and join our forums to connect with
              like-minded individuals, share your projects, and get inspired.
              We regularly host workshops, webinars, and contests to engage with
              our community and promote learning and innovation.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

