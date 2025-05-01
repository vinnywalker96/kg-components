
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useProductStore } from "@/store/productStore";
import { useCartStore } from "@/store/cartStore";
import { ProductWithCategory } from "@/types";
import { Search, ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const Shop = () => {
  const { products, categories, isLoading, fetchProducts, fetchCategories, searchProducts } = useProductStore();
  const { addToCart } = useCartStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const categoryParam = searchParams.get("category");

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (categoryParam) {
      const category = categories.find(
        (cat) => cat.name.toLowerCase() === categoryParam.toLowerCase()
      );
      if (category) {
        fetchProducts(category.id);
      } else {
        fetchProducts();
      }
    } else {
      fetchProducts();
    }
  }, [categoryParam, categories, fetchProducts]);

  const handleCategoryClick = (categoryName: string) => {
    setSearchParams({ category: categoryName });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchProducts(searchQuery);
  };

  const handleAddToCart = (product: ProductWithCategory) => {
    addToCart(product.id, 1);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <div className="space-y-2">
              <button
                className={`w-full text-left py-2 px-4 rounded-md ${
                  !categoryParam ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                }`}
                onClick={() => setSearchParams({})}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`w-full text-left py-2 px-4 rounded-md ${
                    categoryParam?.toLowerCase() === category.name.toLowerCase()
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h1 className="text-3xl font-bold">
              {categoryParam || "All Products"}
            </h1>

            <form onSubmit={handleSearch} className="flex max-w-sm">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none"
              />
              <Button
                type="submit"
                className="rounded-l-none"
                variant="outline"
                size="icon"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-8 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-500">No products found</p>
              {searchQuery && (
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchQuery("");
                    fetchProducts(
                      categoryParam
                        ? categories.find(
                            (cat) =>
                              cat.name.toLowerCase() === categoryParam.toLowerCase()
                          )?.id
                        : undefined
                    );
                  }}
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <Link to={`/product/${product.id}`}>
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
                  </Link>
                  <CardContent className="p-4">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-semibold mb-2">{product.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">
                      {product.description?.substring(0, 60)}
                      {(product.description?.length || 0) > 60 && "..."}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <p className="font-bold text-blue-600">
                        ${Number(product.price).toFixed(2)}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock_quantity < 1}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.stock_quantity < 1 ? "Out of stock" : "Add to Cart"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
