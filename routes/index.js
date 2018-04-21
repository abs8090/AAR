
const router = require('express').Router();
const path = require("path");
const bodyParser = require('body-parser');
const express = require("express");

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
    console.log(req.body);
    // console.log(req.body.name);



    res.json({send : "data recieved", status: true}); //last line in this function
    // recipeNam = req.body.recipeName;
    // stepsArr = req.body.steps;
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