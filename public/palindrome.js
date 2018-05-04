
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
    comments: []
  };

  $("form").submit(function(e){
    e.preventDefault(e);

    obj.name = $("#recipeName").val();
    obj.servings = $("#serving").val();
    obj.time = parseInt($("#timeList").val());
    obj.chef = $("#chef").val();
    obj.category = $("#category").val();
    // obj.comments.push(" ");

    if(obj.name == "" || obj.servings == "" || obj.chef == ""){
      alert("please, provide some info");
      return;
    }

    console.log(obj);
    $.ajax({
      type: "POST",
      url: "/upload",
      data: obj,
      success: function(data){
        console.log("my data: " + data.send);

      },
      dataType: "json"
    });
  });
  
  $("#checkIng").click(function (e){
    e.preventDefault(e);
    var temp = {
      name: $("#ing").val(),
      quantity: $("#quantity").val()
    }
    
    $("#ingList").append("<li>"+ temp.name + "</li>");

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