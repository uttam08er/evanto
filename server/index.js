const dotenv = require("dotenv");
dotenv.config();

// Import core packages
const express = require("express"); 
const http = require("http");     
const cors = require("cors"); 
const helmet = require("helmet"); 
const morgan = require("morgan");  
const cookieParser = require("cookie-parser"); 
const mongoSanitize = require("express-mongo-sanitize"); 
const rateLimit = require("express-rate-limit"); 
const { Server } = require("socket.io"); 

const connectDB = require("./config/db");          
const { initSocket } = require("./config/socket");  

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const venueRoutes = require("./routes/venueRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");

connectDB(); 

const app = express(); 

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});
initSocket(io); 

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,                 
  message: "Too many requests from this IP, please try again after 15 minutes",
});


app.use(helmet());         
app.use(morgan("dev"));    
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,         
}));
app.use(express.json({ limit: "10mb" }));         
app.use(express.urlencoded({ extended: true, limit: "10mb" })); 
app.use(cookieParser());      
app.use(mongoSanitize());     
app.use("/api", limiter);     

// ---- ROUTES ----
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "🎉 Evently API is running!", status: "OK" });
});

app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ---- GLOBAL ERROR HANDLER ----
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ---- START THE SERVER ----
const PORT = process.env.PORT || 5000; 
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
});

module.exports = { app, server };
