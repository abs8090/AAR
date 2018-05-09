

var timeDictionary = {"0":0, "5":5, "10":10};

$(document).ready(function() {

  var obj = {
    _id: null,
    name: null,
    ingss: [],
    steps: [],
    servings: null,
    time: 0,
    cheff: null,
    category: null,
    ratingArray: [],
    rating: null,
    comments: [],
    imagePath: null
  };

  var ingsArr = [];
  var stepArr = [];

  $("form").submit(function(e){
    e.preventDefault(e);

    obj.name = $("#recipeName").val();
    obj.servings = $("#serving").val();
    obj.time = parseInt($("#timeList").val());
    obj.chef = $("#chef").val();
    obj.category = $("#categories").val();
    var temp  = parseInt($("#ratingList").val());

    if(temp === 0){
      obj.rating = "no rating yet";
      
    }else{
      obj.ratingArray.push(parseInt($("#ratingList").val()));
      obj.rating = $("#ratingList").val();
    }
    
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
    }else{
      var formData = new FormData(this);
      formData.append('obj', JSON.stringify(obj));
      $.ajax({
        type: 'POST',
        url: '/upload',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(){
          alert("recipe has been added!");
        }
      });
    }
  });
  
  $("#checkIng").click(function (e){
    e.preventDefault(e);
    var temp = {
      name: $("#ingredients").val(),
      quantity: $("#quantity").val()
    }

    if(!validate(temp.name)){

      alert("invalid ingredient");

    }else if(!validateIngQuantity(temp.quantity)){
      alert("invalid quantity");
    }else{
      $("#ingList").append("<li>"+ temp.name + "</li>");

      obj.ingss.push(temp);
      ingsArr.push(temp);
    }
  });

  $("#checkStep").click(function (e){
    e.preventDefault(e);
    var temp = $("#steps").val();

    if(!validate(temp)){
      alert("invalid step");
    }else{
      
    $("#stepList").append("<li>"+ temp + "</li>");
    obj.steps.push(temp);
    stepArr.push(temp);
    }
  });

});

function validate(str){
  var re2 = new RegExp(/^(?:[A-Za-z]+)(?:[A-Za-z0-9 _]*)$/);// to check if input is a-z or 0-9; allows @ and .
  var result = false;
  
  if( re2.test(str)){
    result = true;

  }else if(str.length === 0 || str === undefined){
    result = false;

  }else{
    result = false;
  }
  return result;
}

function validateIngQuantity(str){
  var re2 = new RegExp(/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/);// to check if input is a-z or 0-9; allows @ and .
  var result = false;
  
  if( re2.test(str)){
    result = true;
    console.log("VALID INPUT!!!");
  }else if(str.length === 0 || str === undefined){
    result = false;
  }else{
    result = false;
  }
  return result;
}