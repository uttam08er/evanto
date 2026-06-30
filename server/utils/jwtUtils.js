const jwt = require("jsonwebtoken");


const generateToken = (payload) => {
  return jwt.sign(
    payload,                            
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const sendTokenResponse = (user, status, res) => {

  const token = generateToken({ id: user._id, role: user.role });

  const cookieOptions = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  user.password = undefined;

  res
    .status(status)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      token, 
      user,
    });
};

module.exports = { generateToken, verifyToken, sendTokenResponse };
