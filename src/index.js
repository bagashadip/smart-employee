const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config/app.js");
const timeout = require("connect-timeout");
const cors = require("cors");
const path = require("path");

require("dotenv").config();
// require("./app/cron/index.js");

const app = express();

// Set Timeout
app.use(timeout(config.timeout));
app.use((req, _, next) => {
  if (!req.timedout) next();
});

// Set Cors
var corsOptionsDelegate = function (req, callback) {
    var origin = false;
    // console.log(req.header("Origin"));
    if (config.whitelistUrl.indexOf(req.header("Origin")) !== -1) {
      origin = true;
    }
  
    const corsOptions = {
      origin: '*',
      credentials: true,
      methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
      optionsSuccessStatus: 200,
    };
    callback(null, corsOptions);
  };
  
app.use(cors(corsOptionsDelegate));
app.use(bodyParser.json());

// app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, config.assetDir)));

app.use(function (req, res, next) {
    setTimeout(next, 200);
});

app.use(require("./router/router"));

app.use((err, req, res, next) => {
    if (err instanceof Error) {
      res.json(err);
    }
});

app.listen({ port: config.port }, () => {
    console.log(`🚀 Server ready at http://localhost:${config.port}`);
});