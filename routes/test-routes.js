// back-end routes todo: add the "/api/user_data" GET route from the Passport Sequelize
// HW; you can hit this route from your front-end JS to get the currently logged in
// user's id

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
  db.Trip.create(req.body.trip)
    // after the trip is created, grab the id of newly-created trip (you'll need this
    // in order to add new flight and event records that are associated with the
    // correct trip!)
    .then(async ({ id }) => {
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
});
