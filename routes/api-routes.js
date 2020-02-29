// Requiring our models and passport as we've configured it
var db = require("../models");
var axios = require("axios");
var moment = require("moment");
var passport = require("../config/passport");

const flights = [];
const events = [];

let UserId;

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the  page.
  // Otherwise the user will be sent an error

  // (req, res, next) => { ...code; next();}
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
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

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  app.post("/api/citySearch", function(req, res) {
    // console.log("apiFlights", req.body);
    const cityFrom = req.body.cityFrom;
    const cityTo = req.body.cityTo;
    const departureDate = moment(req.body.departureDate).format("DD/MM/YYYY");
    const returnDate = moment(req.body.departureDate).format("DD/MM/YYYY");
    const queryUrl = `https://api.skypicker.com/flights?flyFrom=${cityFrom}&to=${cityTo}&date_from=${departureDate}&date_to=${returnDate}&partner=picky&v=3&USD`;
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
          flights.push(flightDetails);
        }); // end dataArr.forEach

        const cityEvent = req.body.cityEvent;
        const startDate = moment(req.body.departureDate).format("YYYY-MM-DD");
        const endDate = moment(req.body.returnDate).format("YYYY-MM-DD");
        console.log("Ticketmaster Dates: ", startDate, endDate);
        //&startDateTime=YYYY-MM-DDT00:00:00Z&endDateTime=YYYY-MM-DDT23:59:00Z
        const eventQueryURL = `https://app.ticketmaster.com/discovery/v2/events.json?city=${cityEvent}&startDateTime=${startDate}T00:01:00Z&endDateTime=${endDate}T23:59:00Z&apikey=zotluMaanqoUR4sTfliAco7lbM5hAij4`;
        return axios.get(eventQueryURL);
      })
      .then(function(eventsData) {
        var eventsDataArr = eventsData.data._embedded.events;
        // console.log(eventsDataArr)
        eventsDataArr.forEach(function(event) {
          // console.log(event)
          const eventDetails = {
            eventName: event.name,
            eventDate: event.dates.start.localDate,
            eventTime: event.dates.start.localTime,
            eventVenue: event._embedded.venues[0].name,
            eventUrl: event.url
            // "Event Price:": event.priceRanges[2].min,
          };
          events.push(eventDetails);
        });

        const flightsAndEvents = {
          flights: flights,
          events: events
        };
        console.log(flightsAndEvents);
        // res.json(flightsAndEvents);
        res.render("index", {
          flights,
          events
        });
      })
      .catch(function(err) {
        console.log("ERROR API_ROUTE");
        console.log(err);
      });

    // store form submission in db
    // res.redirect("/citySearch/ new id from db insert")
  });

  // //route to post data from citySearch but for now will post from itinerary
  // //need to get the user id first
  // //this needs to go in the /api/trips routes?
  // app.post("/api/itinerary", function(req, res) {
  //   console.log(req.body);

  //   db.Trip.create({
  //     UserId: 1, //need to define UserID from user_data api call,
  //     cityName: req.body.cityName,
  //     departureDate: req.body.departureDate,
  //     arrivalDate: req.body.arrivalDate
  //   }).then(function() {
  //     res.redirect(307, "/itinerary");
  //   });
  // });

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

        // include: [{ model: db.Event }],
        // include: [{ model: db.Flight }]
      ]
    }).then(function(dbUser) {
      console.log(dbUser);
      res.json(dbUser);
    });
  });

  app.post("/api/trips", (req, res) => {
    // front-end JS todo: get access to currently logged in user's id (by making an AJAX
    // call to the route referenced above) and save it as the trip object's 'UserId'

    // front-end JS todo: build the object you're posting to this route with a trip
    // sub-object (containing all the key/val pairs necessary for creating a new trip),
    // a flights sub-array (containing a list of flight objects you want to save for
    // that trip), and an objects sub-array (containing a list of event objects you want
    // to save for that trip)

    // make sure that when you create a new trip, the 'trip' object you send from the
    // front-end has a UserId key/val pair!
    // console.log("req", req);
    console.log("req", req.body);
    console.log("Trip", req.body.trip);
    console.log("Events", req.body.events);
    console.log("Flights", req.body.flights);
    console.log("WONDERFUL", req.body.trip.UserId);
    db.Trip.create({
      UserId: req.body.trip.UserId,
      cityName: req.body.trip.cityName,
      departureDate: req.body.trip.departureDate,
      arrivalDate: req.body.trip.arrivalDate
    })
      .then(async ({ id }) => {
        console.log("hi");
        // mapping through array of flights/events from the front-end and adding
        // the correct TripId to each
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
          console.log(err);
        }
      });
    // after the trip is created, grab the id of newly-created trip (you'll need this
    // in order to add new flight and event records that are associated with the
    // correct trip!)
  });
};
