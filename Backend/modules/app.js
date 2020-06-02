// --- libraries importing
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan= require("morgan");
const session= require("client-sessions");
const path = require("path");
const logger = require("morgan");
const DBUtils = require("./utils/DBUtils");

//var router = express.Router();

// --- routes importing
const auth = require("./routes/auth.js");
const users = require("./routes/users.js");
const recipes = require("./routes/recipes.js");

// --- app settings and configurations
const app = express();
const port = 3000;

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// print requests logs
app.use(morgan(":method :url :status :response-time ms"));

// setting cookies configurations
app.use(
  session({
    cookieName: "session",
    secret: "WeLoveToEat",
    duration: "*60*60*1000",
    activeDuration: 0,
  })
);

// senity check - verify that your server is still alive
app.get("/alive", (req, res)=> {
  res.send("I'm Aliiiiivvvvveeeeeeeeee");
});

// routing (COOL!)
app.use("/users", users);
app.use("/recipes", recipes);
app.use(auth);

// deafult router
app.use((req, res)=>{
  res.sendStatus(404);
});

// error middleware ---->> we took it from the example, it wasn't on Shir's video
// app.use(function(err, req, res, next) {
//   res.status(500).send(" Internal error : " + err);
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
