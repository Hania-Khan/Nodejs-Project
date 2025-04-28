const jwt = require("jsonwebtoken");
const UserService = require("../../service/Mongo-service/userService");

//Create User--POST request
exports.createUser = async (req, res) => {
  try {
    //Destructure the request body
    // Check if the required fields are present
    const { name, emailaddress, password, phoneNumber, deviceToken, roles } =
      req.body;
    //Basic validation for required fields
    if (
      !name ||
      !emailaddress ||
      !password ||
      !phoneNumber ||
      !deviceToken ||
      !roles ||
      !Array.isArray(roles)
    ) {
      return res.status(400).json({
        message: "Name, email, password, and roles are required",
      });
    }
    // Create the user using the UserService
    const user = await UserService.createUser(
      name,
      emailaddress,
      password,
      phoneNumber,
      deviceToken,
      roles
    );

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        emailaddress: user.emailaddress,
        phoneNumber: user.phoneNumber,
        deviceToken: user.deviceToken,
        roles: user.roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    //sUCCESSFUL RESPONSE
    // Send the response with user details and token
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
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

exports.loginUser = async (req, res) => {
  try {
    const { emailaddress, password } = req.body;

    if (!emailaddress || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
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

//Replace User--PUT request
exports.replaceUser = async (req, res) => {
  try {
    const { name, emailaddress, password, phoneNumber, deviceToken, roles } =
      req.body;
    const userId = req.user.id;

    const user = await UserService.updateUser(userId, {
      name,
      emailaddress,
      password,
      phoneNumber,
      deviceToken,
      roles,
    });

    // Generate a new token with updated
    const newToken = jwt.sign(
      {
        id: user._id,
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
        id: user._id,
        name: user.name,
        emailaddress: user.emailaddress,
        phoneNumber: user.phoneNumber,
        deviceToken: user.deviceToken,
        roles: user.roles,
      },
      token: newToken, // Return the updated token
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update User--PATCH request
exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from authentication middleware
    const updates = req.body;

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: "No updates provided" });
    }

    const user = await UserService.updateUser(userId, updates);

    // Generate a new token with updated roles
    const newToken = jwt.sign(
      {
        id: user._id,
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
        id: user._id,
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

//GET REQUEST -- get user details
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
        id: user._id,
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

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params; // Get the userId from the route parameter

    const user = await UserService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      user: {
        id: user._id,
        name: user.name,
        emailaddress: user.emailaddress,
        phoneNumber: user.phoneNumber,
        deviceToken: user.deviceToken,
        roles: user.roles,
      },
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete User by ID
exports.deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params; // Get the userId from the route parameter

    const user = await UserService.deleteUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: error.message });
  }
};
