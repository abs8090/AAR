
// first commit
var timeDictionary = {"0":0, "5":5, "10":10};

$(document).ready(function() {

  var obj = {
    _id: null,
    name: null,
    ingss: [],
    steps: [],
    servings: null,
    time: 0,
    chef: null,
    category: null,
    ratingArray: [],
    rating: null,
    comments: []
  };

  $("form").submit(function(e){
    e.preventDefault(e);

    obj.name = $("#recipeName").val();
    obj.servings = $("#serving").val();
    obj.time = parseInt($("#timeList").val());
    obj.chef = $("#chef").val();
    obj.category = $("#categories").val();
    obj.rating = parseInt($("#ratingList").val());

    console.log(obj);

    if(!validate(obj.name)){
      alert("invalid recipe name!");
    }else if(obj.ingss.length === 0){
      alert("please, add at lease one ingredient");
    }else if(obj.steps.length === 0){
      alert("please, add at least one step!");
    }else if(obj.servings === "0"){
      alert("invalid servings!");
    }else if(obj.category === "0"){
      alert("invalid category!");
    }else if(obj.time === 0){
      alert("invalid recipe time!");
    }
    
    else{
      $.ajax({
        type: "POST",
        url: "/upload",
        data: obj,
        success: function(data){
          alert("recipe added successfully!");
  
        },
        dataType: "json"
      });
    }


  });
  
  $("#checkIng").click(function (e){
    e.preventDefault(e);
    var temp = {
      name: $("#ing").val(),
      quantity: $("#quantity").val()
    }

    if(!validate(temp.name)){

      alert("invalid ingredient");

    }else if(!validateIngQuantity(temp.quantity)){
      alert("invalid quantity");
    }else{
      $("#ingList").append("<li>"+ temp.name + "</li>");

      // console.log(temp);
      obj.ingss.push(temp);
    }
    

  });


  $("#checkStep").click(function (e){
    e.preventDefault(e);
    var temp = $("#step").val();

    if(!validate(temp)){
      alert("invalid step");
    }else{
      
    $("#stepList").append("<li>"+ temp + "</li>");
    obj.steps.push(temp);
    }
  });

});

function validate(str){
  var re2 = new RegExp(/^(?:[A-Za-z]+)(?:[A-Za-z0-9 _]*)$/);// to check if input is a-z or 0-9; allows @ and .
  var result = false;
  
  if( re2.test(str)){
    result = true;
    console.log("VALID INPUT!!!");
    //result = checkText(str); // we have alphanumeric input
  }else if(str.length === 0 || str === undefined){
    result = false;
    console.log("0 String");
  }else{
    result = false;
    console.log("Invalid, Catch All");
  }
  return result;
}

function validateIngQuantity(str){
  var re2 = new RegExp(/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/);// to check if input is a-z or 0-9; allows @ and .
  var result = false;
  
  if( re2.test(str)){
    result = true;
    console.log("VALID INPUT!!!");
    //result = checkText(str); // we have alphanumeric input
  }else if(str.length === 0 || str === undefined){
    result = false;
    console.log("0 String");
  }else{
    result = false;
    console.log("Invalid, Catch All");
  }
  return result;
}
