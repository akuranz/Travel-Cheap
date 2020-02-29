// AirportInput("cityFromInput");
// AirportInput("cityToInput");
// clicking search button
let CurrentUserId = localStorage.getItem("UserId");

console.log("searchResults js file");
$(".saved-itinerary").click(function() {
  console.log("hi");
  event.preventDefault();

  let savedEventName = $("#savedEventName").text();

  let savedEventTime = $("#savedEventTime").text();

  let savedEventDate = $("#savedEventDate").text();

  let savedEventVenue = $("#savedEventVenue").text();

  let savedEventURL = $("#savedEventURL").text();

  let savedFlightPrice = $("#savedFlightPrice").text();

  let savedDepartureDate = $("#savedDepartureDate").text();

  let savedArrivalDate = $("#savedArrivalDate").text();

  let savedCityName = $("#savedCityName").text();

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

let cityName = $("#cityEvent").text();
// let savedEvents = [];
// let savedFlights = [];
let savedSearch = [];
$(function() {
  $(".change-saved").on("click", function(event) {
    event.preventDefault();
    $(".savedResults").empty();
    console.log("cityName", cityName);
    let saved = $(this).data("saved");
    let category = $(this).data("category");
    console.log(category);
    let eventName = $(this).data("eventname");
    let eventDate = $(this).data("eventdate");
    let eventTime = $(this).data("eventtime");
    let eventVenue = $(this).data("eventvenue");
    let eventUrl = $(this).data("eventurl");
    let eventDetails = {
      cityName: cityName,
      eventName: eventName,
      eventDate: eventDate,
      eventTime: eventTime,
      eventVenue: eventVenue,
      eventUrl: eventUrl,
      category: "event"
    };

    let flightAirline = $(this).data("flightairline");
    let flightPrice = $(this).data("flightprice");
    let flightDuration = $(this).data("flightduration");
    let flightDepartureTime = $(this).data("flightdeparturetime");
    let flightArrivalTime = $(this).data("flightarrivaltime");

    let flightDetails = {
      flightAirline: flightAirline,
      flightPrice: flightPrice,
      flightDuration: flightDuration,
      flightDepartureTime: flightDepartureTime,
      flightArrivalTime: flightArrivalTime,
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
            .text("City Name: " + savedSearch[i].cityName)
            .attr("id", "savedCityName"),
          $("<p>")
            .text("Event Name: " + savedSearch[i].eventName)
            .attr("id", "savedEventName"),
          ,
          $("<p>")
            .text("Event Date: " + savedSearch[i].eventDate)
            .attr("id", "savedEventDate"),
          ,
          $("<p>")
            .text("Event Time: " + savedSearch[i].eventTime)
            .attr("id", "savedEventTime"),
          ,
          $("<p>")
            .text("Event Venue: " + savedSearch[i].eventVenue)
            .attr("id", "savedEventVenue"),
          ,
          $("<p>")
            .text("Event Url: " + savedSearch[i].eventUrl)
            .attr("id", "savedEventURL")
        ];

        eventDiv.append(eventDets);
        savedResults.append(eventDiv);
      }

      // }        for (var i = 0; i < savedFlights.length; i++) {
      // add divs for each event/flight in savedEvents to the saved container
      console.log(savedSearch[i]);
      if (savedSearch[i].category === "flight") {
        var flightDiv = $("<div>").attr("class", "col-md-4");
        var flightDets = [
          $("<h2>").text("Flight Details"),
          $("<p>")
            .text("Airline: " + savedSearch[i].flightAirline)
            .attr("id", "savedAirlineName"),
          $("<p>")
            .text("Price: " + savedSearch[i].flightPrice)
            .attr("id", "savedFlightPrice"),
          $("<p>")
            .text("Duration: " + savedSearch[i].flightDuration)
            .attr("id", "savedFlightDuration"),
          $("<p>")
            .text("Departure Time: " + savedSearch[i].flightDepartureTime)
            .attr("id", "savedDepartureDate"),
          $("<p>")
            .text("Arrival Time: " + savedSearch[i].flightArrivalTime)
            .attr("id", "savedArrivalDate")
          // $("<button>")
          //   .text("Save Itinerary")
          //   .attr("class", "btn btn-primary saved-itinerary")
        ];
        flightDiv.append(flightDets);
        savedResults.append(flightDiv);
      }
      // }
      console.log("Saved Flights:", savedSearch[i]);
    }
  });

  // console.log("Saved Events:", savedEvents);
  // console.log("Saved Flights:", savedFlights);
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
  cityName
) {
  //need an array on the front end in the right format
  savedItineraries = {
    trip: {
      UserId: CurrentUserId,
      cityName: cityName,
      departureDate: savedDepartureDate,
      arrivalDate: savedArrivalDate
    },
    flights: [
      {
        price: savedFlightPrice,
        departureDate: savedDepartureDate,
        arrivalDate: savedArrivalDate
      }
    ],
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
  console.log("logout");
  window.location.href = "/itinerary";
});

$("#searchBtn").on("click", function(event) {
  console.log("clear div");
  $("#centerBtn").empty();
});
