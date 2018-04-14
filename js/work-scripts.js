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
$("#btn-life").on("click", function(){
   location.href = "life.html";
});

// // Global variable for the todoArray variable
var todoArray;
var playSounds = true;
var soundAdd = new Howl({
   src: ['sound/add.mp3'],
   autoplay: false,
   volume: 0.3
});

var soundDelete = new Howl({
   src: ['sound/delete.mp3'],
   autoplay: false,
   volume: 0.3
});

var soundRecycle = new Howl({
   src: ['sound/recycle.mp3'],
   autoplay: false,
   volume: 0.2
});


// Toggle the line-through on "done" work-items
$("ul").on("click", "li", function() {
   $(this).toggleClass("line-through");
});

// Remove the item on clicking the red x
$("ul").on("click", "span", function(event) {
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

// Remove all & reset the form
$("#reset-div").on("click", "h3", function(event) {

   $("#dialog-confirm").dialog("open");

   // remove the close button on the modal
   $(".ui-dialog-titlebar-close").remove();
   $(".ui-icon-alert").remove();
   $(".ui-dialog-buttonset button:first-of-type").addClass("btn btn-default");
   $(".ui-dialog-buttonset button:last-of-type").addClass("btn btn-primary");

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
      $("ul").prepend("<li><span class='del'><i class='fa fa-times' aria-hidden='true'></i></span>" + newTodo + "</li>");

      event.preventDefault();
   }
});

// Draggable and Sortable lists
$("#todo-list").sortable({
   // connectWith : ".sortable",
   // update : function(event,ui){
   //
   //   todoArray = [];
   //   var listLength = todos.length;
   //
   //   for (var i = 0; i < listLength; i++) {
   //      todoArray = todoArray + todos[i];
   //   }
   //
   //   todoArray = $('#todo-list li').val();
   //   localStorage.setItem('work-items', JSON.stringify(todoArray));
   // }
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
      soundAdd._src = "sound/add.mp3";
      soundDelete._src = "sound/delete.mp3";
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
         $('#todo-list').append("<li class='sortable'><span class='del'><i class='fa fa-times' aria-hidden='true'></i></span>" + todoArray[i] + "</li>");
      }
   }
}

// Main function
main();