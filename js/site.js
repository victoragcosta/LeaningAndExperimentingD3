// Show 20 numbers
if (d3.select("#num20-display").node()) {
  let d20numbers = new ArrayDisplay("#num20-display");
  d20numbers.data = d3.range(20).map((e) => {
    return { value: e, color: "black" };
  });
}
// /Show 20 numbers

// Deal with resizing of the screen
let resizer = () => {
  let width = $(window).width();
  if (width < 400) {
    $("#home").addClass("display-4").removeClass("display-1 display-3");
  } else if (width < 576) {
    $("#home").addClass("display-3").removeClass("display-1 display-4");
  } else {
    $("#home").addClass("display-1").removeClass("display-3 display-4");
  }
};
$(window).resize(resizer);
$(document).ready(resizer);
// /Deal with resizing of the screen

// Deal with ranges
if ($('input[data-toggle="range"]')[0]) {
  $('input[data-toggle="range"]').on("input", function () {
    let self = $(this);
    let target = $(self.attr("data-target"));
    if (target[0]) {
      target.text(self.prop("value"));
    }
  });
}
// /Deal with ranges
