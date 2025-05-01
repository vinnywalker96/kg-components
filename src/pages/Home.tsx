
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProductStore } from "@/store/productStore";

const Home = () => {
  const { products, fetchProducts, fetchCategories, categories } = useProductStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Quality Electronic Components for Every Project
            </h1>
            <p className="text-xl mb-8">
              Discover our comprehensive range of tools, instruments, and
              components for professionals and hobbyists alike.
            </p>
            <Link to="/shop">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Browse Our Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.name}`}
                className="transform hover:scale-105 transition duration-200"
              >
                <Card className="overflow-hidden h-full">
                  <div className="h-32 bg-blue-100 flex items-center justify-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {category.name}
                    </div>
                  </div>
                  <CardContent className="p-4">
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

      {/* Featured Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="transform hover:scale-105 transition duration-200"
              >
                <Card className="overflow-hidden h-full">
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
                  <CardContent className="p-4">
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
          <div className="text-center mt-8">
            <Link to="/shop">
              <Button>View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose KG Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                ⭐
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Products</h3>
              <p className="text-gray-600">
                All our products are carefully selected from trusted manufacturers
                and undergo rigorous quality testing.
              </p>
            </div>
            <div className="p-6">
              <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                🚚
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
              <p className="text-gray-600">
                We ensure quick processing and shipping to get your components to
                you when you need them.
              </p>
            </div>
            <div className="p-6">
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

      {/* Newsletter Section */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated with Our Newsletter
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Subscribe to receive updates on new products, special offers, and
            useful tips for your electronic projects.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              placeholder="Your email address"
              className="bg-white text-gray-800"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Subscribe
            </Button>
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
