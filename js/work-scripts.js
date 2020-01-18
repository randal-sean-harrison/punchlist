/* ------------------------------------------- */
/* index.html >> styles.css >> work-scripts.js */
/* life.html >> styles.css >> life-scripts.js  */
/* ------------------------------------------- */

$("#dialog-confirm").dialog({
   autoOpen: false,
   resizable: false,
   height: "auto",
   width: 400,
   modal: true,
   buttons: {
      "Cancel": function() {
         $(this).dialog("close");
      },
      "Clear All To-dos": function() {
         $("li").slideUp(300, function() {
            $(this).remove();
         });
         // Play a sound when deleting
         soundRecycle.play();
         localStorage.removeItem("work-items");
         todoArray = [];
         event.stopPropagation();
         $("#dialog-confirm").dialog("close");
      }
   }
});

// Top page navigation
$("#btn-life").on("click", function() {
   location.href = "life.html";
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


// Toggle the line-through on "done" work-items
// $("ul").on("click", "li", function() {
//    $(this).toggleClass("line-through");
// });

// Remove the item on clicking the x
$("ul").on("click", "span.del", function(event) {
   $(this).parent().slideUp(300, function() {
      var todoItem = $(this).text();
      // removes todoItem from todoArray
      todoArray.splice($.inArray(todoItem, todoArray), 1);
      // Play a sound when deleting
      soundDelete.play();
      // Writes to localstorage
      localStorage.setItem('work-items', JSON.stringify(todoArray));
      // Removes the item from the DOM
      $(this).remove();
   });
   event.stopPropagation();
});


// Edit the todo
$("ul").on("click", "span.edit-this", function(event) {
    var currentTodo = $(this).parent().text();
    var getEdit = prompt("Edit this to-do...", currentTodo);

    //break out of the function early if cancel or empty
    if (getEdit === null) {
            return;
        }

    // Write the value from the prompt to the list item Todo
    $(this).next().html(getEdit);

});

// Remove all & reset the form
$("#reset-div").on("click", "#reset-list", function(event) {

   $("#dialog-confirm").dialog("open");

   // remove the close button on the modal
   $(".ui-dialog-titlebar-close").remove();
   $(".ui-icon-alert").remove();
   $(".ui-dialog-buttonset button:first-of-type").addClass("btn btn-default");
   $(".ui-dialog-buttonset button:last-of-type").addClass("btn btn-primary");

});

// Email the life list
$("#reset-div").on("click", "#email-list", function(event) {

  var checkmark = "%E2%9C%94  ";

   emailList = JSON.parse(localStorage.getItem('work-items'));

   // reverse the list
   emailList.reverse();
   var newString = "";

   for (let i = 0; i < emailList.length; i++) {

      // adds the linebreak and carriage return to the entries to be emailed
      newString += checkmark + emailList[i] + "%0D%0A";
   }

   var link = 'mailto:rharriso@nd.edu?subject=To-do list (WORK)' + '&body=' + newString;

   window.location.href = link;

});


// Add a todo to the list
$("#todo-addition").keypress(function(event) {
   if (event.which === 13) {

      var newTodo = $(this).val();

      // add the input to the array
      todoArray.push(newTodo);
      soundAdd.play();

      localStorage.setItem('work-items', JSON.stringify(todoArray));

      $(this).val("");
      $("ul").prepend("<li><span class='del'><i class='fa fa-times' aria-hidden='true'></i></span><span class='edit-this'><i class='fa fa-pencil' aria-hidden='true'></i></span>" + "<span class='todo-text-node'>" + newTodo + "</span>" + "</li>");

      event.preventDefault();
   }
});

$("#todo-list").disableSelection();
$("ul, li").disableSelection();

// Toggle sound Icons
$("#sounds #sound-on").on("click", function() {
   $(this).toggleClass("hidden");
   $("#sounds #sound-off").toggleClass("hidden");
   setVolume(false);
});

$("#sounds #sound-off").on("click", function() {
   $(this).toggleClass("hidden");
   $("#sounds #sound-on").toggleClass("hidden");
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
   if (!localStorage.getItem('work-items')) {
      todoArray = [];
   } else {
      todoArray = JSON.parse(localStorage.getItem('work-items'));

      var arrayLength = todoArray.length;

      for (var i = arrayLength - 1; i >= 0; i--) {
         $('#todo-list').append("<li class='sortable'><span class='del'><i class='fa fa-times' aria-hidden='true'></i></span><span class='edit-this'><i class='fa fa-pencil' aria-hidden='true'></i></span>" + "<span class='todo-text-node'>" + todoArray[i] + "</span>" + "</li>");
      }
   }
}

$('[data-toggle="tooltip"]').tooltip();

// Main function
main();
