const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const registerUser = async (req, res) => {
  try {
    // Get data from request body
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // For now, just confirm the user does not exist
    // (Next step: hash password and save user)
    // Hash the password
const hashedPassword = await bcrypt.hash(password, 10);

// Create a new user
const newUser = await User.create({
  name,
  email,
  password: hashedPassword,
});

// Send success response
res.status(201).json({
  message: "User Registered Successfully",
  user: {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
  },
});
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    // Check password
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // Login successful
   // Generate JWT Token
const token = jwt.sign(
  {
    id: user._id,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1d",
  }
);

// Send response
res.status(200).json({
  message: "Login Successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
}; 
const getProfile = (req, res) => {
  res.status(200).json({
    message: "Protected Route Accessed Successfully",
    user: req.user,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};