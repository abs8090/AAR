
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
const multer = require('multer');
var formidable = require('formidable');

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
app.use(express.static(path.join(__dirname, '/public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

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

function validateEmail (str){
  var re2 = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i);// to check if input is a-z or 0-9; allows @ and .
  var result = false;
  
  if( re2.test(str)){
    result = true;
  }else if(str.length === 0 || str === undefined){
    result = false;
  }else{
    result = false;
  }
  return result;
} //end validate email

function validateUsername (str){
  var re2 = new RegExp(/^[a-zA-Z][a-zA-Z\d-_\.]+$/i);// to check if input is a-z or 0-9; allows @ and .
  var result = false;
  
  if( re2.test(str)){
    result = true;
  }else if(str.length === 0 || str === undefined){
    result = false;
  }else{
    result = false;
  }
  return result;
} //end validate username

router.use( async(req, res, next) => {
  delete req.thisUser;

  if(req.cookies['AuthCookie'] !== undefined){
    let tempSession = req.cookies['AuthCookie']
    var query = { session:  tempSession};

    const tempResult = await usersCollection.find(query).toArray();
    if(tempResult.length === 0 ){
    }else{
      tempUser = tempResult[0].username; //getting username for comments
      req.thisUser = tempResult[0];
    }
  }

  next()
    });

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

      var compareHash = await bcrypt.compare(sanitize(req.body.password), userToCompareWith.password);
      if(compareHash){
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 12);

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

  router.get('/newUser', (req,res)=>{
    try{ 
      if(req.hasOwnProperty("thisUser")){  
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

  router.post('/newUser', async (req,res)=>{

      var query = { username: sanitize(req.body.username) };
      var valUser, valPass, valEmail;
      valEmail = validateEmail(sanitize(req.body.email));
      valUsername = validateUsername(sanitize(req.body.username));
      if( !valUsername ){ 
        res.render("newUser",{
          title:"New User",
          error: "Invalid username, Please Try Again"
        });
      }else if( !valEmail ){ 
        res.render("newUser",{
          title:"New User",
          error: "Invalid e-mail address, Please Try Again"
        });
      }else{
        const tempResult = await usersCollection.find(query).toArray();
        if (tempResult.length === 0 ){
  
          var userToAdd = req.body;
          tempID = uuid();
          userToAdd._id = tempID;
          userToAdd.password = await bcrypt.hash(req.body.password, saltRound);
  
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 1);
  
          const sessionID = uuid();
          res.cookie("AuthCookie", sessionID, { expires: expiresAt });
          userToAdd.session = sessionID;
          
          tempUser = userToAdd.username;//get current username
  
          usersCollection.insert(userToAdd, (err, numAffected, userToAdd) =>{
            if(err) throw err;
            if(numAffected.insertedCount !== 1) throw "error occured while adding";
            
          });
          res.redirect(303, '/upload');
  
        }else{
          res.render("newUser",{
            title:"New User",
            error: "Username Already Exists, Please Try Again"
          });
          console.log("Not OK");   
        }
      }      
      
         
    }); //end newUser post

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
});

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb) {
     cb(
        null,
        file.fieldname + '-' + Date.now() + path.extname(file.originalname)
     );
  }
});

const upload = multer({
  storage: storage
});

router.post('/upload',upload.any(), async (req,res)=>{
  
  res.json(req.files[0]);
  var recipeToAdd = JSON.parse(req.body.obj);
  tempID = uuid();
  recipeToAdd._id = tempID;
  recipeToAdd.time = parseInt(recipeToAdd.time);
  recipeToAdd.chef = sanitize(req.body.chef);
  recipeToAdd.imagePath = req.files[0].path;
    
    collection.insert(recipeToAdd, (err, numAffected, recipe) =>{
      if(err) throw err;
      if(numAffected.insertedCount !== 1) throw "error occured while adding";
      console.log("number of documents added: "+ numAffected.insertedCount);
      
    });

    res.end();
});

  router.get('/search', (req,res)=>{

    try{ 
      if(req.hasOwnProperty("thisUser")){   
            console.log("search page");
            console.log(req.body);
            res.render("search",{
            title:"Search Page!"
            }); 
      }else{
 
        res.redirect("/login");
      }
    } catch (err){
      res.status(403).json({ Error: "Not found" });
    }

    });

    router.post('/search', async (req,res)=>{ 
        
      if(req.body.searchBy === "name"){ 
        var query = { name: sanitize(req.body.searchKeyword) };
        collection.find(query).toArray(function(err, result) {
          if (err) throw err;

          res.json({results : result, status: true});
          
        });
        
      }else if(req.body.searchBy === "ingss"){

        collection.find({ingss: {$elemMatch: {name: sanitize(req.body.searchKeyword)}}}).toArray(function(err, result){
        if (err) throw err;

        res.json({results : result, status: true}); //last line in this function
      });

      }else if(req.body.searchBy === "chef"){        

        var query = { chef: sanitize(req.body.searchKeyword) };
        
        collection.find(query).toArray(function(err, result) {
          if (err) throw err;

          res.json({results : result, status: true});          
        });

      }else{

        req.body.searchKeyword = parseInt(req.body.searchKeyword);
        if(req.body.searchKeyword < 60){

          var query = req.body.searchKeyword;
          collection.find({ time: { $lte: query } }).toArray(function(err, result) {
            if (err) throw err;

            res.json({results : result, status: true});          
          });
        
        }else {
          
          var query = sanitize(req.body.searchKeyword);
          collection.find({ time: { $gte: query } }).toArray(function(err, result) {
            if (err) throw err;

            res.json({results : result, status: true});          
          });
        }

      }

    });

    router.get('/recipe', (req,res)=>{

      try{ 
        if(req.hasOwnProperty("thisUser")){   
              res.redirect("/search");
        }else{

          res.redirect("/login");
        }
      } catch (err){
        res.status(403).json({ Error: "Not found" });
      }
      });

    router.get('/recipe/:id', (req, res) => {

      try{ 
        if(req.hasOwnProperty("thisUser")){   
          collection.findOne({_id: sanitize(req.params.id)}, (err, recipe) =>{
        
            if(err) throw "err";
            if(recipe === null) throw "no document found with this ID";

            if(recipe.ratingArray === undefined || recipe.ratingArray === null){
              res.render("recipeInfo",{
                title:"recipe info page!",
                id: recipe._id,
                imagePath: "/"+recipe.imagePath,
                name: recipe.name,
                ingss: recipe.ingss,
                servings: recipe.servings,
                chef: recipe.chef,
                time: recipe.time,
                steps: recipe.steps,
                rating: "no ratings yet",
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
                imagePath: "/"+recipe.imagePath,
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

    router.patch('/recipe/:id', (req,res)=>{

      try{ 
        if(req.hasOwnProperty("thisUser")){
          
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
              { $push: { comments: tempComment} }
           );
            collection.update(
              { _id: sanitize(req.body.id)},
              { $push:{ratingArray: tempRating} }
           );
          }
        }else{

          res.redirect("/login");
        }
      } catch (err){
        res.status(403).json({ Error: "Not found" });
      }
    });

  module.exports = router;
