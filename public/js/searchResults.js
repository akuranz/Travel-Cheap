// AirportInput("cityFromInput");
// AirportInput("cityToInput");
// clicking search button
console.log("searchResults js file");
$(".saved-itinerary").click(function() {
  console.log("hi");
  event.preventDefault();
  let savedEventName = $(".savedEventName")
    .val()
    .trim();
  let savedEventTime = $(".savedEventTime")
    .val()
    .trim();
  let savedEventDate = $(".savedEventDate")
    .val()
    .trim();
  let savedEventVenue = $(".savedEventVenue")
    .val()
    .trim();
  let savedEventURL = $(".savedEventURL")
    .val()
    .trim();
  let savedFlightPrice = $(".savedFlightPrice")
    .val()
    .trim();
  let savedDepartureDate = $(".savedDepartureDate")
    .val()
    .trim();
  let savedArrivalDate = $(".savedArrivalDate")
    .val()
    .trim();

  saveItinerary(
    savedEventName,
    savedEventTime,
    savedEventDate,
    savedEventVenue,
    savedEventURL,
    savedFlightPrice,
    savedDepartureDate,
    savedArrivalDate
  );
  console.log(
    savedEventName,
    savedEventTime,
    savedEventDate,
    savedEventVenue,
    savedEventURL,
    savedFlightPrice,
    savedDepartureDate,
    savedArrivalDate
  );
});

// let saved = $(".change-saved");
// saved.click(function() {
//   let eventId = saved.data(eventid)
//   saved.data("saved", true);
// });

let savedEvents = [];
let savedFlights = [];
$(function() {
  $(".change-saved").on("click", function(event) {
    event.preventDefault();
    let saved = $(this).data("saved");
    let eventName = $(this).data("eventname");
    let eventDate = $(this).data("eventdate");
    let eventTime = $(this).data("eventtime");
    let eventVenue = $(this).data("eventvenue");
    let eventUrl = $(this).data("eventurl");
    let eventDetails = {
      eventName: eventName,
      eventDate: eventDate,
      eventTime: eventTime,
      eventVenue: eventVenue,
      eventUrl: eventUrl
    };

    let flightPrice = $(this).data("flightprice");
    let flightDuration = $(this).data("flightduration");
    let flightDepartureTime = $(this).data("flightdeparturetime");
    let flightArrivalTime = $(this).data("flightarrivaltime");

    let flightDetails = {
      flightPrice: flightPrice,
      flightDuration: flightDuration,
      flightDepartureTime: flightDepartureTime,
      flightArrivalTime: flightArrivalTime
    };

    console.log("eventDetails", event.target);
    $(".savedResults").empty();
    if (saved === false) {
      saved = $(this).attr("saved", !saved);
      console.log("saved", !saved);
      savedEvents.push(eventDetails);
      savedFlights.push(flightDetails);
      // clear out the saved container
      let savedResults = $(".savedResults");
      // loop through savedEvents
      for (var i = 0; i < savedEvents.length; i++) {
        // add divs for each event/flight in savedEvents to the saved container
        var eventNamePrint = [
          $("<p>").text(savedEvents[i].eventName),
          $("<p>").text(savedEvents[i].eventDate),
          $("<p>").text(savedEvents[i].eventTime),
          $("<p>").text(savedEvents[i].eventVenue),
          $("<p>").text(savedEvents[i].eventUrl)
        ];

        savedResults.append(eventNamePrint);
      }
      for (var i = 0; i < savedFlights.length; i++) {
        // add divs for each event/flight in savedEvents to the saved container
        var flightNamePrint = [
          $("<p>").text(savedFlights[i].flightPrice),
          $("<p>").text(savedFlights[i].flightDuration),
          $("<p>").text(savedFlights[i].flightDepartureTime),
          $("<p>").text(savedFlights[i].flightArrivalTime)
        ];

        savedResults.append(flightNamePrint);
      }
    }
    console.log("Saved Events:", savedEvents);
    console.log("Saved Flights:", savedFlights);
  });
});

// function postCity(cityFrom, cityTo, departureDate, returnDate, cityEvent) {
//   console.log("In post flight");
//   cities = {
//     cityFrom: cityFrom,
//     cityTo: cityTo,
//     departureDate: departureDate,
//     returnDate: returnDate,
//     cityEvent: cityEvent
//   };
//   $.post("/api/citySearch", cities)
//     .then(function(data) {
//       console.log(data);
//       if (data) {
//         console.log("You looked up: ", cities);
//       } else {
//         console.log("That is not a valid city");
//       }
//     })
//     .catch(function(err) {
//       console.log(err.message);
//     });
// }

//this is where we create the nested object?
//create container with events and flights in index.handlebars
// const saveItinerary = $(".saveItinerary");

// //get the object

// saveItinerary.on(() => {
//   event.preventDefault();
// });

function saveItinerary(
  savedEventName,
  savedEventTime,
  savedEventDate,
  savedEventVenue,
  savedEventURL,
  savedFlightPrice,
  savedDepartureDate,
  savedArrivalDate
) {
  // $(".saved-itinerary").on("click", function(event) {
  //   event.preventDefault();
  //need an array on the front end in the right format
  savedItineraries = {
    trip: {
      UserId: 1,
      cityName: "Denver",
      departureDate: "2020-03-28",
      arrivalDate: "2020-03-28"
    },
    flights: [
      {
        price: "200",
        departureDate: "2020-03-28",
        arrivalDate: "2020-03-28"
      }
    ],
    events: [
      {
        price: "20",
        date: "2020-03-28",
        time: "8:00"
      }
    ]
  };
  $.post("/api/trips", savedItineraries).then(function(data) {
    console.log(data);
    if (data) {
      console.log("You looked up: ", cities);
    } else {
      console.log("That is not a valid city");
    }
  });
}

// original format YYYY-MM-DD, needs to change to MM/DD/YYYY
// takes depature and return date and reformats it
// let departureD = $("#departureDate")
//   .val()
//   .trim();

// const departureDate = dateFormatter(departureD);

// console.log("Departure Date: ", departureDate.moment().format("DD/MM/YYYY"));
//   let returnD = $("#returnDate")
//     .val()
//     .trim();

// console.log("Departure Date: ", departureDate);
// const returnDate = dateFormatter(returnD);

// console.log("Return Date: ", returnDate);

// clicking previously searched itinerary
// $(document).on("click", ".city", function(event) {
//   var cityFrom = $(this).attr("data-nameFrom");
//   var cityTo = $(this).attr("data-nameTo");
//   // var departureDate = $(this).attr("data-nameDeparture");
//   // var returnDate = $(this).attr("data-nameReturn");
//   // insert function to send to the backend for the axios call?

// postCity(cityFrom, cityTo, departureDate, returnDate);
//   postCity(cityFrom, cityTo, cityEvent);
// });

// function postCity(cityFrom, cityTo) {
//   console.log("In post city")
//   cities = {
//     cityFrom: cityFrom,
//     cityTo: cityTo
//     // departureDate: departureDate,
//     // returnDate: returnDate
//   };

// postCity(cityFrom, cityTo);

//   let cityFrom = $(this).attr("data-nameFrom");
//   let cityTo = $(this).attr("data-nameTo");

//   // takes depature and return date and reformats it
//   let departureD = $(this).attr("data-nameDeparture");
//   const departureDate = dateFormatter(departureD);
//   console.log("Departure Date: " + departureDate);

//   let returnD = $(this).attr("data-nameReturn");
//   const returnDate = dateFormatter(returnD);
//   console.log("Return Date: " + returnDate);

//   // function to send to the backend
//   postCity(cityFrom, cityTo, departureDate, returnDate);
// }

//reformatted to move day first, then month to match api query
// function dateFormatter(date) {
//   let year = date.substring(0, 4);
//   let month = date.substring(5, 7);
//   let day = date.substring(8);
//   let finalDate = day + "/" + month + "/" + year;
//   return finalDate;
// }

// function dateFormatter(date) {
//     let year = date.substring(0, 4);
//     let month = date.substring(5, 7);
//     let day = date.substring(8);
//     let finalDate = month + "/" + day + "/" + year;
//     return finalDate;
// }

// create function that creates button for each saved itinerary
// below is renderButtons function from weather planner that uses local storage to create buttons
// will have to change to using database information

// function renderButtons() {
//   cities = JSON.parse(localStorage.getItem("savedCities"));
//   if (cities === null || cities === undefined) {
//     return;
//   }
//   // Deleting the buttons prior to adding new cities
//   $("#previousSearch").empty();
//   // Looping through the array of cities
//   console.log("Cities: " + cities);
//   for (var i = 0; i < cities.length; i++) {
//     // Then dynamicaly generating buttons for each city in the array
//     var a = $("<button>");
//     // Adding a class of movie to our button
//     a.addClass("city btn btn-outline-secondary btn-block");
//     // Adding a data-attribute
//     a.attr("data-name", cities[i]);
//     // Providing the initial button text
//     a.text(cities[i]);
//     // Adding the button to the buttons-view div
//     $("#previousSearch").append(a);
//   }
// }
