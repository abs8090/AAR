
const router = require('express').Router();
const path = require("path");
const bodyParser = require('body-parser');
const express = require("express");
var MC = require('mongodb').MongoClient;
const bcrypt = require("bcrypt");
const saltRound = 1;
const uuid = require('uuid/v4');
var tempID = uuid();
var collection;
var usersCollection;
const cookieParser = require("cookie-parser");
var xss = require('xss');

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


//////////////// XSS CODE??? ////////////////

const sanitize = (str) => {
	return xss(str, {
		whiteList: [],
		stripIgnoreTag: true,
		stripIgnoreTagBody: ['script', 'style']
	});
}

///////////////// USER ROUTES /////////////////

router.use( async(req, res, next) => {   /////NO XSS NEEDED
  console.log("Middleware")
  delete req.thisUser;

  if(req.cookies['AuthCookie'] !== undefined){
    
    console.log("we have a cookie");
    let tempSession = req.cookies['AuthCookie']
    var query = { session:  tempSession};
    //console.log(query.session);
   // console.log(tempSession);

    const tempResult = await usersCollection.find(query).toArray();
    if(tempResult.length === 0 ){
      console.log("username doesn't exist");
    }else{
      var tempUser = tempResult[0];
      req.thisUser = tempResult[0];
      //console.log(tempResult.length);
      //console.log(tempUser.username);
    }
  }else{
    console.log("Mid 70");
  }
  next()
    });

router.get('/', (req,res)=>{   /////NO XSS NEEDED

  try{ 
    if(req.hasOwnProperty("thisUser")){
      res.redirect("/upload");
    }else{
      res.redirect("login");
    }
  } catch (err){
    res.status(403).json({ Error: "Not found" });
  }

  //r

    // res.status(403).render(path.resolve("static/index.handlebars"),{
    //   title:"The Best Palindrome Checker in the World!"
    // });
  });



  router.get('/login', (req,res)=>{  /////NO XSS NEEDED
  


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

  router.post('/login', async (req,res)=>{ ////NEED TO ADD XSS

    // console.log(req.body);
    var  user = req.body;
    var query = { username: user.username };  //CHANGE TO REQ.BODY.USERNAME??
    // const allUsers = await usersCollection.find({}).toArray();
    // console.log(allUsers);
    const tempResult = await usersCollection.find(query).toArray();
    if(tempResult.length === 0 ){
      console.log("username doesn't exist");
    }else{
      var userToCompareWith = tempResult[0];
      console.log(userToCompareWith);
      console.log(user.hashedPass)
      console.log("2", userToCompareWith.hashedPass)
      console.log(user.password)

      var compareHash = await bcrypt.compare(user.password, userToCompareWith.hashedPass);
      if(compareHash){
        console.log("passwords match");
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        const sessionID = uuid();
        res.cookie("AuthCookie", sessionID, { expires: expiresAt });
        //user.session = sessionID 
        usersCollection.update({username:user.username}, {$set: {session:sessionID}});
        //users[x].sessions.push(sessionID)
                
       // res.redirect("/upload");
       res.redirect(307, '/upload');



      }else{
        console.log("please check your password");
      }
    }

    });


  router.get('/newUser', (req,res)=>{  /////NO XSS NEEDED
    try{ 
      if(req.hasOwnProperty("thisUser")){   /////////////////DO WE WANT THIS?
        res.redirect("/upload");
      }else{
        res.render("newUser",{
          title:"New User"
        });
      }
    } catch (err){
      res.status(403).json({ Error: "Not found" });
    }
     
  });

  router.post('/newUser', async (req,res)=>{///XSS DONE
  
      var query = { username: sanitize(req.body.username) };

      const tempResult = await usersCollection.find(query).toArray();
      if (tempResult.length === 0 ){
        console.log("OK");

        var userToAdd = req.body;
        tempID = uuid();
        userToAdd._id = tempID;
        userToAdd.hashedPass = await bcrypt.hash(userToAdd.hashedPass, saltRound);
        usersCollection.insert(userToAdd, (err, numAffected, userToAdd) =>{
          if(err) throw err;
          if(numAffected.insertedCount !== 1) throw "error occured while adding";
          // res.send({_id: info._id, title: info.title, ingredients: info.ingredients, steps: info.steps});
          console.log("number of documents added: "+ numAffected.insertedCount);
          // console.log(req.id);
        });
        res.end();

      }else{
        console.log("Not OK");   
        res.end();     
      }
      
         
    }); //end newUser post

    router.get('/logout', async (req, res) => {  /////NO XSS NEEDED
      try{
        const anHourAgo = new Date();
        anHourAgo.setHours(anHourAgo.getHours() - 1);
        res.cookie("AuthCookie", "", {expires: anHourAgo})
        res.clearCookie("AuthCookie");
        res.render('user/logout');
      }catch (err) {
        res.status(403).json({ Error: "Logout Failed" });
      }
    });


///////////////// RECIPE ROUTES /////////////////


router.get('/upload', (req,res)=>{ /////NO XSS NEEDED   
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


router.post('/upload', (req,res)=>{ /////NEED TO FIGURE OUT XSS
      
  // res.render(path.resolve("static/index.handlebars"),{
  //   title:"The Best Palindrome Checker in the World!"
  // });

  var recipeToAdd = req.body;
  tempID = uuid();
  recipeToAdd._id = tempID;
  console.log(req.body);
  console.log("tempID: " + tempID);
  console.log("recipeToAdd._id: " + recipeToAdd._id);
  recipeToAdd.time = parseInt(recipeToAdd.time);
  console.log("do database work here");
  collection.insert(recipeToAdd, (err, numAffected, recipe) =>{
    if(err) throw err;
    if(numAffected.insertedCount !== 1) throw "error occured while adding";
    // res.send({_id: info._id, title: info.title, ingredients: info.ingredients, steps: info.steps});
    console.log("number of documents added: "+ numAffected.insertedCount);
    // console.log(req.id);
  });
});

  router.get('/search', (req,res)=>{  /////NO XSS NEEDED

    try{ 
      if(req.hasOwnProperty("thisUser")){   
            console.log("search page");
    console.log(req.body);
    res.render("search",{
      title:"Search Page!"
    }); 
      }else{
        res.render("newUser",{
          title:"New User"
        });
      }
    } catch (err){
      res.status(403).json({ Error: "Not found" });
    }

    

   
      // res.status(403).render(path.resolve("static/index.handlebars"),{
      //   title:"The Best Palindrome Checker in the World!"
      // });
    });

    router.post('/search', async (req,res)=>{ // here we search for all recipes with a specific name  /////XSS DONE
        
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
          
          var query = req.body.searchKeyword;
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

    router.get('/recipe/:id', (req, res) => { /////XSS DONE

      collection.findOne({_id: sanitize(req.params.id)}, (err, recipe) =>{
        
        if(err) throw "err";
        if(recipe === null) throw "no document found with this ID";
        
        res.render("recipeInfo",{
          title:"recipe info page!",
          id: recipe._id,
          name: recipe.name,
          ingss: recipe.ingss,
          servings: recipe.servings,
          chef: recipe.chef,
          time: recipe.time,
          steps: recipe.steps,
          comments: recipe.comments
        }); 
        // res.json({results : recipe, status: true}); 
    });
      
    });

    router.patch('/recipe/:id', (req,res)=>{ /////NEED TO FIGURE OUT XSS??

      console.log(req.body);
      collection.update(
        { _id: req.body.id},
        { $push: { comments: req.body.comments } }
     );
  
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