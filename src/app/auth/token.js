const jwt = require("jsonwebtoken");

module.exports = function (type) {
  /**
   * Generate Token
   * params: type [password, refresh]
   * Return: token
   */
  this.generate = function (data) {
    const secretKey =
      type == "password" ? process.env.JWT_SECRET : process.env.JWT_REFRESH;

    const expiresIn =
      type == "password"
        ? process.env.JWT_EXPIRES_IN
        : process.env.JWT_REFRESH_EXPIRES_IN;

    const token = jwt.sign(
      {
        ...data,
      },
      secretKey,
      { expiresIn: parseInt(expiresIn) }
    );

    return token;
  };
  /**
   * Verify token from request
   * Return: Decoded token
   */
  this.verify = function (token) {
    const secretKey =
      type == "password" ? process.env.JWT_SECRET : process.env.JWT_REFRESH;

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, secretKey);
    } catch (err) {}
    return decodedToken;
  };
};
