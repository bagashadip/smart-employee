const _ = require("lodash");
const nodemailer = require("nodemailer");
var fs = require("fs");

module.exports = async (data) => {
  // Create a SMTP transport object
  return new Promise((resolve, reject) => {
    let transport = nodemailer.createTransport(
      "smtps://" +
        process.env.MAILER_EMAIL +
        ":" +
        encodeURIComponent(process.env.MAILER_PASSWORD) +
        "@" +
        process.env.MAILER_HOST +
        ":" +
        process.env.MAILER_PORT
    );

    console.log("MAILER -> SMTP Configured");

    // Message object
    var message = {
      // sender info
      from: "Kepegawaian JSC <kepegawaian.jsc@gmail.com>",

      // Comma separated list of recipients
      to: '"Receiver Name" <' + data.email + ">",

      // Subject of the message
      subject: "<no-reply>",

      // plaintext body
      // text: "Hello to myself!",

      // HTML body
      html: data.message,
    };

    console.log("MAILER -> Sending Mail");
    transport.sendMail(message, function (error) {
      if (error) {
        console.log("MAILER -> Error occured");
        console.log(error.message);
        let resMail = {
          status: false,
          statusCode: 422,
          message: error.message,
        };
        resolve(resMail);
      } else {
        console.log("MAILER -> Message sent successfully!");
        let resMail = {
          status: true,
          statusCode: 200,
          message: "Username telah dikirim ke email.",
        };
        resolve(resMail);
      }

      // if you don't want to use this transport object anymore, uncomment following line
      transport.close(); // close the connection pool
    });
  });
};
