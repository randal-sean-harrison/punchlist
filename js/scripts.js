// // Global variable for the todoArray variable
var todoArray;

// Toggle the line-through on "done" items
$("ul").on("click", "li", function() {
   $(this).toggleClass("line-through");
});

// Remove the item on clicking the red x
$("ul").on("click", "span", function(event) {
   $(this).parent().fadeOut(300, function() {
      var todoItem = $(this).text();
      // removes todoItem from todoArray
      todoArray.splice($.inArray(todoItem, todoArray), 1);
      // Writes to localstorage
      localStorage.setItem('items', JSON.stringify(todoArray));
      // Removes the item from the DOM
      $(this).remove();
   });
   event.stopPropagation();
});

// Remove all & reset the form
$("#reset-div").on("click", "h3", function(event) {
   $("li").fadeIn(700, function() {
      $(this).remove();
   });
   localStorage.clear();
   todoArray = [];
   event.stopPropagation();
});

// Add a todo to the list
$("#todo-addition").keypress(function(event) {
   if (event.which === 13) {

      var newTodo = $(this).val();

      // add the input to the array
      todoArray.push(newTodo);

      localStorage.setItem('items', JSON.stringify(todoArray));

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
   //   localStorage.setItem('items', JSON.stringify(todoArray));
   // }
});

$("#todo-list").disableSelection();

$("ul, li").disableSelection();

function main() {
   if (!localStorage.getItem('items')) {
      todoArray = [];
   } else {
      todoArray = JSON.parse(localStorage.getItem('items'));

      var arrayLength = todoArray.length;

      for (var i = arrayLength - 1; i >= 0; i--) {
         $('#todo-list').append("<li class='sortable'><span class='del'><i class='fa fa-times' aria-hidden='true'></i></span>" + todoArray[i] + "</li>");
      }
   }
}

// Main function
main();
