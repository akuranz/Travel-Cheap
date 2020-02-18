// AirportInput("cityFromInput");
// AirportInput("cityToInput");

// clicking search button
$("#searchCity").click(function() {
  event.preventDefault();
  let cityFrom = $("#cityFromInput")
    .val()
    .trim();
  let cityTo = $("#cityToInput")
    .val()
    .trim();

  // original format YYYY-MM-DD, needs to change to MM/DD/YYYY
  // takes depature and return date and reformats it
  let departureD = $("#departureDate")
    .val()
    .trim();
  let departureYear = departureD.substring(0, 4);
  let departureMonth = departureD.substring(5, 7);
  let departureDay = departureD.substring(8);
  let departureDate = departureMonth + "/" + departureDay + "/" + departureYear;
  console.log("Departure Date: " + departureDate);
  let returnD = $("#returnDate")
    .val()
    .trim();
  let returnYear = returnD.substring(0, 4);
  let returnMonth = returnD.substring(5, 7);
  let returnDay = returnD.substring(8);
  let returnDate = returnMonth + "/" + returnDay + "/" + returnYear;
  console.log("Return Date: " + returnDate);
  
  // function to send to the backend
  postCity(cityFrom, cityTo, departureDate, returnDate);
});

// clicking previously searched itinerary
$(document).on("click", ".city", function(event) {
  let cityFrom = $(this).attr("data-nameFrom");
  let cityTo = $(this).attr("data-nameTo");

  // takes depature and return date and reformats it
  let departureD = $(this).attr("data-nameDeparture");
  let departureYear = departureD.substring(0, 4);
  let departureMonth = departureD.substring(5, 7);
  let departureDay = departureD.substring(8);
  let departureDate = departureMonth + "/" + departureDay + "/" + departureYear;
  console.log("Departure Date: " + departureDate);
  let returnD = $(this).attr("data-nameReturn");
  let returnYear = returnD.substring(0, 4);
  let returnMonth = returnD.substring(5, 7);
  let returnDay = returnD.substring(8);
  let returnDate = returnMonth + "/" + returnDay + "/" + returnYear;
  console.log("Return Date: " + returnDate);

  // function to send to the backend
  postCity(cityFrom, cityTo, departureDate, returnDate);
});

function postCity(cityFrom, cityTo, departureDate, returnDate) {
  cities = { cityFrom: cityFrom, cityTo: cityTo, departureDate: departureDate, returnDate, returnDate };
  $.post("/api/citySearch", cities).then(function(data) {
    console.log(data);
    if (data) {
      console.log("You looked up: ", cities);
    } else {
      console.log("That is not a valid city");
    }
  });
}

// create function that creates button for each saved itinerary
// below is renderButtons function from weather planner that uses local storage to create buttons
// will have to change to using database information

// function renderButtons() {
//     cities = JSON.parse(localStorage.getItem("savedCities"));
//     if (cities === null || cities === undefined){
//         return;
//     }
//     // Deleting the buttons prior to adding new cities
//     $("#previousSearch").empty();
//         // Looping through the array of cities
//         console.log("Cities: " + cities);
//         for (var i = 0; i < cities.length; i++) {

//           // Then dynamicaly generating buttons for each city in the array
//           var a = $("<button>");
//           // Adding a class of movie to our button
//           a.addClass("city btn btn-outline-secondary btn-block");
//           // Adding a data-attribute
//           a.attr("data-name", cities[i]);
//           // Providing the initial button text
//           a.text(cities[i]);
//           // Adding the button to the buttons-view div
//           $("#previousSearch").append(a);
//         }
// }
