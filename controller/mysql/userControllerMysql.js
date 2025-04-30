const UserService = require("../../service/Mysql-service/userServiceMysql");
const jwt = require("jsonwebtoken");

// Create User -- POST request
exports.createUser = async (req, res) => {
  try {
    const { name, emailaddress, password, phoneNumber, deviceToken, roles } = req.body;

    // Basic validation for required fields
    if (!name || !emailaddress || !password || !phoneNumber || !deviceToken || !roles || !Array.isArray(roles)) {
      return res.status(400).json({ message: "Name, email, password, phone number, device token, and roles are required" });
    }

    // Create the user
    const user = await UserService.createUser(name, emailaddress, password, phoneNumber, deviceToken, roles);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        emailaddress: user.emailaddress,
        phoneNumber: user.phoneNumber,
        deviceToken: user.deviceToken,
        roles: user.roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Successful response
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        emailaddress: user.emailaddress,
        phoneNumber: user.phoneNumber,
        deviceToken: user.deviceToken,
        roles: user.roles,
      },
      token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: error.message });
  }
};

// Login User -- POST request
exports.loginUser = async (req, res) => {
  try {
    const { emailaddress, password } = req.body;

    if (!emailaddress || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const { token } = await UserService.loginUser(emailaddress, password);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// Replace User -- PUT request
exports.replaceUser = async (req, res) => {
  try {
    const { name, emailaddress, password, phoneNumber, deviceToken, roles } = req.body;
    const userId = req.user.id;

    const user = await UserService.replaceUser(userId, { name, emailaddress, password, phoneNumber, deviceToken, roles });

    // Generate a new token with updated information
    const newToken = jwt.sign(
      {
        id: user.id,
        emailaddress: user.emailaddress,
        phoneNumber: user.phoneNumber,
        deviceToken: user.deviceToken,
        roles: user.roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user.id,
        name: user.name,
        emailaddress: user.emailaddress,
        phoneNumber: user.phoneNumber,
        deviceToken: user.deviceToken,
        roles: user.roles,
      },
      token: newToken,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update User -- PATCH request
exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from authentication middleware
    const updates = req.body;

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: "No updates provided" });
    }

    const user = await UserService.updateUser(userId, updates);

    // Generate a new token with updated information
    const newToken = jwt.sign(
      {
        id: user.id,
        emailaddress: user.emailaddress,
        phoneNumber: user.phoneNumber,
        deviceToken: user.deviceToken,
        roles: user.roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user.id,
        name: user.name,
        emailaddress: user.emailaddress,
        phoneNumber: user.phoneNumber,
        deviceToken: user.deviceToken,
        roles: user.roles,
      },
      token: newToken,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get User by ID -- GET request
exports.getUser = async (req, res) => {
  try {
    const userId = req.user.id; // Get the userId from the authenticated user (from the JWT payload)

    const user = await UserService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      user: {
        id: user.id,
        name: user.name,
        emailaddress: user.emailaddress,
        phoneNumber: user.phoneNumber,
        deviceToken: user.deviceToken,
        roles: user.roles,
      },
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get User by ID from URL params -- GET request
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete User by ID -- DELETE request
exports.deleteUserById = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await UserService.deleteUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: error.message });
  }
};
