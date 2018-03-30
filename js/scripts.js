// // Set up localStorage array and get array elements if not empty
var todoArray;

if (localStorage.getItem('todoArray')) {
  items = JSON.parse(localStorage.getItem('todoArray'));
} else {
   todoArray = [];
}

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

// Remove all & reset the form
$("#reset-div").on("click", "h3", function(event) {
   $("li").fadeIn(700, function(){
      $(this).remove();
   });
   $("ul").append("<li><span class='del'><i class='fa fa-times' aria-hidden='true'></i></span>Wash the dishes!</li>");
   localStorage.clear();
   event.stopPropagation();
});

// Add a todo to the list
$("#todo-addition").keypress(function(event){
   if(event.which === 13) {
      var newTodo = $(this).val();

      // add the input to the array
      todoArray.push(newTodo);

      // localStorage.setItem('items', JSON.stringify(todoArray));
      // const data = JSON.parse(localStorage.setItem('items'));

      $(this).val("");
      $("ul").prepend("<li><span class='del'><i class='fa fa-times' aria-hidden='true'></i></span>" + newTodo + "</li>");

      event.preventDefault();
   }
});
