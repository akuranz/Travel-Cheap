var queryURL = "/api/trips/" + 1;

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
  // console.log(response);
});
