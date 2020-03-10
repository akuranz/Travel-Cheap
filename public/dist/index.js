console.log("searchResults js file");
let savedSearch = [];
$(function() {
  $(".change-saved").on("click", function(a) {
    a.preventDefault(), $(".savedResults").empty();
    let b = $(this).data("saved"),
      c = $(this).data("category"),
      d = {
        eventCity: $(this).data("eventcity"),
        eventName: $(this).data("eventname"),
        eventDate: $(this).data("eventdate"),
        eventTime: $(this).data("eventtime"),
        eventVenue: $(this).data("eventvenue"),
        eventUrl: $(this).data("eventurl"),
        category: "event"
      },
      e = {
        flightAirline: $(this).data("flightairline"),
        flightPrice: $(this).data("flightprice"),
        flightDuration: $(this).data("flightduration"),
        flightDepartureTime: $(this).data("flightdeparturetime"),
        flightArrivalTime: $(this).data("flightarrivaltime"),
        category: "flight"
      };
    console.log("eventDetails", a.target),
      (b = $(this).attr("saved", !b)),
      console.log("saved", !b),
      "event" === c ? savedSearch.push(d) : savedSearch.push(e);
    let f = $(".savedResults");
    console.log("SavedSearch:", savedSearch);
    for (var g = 0; g < savedSearch.length; g++) {
      if ("event" === savedSearch[g].category) {
        var h = $("<div>").attr("class", "col-md-4"),
          j = [
            $("<h4>")
              .text(savedSearch[g].eventCity)
              .attr("class", "savedCityName"),
            $("<h4>").text("Event Details"),
            $("<p>")
              .text(savedSearch[g].eventName)
              .attr("class", "savedEventName"),
            ,
            $("<p>")
              .text(savedSearch[g].eventDate)
              .attr("class", "savedEventDate"),
            ,
            $("<p>")
              .text(savedSearch[g].eventTime)
              .attr("class", "savedEventTime"),
            ,
            $("<p>")
              .text(savedSearch[g].eventVenue)
              .attr("class", "savedEventVenue"),
            ,
            $("<p>")
              .text(savedSearch[g].eventUrl)
              .attr("class", "savedEventURL")
          ];
        h.append(j), f.append(h);
      }
      if ((console.log(savedSearch[g]), "flight" === savedSearch[g].category)) {
        var k = $("<div>").attr("class", "col-md-4"),
          l = [
            $("<h4>").text("Flight Details"),
            $("<p>")
              .text(savedSearch[g].flightAirline)
              .attr("class", "savedAirlineName"),
            $("<p>")
              .text(savedSearch[g].flightPrice)
              .attr("class", "savedFlightPrice"),
            $("<p>")
              .text(savedSearch[g].flightDuration)
              .attr("class", "savedFlightDuration"),
            $("<p>")
              .text(savedSearch[g].flightDepartureTime)
              .attr("class", "savedDepartureDate"),
            $("<p>")
              .text(savedSearch[g].flightArrivalTime)
              .attr("class", "savedArrivalDate")
          ];
        k.append(l), f.append(k);
      }
      console.log("Saved Flights:", savedSearch[g]);
    }
  });
}),
  $(".saved-itinerary").click(function() {
    console.log("hi"), event.preventDefault();
    let a = $(".savedEventName").text(),
      b = $(".savedEventTime").text(),
      c = $(".savedEventDate").text(),
      d = $(".savedEventVenue").text(),
      e = $(".savedEventURL").text(),
      f = $(".savedFlightPrice").text(),
      g = $(".savedDepartureDate").text(),
      h = $(".savedArrivalDate").text(),
      i = $(".savedCityName").text();
    saveItinerary(a, b, c, d, e, f, g, h, i),
      console.log(a, b, c, d, e, f, g, h, i);
  });
function saveItinerary(a, b, c, d, e, f, g, h, i) {
  (savedItineraries = {
    trip: { cityName: i, departureDate: g, arrivalDate: h },
    flights: [{ price: f, departureDate: g, arrivalDate: h }],
    events: [{ name: a, date: c, time: b, venue: d, url: e }]
  }),
    $.post("/api/trips", savedItineraries).then(function(a) {
      console.log(a),
        a
          ? console.log("You looked up: ", savedItineraries)
          : console.log("That is not a valid city");
    });
}
$("#search-logout").on("click", function() {
  console.log("logout"), (window.location.href = "/logout");
}),
  $("#saved-itinerary").on("click", function() {
    console.log("redirect to itinerary"), (window.location.href = "/itinerary");
  });
