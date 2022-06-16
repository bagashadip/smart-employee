const jwt = require("jsonwebtoken");
const { User } = require("../models/model");
const error = require("../util/errors");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return error(res).authenticationError("Not Authenticated");
  }
  const token = authHeader.substring(7, authHeader.length);

  if (!token) {
    return error(res).authenticationError("Not Authenticated");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return error(res).authenticationError("Not Authenticated");
  }
  if (!decodedToken) {
    return error(res).authenticationError("Not Authenticated");
  }

  const user = await User.findByPk(decodedToken.userId);
  if (!user) {
    return error(res).authenticationError("Not Authenticated");
  }
  req.user = user;
  next();
};
