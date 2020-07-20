// --- libraries importing
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

//#region express configures
require("dotenv").config();
var express = require("express");
var path = require("path");
var logger = require("morgan");
const session = require("client-sessions");
const DBUtils = require("./utils/DBUtils");
const cors = require("cors");

// --- app settings and configurations
const app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json
//enable all cors
//app.use(cors());

var corsOptions = {
  origin: "http://localhost:8080",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(
  session({
    cookieName: "session", // the cookie key name
    secret: process.env.COOKIE_SECRET, // the encryption key
    duration: 60 * 60 * 60 * 1000, // expired after 60 minutes
    activeDuration: 0, // if expiresIn < activeDuration,
    //the session will be extended by activeDuration milliseconds
  })
);
app.use(cookieParser());
// setting cookies configurations

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files

var port = process.env.PORT || "3000"; // print requests logs
//app.use(morgan(":method :url :status :response-time ms"));
//app.use(bodyParser.json());// parse application/json

//#endregion

// --- routes importing

app.use(function (req, res, next) {
  if (req.session && req.session.user_id) {
    DBUtils.execQuery("SELECT user_id FROM users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
        }
        next();
      })
      .catch((error) => next());
  } else {
    next();
  }
});
//const auth = require("./routes/auth.js");
const users = require("./routes/users.js");
const recipes = require("./routes/recipes.js");
const profiles = require("./routes/profiles.js");

//#endregion

// senity check - verify that your server is still alive
app.get("/alive", (req, res) => {
  res.send("I'm Aliiiiivvvvveeeeeeeeee");
});

// routing (COOL!)
app.use("/users", users);
app.use("/recipes", recipes);
//app.use(auth);
app.use("/profiles", profiles);

// deafult router
app.use((req, res) => {
  res.sendStatus(404);
});

// error middleware ---->> we took it from the example, it wasn't on Shir's video
// app.use(function(err, req, res, next) {
//   res.status(500).send(" Internal error : " + err);
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});


//b7a843b69e064c53aeb275988fe53773
