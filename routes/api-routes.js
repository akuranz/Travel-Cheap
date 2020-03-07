// Requiring our models and passport as we've configured it
var db = require("../models");
var axios = require("axios");
var moment = require("moment");
var passport = require("../config/passport");
var isAuthenticated = require("../config/middleware/isAuthenticated");
var env = require("dotenv").config();

let flights = [];
let events = [];

let UserId;

module.exports = function(app) {
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  app.post("/api/signup", function(req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        res.status(401).json("User already exists.");
      });
  });

  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/user_data", isAuthenticated, function(req, res) {
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  app.post("/api/citySearch", function(req, res) {
    // console.log("apiFlights", req.body);
    const cityFrom = req.body.cityFrom;
    const cityTo = req.body.cityTo;
    const departureDate = moment(req.body.departureDate).format("DD/MM/YYYY");
    const returnDate = moment(req.body.departureDate).format("DD/MM/YYYY");
    const queryUrl = `https://api.skypicker.com/flights?flyFrom=${cityFrom}&to=${cityTo}&date_from=${departureDate}&date_to=${returnDate}&partner=picky&v=3&USD`;
    flights = [];
    events = [];
    axios
      .get(queryUrl)
      .then(function(data) {
        var dataArr = data.data.data;
        dataArr.forEach(function(flight) {
          const flightDetails = {
            Airline: flight.airlines,
            Price: flight.price,
            Duration: flight.fly_duration,
            DepartureTime: moment
              .unix(flight.dTime)
              .format("MM/DD/YYYY h:mm a"),
            ArrivalTime: moment.unix(flight.aTime).format("MM/DD/YYYY h:mm a")
          };
          // console.log(flight);
          // flights.splice(0, flights.length);
          flights.push(flightDetails);
        }); // end dataArr.forEach

        const cityEvent = req.body.cityEvent;
        console.log("city inside API Call", cityEvent);
        const startDate = moment(req.body.departureDate).format("YYYY-MM-DD");
        const endDate = moment(req.body.returnDate).format("YYYY-MM-DD");
        const api_key = process.env.API_KEY;
        console.log("Ticketmaster Dates: ", startDate, endDate);
        const eventQueryURL = `https://app.ticketmaster.com/discovery/v2/events.json?city=${cityEvent}&startDateTime=${startDate}T00:01:00Z&endDateTime=${endDate}T23:59:00Z&apikey=${api_key}`;
        return axios.get(eventQueryURL);
      })
      .then(function(eventsData) {
        var eventsDataArr = eventsData.data._embedded.events;
        console.log(eventsDataArr);
        eventsDataArr.forEach(function(event) {
          console.log(event);
          const eventDetails = {
            eventCity: req.body.cityEvent,
            eventName: event.name,
            eventDate: event.dates.start.localDate,
            eventTime: event.dates.start.localTime,
            eventVenue: event._embedded.venues[0].name,
            eventUrl: event.url
            // "Event Price:": event.priceRanges[2].min,
          };
          // events.splice(0, events.length);
          console.log(event);
          events.push(eventDetails);
        });

        const flightsAndEvents = {
          flights: flights,
          events: events
        };
        console.log(flightsAndEvents);
        res.render("index", {
          flights,
          events
        });
      })
      .catch(function(err) {
        console.log("ERROR API_ROUTE");
        console.log(err);
      });
  });

  app.get("/api/trips/:id", (req, res) => {
    db.User.findAll({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: db.Trip,
          include: [{ model: db.Flight }, { model: db.Event }]
        }
      ]
    }).then(function(dbUser) {
      console.log(dbUser);
      res.json(dbUser);
    });
  });

  app.post("/api/trips", isAuthenticated, (req, res) => {
    console.log("req", req.body);
    console.log("Trip", req.body.trip);
    // console.log("Events", req.body.events);
    // console.log("Flights", req.body.flights);
    // console.log("WONDERFUL", req.body.trip.UserId);
    db.Trip.create({
      UserId: req.user.id,
      cityName: req.body.trip.cityName,
      departureDate: req.body.trip.departureDate,
      arrivalDate: req.body.trip.arrivalDate
    })
      .then(async ({ id }) => {
        console.log("hi");

        const flights = req.body.flights.map(flight => {
          flight.TripId = id;
          return flight;
        });

        // ^^^ see above comment ^^^
        const events = req.body.events.map(event => {
          event.TripId = id;
          return event;
        });

        // then bulk creating multiple flights/events at once; thanks to the code above,
        // each flight/event object should have a TripId that associates it with the
        // current trip, which is in turn associated with the currently logged-in user
        await db.Flight.bulkCreate(flights);
        await db.Event.bulkCreate(events);

        // send a response to the the client terminating the req/res cycle
        res.end();
      })
      .catch(err => {
        if (err) {
          res.status(500).send(err);
        }
      });
    // after the trip is created, grab the id of newly-created trip (you'll need this
    // in order to add new flight and event records that are associated with the
    // correct trip!)
  });
};
