# AAR

This is the Group Project for CS 546, Group AAR. <br />
Project Manager: Abdulaziz Alhomaidhi <br />
Group Members: Abdulaziz Alhomaidhi, Ruth Dennehy, Alexandra Behrman, James Spaniak <br />

This project is a web application designed to allow user's to create and search for recipes after creating and being logged into an account.

# Video Link:
https://www.youtube.com/watch?v=iweVaE0ddSI&feature=youtu.be

# Getting Started
1. First you will need to make sure that node.js is installed.
2. In the folder containing this project run the command "npm install"
3. Next run the command "mongod" in a seperate terminal 
4. In the folder containing the project run the command "npm run seed" to seed the database.
5. Once the seed is complete, in the folder containing the project run the command "npm start"
6. Create an Account: to use this application you will need to create an account by providing a valid username, password, and e-mail 
7. Upload A Recipe: fill out all specified fields then click the submit button
8. Search A Recipe: you have the option to search by: ingredient, recipe name, chef, or time
9. Log Out: after logging out you will need to login using the username and password

# General Notes
1. in the video, we said we throw an error when a user tries to access the route ('/recipe/:id') and no such recipe exists. However, we later updated that by adding an error.handlebars page indicating that error message  with the ability to go back to the search page.
2. in recipeInfo page, any comment made by the user will be shown immediatly when clicking "submit" without showing username. In order to see the name and the new rating (if the user rated the recipe) , the page needs to be refreshed. 
