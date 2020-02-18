// AirportInput("cityFromInput");
// AirportInput("cityToInput");

// clicking search button
$("#searchCity").click(function() {
  event.preventDefault();
  var cityFrom = $("#cityFromInput")
    .val()
    .trim();
  var cityTo = $("#cityToInput")
    .val()
    .trim();
  // insert function to send to the backend for the axios call?
  postCity(cityFrom, cityTo);
});

// clicking previously searched itinerary
$(document).on("click", ".city", function(event) {
  var cityFrom = $(this).attr("data-nameFrom");
  var cityTo = $(this).attr("data-nameTo");
  // insert function to send to the backend for the axios call?
  postCity(cityFrom, cityTo);
});

function postCity(cityFrom, cityTo) {
  cities = { cityFrom: cityFrom, cityTo: cityTo };
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
