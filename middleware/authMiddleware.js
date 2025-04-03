const jwt = require("jsonwebtoken");
const Joi = require("joi");

exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ message: "Unauthorized: Token has expired" });
        }
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

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
    recipient: Joi.alternatives().conditional("type", {
      is: "push",
      then: Joi.alternatives()
        .try(
          Joi.string(),
          Joi.array().items(
            Joi.object({ deviceToken: Joi.string().required() })
          )
        )
        .required(),
      otherwise: Joi.alternatives()
        .try(
          Joi.string().email(),
          Joi.string().pattern(/^[^@]+$/),
          Joi.array().items(Joi.string().email())
        )
        .required(),
    }),
    content: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  next(); // ✅ Ensure the next middleware is called
};
