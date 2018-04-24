
const router = require('express').Router();
const path = require("path");
const bodyParser = require('body-parser');
const express = require("express");
var MC = require('mongodb').MongoClient;
const uuid = require('uuid/v4');
var tempID = uuid();
var collection;

MC.connect("mongodb://localhost:27017/", function(err, db) {
    if(err) { return console.dir(err); }
  
    var database = db.db("AAR");
    collection = database.collection('recipes');
});


const app = express();
const handelBar = require('express-handlebars');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

app.engine('handlebars', handelBar({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var recipeNam = "";
var stepsArr = [];
var recipesArr = [];

router.get('/', (req,res)=>{

  res.render(path.resolve("static/index.handlebars"),{
    title:"The Best Palindrome Checker in the World!"
  });    
    // res.status(403).render(path.resolve("static/index.handlebars"),{
    //   title:"The Best Palindrome Checker in the World!"
    // });
  });

  router.post('/', (req,res)=>{
        
    // res.render(path.resolve("static/index.handlebars"),{
    //   title:"The Best Palindrome Checker in the World!"
    // });

    var recipeToAdd = req.body;
    tempID = uuid();
    recipeToAdd._id = tempID;
    console.log(req.body);
    console.log("tempID: " + tempID);
    console.log("recipeToAdd._id: " + recipeToAdd._id);

    console.log("do database work here");
    collection.insert(recipeToAdd, (err, numAffected, recipe) =>{
      if(err) throw err;
      if(numAffected.insertedCount !== 1) throw "error occured while adding";
      // res.send({_id: info._id, title: info.title, ingredients: info.ingredients, steps: info.steps});
      console.log("number of documents added: "+ numAffected.insertedCount);
      // console.log(req.id);
    });
  });

  router.get('/search', (req,res)=>{

    console.log("search page");
    console.log(req.body);
    res.render(path.resolve("views/posts/search.handlebars"),{
      title:"search page!"
    });    
      // res.status(403).render(path.resolve("static/index.handlebars"),{
      //   title:"The Best Palindrome Checker in the World!"
      // });
    });

    router.post('/search', async (req,res)=>{ // here we search for all recipes with a specific name
        
      // res.render(path.resolve("static/index.handlebars"),{
      //   title:"The Best Palindrome Checker in the World!"
      // });
      var recipeToSearchFor = req.body;
      var desiredRecipesArr = []; 
      var tempRecipeName = recipeToSearchFor.name;
      var query = { name: tempRecipeName };
      collection.f
      desiredRecipesArr = await collection.find(query).toArray(function(err, result) {
        if (err) throw err;
        if(result.length === 0){
          console.log("nothing returned");
        }else{
          
          desiredRecipesArr = result;
          console.log(desiredRecipesArr.length);
        }
        
      });
      
    // get all recipes:   
    //   await collection.find().toArray((err, recipes) =>{
    //     if(err) throw err;
    //     recipesArr = recipes;
    //     // console.log("recipes length: " + recipes.length);
    //     // console.log(typeof recipes);
    // });
    //   console.log("new message length: " + recipesArr.length);
      
      res.json({send : "data recieved", status: true}); //last line in this function
    });

  module.exports = router;