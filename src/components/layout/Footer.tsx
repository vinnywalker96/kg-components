
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">
              KG<span className="text-blue-400">Components</span>
            </h3>
            <p className="text-gray-300 mb-4">
              Your trusted source for quality electronic components and tools.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-blue-400 transition-colors inline-block">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors inline-block">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop?category=Tools" className="text-gray-300 hover:text-blue-400 transition-colors inline-block">
                  Tools
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Accessories" className="text-gray-300 hover:text-blue-400 transition-colors inline-block">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Instruments" className="text-gray-300 hover:text-blue-400 transition-colors inline-block">
                  Instruments
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Power%20Products" className="text-gray-300 hover:text-blue-400 transition-colors inline-block">
                  Power Products
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Test%20and%20Measurements" className="text-gray-300 hover:text-blue-400 transition-colors inline-block">
                  Test & Measurements
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
            <address className="not-italic text-gray-300 space-y-2">
              <p className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0" />
                <span>123 Component Street<br />Tech City, TC 12345</span>
              </p>
              <p className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0" />
                <a href="mailto:info@kgcomponents.com" className="hover:text-blue-400 transition-colors">
                  info@kgcomponents.com
                </a>
              </p>
              <p className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0" />
                <a href="tel:+15551234567" className="hover:text-blue-400 transition-colors">
                  +1 (555) 123-4567
                </a>
              </p>
            </address>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="border-t border-gray-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} KG Components. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <nav className="flex flex-wrap space-x-4 justify-center">
                <Link to="/privacy" className="text-gray-400 hover:text-blue-400 text-sm">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-400 hover:text-blue-400 text-sm">
                  Terms of Service
                </Link>
                <Link to="/shipping" className="text-gray-400 hover:text-blue-400 text-sm">
                  Shipping Policy
                </Link>
                <Link to="/returns" className="text-gray-400 hover:text-blue-400 text-sm">
                  Returns
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Methods Footer */}
      <div className="bg-slate-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              Secure payments by trusted providers
            </p>
            <div className="mt-2 md:mt-0 flex space-x-4">
              {["Visa", "Mastercard", "PayPal", "Apple Pay"].map((payment) => (
                <div key={payment} className="text-gray-400 text-sm">
                  {payment}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
