const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserService {
  static async createUser(name, emailaddress, password, roles) {
        const existingUser = await User.findOne({ emailaddress });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, emailaddress, password: hashedPassword, roles });
    await user.save();

    return user;
  }

   static async loginUser(emailaddress, password) {
      const user = await User.findOne({ emailaddress });
    if (!user) {
      throw new Error("Invalid emailaddress or password");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid emailaddress or password");
    }

    const token = jwt.sign(
      { id: user._id, email: user.emailaddress, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } 
    );

    return { token, user };
  }
}

module.exports = UserService;