
$(document).ready(function() {

    var user = {
        _id: null,        
        username: null,
        password: null, 
        email: null,
        session: null,
        recipe: {
            recipeID:  null ,
            canRate: true
        }
      };

    $("form").submit(function(e){
        e.preventDefault(e);

        user.username = $("#username").val();
        user.password = $("#password").val();  ///function to hash
        user.email = $("#email").val();

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
