
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">KG Components</h3>
            <p className="text-gray-300">
              Your trusted source for quality electronic components and tools.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-white">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop?category=Tools" className="text-gray-300 hover:text-white">
                  Tools
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Accessories" className="text-gray-300 hover:text-white">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Instruments" className="text-gray-300 hover:text-white">
                  Instruments
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Power%20Products" className="text-gray-300 hover:text-white">
                  Power Products
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Test%20and%20Measurements" className="text-gray-300 hover:text-white">
                  Test and Measurements
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Contact</h4>
            <address className="not-italic text-gray-300">
              <p>123 Component Street</p>
              <p>Tech City, TC 12345</p>
              <p className="mt-2">Email: info@kgcomponents.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300">
            &copy; {currentYear} KG Components. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <nav className="flex space-x-4">
              <Link to="/privacy" className="text-gray-300 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-white text-sm">
                Terms of Service
              </Link>
              <Link to="/shipping" className="text-gray-300 hover:text-white text-sm">
                Shipping Policy
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
