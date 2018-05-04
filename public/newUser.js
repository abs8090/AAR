
$(document).ready(function() {

    var user = {
        _id: null,        
        username: null,
        hashedPass: null, 
        email: null,
        session: null
      };

      console.log("ready");



    $("form").submit(function(e){
        e.preventDefault(e);

        //obj.comments = $("#comment").val();
        
        
       // $("#comments").append("<li>"+ obj.comments + "</li>");
        //console.log("new comment made");
        user.username = $("#username").val();
        user.hashedPass = $("#password").val();  ///function to hash
        user.email = $("#email").val();
        console.log(user);

        $.ajax({
            type: "POST",
            url: "/newUser",
            data: user,
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