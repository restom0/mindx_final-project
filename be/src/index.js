const express = require("express");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const path = require("path");

const app = express();
const port = 3000;

const db = require("./config/db");
// HTTP logger
app.use(morgan("combined"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
// Template engine setup
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
  })
);
const route = require("./routes");
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));
// // Define a route to render the home view
// app.get('/', (req, res) => {
//     res.render('home');
// });
// // app.get('/news', (req, res) => {
// //     res.render('news');
// // });

// app.get('/search', (req, res) => {
//     console.log(req.query);
//     res.render('search');
// });
// app.post('/search', (req, res) => {
//     console.log(req.body);
//     res.render('search');
// });

//Route init
route(app);

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
