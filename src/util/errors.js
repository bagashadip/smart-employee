const msgError = {
    AUTHENTICATION_ERROR: "Unauthorized",
    VALIDATION_ERROR: "Validation Error",
    PERMISSION_ERROR: "Access Denied",
  };
  
  module.exports = (res) => {
    return {
      validationError: (errors) => {
        return res
          .status(422)
          .json({ status: msgError.VALIDATION_ERROR, errors: errors });
      },
      authenticationError: (errors) => {
        return res
          .status(401)
          .json({ status: msgError.AUTHENTICATION_ERROR, errors: errors });
      },
      permissionError: () => {
        return res.status(401).json({
          status: msgError.PERMISSION_ERROR,
          errors: ["You don't have permission to access this module!"],
        });
      },
    };
  };
  