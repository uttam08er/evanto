import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import { toast } from "react-toastify";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent! We'll reply within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Contact Us</h1>
        <p className="text-gray-500 text-lg">Have questions? We'd love to hear from you.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Get in Touch</h2>
          {[
            { icon: FiMail, label: "Email Us", value: "hello@evently.in", color: "text-blue-600 bg-blue-50" },
            { icon: FiPhone, label: "Call Us", value: "+91 98765 43210", color: "text-green-600 bg-green-50" },
            { icon: FiMapPin, label: "Visit Us", value: "123 Event Street, Mumbai 400001", color: "text-red-600 bg-red-50" },
          ].map((item) => (
            <div key={item.label} className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center`}>
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="font-medium text-gray-900">{item.value}</p>
              </div>
            </div>
          ))}

          <div className="bg-primary-50 rounded-2xl p-5 mt-6">
            <h3 className="font-semibold text-primary-700 mb-2">Support Hours</h3>
            <p className="text-primary-600 text-sm">Monday – Saturday: 9 AM to 8 PM</p>
            <p className="text-primary-600 text-sm">Sunday: 10 AM to 6 PM</p>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                required placeholder="Rahul Kumar" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                required placeholder="you@example.com" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required placeholder="How can we help?" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              required rows={5} placeholder="Tell us more..." className="input-field resize-none" />
          </div>
          <button type="submit" disabled={sending} className="btn-primary w-full flex items-center justify-center space-x-2">
            <FiSend size={16} />
            <span>{sending ? "Sending..." : "Send Message"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
