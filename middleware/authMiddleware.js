const jwt = require("jsonwebtoken");
const Joi = require("joi");

//These middleware functions are used 
// 1. only authorized users can access certain routes, 
// 2. users have the required roles, 
// 3. request body is valid before processing

// Middleware to authenticate the user
exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user payload to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Middleware to check user roles
exports.roleMiddleware = (allowedRoles) => (req, res, next) => {
  try {
    const userRoles = req.user.roles; // Extract roles from the decoded token
    const hasAccess = allowedRoles.some((role) => userRoles.includes(role));
    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied: Insufficient permissions" });
    }
    next(); 
  } catch (error) {
    res.status(403).json({ message: "Access denied: Unable to verify roles" });
  }
};

// Middleware to validate the request body
exports.validateNotificationRequest = (req, res, next) => {
  const schema = Joi.object({
    type: Joi.string().valid("email", "sms", "push").required(),
    subject: Joi.string().when("type", { is: "email", then: Joi.required() }),
    title: Joi.string().when("type", { is: "push", then: Joi.required() }),
    phoneNumber: Joi.string().when("type", { is: "sms", then: Joi.required() }),
    emailaddress: Joi.string().when("type", { is: "email", then: Joi.required() }),
    content: Joi.string().required(),
    recipient: Joi.alternatives()
      .try(
        Joi.string().email(),
        Joi.string().pattern(/^[^@]+$/),
        Joi.array().items(Joi.string().email())
      )
      .required(),
      status: Joi.string()
      .valid("Sent", "Failed", "Pending") // Allow only specific values
      .default("Pending"), // Default value if not provided
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  next(); // Proceed to the next middleware or route handler
};