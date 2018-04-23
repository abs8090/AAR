
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

    // console.log(req.body.name);

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
   // res.json({send : "data recieved", status: true}); //last line in this function
    // recipeNam = req.body.recipeName;
    // stepsArr = req.body.steps;
  });

  router.get('/search', (req,res)=>{

    res.render(path.resolve("views/posts/search.handlebars"),{
      title:"search page!"
    });    
      // res.status(403).render(path.resolve("static/index.handlebars"),{
      //   title:"The Best Palindrome Checker in the World!"
      // });
    });


  // router.post('/result', (req,res)=>{
        
  //   // console.log(req.body.name);
  //   recipeNam = req.body.recipeName;
  //   stepsArr = req.body.steps;

  //   console.log(typeof stepsArr);
    
  //   var re1 = new RegExp(/[^a-zA-Z0-9]+/i);
  //   var re2 = new RegExp(/[a-zA-Z0-9]+/i);
  
  //   res.render('posts/result', {
  //     name: recipeNam,
  //     steps: req.body.steps
  //     });
  // });




  module.exports = router;