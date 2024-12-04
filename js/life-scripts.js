/* ------------------------------------------- */
/* index.html >> styles.css >> work-scripts.js */
/* life.html >> styles.css >> life-scripts.js  */
/* projects.html >> styles.css >> projects-scripts.js  */
/* ------------------------------------------- */

$("#dialog-confirm").dialog({
  autoOpen: false,
  resizable: false,
  height: "auto",
  width: 400,
  modal: true,
  buttons: {
    "Cancel": function () {
      $(this).dialog("close");
    },
    "Clear All To-dos": function () {
      $("li").slideUp(300, function () {
        $(this).remove();
      });
      // Play a sound when deleting
      soundRecycle.play();
      localStorage.removeItem("life-items");
      todoArray = [];
      event.stopPropagation();
      $("#dialog-confirm").dialog("close");
    }
  }
});


// Top page navigation
// Link to elements with data-url attributes -----------------------------------
$(document).on("click", "[data-url]", function () {
  let url = $(this).data("url");
  window.location.href = url;
});


// // Global variable for the todoArray variable
var todoArray;
var playSounds = true;
var soundAdd = new Howl({
  src: ['sound/delete.mp3'],
  autoplay: false,
  volume: 0.3
});

var soundDelete = new Howl({
  src: ['sound/add.mp3'],
  autoplay: false,
  volume: 0.3
});

var soundRecycle = new Howl({
  src: ['sound/recycle.mp3'],
  autoplay: false,
  volume: 0.2
});

// Toggle the line-through on "done" life-items
// $("ul").on("click", "li", function() {
//    $(this).toggleClass("line-through");
// });

// Remove the item on clicking the red x
$("ul").on("click", "span.del", function (event) {
  $(this).parent().slideUp(300, function () {
    var todoItem = $(this).text();
    // removes todoItem from todoArray
    todoArray.splice($.inArray(todoItem, todoArray), 1);
    // Play a sound when deleting
    soundDelete.play();
    // Writes to localstorage
    localStorage.setItem('life-items', JSON.stringify(todoArray));
    // Removes the item from the DOM
    $(this).remove();
  });
  event.stopPropagation();
});

// Edit the todo (removed event as it's not passed into function)
$("ul").on("click", "span.edit-this", function () {
  var currentTodo = $(this).parent().text();
  var getEdit = prompt("Edit this to-do...", currentTodo);

  //break out of the function early if cancel or empty
  if (getEdit === null) {
    return;
  }

  // Write the value from the prompt to the list item Todo
  $(this).next().html(getEdit);

  // write the changes to the localStorage
  var newTodoArray = [];

  $("#todo-list li").each(function () {
    newTodoArray.push($(this).text());
  });

  todoArray = newTodoArray.reverse();


  if (window.location.href.indexOf("life") > -1) {
    localStorage.setItem('life-items', JSON.stringify(todoArray));
  } else if (window.location.href.indexOf("index") > -1) {
    localStorage.setItem('work-items', JSON.stringify(todoArray));
  } else {
    localStorage.setItem('project-items', JSON.stringify(todoArray));
  }

});

// Remove all & reset the form (removed event as it's not passed into function)
$("#reset-div").on("click", "#reset-list", function () {

  $("#dialog-confirm").dialog("open");

  // remove the close button on the modal
  $(".ui-dialog-titlebar-close").remove();
  $(".ui-icon-alert").remove();
  $(".ui-dialog-buttonset button:first-of-type").addClass("btn btn-default");
  $(".ui-dialog-buttonset button:last-of-type").addClass("btn btn-primary");

});

// Email the life list (removed event as it's not passed into function)
$("#reset-div").on("click", "#email-list", function () {

  var emailRecipient = prompt("Enter email address: ");

  var checkmark = "%E2%9C%94  ";

  emailList = JSON.parse(localStorage.getItem('life-items'));

  // reverse the list
  emailList.reverse();
  var newString = "";

  for (let i = 0; i < emailList.length; i++) {

    // adds the linebreak and carriage return to the entries to be emailed
    newString += checkmark + emailList[i] + "%0D%0A";
  }

  var link = 'mailto:' + emailRecipient + '?subject=To-do list (LIFE)' + '&body=' + newString;

  window.open(link, '_blank');

});

// Add a todo to the list
$("#todo-addition").keypress(function (event) {
  if (event.which === 13) {

    var newTodo = $(this).val();

    // add the input to the array
    todoArray.push(newTodo);
    soundAdd.play();

    localStorage.setItem('life-items', JSON.stringify(todoArray));

    $(this).val("");
    $("ul").prepend("<li><span class='del opacity-50'><i class='fa-solid fa-times' aria-hidden='true'></i></span><span class='edit-this'><i class='fa fa-pencil opacity-50' aria-hidden='true'></i></span>" + "<span class='todo-text-node'>" + newTodo + "</span>" + "</li>");

    event.preventDefault();
  }
});

$("#todo-list").disableSelection();
$("ul, li").disableSelection();


// Toggle sound Icons
$("#sounds #sound-on").on("click", function () {
  $(this).toggleClass("d-none");
  $("#sounds #sound-off").toggleClass("d-none");
  setVolume(false);
});

$("#sounds #sound-off").on("click", function () {
  $(this).toggleClass("d-none");
  $("#sounds #sound-on").toggleClass("d-none");
  setVolume(true);
});

function setVolume(playSounds) {
  if (playSounds === true) {
    // Play sound when adding a todo
    // console.log("true");
    soundAdd._src = "sound/delete.mp3";
    soundDelete._src = "sound/add.mp3";
    soundRecycle._src = "sound/recycle.mp3";
    // console.log(sound);
  } else {
    // Don't play sound when adding a todo
    // console.log("false");
    soundAdd._src = "sound/silent.mp3";
    soundDelete._src = "sound/silent.mp3";
    soundRecycle._src = "sound/silent.mp3";
    // console.log(sound);
  }
}

// Main function
function main() {
  if (!localStorage.getItem('life-items')) {
    todoArray = [];
  } else {
    todoArray = JSON.parse(localStorage.getItem('life-items'));

    var arrayLength = todoArray.length;

    for (var i = arrayLength - 1; i >= 0; i--) {
      $('#todo-list').append("<li class='sortable'><span class='del opacity-50'><i class='fa-solid fa-times' aria-hidden='true'></i></span><span class='edit-this opacity-50'><i class='fa fa-pencil' aria-hidden='true'></i></span>" + "<span class='todo-text-node'>" + todoArray[i] + "</span>" + "</li>");
    }
  }
}

// Scroll to top button — When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction()
};

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("topper").style.display = "block";
  } else {
    document.getElementById("topper").style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

$("#topper").on("click", function () {
  $("html").animate({
    scrollTop: 0
  }, 500, "easeOutQuad");
});

// In-page sccroll-to links
// $("a.scroll-link").click(function(event) {
//   event.preventDefault();
//   $("html, body").animate({
//     scrollTop: $($(this).attr("href")).offset().top - 100
//   }, 500, "easeOutQuad");
// });

$('[data-toggle="tooltip"]').tooltip();


// Get the date for saving to a filename
var d = new Date();
var month = d.getMonth() + 1;
var day = d.getDate();
var hours = d.getHours();
var amPm = "am";
if (hours >= 12) {
  hours = hours - 12;
  amPm = "pm";
}
var minutes = d.getMinutes();

// Concatenate date and file name
var fullDate = d.getFullYear() + '-' +
  (('' + month).length < 2 ? '0' : '') + month + '-' +
  (('' + day).length < 2 ? '0' : '') + day + "-" + hours + minutes + amPm;
var fileToSave = fullDate + "-punchlist-life.txt";

// Save button
$("#save-button").on("click", function () {

  var listy = $("#todo-list li").map(function () {
    return $(this).text();
  }).get().join("\n");

  // $("#randomStudent li").text()

  var blob = new Blob([listy], {
    type: "text/txt;charset=utf-8"
  });
  saveAs(blob, fileToSave);
});

// Main function
main();
