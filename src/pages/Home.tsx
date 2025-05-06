
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProductStore } from "@/store/productStore";
import { ArrowRight } from "lucide-react";

const Home = () => {
  const { products, fetchProducts, fetchCategories, categories } = useProductStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Beautiful Background */}
      <section 
        className="bg-cover bg-center text-white relative"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 20, 50, 0.7), rgba(0, 20, 50, 0.7)), url('https://images.unsplash.com/photo-1580508174046-170816f65662?q=80&w=1470&auto=format&fit=crop')",
          height: "600px"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-transparent" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 h-full flex items-center">
          <div className="max-w-3xl mx-auto text-center backdrop-blur-sm bg-black/20 p-8 rounded-lg border border-white/10 shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Quality Electronic Components for Every Project
            </h1>
            <p className="text-xl mb-8">
              Discover our comprehensive range of tools, instruments, and
              components for professionals and hobbyists alike.
            </p>
            <Link to="/shop">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section with Gradient Background */}
      <section className="py-16 relative overflow-hidden" style={{
        backgroundImage: "linear-gradient(90deg, hsla(221, 45%, 98%, 1) 0%, hsla(220, 78%, 95%, 1) 100%)"
      }}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500" />
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Browse Our Categories
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Explore our extensive collection of electronic components organized by category
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.name}`}
                className="transform hover:scale-105 transition duration-300"
              >
                <Card className="overflow-hidden h-full shadow-lg hover:shadow-xl border-0">
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
                    <div className="text-2xl font-bold text-white">
                      {category.name}
                    </div>
                  </div>
                  <CardContent className="p-4 bg-white">
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section with Subtle Background */}
      <section className="py-16" style={{
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=3000&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center"
      }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Featured Products
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our most popular and highly recommended electronic components
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="transform hover:scale-105 transition duration-300"
              >
                <Card className="overflow-hidden h-full shadow-lg hover:shadow-xl border-0">
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400">No image</div>
                    )}
                  </div>
                  <CardContent className="p-6 bg-white">
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {product.description?.substring(0, 60)}
                      {(product.description?.length || 0) > 60 && "..."}
                    </p>
                    <p className="font-bold text-blue-600">${Number(product.price).toFixed(2)}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/shop">
              <Button className="bg-blue-700 hover:bg-blue-800">View All Products <ArrowRight className="ml-2 h-5 w-5" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section with Color Background */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Why Choose KG Components
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We pride ourselves on offering the best experience for electronics enthusiasts
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                ⭐
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Products</h3>
              <p className="text-gray-600">
                All our products are carefully selected from trusted manufacturers
                and undergo rigorous quality testing.
              </p>
            </div>
            <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                🚚
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
              <p className="text-gray-600">
                We ensure quick processing and shipping to get your components to
                you when you need them.
              </p>
            </div>
            <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                👨‍💻
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Support</h3>
              <p className="text-gray-600">
                Our team of technical experts is always ready to help you with
                product selection and technical advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section with Beautiful Background */}
      <section className="py-16 text-white relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{
          backgroundImage: "linear-gradient(rgba(0, 20, 80, 0.8), rgba(0, 20, 80, 0.8)), url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=3000&auto=format&fit=crop')",
          backgroundAttachment: "fixed"
        }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-2xl mx-auto backdrop-blur-sm bg-black/20 p-8 rounded-lg border border-white/10 shadow-xl">
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated with Our Newsletter
            </h2>
            <p className="text-lg mb-6">
              Subscribe to receive updates on new products, special offers, and
              useful tips for your electronic projects.
            </p>
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-white text-gray-800"
              />
              <Button className="bg-white text-blue-700 hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Input = ({ className, ...props }) => (
  <input
    className={`px-4 py-2 rounded-md flex-1 border-0 ${className}`}
    {...props}
  />
);

export default Home;
