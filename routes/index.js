
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
app.use(cookieParser());
app.use(bodyParser.json()); 

var recipeNam = "";
var stepsArr = [];
var recipesArr = [];

router.use( async(req, res, next) => {
  console.log("Middleware")

  if(req.cookies['AuthCookie']){
    //check if user has cookie in session //////////////////////////////////////////////////////

  }

  next()
    });

router.get('/', (req,res)=>{

  res.redirect("login");
    // res.status(403).render(path.resolve("static/index.handlebars"),{
    //   title:"The Best Palindrome Checker in the World!"
    // });
  });

  router.get('/upload', (req,res)=>{
        
    // res.render(path.resolve("static/index.handlebars"),{
    //   title:"The Best Palindrome Checker in the World!"
    // });
    res.render("upload",{
      title:"upload recipe"
      //Add res.status //////////////////////////////
    });
  });


  router.post('/upload', (req,res)=>{
        
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

  router.get('/login', (req,res)=>{
    res.render("login",{
      title:"Login"
      //Add res.status //////////////////////////////
    });
  });

  router.post('/login', async (req,res)=>{

    // console.log(req.body);
    var  user = req.body;
    var query = { username: user.username };
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
      }else{
        console.log("please check your password");
      }
    }

    });


  router.get('/newUser', (req,res)=>{
     res.render("newUser",{
       title:"New User"
     });
  });

  router.post('/newUser', async (req,res)=>{
  
      var query = { username: req.body.username };

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


///////////////// RECIPE ROUTES /////////////////
  router.get('/search', (req,res)=>{

    console.log("search page");
    console.log(req.body);
    res.render("search",{
      title:"Search Page!"
    });    
      // res.status(403).render(path.resolve("static/index.handlebars"),{
      //   title:"The Best Palindrome Checker in the World!"
      // });
    });

    router.post('/search', async (req,res)=>{ // here we search for all recipes with a specific name
        
      // res.render(path.resolve("static/index.handlebars"),{
      //   title:"The Best Palindrome Checker in the World!"
      // });
      // console.log(req.body.searchBy + ": " + req.body.searchKeyword);

      if(req.body.searchBy === "name"){
        console.log("search by name"); 
        console.log(req.body.searchKeyword);  
        console.log(typeof req.body.searchKeyword);   
        var query = { name: req.body.searchKeyword };
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
        collection.find({ingss: {$elemMatch: {name:req.body.searchKeyword}}}).toArray(function(err, result){
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

        var query = { chef: req.body.searchKeyword };
        
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

    router.get('/recipe/:id', (req, res) => {

      collection.findOne({_id:req.params.id}, (err, recipe) =>{
        
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

    router.patch('/recipe/:id', (req,res)=>{

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