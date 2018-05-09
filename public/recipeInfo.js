
$(document).ready(function() {

    var obj = {
        id: null,        
        comments: null,
        rating: null
      };

      obj.id = $("h1").text();
      $("h1").hide();
    $("form").submit(function(e){
        e.preventDefault(e);
       
        obj.comments = $("#comment").val();
        var temp  = parseInt($("#ratingList").val());

        if(temp !== 0){
          obj.rating = temp;
        }

        if(!validate(obj.comments)){
            alert("Invalid comment!");
            return;            
        }else{
            $("#comments").append("<li>"+ obj.comments + "</li>");
    
            $.ajax({
                type: "PATCH",
                url: "/recipe/"+obj.id,
                data: obj,
                success: function(data){
                    },
                    dataType: "json"
                  });
        }
    });
});

function validate(str){
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
