
// first commit

$(document).ready(function() {

  var obj = {
    _id: null,
    name: null,
    ingss: [],
    steps: [],
    servings: null,
    time: null,
    chef: null
  };

  $("form").submit(function(e){
    e.preventDefault(e);

    obj.name = $("#recipeName").val();
    obj.servings = $("#serving").val();
    obj.time = $("#time").val();
    obj.chef = $("#chef").val();

    console.log(obj);
    $.ajax({
      type: "POST",
      url: "/",
      data: obj,
      success: function(data){
        console.log("my data: " + data.send);

      },
      dataType: "json"
    });
  });
  
  $("#checkIng").click(function (e){
    e.preventDefault(e);
    var temp = $("#ing").val();
    $("#ingList").append("<li>"+ temp + "</li>");

    // console.log(temp);
    obj.ingss.push(temp);
  });


  $("#checkStep").click(function (e){
    e.preventDefault(e);
    var temp = $("#step").val();
    $("#stepList").append("<li>"+ temp + "</li>");

    // console.log(temp);
    obj.steps.push(temp);
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