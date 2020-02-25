// Requiring our models and passport as we've configured it
var db = require("../models");
var axios = require("axios");
var moment = require("moment");
var passport = require("../config/passport");

const flights = [];
const events = [];

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

  // Route for getting some data about our user to be used client side
  // app.post("/api/citySearch", function(req, res) {
  //   console.log("apiFlights", req.body);
  //   const cityFrom = req.body.cityFromInput;
  //   const cityTo = req.body.cityToInput;
  //   // const departureDate = "11/03/2020";
  //   // const returnDate = "11/03/2020";
  //   // const departureDate = req.body.departureDate;
  //   // const returnDate = req.body.returnDate;
  //   const queryUrl = `https://api.skypicker.com/flights?flyFrom=${cityFrom}&to=${cityTo}&partner=picky&v=3&USD`;
  //   // const queryUrl = `https://api.skypicker.com/flights?flyFrom=${cityFrom}&to=${cityTo}&dateFrom=23/03/2020&dateTo=24/03/2020&partner=picky&v=3&USD`;
  //   axios
  //     .get(queryUrl)
  //     .then(function(data) {
  //       var dataArr = data.data.data;
  //       dataArr.forEach(function(flight) {
  //         const flightRoute = flight.route[0];
  //         const flightDetails = {
  //           Price: flight.price,
  //           Duration: flight.fly_duration,
  //           DepartureTime: moment
  //             .unix(flight.dTime)
  //             .format("MMMM Do YYYY | h:mm a"),
  //           ArrivalTime: moment
  //             .unix(flight.aTime)
  //             .format("MMMM Do YYYY | h:mm a"),
  //           //need to figure out array return
  //           Airline: flight.airlines,
  //           //this is not layover
  //           Layover: flight.has_airport_change,
  //           //if more than one object in flight, which no is it returning?
  //           //is this in handlebars or here?
  //           FlightNumber: flightRoute.operating_flight_no,
  //           OriginCity: flightRoute.cityFrom,
  //           DestinationCity: flightRoute.cityTo
  //         };
  //         console.log(flight);
  //         flights.push(flightDetails);
  //       }); // end dataArr.forEach
  //     }) // end axios.get
  //     .then(function() {
  //       const cityEvent = req.body.cityEvent;
  //       const eventQueryURL = `https://app.ticketmaster.com/discovery/v2/events.json?city=${cityEvent}&apikey=zotluMaanqoUR4sTfliAco7lbM5hAij4`;
  //       return axios.get(eventQueryURL);
  //     })
  //     .then(function(eventsData) {
  //       var eventsDataArr = eventsData.data._embedded.events;
  //       // console.log(eventsDataArr)
  //       eventsDataArr
  //         .forEach(function(event) {
  //           // console.log(event)
  //           const eventDetails = {
  //             "Event Name": event.name,
  //             "Event Date:": event.dates.start.localDate,
  //             "Event Time:": event.dates.start.localTime,
  //             "Event Venue:": event._embedded.venues[0].name,
  //             // "Event Price:": event.priceRanges[2].min,
  //             "Event URL:": event.url
  //           };
  //           events.push(eventDetails);
  //         })
  //         .catch(err => {
  //           if (err) throw new Error(err);
  //         });

  //       const flightsAndEvents = {
  //         flights: flights,
  //         events: events
  //       };
  //       console.log(flightsAndEvents);
  //       res.json(flightsAndEvents);
  //     });
  // });

  app.post("/api/citySearch", function(req, res) {
    // console.log("apiFlights", req.body);
    const cityFrom = req.body.cityFrom;
    const cityTo = req.body.cityTo;
    // const departureDate = req.body.departureDate;
    // const arrivalDate = req.body.departureDate;
    const queryUrl = `https://api.skypicker.com/flights?flyFrom=${cityFrom}&to=${cityTo}&partner=picky&v=3&USD`;
    axios
      .get(queryUrl)
      .then(function(data) {
        var dataArr = data.data.data;
        dataArr.forEach(function(flight) {
          const flightDetails = {
            Price: flight.price,
            Duration: flight.fly_duration,
            DepartureTime: moment.unix(flight.dTime).format("MM/DD/YYYY"),
            ArrivalTime: moment.unix(flight.aTime).format("MM/DD/YYYY"),
            Airline: flight.airline
          };
          // console.log(flight);
          flights.push(flightDetails);
        }); // end dataArr.forEach
      }) // end axios.get
      .then(function() {
        const cityEvent = req.body.cityEvent;
        const eventQueryURL = `https://app.ticketmaster.com/discovery/v2/events.json?city=${cityEvent}&apikey=zotluMaanqoUR4sTfliAco7lbM5hAij4`;
        return axios.get(eventQueryURL);
      })
      .then(function(eventsData) {
        var eventsDataArr = eventsData.data._embedded.events;
        // console.log(eventsDataArr)
        eventsDataArr.forEach(function(event) {
          // console.log(event)
          const eventDetails = {
            "Event Name": event.name,
            "Event Date:": event.dates.start.localDate,
            "Event Time:": event.dates.start.localTime,
            "Event Venue:": event._embedded.venues[0].name,
            // "Event Price:": event.priceRanges[2].min,
            "Event URL:": event.url
          };
          events.push(eventDetails);
        });

        const flightsAndEvents = {
          flights: flights,
          events: events
        };
        console.log(flightsAndEvents);
        res.json(flightsAndEvents);
      });
  });

  //route to post data from citySearch but for now will post from itinerary
  //need to get the user id first
  //this needs to go in the /api/trips routes?
  app.post("/api/itinerary", function(req, res) {
    console.log(req.body);
    db.Trip.create({
      UserId: 1, //need to define UserID from user_data api call,
      cityName: req.body.cityName,
      departureDate: req.body.departureDate,
      arrivalDate: req.body.arrivalDate
    }).then(function() {
      res.redirect(307, "/itinerary");
    });
  });

  app.get("/api/trips/:id", (req, res) => {
    db.User.findAll({
      where: {
        // id: req.params.id
        id: 1
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

  // const eventQueryURL = `https://app.ticketmaster.com/discovery/v2/events.json?city=Denver&apikey=zotluMaanqoUR4sTfliAco7lbM5hAij4`;
  // axios.get(eventQueryURL).then(function(data) {
  //   var eventsDataArr=data.data._embedded.events;
  //   // console.log(eventsDataArr)
  //   eventsDataArr.forEach(function(event){
  //     // console.log(event)
  //   const eventDetails = {
  //       "Event Name": event.name,
  //       "Event Date:": event.dates.start.localDate,
  //       "Event Time:": event.dates.start.localTime,
  //       "Event Venue:": event._embedded.venues[0].name,
  //       "Event URL:":event.url
  //     }
  //     events.push(
  //       eventDetails
  //     );
  // console.log("EVENTS",events)
  // res.json(events);
  //  const flightsAndEvents = {
  //   flights: flights,
  //   events: events
  // }
  // res.json(flightsAndEvents);

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
    console.log("Trip", req.body.trip);
    db.Trip.create(req.body.trip)
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
