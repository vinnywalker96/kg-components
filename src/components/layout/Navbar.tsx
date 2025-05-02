
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAdmin, signOut } = useAuthStore();
  const { items, fetchCart } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className={`sticky top-0 z-10 transition-all duration-300 ${
      scrolled ? "bg-white shadow-md" : "bg-white/90 backdrop-blur-sm"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col">
          {/* Top Bar */}
          <div className="py-2 border-b border-gray-100 hidden md:block">
            <div className="flex justify-between items-center text-sm">
              <div className="text-gray-500">
                Quality Electronic Components Since 2010
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/shipping" className="text-gray-600 hover:text-blue-700">Shipping</Link>
                <Link to="/terms" className="text-gray-600 hover:text-blue-700">Terms</Link>
                <Link to="/privacy" className="text-gray-600 hover:text-blue-700">Privacy</Link>
              </div>
            </div>
          </div>
          
          {/* Main Navigation */}
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center">
              <Link to="/" className="text-xl md:text-2xl font-bold text-blue-700">
                KG<span className="text-slate-800">Components</span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 mx-12">
              <form onSubmit={handleSearchSubmit} className="w-full max-w-lg mx-auto relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full px-4 py-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium hover:text-blue-700 transition-colors ${
                    location.pathname === item.path
                      ? "text-blue-700 border-b-2 border-blue-700 pb-1"
                      : "text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/favorites" className="text-gray-700 hover:text-blue-700">
                <Heart className="h-5 w-5" />
              </Link>
              
              {user ? (
                <>
                  <Link to="/cart" className="relative">
                    <ShoppingCart className="h-5 w-5 text-gray-700 hover:text-blue-700" />
                    {items.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-blue-700">
                        {items.length}
                      </Badge>
                    )}
                  </Link>
                  
                  <div className="relative group">
                    <Button variant="ghost" className="p-2 rounded-full hover:bg-gray-100">
                      <User className="h-5 w-5" />
                    </Button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                      <div className="py-2 px-4 border-b border-gray-100">
                        <p className="font-medium text-sm">My Account</p>
                      </div>
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <Link to="/auth">
                  <Button className="bg-blue-700 hover:bg-blue-800">Sign In</Button>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              {user && (
                <Link to="/cart" className="relative mr-4">
                  <ShoppingCart className="h-6 w-6 text-gray-700" />
                  {items.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-blue-600">
                      {items.length}
                    </Badge>
                  )}
                </Link>
              )}
              <button
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-2">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/account"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Account
                </Link>
                <Link
                  to="/orders"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
