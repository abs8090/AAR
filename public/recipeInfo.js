
$(document).ready(function() {

    var obj = {
        id: null,        
        comments: null
      };

      console.log("ready");
      obj.id = $("h1").text();
      $("h1").hide();
    $("form").submit(function(e){
        e.preventDefault(e);
        obj.comments = $("#comment").val();
        
        
        if(!validate(obj.comments)){
            alert("Invalid comment!");
            return;            
        }else{
            $("#comments").append("<li>"+ obj.comments + "</li>");
            console.log("new comment made");
            console.log(obj);
    
            $.ajax({
                type: "PATCH",
                url: "/recipe/"+obj.id,
                data: obj,
                success: function(data){
                      console.log(data);
                    },
                    dataType: "json"
                  });
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

            //   data.results.forEach(element => {
            //     html+='<li> <a href = "/recipe/' + element._id+'">'+ element.name + '</a> </li>' 
                
            //     // please, don't delete this list of comments, we may need it and it was so hard to figure out
            //     //"<ul>";
            //     // html+="<li>chef: "+element.chef +"</li>";
            //     // html+="<li>servings: "+element.servings +"</li>";
            //     // html+="<li>time: "+element.time +"</li>";
            //     // html+="<li>ingredients:<ul>";
            //     // element.ingss.forEach(ing =>{
            //     //   html+="<li>"+ing.quantity+ " " +ing.name + "</li>";
            //     // });              
            //     // html+="</ul></li>";
            //     // html+="<li>steps:<ul>";
            //     // element.steps.forEach(step =>{
            //     //   html+="<li>"+step + "</li>";
            //     // });              
            //     // html+="</ul></li>";
            //     // html+= "</ul>
            //     // "</li>";
            //   });