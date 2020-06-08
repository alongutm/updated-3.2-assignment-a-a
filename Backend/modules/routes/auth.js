var express = require("express");
var router = express.Router();
const DBUtils = require("../utils/DBUtils");

//#region cookie middleware
router.use(function (req, res, next) {
    if (req.session && req.session.id) {
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


module.exports = router;
