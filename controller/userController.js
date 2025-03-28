const jwt = require("jsonwebtoken");
const UserService = require("../service/userService");

exports.createUser = async (req, res) => {
  try {
    const { name, emailaddress, password, roles } = req.body;

    if (
      !name ||
      !emailaddress ||
      !password ||
      !roles ||
      !Array.isArray(roles)
    ) {
      return res
        .status(400)
        .json({
          message: "Name, emailaddress, password, and roles are required",
        });
    }

    const user = await UserService.createUser(
      name,
      emailaddress,
      password,
      roles
    );

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
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const { token, user } = await UserService.loginUser(emailaddress, password);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(401).json({ message: error.message });
  }
};
