const express = require("express");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const cors = require("cors");
const path = require("path");
var cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
app.use(cors());
const db = require("./src/config/database");
// HTTP logger
app.use(morgan("dev"));
app.use(morgan("combined"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
const route = require("./routes");
//Route init
route(app);

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
module.exports = app;
