
// first commit

$(document).ready(function() {

  var obj = {
    _id: null,
    name: null,
  };

  $("form").submit(function(e){
    e.preventDefault(e);

    obj.name = $("#recipeName").val();

    if (obj.name === ""){
        alert("enter recipe name");
        return;
    }else {
        console.log(obj);
        $.ajax({
          type: "POST",
          url: "/search",
          data: obj,
          success: function(data){
            console.log("some data");
    
          },
          dataType: "json"
        });
    }
  });
});



/*
// const dbFunctions = require('../dbFunctions');

 var temp = "";
 var tempArr = [];
// var ingredientsArr = [];
// var stepsArr = [];
 var flag = false;

 document.getElementById("displayObj").addEventListener("click",recipe);
 document.getElementById("checkIng").addEventListener("click", checkIng);
 document.getElementById("checkStep").addEventListener("click", checkStep);

  var obj = {name: null,
              ingss: [],
              steps: [],
              servings: null,
              time: null,
              chef: null
  };

function recipe(e){
  console.log(obj.steps.length);
  var form = document.getElementById("form_id");

  Array.from(document.querySelectorAll("input")).forEach(function(input){
		obj.steps.push(input.value);
  });
  alert(obj.steps);
  form.submit();

}

function checkIng(){
  var addedIng = document.getElementById("ing");
  obj.ingss.push(addedIng.value);
}

function checkStep(){
  var addedStep = document.getElementById("step");
  // addedStep.value+=",";
  obj.steps.push(addedStep.value);
  console.log(obj.steps.length);
}
*/