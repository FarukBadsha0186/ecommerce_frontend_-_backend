import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    company: {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Blog', path: '/blog' },
        { label: 'Press', path: '/press' },
      ]
    },
    support: {
      title: 'Support',
      links: [
        { label: 'Help Center', path: '/help' },
        { label: 'Returns', path: '/returns' },
        { label: 'Shipping Info', path: '/shipping' },
        { label: 'Payment Options', path: '/payment' },
      ]
    },
    legal: {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Cookie Policy', path: '/cookies' },
        { label: 'Disclaimer', path: '/disclaimer' },
      ]
    }
  };

  const socialIcons = [
    { icon: FiFacebook, href: 'https://facebook.com', color: 'hover:text-blue-600' },
    { icon: FiTwitter, href: 'https://twitter.com', color: 'hover:text-blue-400' },
    { icon: FiInstagram, href: 'https://instagram.com', color: 'hover:text-pink-600' },
    { icon: FiYoutube, href: 'https://youtube.com', color: 'hover:text-red-600' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ShopEase
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Your one-stop destination for quality products at unbeatable prices. 
              Shop with confidence and enjoy the best shopping experience.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <FiMapPin className="text-blue-500" />
                <span className="text-sm">123 Business Street, New York, NY 10001</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="text-blue-500" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiMail className="text-blue-500" />
                <span className="text-sm">support@shopease.com</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.values(footerSections).map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-white font-semibold mb-2">Subscribe to Newsletter</h3>
              <p className="text-gray-400 text-sm">Get the latest updates and exclusive offers</p>
            </div>
            <form className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-blue-500 text-white"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex space-x-4">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${social.color} transition text-xl`}
                >
                  <social.icon />
                </a>
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} ShopEase. All rights reserved. | Designed with ❤️ for modern e-commerce
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;