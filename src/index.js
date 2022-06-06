const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config/app.js");

const app = express();

app.use(require("./router/router"));
app.use(bodyParser.json());

app.listen({ port: config.port }, () => {
    console.log(`🚀 Server ready at http://localhost:${config.port}`);
});