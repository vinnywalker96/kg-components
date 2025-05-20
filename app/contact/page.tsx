import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"
import { Faq } from "@/components/contact/faq"
import { Separator } from "@/components/ui/separator"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | KG-Components",
  description: "Get in touch with KG-Components. We're here to help with your electronic component needs.",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <Separator className="mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="md:col-span-1">
            <ContactInfo />
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <ContactForm />
            
            {/* Map */}
            <div className="mt-8 rounded-lg overflow-hidden h-64 bg-gray-200">
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <p>Map will be displayed here</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <Faq />
        </div>
      </div>
    </div>
  )
}

