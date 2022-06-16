const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const Token = require("./token");
const error = require("../../util/errors");

const Op = Sequelize.Op;

const { User } = require("../../models/model");
const { use } = require("../../router/router");

module.exports = {
  register: async (req, res, next) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const username = req.body.username;
    const password = req.body.password;
    try {
      const hashedPw = await bcrypt.hash(password, 12);
      const newUser = new User({
        username_user: username,
        password_user: hashedPw,
      });
      await newUser.save();
      res.json({ 
        status: "sucess",
        message: "User created!", id: newUser.id_user 
      });

    } catch (err) {
      next(err);
    }
  },
  loginWithPassword: async (req, res, _) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const username = req.body.username;
    const password = req.body.password;
    let loadedUser;

    const user = await User.findOne({
      where: {
        username_user: {
          [Op.iLike]: username,
        },
      },
    });

    if (!user) {
      return error(res).authenticationError(["Invalid username or password."]);
    }

    loadedUser = user;

    const isEqual = await bcrypt.compare(password, user.password_user);
    if (!isEqual) {
      return error(res).authenticationError(["Invalid username or password."]);
    }

    const accesToken = new Token("password").generate({
      userId: loadedUser.id_user.toString(),
      scope: req.body.scope,
      grantType: "password",
    });
    const refreshToken = new Token("refresh").generate({
      userId: loadedUser.id_user.toString(),
      scope: req.body.scope,
      grantType: "password",
    });
    
    await User.update({ 
      token_user: accesToken,
      lastlogin_user: new Date()
    }, 
    {
      where: {
        username_user: username,
      }
    });

    res.json({
      token_type: "bearer",
      access_token: accesToken,
      refresh_token: refreshToken,
      user: {
        id: loadedUser.id_user,
        username: loadedUser.username_user,
      },
      expires_in: process.env.JWT_EXPIRES_IN,
    });
  },
  refreshToken: async (req, res, _) => {
    const token = req.body.token;
    const verify = new Token("refresh").verify(token);

    if (verify) {
      const user = await User.findByPk(verify.userId);
      if (!user) {
        return error(res).authenticationError(["User not found."]);
      }
      // Validate Role & Zone
      const mUserRole = await UserRole.findOne({
        attributes: ["id", "roles"],
        where: {
          userId: user.id,
          zoneId: user.activeZone,
        },
      });
      const mRole = await Role.findByPk(user.activeRole);
      if (!mRole) {
        return error(res).authenticationError(["Invalid Role."]);
      }
      if (mUserRole) {
        if (mUserRole.roles.indexOf(mRole.slug) == -1) {
          return error(res).authenticationError(["Invalid Role."]);
        }
      } else {
        return error(res).authenticationError(["Invalid Zone."]);
      }

      const accesToken = new Token("password").generate({
        userId: verify.userId,
        scope: verify.scope,
        grantType: "password",
      });
      const refreshToken = new Token("refresh").generate({
        userId: verify.userId,
        scope: verify.scope,
        grantType: "password",
      });
      res.json({
        token_type: "bearer",
        access_token: accesToken,
        refresh_token: refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          activeZone: user.activeZone,
          activeRole: user.activeRole,
        },
        expires_in: process.env.JWT_EXPIRES_IN,
      });
    } else {
      return error(res).authenticationError(["Invalid token."]);
    }
  },
  validate: (type) => {
    switch (type) {
      case "loginWithPassword":
        {
          return [
            body("username")
              .notEmpty()
              .withMessage("Please enter a valid username."),
            body("password")
              .notEmpty()
              .trim()
              .withMessage("Password cannot be empty."),
          ];
        }
        break;
      case "register":
        {
          return [
            body("username")
              .customSanitizer((value) => {
                return value ? value.toLowerCase() : null;
              })
              .notEmpty()
              .custom((value, { req }) => {
                return User.findOne({
                  where: {
                    username_user: {
                      [Op.iLike]: value,
                    },
                  },
                }).then((userDoc) => {
                  if (userDoc) {
                    return Promise.reject("Username already exists!");
                  }
                });
              }),
            body("password")
              .notEmpty()
              .trim()
              .isLength({ min: 6 })
              .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/
              )
              .withMessage(
                "Password should have minimum six characters, at least one letter, one number and one special character"
              ),
          ];
        }
        break;
    }
  },
};
