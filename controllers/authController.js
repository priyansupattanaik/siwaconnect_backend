const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  createUser,
  findUserByMobile,
  findUserById,
} = require("../models/userModel");

const signup = async (req, res) => {
  const { name, email, mobile, address, password, confirmPassword } = req.body;

  console.log("Request Body:", req.body);

  if (
    password &&
    confirmPassword &&
    password.trim() !== confirmPassword.trim()
  ) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    await createUser({
      name,
      email,
      mobile,
      address,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Database error during signup:", error.message); // Log the error
    res.status(500).json({ error: "Database error" });
  }
};

const login = async (req, res) => {
  const { mobile, password } = req.body;

  try {
    // Find user by mobile number
    const user = await findUserByMobile(mobile);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send user details along with the token
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Server error during login:", error.message); // Log the error
    res.status(500).json({ error: "Server error" });
  }
};

// New function to get user profile based on the JWT
const getUserProfile = async (req, res) => {
  try {
    // Get the user ID from the token (assuming it is stored in req.user)
    const userId = req.user.id;

    // Find the user by ID
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user details (you can include more fields if needed)
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      address: user.address,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ error: "Error fetching user profile" });
  }
};

module.exports = { signup, login, getUserProfile };
