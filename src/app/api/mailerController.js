const nodemailer = require("nodemailer");

module.exports = {
  send: async (req, res) => {
    // Create a SMTP transport object
    var transport = nodemailer.createTransport(
      "smtps://kepegawaian.jsc@gmail.com:" +
        encodeURIComponent("eutncomvkxelxuku") +
        "@smtp.gmail.com:465"
    );

    console.log("SMTP Configured");

    // Message object
    var message = {
      // sender info
      from: "Sender Name <kepegawaian.jsc@gmail.com>",

      // Comma separated list of recipients
      to: '"Receiver Name" <hadi.bagas@gmail.com>',

      // Subject of the message
      subject: "<no-reply>",

      // plaintext body
      text: "Hello to myself!",

      // HTML body
      html:
        '<p><b>Hello</b> to myself <img src="cid:note@node"/></p>' +
        "<p>Here's a nyan cat for you as an embedded attachment:<br/></p>",
    };

    console.log("Sending Mail");
    transport.sendMail(message, function (error) {
      if (error) {
        console.log("Error occured");
        console.log(error.message);
        res.send(error.message);
      }
      console.log("Message sent successfully!");
      res.send("Message sent successfully!");

      // if you don't want to use this transport object anymore, uncomment following line
      //transport.close(); // close the connection pool
    });
  },
};
