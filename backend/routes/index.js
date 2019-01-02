var express = require('express');
var router = express.Router();
const eventController=require("../controllers/eventController")
const {catchErrors}=require("../handlers/errorHandlers")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("home");
});
// router.post("/search",eventController.search);
router.get("/search",eventController.search);
router.get("/search/:id",eventController.eventDetail);
router.get("/artist/:artist/:teamname/:category/:keyword",eventController.getArtist);
router.get("/venue/:venuename",eventController.getVenue);
router.get("/upcoming/:venuename",eventController.getUpcoming)

module.exports = router;
