import { motion } from "framer-motion";

const AboutPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="text-center mb-12">
        <span className="text-5xl">🎉</span>
        <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-3">About Evently</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          India's most trusted platform for booking event venues. From weddings to corporate
          events, we connect you with the perfect venue for every occasion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { emoji: "🎯", title: "Our Mission", desc: "To make event venue booking simple, transparent, and affordable for everyone in India." },
          { emoji: "👀", title: "Our Vision", desc: "To be the go-to platform for 10 million event planners across India by 2026." },
          { emoji: "💎", title: "Our Values", desc: "Trust, transparency, and customer delight are at the core of everything we do." },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <span className="text-4xl block mb-3">{item.emoji}</span>
            <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-primary-600 to-purple-700 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Join 5000+ Happy Customers</h2>
        <p className="text-white/80 mb-6">Book your next event venue with confidence</p>
        <a href="/venues" className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors inline-block">
          Browse Venues →
        </a>
      </div>
    </motion.div>
  </div>
);

export default AboutPage;
