
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProductStore } from "@/store/productStore";
import { useEffect } from "react";
import { ArrowRight, ShoppingBag, TrendingUp, Award, Box, RefreshCcw } from "lucide-react";

const Index = () => {
  const { products, fetchProducts, fetchCategories, categories } = useProductStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white">
          <div className="container mx-auto px-4 py-20 md:py-28">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Quality Electronic Components for Every Project
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Professional tools and components for engineers, hobbyists, and businesses
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop">
                  <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50 px-8 py-6 text-base font-semibold">
                    Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-6 text-base font-semibold">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ 
          clipPath: "ellipse(75% 100% at 50% 100%)"
        }}></div>
      </section>

      {/* Value Props Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <ShoppingBag className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Premium Selection</h3>
                <p className="text-gray-600">Carefully selected quality components from trusted manufacturers</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Industry Leading</h3>
                <p className="text-gray-600">State-of-the-art equipment and components for professionals</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Award className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Quality Guaranteed</h3>
                <p className="text-gray-600">All products undergo rigorous quality testing before shipping</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <RefreshCcw className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Quick processing and shipping to get your orders to you faster</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Browse Our Categories</h2>
            <p className="text-gray-600 mt-2">Find exactly what you need for your next project</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.name}`}
                className="transform transition-transform hover:scale-105 hover:shadow-lg"
              >
                <Card className="overflow-hidden h-full border-none shadow-md">
                  <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
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
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/shop">
              <Button variant="outline" className="border-blue-500 text-blue-700 hover:bg-blue-50">
                View All Categories <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="text-gray-600 mt-2">Top picks from our extensive catalog</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="transform transition-all duration-300 hover:scale-105 group"
              >
                <Card className="overflow-hidden h-full border border-gray-100 shadow-sm group-hover:shadow-md">
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
                    <h3 className="font-medium mb-2 group-hover:text-blue-700 line-clamp-2 h-12">
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
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/shop">
              <Button className="bg-blue-700 hover:bg-blue-800">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">What Our Customers Say</h2>
            <p className="text-gray-600 mt-2">Don't just take our word for it</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "John K.",
                role: "Electrical Engineer",
                comment: "The quality of components I've received has been consistently excellent. My go-to supplier for all electronic needs.",
              },
              {
                name: "Sarah T.",
                role: "DIY Enthusiast",
                comment: "As a hobbyist, I appreciate the vast selection and helpful customer service when I need guidance on my projects.",
              },
              {
                name: "Michael R.",
                role: "Product Developer",
                comment: "Fast shipping and reliable parts. I've been using KG Components for all my prototyping needs for years.",
              }
            ].map((testimonial, index) => (
              <Card key={index} className="overflow-hidden border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="mb-4 text-yellow-400 flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-700 flex-grow">"{testimonial.comment}"</p>
                    <div className="mt-6 flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 font-semibold">{testimonial.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Next Project?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Join thousands of satisfied customers who trust us for their electronic component needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50 px-8 py-6 text-base font-semibold">
                Start Shopping
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-6 text-base font-semibold">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-8">
              Subscribe to receive updates on new products, special offers, and useful tips for your projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 flex-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button className="bg-blue-700 hover:bg-blue-800 py-6 px-8 text-base font-semibold">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
