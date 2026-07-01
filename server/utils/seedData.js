const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User");
const Venue = require("../models/Venue");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");
};

const seedUsers = async () => {
  await User.deleteMany({});
  console.log("🗑️  Cleared users");

  const hashedAdmin = await bcrypt.hash("admin123", 12);
  const hashedOwner = await bcrypt.hash("owner123", 12);
  const hashedUser  = await bcrypt.hash("user123", 12);

  const users = await User.insertMany([
    {
      name: "Super Admin",
      email: "admin@evanto.com",
      password: hashedAdmin,
      phone: "9000000001",
      role: "admin",
      isVerified: true,
    },
    {
      name: "Rajesh Venue Owner",
      email: "owner@evanto.com",
      password: hashedOwner,
      phone: "9000000002",
      role: "owner",
      isVerified: true,
    },
    {
      name: "Priya Customer",
      email: "user@evanto.com",
      password: hashedUser,
      phone: "9000000003",
      role: "user",
      isVerified: true,
    },
  ]);

  console.log("👥 Users seeded:", users.map((u) => u.email).join(", "));
  return users;
};

// ---- SEED VENUES ----
const seedVenues = async (ownerId) => {
  await Venue.deleteMany({});
  console.log("🗑️  Cleared venues");

  const venues = await Venue.insertMany([
    {
      ownerId,
      venueName: "The Grand Palace Banquet",
      category: "Wedding",
      description: "A luxurious banquet hall perfect for grand weddings and receptions. Featuring marble floors, chandeliers, and impeccable service. Our dedicated team ensures every detail is perfect for your special day.",
      venueType: "Banquet Hall",
      address: "12, Marine Drive",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400002",
      latitude: 18.9446,
      longitude: 72.8235,
      capacity: 500,
      pricePerPlate: 1200,
      decorationPrice: 50000,
      amenities: ["Parking", "AC", "DJ", "Decoration", "Catering", "Photography", "Stage"],
      images: [
        { url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800", public_id: "venue1_1" },
        { url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800", public_id: "venue1_2" },
      ],
      status: "approved",
      featured: true,
      rating: 4.8,
      totalReviews: 32,
    },
    {
      ownerId,
      venueName: "Lakeview Resort & Spa",
      category: "Anniversary",
      description: "Nestled by the serene lake, our resort offers the perfect backdrop for romantic celebrations. Enjoy world-class amenities, outdoor ceremonies by the water, and exquisite cuisine.",
      venueType: "Resort",
      address: "NH-8, Udaipur Road",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
      latitude: 26.9124,
      longitude: 75.7873,
      capacity: 300,
      pricePerPlate: 1800,
      decorationPrice: 75000,
      amenities: ["Parking", "AC", "DJ", "Decoration", "Catering", "Swimming Pool", "Outdoor Area", "Photography"],
      images: [
        { url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800", public_id: "venue2_1" },
      ],
      status: "approved",
      featured: true,
      rating: 4.9,
      totalReviews: 48,
    },
    {
      ownerId,
      venueName: "The Corporate Hub",
      category: "Corporate Event",
      description: "State-of-the-art conference and event space in the heart of Bangalore's business district. Perfect for product launches, team events, conferences, and seminars.",
      venueType: "Hotel",
      address: "MG Road, Indiranagar",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560038",
      latitude: 12.9716,
      longitude: 77.5946,
      capacity: 200,
      pricePerPlate: 800,
      decorationPrice: 20000,
      amenities: ["Parking", "AC", "WiFi", "Catering", "Stage", "Photography"],
      images: [
        { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800", public_id: "venue3_1" },
      ],
      status: "approved",
      featured: true,
      rating: 4.6,
      totalReviews: 25,
    },
    {
      ownerId,
      venueName: "Bloom Garden Party Hall",
      category: "Birthday Party",
      description: "A charming garden party hall bursting with natural beauty. Perfect for birthday bashes, kitty parties, and casual gatherings. Beautiful floral settings with outdoor and indoor spaces.",
      venueType: "Party Hall",
      address: "Sector 18, Noida",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      latitude: 28.7041,
      longitude: 77.1025,
      capacity: 150,
      pricePerPlate: 600,
      decorationPrice: 15000,
      amenities: ["Parking", "AC", "DJ", "Decoration", "Catering", "Outdoor Area"],
      images: [
        { url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800", public_id: "venue4_1" },
      ],
      status: "approved",
      featured: true,
      rating: 4.5,
      totalReviews: 18,
    },
    {
      ownerId,
      venueName: "Spice Garden Restaurant",
      category: "Family Gathering",
      description: "Authentic Indian cuisine in an elegant setting. Private dining rooms available for family gatherings, engagement parties, and intimate celebrations. Famous for our Mughlai and South Indian specialties.",
      venueType: "Restaurant",
      address: "Anna Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600040",
      latitude: 13.0827,
      longitude: 80.2707,
      capacity: 100,
      pricePerPlate: 450,
      decorationPrice: 0,
      amenities: ["Parking", "AC", "Catering", "WiFi"],
      images: [
        { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800", public_id: "venue5_1" },
      ],
      status: "approved",
      featured: true,
      rating: 4.7,
      totalReviews: 56,
    },
    {
      ownerId,
      venueName: "Skyline Rooftop Venue",
      category: "Engagement",
      description: "A stunning rooftop venue with panoramic city views. Perfect for engagement parties, cocktail events, and sunset celebrations. Features open-air and covered sections for any weather.",
      venueType: "Party Hall",
      address: "Banjara Hills, Road No. 12",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500034",
      latitude: 17.3850,
      longitude: 78.4867,
      capacity: 200,
      pricePerPlate: 900,
      decorationPrice: 30000,
      amenities: ["AC", "DJ", "Decoration", "Catering", "Photography", "Outdoor Area", "Stage"],
      images: [
        { url: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800", public_id: "venue6_1" },
      ],
      status: "approved",
      featured: true,
      rating: 4.4,
      totalReviews: 21,
    },
  ]);

  console.log("🏢 Venues seeded:", venues.map((v) => v.venueName).join(", "));
};

// ---- RUN SEED ----
const runSeed = async () => {
  try {
    await connectDB();
    const users = await seedUsers();

    // Find the owner user's ID
    const owner = users.find((u) => u.role === "owner");
    await seedVenues(owner._id);

    console.log("\n🎉 Database seeded successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Admin:  admin@evanto.com / admin123");
    console.log("Owner:  owner@evanto.com / owner123");
    console.log("User:   user@evanto.com  / user123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    process.exit(0); 
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1); 
  }
};

runSeed();
