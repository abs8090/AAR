var MC = require('mongodb').MongoClient;
const bcrypt = require("bcrypt");
const saltRound = 10;
const uuid = require('uuid/v4');
var collection;
var usersCollection;

async function main() {

    var user1 = {
        _id: uuid(),        
        username: "test1",
        password: "password1",
        hashedPass: null, 
        email: "test1@email.com",
        session: null,
        recipe: { recipeID:  null, canRate: true}
    };

    var user2 = {
        _id: uuid(),        
        username: "test2",
        password: "password2",
        hashedPass: null, 
        email: "test2@email.com",
        session: null,
        recipe: { recipeID:  null, canRate: true}
    };

    var user3 = {
        _id: uuid(),        
        username: "test3",
        password: "password3",
        hashedPass: null, 
        email: "test3@email.com",
        session: null,
        recipe: { recipeID:  null, canRate: true}
    };

    var user4 = {
        _id: uuid(),        
        username: "test4",
        password: "password4",
        hashedPass: null, 
        email: "test4@email.com",
        session: null,
        recipe: { recipeID:  null, canRate: true}
    };

    user1.hashedPass = await bcrypt.hash(user1.password, saltRound);
    user2.hashedPass = await bcrypt.hash(user2.password, saltRound);
    user3.hashedPass = await bcrypt.hash(user3.password, saltRound);
    user4.hashedPass = await bcrypt.hash(user4.password, saltRound);

    var recipe1 = {
        _id: uuid(),
        name: "recipe1",
        ingss: [ing1 = { name: "ing1", quantity: "7"}],
        steps: ["step1", "step2"],
        servings: 2,
        time: 5,
        chef: null,
        category: "breakfast",
        ratingArray: [4],
        rating: 4,
        comments: [comment1 = {username: "test2", comment: "comment1"}]
    };

    var recipe2 = {
        _id: uuid(),
        name: "recipe2",
        ingss: [ing1 = { name: "ing1", quantity: "3"}, ing2 = {name: "ing2", quantity: "2"}],
        steps: ["step1", "step2", "step3", "step4", "step5"],
        servings: 12,
        time: 10,
        chef: "Rachel Ray",
        category: "lunch",
        ratingArray: [],
        rating: null,
        comments: [comment1 = {username: "test1", comment: "comment1"}, comment2 = {username: "test3", comment: "comment2"}]
    };

    var recipe3 = {
        _id: uuid(),
        name: "recipe3",
        ingss: [ing1 = { name: "ing1", quantity: "7"}, ing2 = {name: "ing2", quantity: "4"}, ing2 = {name: "ing2", quantity: "9"}],
        steps: ["step1", "step2", "step3"],
        servings: 4,
        time: 15,
        chef: null,
        category: "dinner",
        ratingArray: [4, 3, 4, 2, 1],
        rating: 2.8,
        comments: []
    };

    var recipe4 = {
        _id: uuid(),
        name: "recipe4",
        ingss: [ing1 = { name: "ing1", quantity: "1"}, ing2 = {name: "ing5", quantity: "3"}],
        steps: ["step1", "step2", "step3", "step4"],
        servings: 8,
        time: 20,
        chef: "Gordon Ramsey",
        category: "breakfast",
        ratingArray: [1, 3],
        rating: 2,
        comments: [comment1 = {username: "test2", comment: "comment1"}, comment2 = {username: "test1", comment: "comment2"}]
    };

    MC.connect("mongodb://localhost:27017/", function(err, db) {
        if(err) { return console.dir(err); }
  
        var database = db.db("AAR");
        collection = database.collection('recipes');
        usersCollection = database.collection('users');

        collection.insert(recipe1, (err, numAffected, recipe) => {
            if(err) throw err;
            if(numAffected.insertedCount !== 1) throw "error occured while adding";
        });

        collection.insert(recipe2, (err, numAffected, recipe) => {
            if(err) throw err;
            if(numAffected.insertedCount !== 1) throw "error occured while adding";
        });

        collection.insert(recipe3, (err, numAffected, recipe) => {
            if(err) throw err;
            if(numAffected.insertedCount !== 1) throw "error occured while adding";
        });

        collection.insert(recipe4, (err, numAffected, recipe) => {
            if(err) throw err;
            if(numAffected.insertedCount !== 1) throw "error occured while adding";
        });

        usersCollection.insert(user1, (err, numAffected, userToAdd) =>{
            if(err) throw err;
            if(numAffected.insertedCount !== 1) throw "error occured while adding";
        });

        usersCollection.insert(user2, (err, numAffected, userToAdd) =>{
            if(err) throw err;
            if(numAffected.insertedCount !== 1) throw "error occured while adding";
        });

        usersCollection.insert(user3, (err, numAffected, userToAdd) =>{
            if(err) throw err;
            if(numAffected.insertedCount !== 1) throw "error occured while adding";
        });

        usersCollection.insert(user4, (err, numAffected, userToAdd) =>{
            if(err) throw err;
            if(numAffected.insertedCount !== 1) throw "error occured while adding";
        });
    });

    console.log("done seeding db");

};

main();
