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

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  // dummy handlebars route:
  // app.get("/itinerary", isAuthenticated, async function(req, res) {
  //   //res.sendFile(path.join(__dirname, "../public/itinerary.html"));
  //   try {
  //     let html = await readFile(
  //       path.join(__dirname, "../public/itinerary.html"),
  //       "utf8"
  //     );
  //     let user = await db.User.findAll({
  //       where: {
  //         // id: req.params.id
  //         id: req.user.id
  //       },
  //       include: [
  //         {
  //           model: db.Trip,
  //           include: [{ model: db.Flight }, { model: db.Event }]
  //         }

  //         // include: [{ model: db.Event }],
  //         // include: [{ model: db.Flight }]
  //       ]
  //     });

  //     let flights = [];
  //     for (let planned of user) {
  //       for (let trips of planned.Trips) {
  //         var flight = "<h1>" + trips.cityName + "</h1> <ul>";
  //         for (let flights of trips.Flights) {
  //           flight += "<li>" + flights.time + "<li>";
  //         }
  //         flight += "</ul>";
  //         flights.push(flight);
  //       }
  //     }
  //     console.log(flights);
  //     html = html.replace("{{flights}}", flights.join(""));

  //     res.send(html);

  //     // res.render("itinerary", {
  //     //   user
  //     // });
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // });

  //Real handlebars route:
  app.get("/itinerary", isAuthenticated, async function(req, res) {
    //res.sendFile(path.join(__dirname, "../public/itinerary.html"));
    console.log("inside itinerary get route");
    let user = await db.User.findAll({
      where: {
        // id: req.user.id
        id: 1
      },
      include: [
        {
          model: db.Trip,
          include: [{ model: db.Flight }, { model: db.Event }]
        }
      ]
    });
    console.log("Natalia", user[0].dataValues.Trips[0].dataValues);
    let info = user[0].dataValues.Trips;
    console.log(info[0].cityName);
    console.log("Flight: ", info[0].Flights[0].dataValues);
    console.log("Events: ", info[0].Events[0].dataValues);
    res.render(
      "itinerary",
      {
        info
      }
    );
  });

  // app.get("/citySearch", function(req, res) {
  //   // res.render("index", { layout: "mian" });
  //   res.sendFile(path.join(__dirname, "../public/searchResults.html"));
  // });

  //handlebar HTML route
  app.get("/citySearch", function(req, res) {
    res.render("index");
  });
};
