
const router = require('express').Router();
const path = require("path");
const bodyParser = require('body-parser');
const express = require("express");
var MC = require('mongodb').MongoClient;
const bcrypt = require("bcrypt");
const saltRound = 10;
const uuid = require('uuid/v4');
var tempID = uuid();
var collection;
var usersCollection;
const cookieParser = require("cookie-parser");
var xss = require("xss");

MC.connect("mongodb://localhost:27017/", function(err, db) {
    if(err) { return console.dir(err); }
  
    var database = db.db("AAR");
    collection = database.collection('recipes');
    usersCollection = database.collection('users');
});


const app = express();
const handelBar = require('express-handlebars');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

app.engine('handlebars', handelBar({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
router.use(cookieParser());
router.use(bodyParser.json()); 

var recipeNam = "";
var stepsArr = [];
var recipesArr = [];
var tempUser;
var newUserErrMsg = "";

//////////////// XSS CODE ////////////////

const sanitize = (source) => {
	return xss(source, {
		whiteList: [],
		stripIgnoreTag: true,
		stripIgnoreTagBody: ['script', 'style']
	});
}

///////////////// USER ROUTES /////////////////

//no xss needed
function validateEmail (str){
  // var re1 = new RegExp(/[^-a-zA-Z0-9@._]+$/i);// to check for any input that is not a-z, 0-9, @ or .
  var re2 = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i);// to check if input is a-z or 0-9; allows @ and .
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
} //end validate email

//no xss needed
function validateUsername (str){
  // var re1 = new RegExp(/[^-a-zA-Z0-9@._]+$/i);// to check for any input that is not a-z, 0-9, @ or .
  var re2 = new RegExp(/^[a-zA-Z][a-zA-Z\d-_\.]+$/i);// to check if input is a-z or 0-9; allows @ and .
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
} //end validate username

//no xss needed
router.use( async(req, res, next) => {
  delete req.thisUser;

  if(req.cookies['AuthCookie'] !== undefined){
    console.log("we have a cookie");
    let tempSession = req.cookies['AuthCookie']
    var query = { session:  tempSession};

    const tempResult = await usersCollection.find(query).toArray();
    if(tempResult.length === 0 ){
      console.log("username doesn't exist");
    }else{
      tempUser = tempResult[0].username; //getting username for comments
      req.thisUser = tempResult[0];
    }
  }

  next()
    });

//no xss needed
router.get('/', (req,res)=>{

  try{ 
    if(req.hasOwnProperty("thisUser")){
      res.redirect("/upload");
    }else{
      res.redirect("login");
    }
  } catch (err){
    res.status(403).json({ Error: "Not found" });
  }

  });


  //no xss needed
  router.get('/login', (req,res)=>{
  
    try{ 
      if(req.hasOwnProperty("thisUser")){
        res.redirect('upload');

      }else{
        res.render("login",{
          title:"Login"
        });
        
      }
    } catch (err){
      res.status(403).json({ Error: "Not found" });
    }
    
  });

  //XSS DONE
  router.post('/login', async (req,res)=>{

    var  user = req.body;
    var query = { username: sanitize(req.body.username) };
    const tempResult = await usersCollection.find(query).toArray();
    
    if(tempResult.length === 0 || tempResult === undefined){
      res.render("login",{
        title:"Login",
        error:"Username doesn't exist, please try again"
      });
    }else{
      var userToCompareWith = tempResult[0];
      
      tempUser = userToCompareWith.username;//get current username

      var compareHash = await bcrypt.compare(sanitize(req.body.password), userToCompareWith.hashedPass);
      if(compareHash){
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        const sessionID = uuid();
        res.cookie("AuthCookie", sessionID, { expires: expiresAt });
        usersCollection.update({username: sanitize(req.body.username)}, {$set: {session:sessionID}});
      
       res.redirect(303, '/upload');
      }else{
        res.render("login",{
          title:"Login",
          error:"please check your password"
        });
      }
    }
    });

  //no xss needed  
  router.get('/newUser', (req,res)=>{
    try{ 
      if(req.hasOwnProperty("thisUser")){   /////////////////DO WE WANT THIS?
        res.redirect(303, '/upload');
      }else{
        res.render("newUser",{
          title:"New User"
        });
      }
    } catch (err){
      res.status(403).json({ Error: "Not found" });
    }
     
  });

  //XSS DONE
  router.post('/newUser', async (req,res)=>{
  //<script type = "text/javascript" src = "/public/newUser.js"></script> 

  // make sure to end request based on i-statmnt result
      var query = { username: sanitize(req.body.username) };
      var valUser, valPass, valEmail;
      // valUser = await validate(req.body.username)
      valEmail = validateEmail(sanitize(req.body.email));
      valUsername = validateUsername(sanitize(req.body.username));
      if( !valUsername ){ //if any are invalid
        //console.log(req.body);
        res.render("newUser",{
          title:"New User",
          error: "Invalid username, Please Try Again"
        });
      }else if( !valEmail ){ //if any are invalid
        //console.log(req.body);
        res.render("newUser",{
          title:"New User",
          error: "Invalid e-mail address, Please Try Again"
        });
      }else{
        const tempResult = await usersCollection.find(query).toArray();
        if (tempResult.length === 0 ){
          console.log("OK");
  
          var userToAdd = req.body;
          tempID = uuid();
          userToAdd._id = tempID;
          console.log(userToAdd);
          userToAdd.hashedPass = await bcrypt.hash(userToAdd.password, saltRound);
  
  
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 1);
  
          const sessionID = uuid();
          res.cookie("AuthCookie", sessionID, { expires: expiresAt });
          userToAdd.session = sessionID;
          
          tempUser = userToAdd.username;//get current username
  
          usersCollection.insert(userToAdd, (err, numAffected, userToAdd) =>{
            if(err) throw err;
            if(numAffected.insertedCount !== 1) throw "error occured while adding";
            // res.send({_id: info._id, title: info.title, ingredients: info.ingredients, steps: info.steps});
            console.log("number of documents added: "+ numAffected.insertedCount);
            // console.log(req.id);
            // res.send("done");
            
          });
          res.redirect(303, '/upload');
  
        }else{
          res.render("newUser",{
            title:"New User",
            error: "Username Already Exists, Please Try Again"
          });
          console.log("Not OK");   
          // res.end();     
        }
      }      
      
         
    }); //end newUser post

    //no xss needed
    router.get('/logout', (req,res)=>{
      try{
        
        const anHourAgo = new Date();
        anHourAgo.setHours(anHourAgo.getHours() - 1);
        res.cookie("AuthCookie", "", {expires: anHourAgo})
        res.clearCookie("AuthCookie");
        res.render("logout");
        
      }catch (err) {
        res.status(403).json({ Error: "Logout Failed" });
      }
      
    });


///////////////// RECIPE ROUTES /////////////////

//no xss needed
router.get('/upload', (req,res)=>{
  try{ 
    if(req.hasOwnProperty("thisUser")){   
      res.render("upload",{
        title:"upload recipe"
      });
    }else{
      res.render("newUser",{
        title:"New User"
      });
    }
  } catch (err){
    res.status(403).json({ Error: "Not found" });
  }        
  // res.render(path.resolve("static/index.handlebars"),{
  //   title:"The Best Palindrome Checker in the World!"
  // });

});

//FIGURE OUT XSS
router.post('/upload', (req,res)=>{
      
  // res.render(path.resolve("static/index.handlebars"),{
  //   title:"The Best Palindrome Checker in the World!"
  // });

  var recipeToAdd = req.body;
  tempID = uuid();
  recipeToAdd._id = tempID;
  recipeToAdd.time = parseInt(recipeToAdd.time);
  //recipeToAdd.rating = parseInt(recipeToAdd.rating);
  recipeToAdd.chef = sanitize(req.body.chef);
    collection.insert(recipeToAdd, (err, numAffected, recipe) =>{
      if(err) throw err;
      if(numAffected.insertedCount !== 1) throw "error occured while adding";
      // res.send({_id: info._id, title: info.title, ingredients: info.ingredients, steps: info.steps});
      console.log("number of documents added: "+ numAffected.insertedCount);
      // console.log(req.id);
    });
  
  

});

//no xss needed
  router.get('/search', (req,res)=>{

    try{ 
      if(req.hasOwnProperty("thisUser")){   
            console.log("search page");
            console.log(req.body);
            res.render("search",{
            title:"Search Page!"
            }); 
      }else{
        // res.render("newUser",{
        //   title:"New User"
        // });
        res.redirect("/login");
      }
    } catch (err){
      res.status(403).json({ Error: "Not found" });
    }

    

   
      // res.status(403).render(path.resolve("static/index.handlebars"),{
      //   title:"The Best Palindrome Checker in the World!"
      // });
    });

    //XSS DONE
    router.post('/search', async (req,res)=>{ // here we search for all recipes with a specific name
        
      // res.render(path.resolve("static/index.handlebars"),{
      //   title:"The Best Palindrome Checker in the World!"
      // });
      // console.log(req.body.searchBy + ": " + req.body.searchKeyword);

      if(req.body.searchBy === "name"){
        console.log("search by name"); 
        console.log(req.body.searchKeyword);  
        console.log(typeof req.body.searchKeyword);   
        var query = { name: sanitize(req.body.searchKeyword) };
        collection.find(query).toArray(function(err, result) {
          if (err) throw err;
          if(result.length === 0){
            console.log("nothing returned");
            
          }
          res.json({results : result, status: true});
          
        });
        
      }else if(req.body.searchBy === "ingss"){
        console.log("search by ingss");
        console.log(req.body.searchKeyword); 
        console.log(typeof req.body.searchKeyword); 
        collection.find({ingss: {$elemMatch: {name: sanitize(req.body.searchKeyword)}}}).toArray(function(err, result){
        if (err) throw err;
        if(result.length === 0){
          console.log("nothing returned");
        }
        res.json({results : result, status: true}); //last line in this function
      });

      }else if(req.body.searchBy === "chef"){        
        console.log("search by chef");
        console.log(req.body.searchKeyword); 
        console.log(typeof req.body.searchKeyword); 

        var query = { chef: sanitize(req.body.searchKeyword) };
        
        collection.find(query).toArray(function(err, result) {
          if (err) throw err;
          if(result.length === 0){
            console.log("nothing returned");
          }
          res.json({results : result, status: true});          
        });

      }else{
        console.log("search by time");
        console.log(req.body.searchKeyword); 
        req.body.searchKeyword = parseInt(req.body.searchKeyword);
        console.log(typeof req.body.searchKeyword);
        //.find( { qty: { $lt: 20 } } )
        if(req.body.searchKeyword < 60){

          var query = req.body.searchKeyword;
          collection.find({ time: { $lte: query } }).toArray(function(err, result) {
            if (err) throw err;
            if(result.length === 0){
              console.log("nothing returned");
            }
            res.json({results : result, status: true});          
          });
        
        }else {
          
          var query = sanitize(req.body.searchKeyword);
          collection.find({ time: { $gte: query } }).toArray(function(err, result) {
            if (err) throw err;
            if(result.length === 0){
              console.log("nothing returned");
            }
            res.json({results : result, status: true});          
          });
        }

      }

    });

    //no xss needed
    router.get('/recipe', (req,res)=>{

      try{ 
        if(req.hasOwnProperty("thisUser")){   
              res.redirect("/search");
              // res.render("search",{
              // title:"Search Page!"
              // }); 
        }else{
          // res.render("newUser",{
          //   title:"New User"
          // });
          res.redirect("/login");
        }
      } catch (err){
        res.status(403).json({ Error: "Not found" });
      }
        // res.status(403).render(path.resolve("static/index.handlebars"),{
        //   title:"The Best Palindrome Checker in the World!"
        // });
      });

    //XSS DONE
    router.get('/recipe/:id', (req, res) => {

      try{ 
        if(req.hasOwnProperty("thisUser")){   
          collection.findOne({_id: sanitize(req.params.id)}, (err, recipe) =>{
        
            if(err) throw "err";
            if(recipe === null) throw "no document found with this ID";

            if(recipe.ratingArray.length === 0){
              res.render("recipeInfo",{
                title:"recipe info page!",
                id: recipe._id,
                name: recipe.name,
                ingss: recipe.ingss,
                servings: recipe.servings,
                chef: recipe.chef,
                time: recipe.time,
                steps: recipe.steps,
                rating: recipe.rating,
                comments: recipe.comments
              }); 
            }else{
              var avg = 0;
              for(var x = 0; x < recipe.ratingArray.length; x++){
                avg += recipe.ratingArray[x];
              }
              avg = avg / recipe.ratingArray.length;
              recipe.rating = avg;
              
              res.render("recipeInfo",{
                title:"recipe info page!",
                id: recipe._id,
                name: recipe.name,
                ingss: recipe.ingss,
                servings: recipe.servings,
                chef: recipe.chef,
                time: recipe.time,
                steps: recipe.steps,
                rating: recipe.rating,
                comments: recipe.comments
              }); 

            }            


            // res.json({results : recipe, status: true}); 
        });

        }else{

          res.redirect("/login");
        }
      } catch (err){
        res.status(403).json({ Error: "Not found" });
      }
      
    });

    //XSS DONE
    router.patch('/recipe/:id', (req,res)=>{



      try{ 
        if(req.hasOwnProperty("thisUser")){
          console.log(req.body);
          
          if(req.body.rating === ""){
            var tempComment = {username: tempUser, comment: sanitize(req.body.comments)}
            collection.update(
              { _id: sanitize(req.body.id)},
              { $push: { comments: tempComment} }
           );

          }else{
            var tempComment = {username: tempUser, comment: sanitize(req.body.comments)}
            var tempRating = parseInt(req.body.rating);

            collection.update(
              { _id: sanitize(req.body.id)},
              { $push: { comments: tempComment},
                $push:{ratingArray: tempRating}
              }
           );
          }


        }else{

          res.redirect("/login");
        }
      } catch (err){
        res.status(403).json({ Error: "Not found" });
      }
    });

  



//GET
// app.get('/', async (req, res) => {
//   try {
//       //let isSet = req.cookies['AuthCookie'];
//       //if cookie for user redirect to private page
//       if (req.hasOwnProperty(true)){     ///////////////////COOKIE 
//            res.redirect("/upload")
//       }else{
//           //else render the login page
//           res.render('user/login')
//       }

//   } catch (err) {
//         res.status(403).json({ Error: "Not found" });
//   }
//     });




  module.exports = router;