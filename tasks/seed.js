const uuid = require('uuid/v4');
var tempID = uuid();
var MC = require('mongodb').MongoClient;
var collection;
var usersCollection;

function main() {

    console.log("made it here 1");
    
    MC.connect("mongodb://localhost:27017/", function(err, db) {
        if(err) { return console.dir(err); }
        var database = db.db("AAR");
        collection = database.collection('recipes');
        usersCollection = database.collection('users');
    });

    console.log("made it here 2");

    const recipe1 = {
        _id: uuid(),
        name: "recipe1",
        ingss: [ing1 = { name: "ing1", quantity: "7"}],
        steps: ["step1"],
        servings: 2,
        time: 5,
        chef: null,
        category: "breakfast",
        ratingArray: [],
        rating: 4,
        comments: []
    };

    console.log("made it here 3");

    collection.add(recipe1);
    console.log("done seeding db");

}