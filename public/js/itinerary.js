//toggle button to show saved info for Flights and Events
let showInfo = true;
$(".seeInfo").on("click", function(event) {
console.log("btn clicked");
if(showInfo === true){
    $(".hiddenItinerary").css("display", "block");
    $(".seeInfo").text("Hide Info");
    showInfo = false;
}else{
    $(".hiddenItinerary").css("display", "none");
    $(".seeInfo").text("Itinerary");
    showInfo = true;
}
});