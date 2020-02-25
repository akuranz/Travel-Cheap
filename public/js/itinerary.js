//toggle button to show saved info for Flights and Events
let showInfo = true;
$("button").on("click", function(event) {
console.log("btn clicked");
var currentBtn = $(this).data("id");
console.log(currentBtn);
if(showInfo === true){
    $(`#${currentBtn}`).css("display", "block");
    showInfo = false;
}else{
    $(`#${currentBtn}`).css("display", "none");
    showInfo = true;
}
});