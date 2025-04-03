const jwt = require("jsonwebtoken");
const UserService = require("../service/userService");

exports.createUser = async (req, res) => {
  try {
    const { name, emailaddress, password, roles } = req.body;

    if (!name || !emailaddress || !password || !roles || !Array.isArray(roles)) {
      return res.status(400).json({
        message: "Name, email, password, and roles are required",
      });
    }

    const user = await UserService.createUser(name, emailaddress, password, roles);

    const token = jwt.sign(
      { id: user._id, emailaddress: user.emailaddress, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        emailaddress: user.emailaddress,
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
      return res.status(400).json({ message: "Email and password are required" });
    }

    const { token, user } = await UserService.loginUser(emailaddress, password);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(401).json({ message: "Invalid email or password" });
  }
};


exports.replaceUser = async (req, res) => {
  try {
    const { name, emailaddress, password, roles } = req.body;
    const userId = req.user.id;

    const user = await UserService.updateUser(userId, { name, emailaddress, password, roles });

    // Generate a new token with updated roles
    const newToken = jwt.sign(
      { id: user._id, emailaddress: user.emailaddress, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        emailaddress: user.emailaddress,
        roles: user.roles,
      },
      token: newToken, // Return the updated token
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: error.message });
  }
};

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
      { id: user._id, emailaddress: user.emailaddress, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        emailaddress: user.emailaddress,
        roles: user.roles,
      },
      token: newToken,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: error.message });
  }
};

