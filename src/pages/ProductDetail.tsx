
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProductStore } from "@/store/productStore";
import { useCartStore } from "@/store/cartStore";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Minus, Plus, ShoppingCart, Cpu, CircuitBoard } from "lucide-react";
import ComponentViewer from "@/components/three/ComponentViewer";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { products, fetchProducts, getProductById, isLoading } = useProductStore();
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const [showThreeDView, setShowThreeDView] = useState(false);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  const product = productId ? getProductById(productId) : undefined;

  // Determine the component type based on the product category or name
  const getComponentType = () => {
    if (!product) return 'generic';
    
    const name = product.name.toLowerCase();
    const category = product.category?.name.toLowerCase() || '';
    
    if (name.includes('resistor') || category.includes('resistor')) {
      return 'resistor';
    } else if (name.includes('capacitor') || category.includes('capacitor')) {
      return 'capacitor';
    } else if (name.includes('ic') || name.includes('chip') || name.includes('microcontroller') || name.includes('processor')) {
      return 'ic';
    } else {
      return 'generic';
    }
  };

  const handleDecrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrementQuantity = () => {
    if (product && quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
    }
  };

  const toggleRotate = () => {
    setIsRotating(!isRotating);
  };

  const toggleThreeDView = () => {
    setShowThreeDView(!showThreeDView);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="h-96 w-full md:w-1/2" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <div className="space-y-2 pt-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/shop">
            <Button>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Link to="/shop" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Shop
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <div 
              className={`bg-gray-100 h-96 flex items-center justify-center rounded-lg overflow-hidden component-card ${isRotating ? 'animate-pulse' : ''}`}
              onClick={toggleRotate}
            >
              {showThreeDView ? (
                <ComponentViewer 
                  componentType={getComponentType()} 
                  className="w-full h-full" 
                />
              ) : (
                product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className={`h-full w-full object-contain transition-all duration-1000 ${isRotating ? 'rotate-y-180' : ''}`}
                    style={{ transformStyle: 'preserve-3d' }}
                  />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center justify-center">
                    <CircuitBoard className="h-16 w-16 mb-4 text-blue-300" />
                    <span>No image available</span>
                    <span className="text-sm mt-2 text-blue-400">Click to see component details</span>
                  </div>
                )
              )}
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-center text-sm text-gray-500">Click image to rotate</p>
              <Button
                onClick={toggleThreeDView}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {showThreeDView ? "Show Photo" : "View 3D Model"}
              </Button>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-2 flex items-center">
              <span className="led-indicator"></span>
              <span className="text-sm text-green-600 font-medium">
                Electronic Component
              </span>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-blue-600 mb-4">
              ${Number(product.price).toFixed(2)}
            </p>

            {product.category && (
              <div className="mb-4">
                <Link
                  to={`/shop?category=${product.category.name}`}
                  className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {product.category.name}
                </Link>
              </div>
            )}

            <div className="prose mb-6">
              <p>{product.description}</p>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-semibold flex items-center mb-2">
                <Cpu className="mr-2 h-4 w-4 text-blue-600" />
                Technical Specifications
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Manufacturer: {product.category?.name || "Unknown"}</li>
                <li>SKU: {product.id.substring(0, 8)}</li>
                <li>Condition: New</li>
                <li>Warranty: 1 Year Limited</li>
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-1">Availability:</p>
              {product.stock_quantity > 0 ? (
                <p className="text-green-600">
                  In Stock ({product.stock_quantity} available)
                </p>
              ) : (
                <p className="text-red-600">Out of Stock</p>
              )}
            </div>

            {product.stock_quantity > 0 && (
              <>
                <div className="flex items-center space-x-4 mb-6">
                  <p className="text-gray-700">Quantity:</p>
                  <div className="flex items-center border rounded-md shadow-sm">
                    <button
                      onClick={handleDecrementQuantity}
                      className="px-3 py-1 text-gray-700 hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-1 border-x">{quantity}</span>
                    <button
                      onClick={handleIncrementQuantity}
                      className="px-3 py-1 text-gray-700 hover:bg-gray-100"
                      disabled={quantity >= product.stock_quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="w-full md:w-auto component-card"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Related Products with Enhanced 3D Cards */}
        {products.length > 1 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {products
                .filter(
                  (p) =>
                    p.category_id === product.category_id && p.id !== product.id
                )
                .slice(0, 4)
                .map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    to={`/product/${relatedProduct.id}`}
                  >
                    <Card className="overflow-hidden h-full component-card">
                      <div className="h-40 bg-gray-100 flex items-center justify-center">
                        {relatedProduct.image_url ? (
                          <img
                            src={relatedProduct.image_url}
                            alt={relatedProduct.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="text-gray-400 flex items-center justify-center">
                            <CircuitBoard className="h-10 w-10 text-blue-300" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1">{relatedProduct.name}</h3>
                        <p className="font-bold text-blue-600">
                          ${Number(relatedProduct.price).toFixed(2)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
