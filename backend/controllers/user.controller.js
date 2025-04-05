const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

/**
 * @desc Register a new user with GST details
 * @route POST /api/users/register
 */
exports.registerUser = async (req, res) => {
  try {
    const { name, gstNumber, tradeName, legalName, address, status, password } = req.body;

    // Basic validation
    if (!name || !gstNumber || !tradeName || !legalName || !password) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Check if user exists
    const userExists = await User.findOne({ gstNumber });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with default address if not provided
    const user = new User({
      name,
      gstNumber,
      tradeName,
      legalName,
      address: address || {
        bnm: "",
        st: "",
        loc: "",
        bno: "",
        stcd: "",
        pncd: ""
      },
      status: status || "Active",
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    await user.save();
    res.status(201).json({
      message: "User registered successfully",
      token,
      userId: user._id,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Login user using GST Number & Password (Supports Remember Me)
 * @route POST /api/users/login
 */
exports.loginUser = async (req, res) => {
  try {
    const { gstNumber, password, rememberMe } = req.body;

    // Check if user exists
    const user = await User.findOne({ gstNumber });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Set token expiry based on "Remember Me"
    const expiresIn = rememberMe ? "7d" : "1h";

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn });

    res.json({ message: "Login successful", token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Get user data by ID
 * @route GET /api/users/:id
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
