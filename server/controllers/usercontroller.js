const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Required fields
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  // Name validation
  if (name.trim().length < 3) {
    return res.status(400).json({
      message: "Name must be at least 3 characters",
    });
  }

  // Email validation
  const emailRegex = /^\S+@\S+\.\S+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email address",
    });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  // Check existing user
  const existingUser = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  // Create user...
};