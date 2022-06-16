const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const Token = require("./token");
const error = require("../../util/errors");

const Op = Sequelize.Op;

const { User, Zone, Role, UserRole } = require("../../models/model");
const { use } = require("../../router/router");

module.exports = {
  register: async (req, res, next) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    try {
      if(req.body.role == "public-user"){
        const mZone = await Zone.findOne({where: {code: "31.00.00.0000"}});
        const mRole = await Role.findOne({where: {slug: req.body.role}});
        req.body.activeRole = mRole.id;
        req.body.activeZone = mZone.id;

        const hashedPw = await bcrypt.hash(password, 12);
        const newUser = new User({
          email: email,
          password: hashedPw,
          name: name,
          activeRole: mRole.id,
          activeZone: mZone.id
        });
        await newUser.save();

        await new UserRole({
          userId: newUser.id,
          zoneId: mZone.id,
          roles: [req.body.role]
        }).save();

        res.json({ message: "User created!", id: newUser.id });
      }else{
        const hashedPw = await bcrypt.hash(password, 12);
        const newUser = new User({
          email: email,
          password: hashedPw,
          name: name,
        });
        await newUser.save();
        res.json({ message: "User created!", id: newUser.id });
      }

    } catch (err) {
      next(err);
    }
  },
  loginWithPassword: async (req, res, _) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return error(res).validationError(validation.array());
    }

    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    let activeRole;
    let activeZone;
    let to;

    const user = await User.findOne({
      where: {
        email: {
          [Op.iLike]: email,
        },
      },
    });

    if (!user) {
      return error(res).authenticationError(["Invalid username or password."]);
    }
    activeRole = user.activeRole;
    activeZone = user.activeZone;

    loadedUser = user;

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return error(res).authenticationError(["Invalid username or password."]);
    }

    const userRole = await UserRole.findOne({ where: { userId: user.id } });
    if (!userRole) {
      return error(res).authenticationError(["You don't have privileges."]);
    }

    // if(userRole.roles.includes("public-user")){
    //   return error(res).authenticationError(["You don't have privileges"]);
    // }

    if (!user.activeRole || !user.activeZone) {
      // Set Default Role & Zone
      if (!user.activeZone) {
        const mZone = await Zone.findByPk(userRole.zoneId);
        if (mZone) {
          await User.update(
            { activeZone: mZone.id },
            { where: { id: user.id } }
          );
          activeZone = mZone.id;
        } else {
          return error(res).authenticationError(["You don't have privileges."]);
        }
      }

      if (!user.activeRole) {
        if (userRole.roles && userRole.roles.length > 0) {
          const mRole = await Role.findOne({
            where: {
              slug: userRole.roles[0],
            },
          });

          if (mRole) {
            await User.update(
              { activeRole: mRole.id },
              { where: { id: user.id } }
            );
            activeRole = mRole.id;
            to = mRole.defaultRoute;
          } else {
            return error(res).authenticationError([
              "You don't have privileges.",
            ]);
          }
        } else {
          return error(res).authenticationError(["You don't have privileges."]);
        }
      }
    } else {
      // Validate Zone & Role

      const mUserRole = await UserRole.findOne({
        attributes: ["id", "roles"],
        where: {
          userId: user.id,
          zoneId: user.activeZone,
        },
      });

      if (mUserRole) {
        const mRole = await Role.findByPk(user.activeRole);
        to = mRole.defaultRoute;
        if (mRole) {
          // Zone is Exists, check is role exists?
          if (mUserRole.roles && mUserRole.roles.length > 0) {
            if (mUserRole.roles.indexOf(mRole.slug) == -1) {
              const mDefaultRole = await Role.findOne({
                where: {
                  slug: mUserRole.roles[0],
                },
              });
              // Set Default Role
              if (mDefaultRole) {
                await User.update(
                  { activeRole: mDefaultRole.id },
                  { where: { id: user.id } }
                );
                activeRole = mDefaultRole.id;
                to = mDefaultRole.defaultRoute;
              } else {
                return error(res).authenticationError(["Unknown Role."]);
              }
            }
          } else {
            return error(res).authenticationError([
              "You don't have role privileges.",
            ]);
          }
        } else {
          return error(res).authenticationError(["Unknown Role."]);
        }
      } else {
        if (userRole.roles && userRole.roles.length > 0) {
          const mRole = await Role.findOne({
            where: {
              slug: userRole.roles[0],
            },
          });
          if (mRole) {
            // Set To Default Zone
            await User.update(
              { activeZone: userRole.zoneId, activeRole: mRole.id },
              { where: { id: user.id } }
            );
            activeZone = userRole.zoneId;
            activeRole = mRole.id;
            to = mRole.defaultRoute;
          } else {
            return error(res).authenticationError(["Unknown Role."]);
          }
        } else {
          return error(res).authenticationError([
            "You don't have role privileges.",
          ]);
        }
      }
    }

    const accesToken = new Token("password").generate({
      userId: loadedUser.id.toString(),
      scope: req.body.scope,
      grantType: "password",
    });
    const refreshToken = new Token("refresh").generate({
      userId: loadedUser.id.toString(),
      scope: req.body.scope,
      grantType: "password",
    });
    // console.log(to);
    res.json({
      token_type: "bearer",
      access_token: accesToken,
      refresh_token: refreshToken,
      user: {
        id: loadedUser.id,
        email: loadedUser.email,
        name: loadedUser.name,
        activeZone: activeZone,
        activeRole: activeRole,
      },
      to: to,
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
            body("email")
              .notEmpty()
              .isEmail()
              .withMessage("Please enter a valid email."),
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
            body("email")
              .customSanitizer((value) => {
                return value ? value.toLowerCase() : null;
              })
              .notEmpty()
              .isEmail()
              .custom((value, { req }) => {
                return User.findOne({
                  where: {
                    email: {
                      [Op.iLike]: value,
                    },
                  },
                }).then((userDoc) => {
                  if (userDoc) {
                    return Promise.reject("E-Mail address already exists!");
                  }
                });
              })
              .withMessage("Please enter a valid email."),
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
            body("name").trim().notEmpty().withMessage("Name is required!"),
          ];
        }
        break;
    }
  },
};
