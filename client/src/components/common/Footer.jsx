import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎉</span>
              <span className="text-xl font-bold text-white">Evanto</span>
            </div>
            <p className="text-sm leading-relaxed">
              Your one-stop platform for booking the perfect venue for every occasion.
              Weddings, birthdays, corporate events and more.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors"><FiFacebook size={20} /></a>
              <a href="#" className="hover:text-primary-400 transition-colors"><FiInstagram size={20} /></a>
              <a href="#" className="hover:text-primary-400 transition-colors"><FiTwitter size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/venues", label: "Venues" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Events</h3>
            <ul className="space-y-2 text-sm">
              {["Weddings", "Birthday Parties", "Corporate Events", "Anniversaries", "Engagement Parties"].map((event) => (
                <li key={event}>
                  <Link to={`/venues?category=${event}`} className="hover:text-primary-400 transition-colors">
                    {event}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3">
                <FiMapPin className="text-primary-400 flex-shrink-0" />
                <span>123 Event Street, Mumbai, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="text-primary-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="text-primary-400 flex-shrink-0" />
                <span>hello@evanto.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© {currentYear} Evanto. All rights reserved.</p>
          <div className="flex space-x-4 mt-3 md:mt-0">
            <a href="#" className="hover:text-primary-400">Privacy Policy</a>
            <a href="#" className="hover:text-primary-400">Terms of Service</a>
            <a href="#" className="hover:text-primary-400">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
