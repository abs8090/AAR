
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
    });
});



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