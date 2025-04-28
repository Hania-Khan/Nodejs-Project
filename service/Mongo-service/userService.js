const User = require("../../model/mongo/userMongo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserService {
  // User Registration
  static async createUser(
    name,
    emailaddress,
    password,
    phoneNumber,
    deviceToken,
    roles
  ) {
    //Check for existing user (case-insensitive)
    const existingUser = await User.findOne({
      emailaddress: { $regex: new RegExp(`^${emailaddress}$`, "i") },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    //Create and save new user
    const user = new User({
      name,
      emailaddress,
      password,
      phoneNumber,
      deviceToken,
      roles,
    });
    await user.save();
    return user;
  }

  // User Login
  static async loginUser(emailaddress, password) {
    const user = await User.findOne({
      emailaddress: { $regex: new RegExp(`^${emailaddress}$`, "i") },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Compare plain password with hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.emailaddress,
        phoneNumber: user.phoneNumber,
        deviceToken: user.deviceToken,
        roles: user.roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token, user };
  }

  static async replaceUser(
    userId,
    { name, emailaddress, password, phoneNumber, deviceToken, roles }
  ) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if email is being updated and ensure it's unique
    if (emailaddress && emailaddress !== user.emailaddress) {
      const existingUser = await User.findOne({ emailaddress });
      if (existingUser) {
        throw new Error("Email already in use");
      }
      user.emailaddress = emailaddress;
    }

    // Update name and roles if provided
    if (name) user.name = name;
    if (roles && Array.isArray(roles)) user.roles = roles;

    // Hash new password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    return user;
  }

  static async updateUser(userId, updates) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const { name, emailaddress, password, phoneNumber, deviceToken, roles } =
      updates;

    // Check if email is being updated and ensure it's unique
    if (emailaddress && emailaddress !== user.emailaddress) {
      const existingUser = await User.findOne({ emailaddress });
      if (existingUser) {
        throw new Error("Email already in use");
      }
      user.emailaddress = emailaddress;
    }

    // Update fields only if provided
    if (name) user.name = name;

    // Merge new roles with existing roles instead of replacing
    if (roles && Array.isArray(roles)) {
      user.roles = [...new Set([...user.roles, ...roles])];
    }

    // Hash new password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    return user;
  }

  // Get User by ID
  static async getUserById(userId) {
    const user = await User.findById(userId);
    return user;
  }

  // Delete User by ID
  static async deleteUserById(userId) {
    const user = await User.findByIdAndDelete(userId);
    return user;
  }
}

module.exports = UserService;
