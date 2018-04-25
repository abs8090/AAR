function mychange(){

  console.log($('#search').val());
  if($('#search').val() !== "time"){
    $("#searchKeyword").show();
    $("#label").show();
    $("#time").hide();
  }else{
    $("#time").show();
    $("#searchKeyword").hide();
    $("#label").hide();
    }
  }

$(document).ready(function() {

  var obj = {
    searchBy: null,
    searchKeyword: null
  };

  $("#searchKeyword").hide();
  $("#label").hide();
  $("#time").hide();

  $("form").submit(function(e){
    e.preventDefault(e);

    obj.searchBy = $("#search").val();
    if(obj.searchBy === "0"){
      $("#searchKeyword").hide();
      $("#label").hide();
      $("#time").hide();
      alert("please, select search type");
      return;
    }else{
        
          $.ajax({
            type: "POST",
            url: "/search",
            data: obj,
            success: function(data){
              console.log(data);
              var html = "";
              data.results.forEach(element => {
                html+='<li> <a href = "/recipe/' + element._id+'">'+ element.name + '</a> </li>' 
                
                //"<ul>";
                // html+="<li>chef: "+element.chef +"</li>";
                // html+="<li>servings: "+element.servings +"</li>";
                // html+="<li>time: "+element.time +"</li>";
                // html+="<li>ingredients:<ul>";
                // element.ingss.forEach(ing =>{
                //   html+="<li>"+ing.quantity+ " " +ing.name + "</li>";
                // });              
                // html+="</ul></li>";
                // html+="<li>steps:<ul>";
                // element.steps.forEach(step =>{
                //   html+="<li>"+step + "</li>";
                // });              
                // html+="</ul></li>";
                // html+= "</ul>
                // "</li>";
              });
              if(!data.results.length){
                html = "no results found";
              }
              $("#results").html(html);
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