


const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");
const bodyParser = require('body-parser');
const routes = require("./routes");
const handelBar = require('express-handlebars');
// comment
app.use("/public", static);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.engine('handlebars', handelBar({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/',routes);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});

function checkText(str){

  str = str.replace(/[^a-zA-Z0-9]/g,'').toLowerCase();
  var tempStr = str.split("").reverse().join(""); 

  return (str === tempStr);
  
}

  function validate(str){
    var re1 = new RegExp(/[^a-zA-Z0-9]+/i);
    var re2 = new RegExp(/[a-zA-Z0-9]+/i);
    var result;
      if(re1.test(str)){
    
        if(re2.test(str)){
          result = checkText(str);
        }else{
          result = false;
        }
        
      }else if (str.length === 0){
        result = false;
      }else {
        result = checkText(str);
      }
    
    return result;
  }
