import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiArrowRight,
  FiStar,
  FiCheckCircle,
} from "react-icons/fi";
import { venueAPI } from "../../services/api";
import VenueCard from "../../components/venue/VenueCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import HeroBackground from "../../components/ui/HeroBackground";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }, // Each child animates 0.1s after previous
};

// ---- DATA CONSTANTS ----
const EVENT_CATEGORIES = [
  { name: "Wedding", emoji: "💍", color: "bg-rose-50 text-rose-600" },
  {
    name: "Birthday Party",
    emoji: "🎂",
    color: "bg-yellow-50 text-yellow-600",
  },
  { name: "Corporate Event", emoji: "💼", color: "bg-blue-50 text-blue-600" },
  { name: "Anniversary", emoji: "❤️", color: "bg-pink-50 text-pink-600" },
  { name: "Engagement", emoji: "💫", color: "bg-purple-50 text-purple-600" },
  { name: "Baby Shower", emoji: "🍼", color: "bg-green-50 text-green-600" },
  {
    name: "Farewell Party",
    emoji: "👋",
    color: "bg-orange-50 text-orange-600",
  },
  { name: "Family Gathering", emoji: "👨‍👩‍👧‍👦", color: "bg-teal-50 text-teal-600" },
];

const POPULAR_CITIES = [
  {
    name: "Mumbai",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400",
    venues: 120,
  },
  {
    name: "Delhi",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400",
    venues: 95,
  },
  {
    name: "Bangalore",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400",
    venues: 85,
  },
  {
    name: "Jaipur",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400",
    venues: 72,
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Search & Browse",
    desc: "Explore hundreds of venues by city, event type, or budget",
    icon: "🔍",
  },
  {
    step: "02",
    title: "Select Your Venue",
    desc: "Compare venues, check availability, and read reviews",
    icon: "📋",
  },
  {
    step: "03",
    title: "Book & Pay",
    desc: "Secure your date with our safe online payment system",
    icon: "💳",
  },
  {
    step: "04",
    title: "Celebrate!",
    desc: "Arrive at your perfectly arranged venue and enjoy your event",
    icon: "🎉",
  },
];

const STATS = [
  { value: "5000+", label: "Happy Customers" },
  { value: "1200+", label: "Venues Listed" },
  { value: "50+", label: "Cities Covered" },
  { value: "98%", label: "Satisfaction Rate" },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    event: "Wedding",
    rating: 5,
    text: "Evently made our wedding venue search so easy! Found our dream venue in just 2 days.",
    avatar: "P",
  },
  {
    name: "Rahul Mehta",
    event: "Corporate Event",
    rating: 5,
    text: "Perfect for corporate events. Professional service and beautiful venues. Highly recommend!",
    avatar: "R",
  },
  {
    name: "Anita Patel",
    event: "Birthday Party",
    rating: 5,
    text: "Booked a stunning party hall for my daughter's birthday. Everyone was amazed!",
    avatar: "A",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredVenues, setFeaturedVenues] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(true);

  const [searchData, setSearchData] = useState({
    city: "",
    category: "",
    date: "",
    guests: "",
  });

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await venueAPI.getFeatured();
        setFeaturedVenues(data.venues);
      } catch (error) {
        console.error("Failed to load featured venues");
      } finally {
        setLoadingVenues(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchData.city) params.set("city", searchData.city);
    if (searchData.category) params.set("category", searchData.category);
    if (searchData.guests) params.set("capacity", searchData.guests);
    navigate(`/venues?${params.toString()}`);
  };

  return (
    <div>
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <HeroBackground/>
        {/* <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        /> */}

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm"
          >
            🎊 India's #1 Event Booking Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Book the Perfect
            <span className="block text-yellow-300">Venue for Your</span>
            <span className="block">Special Moment</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto"
          >
            Discover and book stunning venues for weddings, birthday parties,
            corporate events, and more across 50+ cities in India.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="bg-white rounded-2xl p-3 shadow-2xl max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {/* City */}
              <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 focus-within:border-primary-500">
                <FiMapPin className="text-primary-500 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Which city?"
                  value={searchData.city}
                  onChange={(e) =>
                    setSearchData({ ...searchData, city: e.target.value })
                  }
                  className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
                />
              </div>

              <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 focus-within:border-primary-500">
                <span className="mr-2 text-lg">🎉</span>
                <select
                  value={searchData.category}
                  onChange={(e) =>
                    setSearchData({ ...searchData, category: e.target.value })
                  }
                  className="w-full outline-none text-sm text-gray-700 bg-transparent"
                >
                  <option value="">Event Type</option>
                  {EVENT_CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 focus-within:border-primary-500">
                <FiCalendar className="text-primary-500 mr-2 flex-shrink-0" />
                <input
                  type="date"
                  value={searchData.date}
                  min={new Date().toISOString().split("T")[0]} // Can't select past dates
                  onChange={(e) =>
                    setSearchData({ ...searchData, date: e.target.value })
                  }
                  className="w-full outline-none text-sm text-gray-700"
                />
              </div>

              <button
                type="submit"
                className="btn-primary flex items-center justify-center space-x-2 rounded-xl"
              >
                <FiSearch />
                <span>Search Venues</span>
              </button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mt-8 text-white/70 text-sm"
          >
            <span>✅ 1200+ Venues</span>
            <span>✅ Instant Booking</span>
            <span>✅ Secure Payments</span>
            <span>✅ Free Cancellation</span>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              What Are You Celebrating?
            </h2>
            <p className="text-gray-500 text-lg">
              Find venues perfectly suited for any occasion
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3"
          >
            {EVENT_CATEGORIES.map((cat) => (
              <motion.div key={cat.name} variants={fadeUp}>
                <button
                  onClick={() => navigate(`/venues?category=${cat.name}`)}
                  className={`w-full p-4 rounded-xl ${cat.color} hover:shadow-md transition-all duration-200 hover:-translate-y-1 text-center`}
                >
                  <span className="text-3xl block mb-2">{cat.emoji}</span>
                  <span className="text-xs font-semibold leading-tight block">
                    {cat.name}
                  </span>
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Featured Venues
              </h2>
              <p className="text-gray-500">
                Handpicked top-rated venues for your events
              </p>
            </motion.div>
            <button
              onClick={() => navigate("/venues")}
              className="text-primary-600 font-medium flex items-center hover:underline"
            >
              View All <FiArrowRight className="ml-1" />
            </button>
          </div>

          {loadingVenues ? (
            <LoadingSpinner />
          ) : featuredVenues.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No featured venues yet.</p>
              <button
                onClick={() => navigate("/venues")}
                className="btn-primary mt-4"
              >
                Browse All Venues
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVenues.map((venue) => (
                <VenueCard key={venue._id} venue={venue} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Popular Cities
            </h2>
            <p className="text-gray-500">
              Explore venues in India's most vibrant cities
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_CITIES.map((city, index) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => navigate(`/venues?city=${city.name}`)}
                  className="relative w-full h-48 rounded-2xl overflow-hidden group"
                >
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white text-left">
                    <p className="font-bold text-xl">{city.name}</p>
                    <p className="text-sm text-white/80">
                      {city.venues}+ venues
                    </p>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              How Evently Works
            </h2>
            <p className="text-gray-500">
              Book your dream venue in 4 simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center relative"
              >
                {index < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-1/2 w-full border-t-2 border-dashed border-primary-200 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                    {step.icon}
                  </div>
                  <span className="text-sm font-bold text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
                    Step {step.step}
                  </span>
                  <h3 className="font-bold text-xl text-gray-900 mt-3 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-4xl sm:text-5xl font-bold text-yellow-300 mb-2">
                  {stat.value}
                </div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              What Our Customers Say
            </h2>
            <p className="text-gray-500">
              Thousands of happy events, one platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, index) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                {/* Stars */}
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="text-yellow-400 fill-current"
                      size={18}
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 leading-relaxed">
                  "{t.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.event}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Plan Your Perfect Event?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Join 5000+ happy customers who trusted Evently for their special
              occasions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/venues")}
                className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Browse Venues
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-yellow-400 text-gray-900 font-semibold px-8 py-3 rounded-xl hover:bg-yellow-300 transition-colors"
              >
                Sign Up Free 🎉
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
