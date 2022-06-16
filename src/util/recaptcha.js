var url = require("url");
var https = require("https");
var HttpsProxyAgent = require("https-proxy-agent");

module.exports = function (token) {
  var recaptcha_url =
    "https://www.google.com/recaptcha/api/siteverify?secret=" +
    process.env.CAPTCHA_SECRET +
    "&response=" +
    token;

  var options = url.parse(recaptcha_url);

  // Use Proxy
  if (process.env.HTTP_PROXY && process.env.HTTP_PROXY != "") {
    var agent = new HttpsProxyAgent(process.env.HTTP_PROXY);
    options.agent = agent;
  }

  return new Promise(function (resolve, reject) {
    https.get(options, function (res) {
      if (res.statusCode == 200) {
        var str = "";
        res.on("data", function (chunk) {
          str += chunk;
        });
        res.on("end", function () {
          const responseVerify = JSON.parse(str);
          console.log(responseVerify);
          if (responseVerify.success) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      } else {
        reject(req.errors);
      }
    });
  });
};
