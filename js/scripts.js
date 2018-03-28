// scripts.js

// Toggle the line-through on "done" items
$("ul").on("click", "li", function() {
   $(this).toggleClass("line-through");
});

// Remove the item on clicking the red x
$("ul").on("click", "span", function(event) {
   $(this).parent().fadeOut(300, function(){
      $(this).remove();
   });
   event.stopPropagation();
});

// Add a todo to the list
$("#todo-addition").keypress(function(event){
   if(event.which === 13) {
      var newTodo = $(this).val();
      $(this).val("");
      $("ul").append("<li><span class='del'><i class='fa fa-times' aria-hidden='true'></i></span>" + newTodo + "</li>");
      event.preventDefault();
   }
});
