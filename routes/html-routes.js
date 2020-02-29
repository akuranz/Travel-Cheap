// Requiring path to so we can use relative routes to our HTML files
var path = require("path");
// var fs = require("fs");
// var util = require("util");
const db = require("../models");
// var readFile = util.promisify(fs.readFile);

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", function(req, res) {
    console.log("HEREEEEEEE");
    if (req.user) {
      res.redirect("/itinerary");
    }
    res.sendFile(path.join(__dirname, "../public/sign-up.html"));
  });

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/itinerary");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  //Real handlebars route:
  app.get("/itinerary", isAuthenticated, async function(req, res) {
    //res.sendFile(path.join(__dirname, "../public/itinerary.html"));
    console.log("inside itinerary get route");

    let user = await db.User.findAll({
      where: {
        id: req.user.id
        // id: 1
      },
      include: [
        {
          model: db.Trip,
          include: [{ model: db.Flight }, { model: db.Event }]
        }
      ]
    });

    let info = user[0].dataValues.Trips;
    console.log(info[0].dataValues);
    console.log("INFO", info);

    res.render("itinerary", {
      info
    });
  });

  //handlebar HTML route
  app.get("/citySearch", function(req, res) {
    res.render("index");
  });
  app.get("/citySearch/:qId", function(req, res) {
    // get db info about query
    // query your API
    res.render("index", {
      //flights,
      //events,
    });
  });

  app.get("/citySearch/flight/:qId/:name", function(req, res) {
    // get db info about query
    // query your API

    res.render("index", {
      //flights,
      //events,
      dispFlight: true,
      flight: {
        eventName: "Some Flight"
      }
    });
  });
};
