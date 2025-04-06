const jwt = require("jsonwebtoken");
const Joi = require("joi");

exports.authenticate = (req, res, next) => {
  try {
    //Extract the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    //Verify the token using the secret key
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ message: "Unauthorized: Token has expired" });
        }
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      //Attach the decoded user information to the request object
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

exports.roleMiddleware = (allowedRoles) => (req, res, next) => {
  try {
    const userRoles = req.user.roles;
    //Check if any allowed role matches the user's roles
    const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasAccess) {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient permissions" });
    }

    next();
  } catch (error) {
    console.error("Role verification error:", error);
    res.status(403).json({ message: "Access denied: Unable to verify roles" });
  }
};

exports.validateNotificationRequest = (req, res, next) => {
  const schema = Joi.object({
    type: Joi.string().valid("email", "sms", "push").required(),
    subject: Joi.string().when("type", {
      is: "email",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    title: Joi.string().when("type", {
      is: "push",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    recipients: Joi.array()
      .items(
        Joi.object({
          email: Joi.string().email(),
          phoneNumber: Joi.string().pattern(/^[0-9]+$/),
          deviceToken: Joi.string(),
        })
      )
      .min(1)
      .required(),
    content: Joi.string().required(),
    status: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  next();
};
