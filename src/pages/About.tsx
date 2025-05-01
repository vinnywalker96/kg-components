
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">About KG Components</h1>
        
        <div className="mb-12">
          <div className="bg-blue-600 h-64 rounded-lg flex items-center justify-center mb-8">
            <h2 className="text-3xl font-bold text-white">Quality Electronic Components</h2>
          </div>
          
          <p className="text-lg mb-6">
            KG Components is a leading provider of high-quality electronic components, tools, and testing equipment for professionals, hobbyists, and businesses alike. Founded with a passion for electronics and a commitment to quality, we've been serving our customers with the best products in the industry.
          </p>
          
          <p className="text-lg">
            Our mission is to provide easy access to premium electronic components and tools, supporting innovation and creativity in the electronics field. Whether you're building a simple circuit or a complex system, we have the components you need to bring your ideas to life.
          </p>
        </div>
        
        <h2 className="text-2xl font-bold mb-6">Our Values</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4 flex justify-center">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Quality First</h3>
              <p className="text-gray-600">We source only the highest quality components from trusted manufacturers.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4 flex justify-center">🔧</div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">We constantly update our inventory with the latest technologies and components.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4 flex justify-center">👨‍💻</div>
              <h3 className="text-xl font-semibold mb-2">Customer Focus</h3>
              <p className="text-gray-600">Our customers' success is our success. We provide expert support and guidance.</p>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-2xl font-bold mb-6">Our History</h2>
        
        <div className="prose max-w-none mb-12">
          <p>
            KG Components was established in 2010 by a group of electronics engineers who were frustrated by the lack of quality components available in the market. What started as a small operation has grown into a trusted source for electronic components worldwide.
          </p>
          
          <p>
            Over the years, we've expanded our inventory to include a wide range of products across multiple categories:
          </p>
          
          <ul>
            <li><strong>Tools</strong> - Professional-grade soldering equipment, precision tools, and workstation accessories</li>
            <li><strong>Accessories</strong> - Cables, connectors, enclosures, and other essential components</li>
            <li><strong>Instruments</strong> - Precision measurement devices and specialized electronic instruments</li>
            <li><strong>Power Products</strong> - Power supplies, batteries, and energy management solutions</li>
            <li><strong>Test and Measurements</strong> - Oscilloscopes, multimeters, and other diagnostic equipment</li>
          </ul>
          
          <p>
            Today, we serve thousands of customers ranging from individual hobbyists to large corporations and educational institutions. Our dedication to quality and service remains at the core of everything we do.
          </p>
        </div>
        
        <h2 className="text-2xl font-bold mb-6">Our Team</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            { name: "John Doe", role: "CEO & Founder", description: "Electronics engineer with 20+ years of experience" },
            { name: "Jane Smith", role: "Technical Director", description: "Specializes in power electronics and testing equipment" },
            { name: "Robert Johnson", role: "Customer Relations", description: "Ensures our customers receive the best service possible" }
          ].map((member, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="h-32 w-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-center">{member.name}</h3>
                <p className="text-blue-600 text-center mb-2">{member.role}</p>
                <p className="text-gray-600 text-center">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
          <p className="mb-6">
            Connect with other electronics enthusiasts, learn from our experts, and stay updated on the latest products and technologies.
          </p>
          <div className="flex justify-center space-x-4">
            {["Facebook", "Twitter", "LinkedIn", "YouTube"].map((platform) => (
              <button key={platform} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                {platform}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
