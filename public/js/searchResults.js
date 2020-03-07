// AirportInput("cityFromInput");
// AirportInput("cityToInput");

console.log("searchResults js file");
let savedSearch = [];
$(function() {
  $(".change-saved").on("click", function(event) {
    event.preventDefault();
    $(".savedResults").empty();

    let saved = $(this).data("saved");
    let category = $(this).data("category");
    let eventDetails = {
      eventCity: $(this).data("eventcity"),
      eventName: $(this).data("eventname"),
      eventDate: $(this).data("eventdate"),
      eventTime: $(this).data("eventtime"),
      eventVenue: $(this).data("eventvenue"),
      eventUrl: $(this).data("eventurl"),
      category: "event"
    };

    let flightDetails = {
      flightAirline: $(this).data("flightairline"),
      flightPrice: $(this).data("flightprice"),
      flightDuration: $(this).data("flightduration"),
      flightDepartureTime: $(this).data("flightdeparturetime"),
      flightArrivalTime: $(this).data("flightarrivaltime"),
      category: "flight"
    };

    console.log("eventDetails", event.target);
    // if (saved === false) {
    saved = $(this).attr("saved", !saved);
    console.log("saved", !saved);
    if (category === "event") {
      savedSearch.push(eventDetails);
    } else {
      savedSearch.push(flightDetails);
    }
    // clear out the saved container
    let savedResults = $(".savedResults");
    // loop through savedEvents
    console.log("SavedSearch:", savedSearch);
    for (var i = 0; i < savedSearch.length; i++) {
      // add divs for each event/flight in savedEvents to the saved container
      if (savedSearch[i].category === "event") {
        var eventDiv = $("<div>").attr("class", "col-md-4");
        var eventDets = [
          // $("<p>").text(cityName),
          $("<h4>")
            .text(savedSearch[i].eventCity)
            .attr("class", "savedCityName"),
          $("<h4>").text("Event Details"),
          $("<p>")
            .text(savedSearch[i].eventName)
            .attr("class", "savedEventName"),
          ,
          $("<p>")
            .text(savedSearch[i].eventDate)
            .attr("class", "savedEventDate"),
          ,
          $("<p>")
            .text(savedSearch[i].eventTime)
            .attr("class", "savedEventTime"),
          ,
          $("<p>")
            .text(savedSearch[i].eventVenue)
            .attr("class", "savedEventVenue"),
          ,
          $("<p>")
            .text(savedSearch[i].eventUrl)
            .attr("class", "savedEventURL")
        ];

        eventDiv.append(eventDets);
        savedResults.append(eventDiv);
      }

      console.log(savedSearch[i]);
      if (savedSearch[i].category === "flight") {
        var flightDiv = $("<div>").attr("class", "col-md-4");
        var flightDets = [
          $("<h4>").text("Flight Details"),
          $("<p>")
            .text(savedSearch[i].flightAirline)
            .attr("class", "savedAirlineName"),
          $("<p>")
            .text(savedSearch[i].flightPrice)
            .attr("class", "savedFlightPrice"),
          $("<p>")
            .text(savedSearch[i].flightDuration)
            .attr("class", "savedFlightDuration"),
          $("<p>")
            .text(savedSearch[i].flightDepartureTime)
            .attr("class", "savedDepartureDate"),
          $("<p>")
            .text(savedSearch[i].flightArrivalTime)
            .attr("class", "savedArrivalDate")
        ];
        flightDiv.append(flightDets);
        savedResults.append(flightDiv);
      }
      // }
      console.log("Saved Flights:", savedSearch[i]);
    }
  });
});

$(".saved-itinerary").click(function() {
  console.log("hi");
  event.preventDefault();

  let savedEventName = $(".savedEventName").text();

  let savedEventTime = $(".savedEventTime").text();

  let savedEventDate = $(".savedEventDate").text();

  let savedEventVenue = $(".savedEventVenue").text();

  let savedEventURL = $(".savedEventURL").text();

  let savedFlightPrice = $(".savedFlightPrice").text();

  let savedDepartureDate = $(".savedDepartureDate").text();

  let savedArrivalDate = $(".savedArrivalDate").text();

  let savedCityName = $(".savedCityName").text();

  saveItinerary(
    savedEventName,
    savedEventTime,
    savedEventDate,
    savedEventVenue,
    savedEventURL,
    savedFlightPrice,
    savedDepartureDate,
    savedArrivalDate,
    savedCityName
  );

  console.log(
    savedEventName,
    savedEventTime,
    savedEventDate,
    savedEventVenue,
    savedEventURL,
    savedFlightPrice,
    savedDepartureDate,
    savedArrivalDate,
    savedCityName
  );
});

function saveItinerary(
  savedEventName,
  savedEventTime,
  savedEventDate,
  savedEventVenue,
  savedEventURL,
  savedFlightPrice,
  savedDepartureDate,
  savedArrivalDate,
  savedCityName
) {
  //need an array on the front end in the right format
  savedItineraries = {
    trip: {
      cityName: savedCityName,
      departureDate: savedDepartureDate,
      arrivalDate: savedArrivalDate
    },
    //stringify the array and then parse it when we pull it back out
    flights: [
      {
        price: savedFlightPrice,
        departureDate: savedDepartureDate,
        arrivalDate: savedArrivalDate
      }
    ],
    //stringify the array and then parse it when we pull it back out
    events: [
      {
        name: savedEventName,
        date: savedEventDate,
        time: savedEventTime,
        venue: savedEventVenue,
        url: savedEventURL
      }
    ]
  };
  $.post("/api/trips", savedItineraries).then(function(data) {
    console.log(data);
    if (data) {
      console.log("You looked up: ", savedItineraries);
    } else {
      console.log("That is not a valid city");
    }
  });
}

$("#search-logout").on("click", function(event) {
  console.log("logout");
  window.location.href = "/logout";
});

$("#saved-itinerary").on("click", function(event) {
  console.log("redirect to itinerary");
  window.location.href = "/itinerary";
});
