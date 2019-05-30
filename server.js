const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require('fs');
const path = require('path')
const port = process.env.PORT || 8000;
// Use the array below to store the users. Add/remove/update items in it based off
// let storage = require('./storage.json');
app.use(bodyParser.json());

//Get route for getting all users
app.get('/users', (req,res) => {
  fs.readFile('./storage.json', 'utf8', function(err, data) {
    if(err) throw err;
    res.json(JSON.parse(data));
  })
})


// Get route for getting a user by name
app.get('/users/:name', (req,res) => {
  fs.readFile('./storage.json', 'utf8', function(err, data) {
    if(err) throw err;
    let parsedData = JSON.parse(data);
    console.log(parsedData);
    let matchedUser = parsedData.filter((item) => {
      return item.name === req.params.name;
    });

    if(matchedUser) {
      res.json(matchedUser)
    } else {
      res.sendStatus(400);
    }
  })

})


//Create route for creating new users
app.post('/users', (req, res) => {
  let user = {
    name: req.body.name,
    email: req.body.email,
    state: req.body.state
  }
  fs.readFile('./storage.json', 'utf8', function(err,data){
    if(err) throw err;
    let parsedData = JSON.parse(data);
    console.log(parsedData);
    parsedData.push(user);
    fs.writeFile('./storage.json', JSON.stringify(parsedData), (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
    res.sendStatus(400);
  })
})


//Update route for updating a user by name
app.put('users/:name', (req,res) => {
  console.log("I am in patchUser/Update");
  fs.readFile('./storage.json', 'utf8', function(err, data) {
    if(err) throw err;
    let userData = JSON.parse(data);
    let name = req.params.name;
    for(let i = 0; userData.length; i++) {
      if(name === userData[i].name){
        userData[i] = req.body;
      }
    }
    fs.writeFile('./storage.json', JSON.stringify(userData), (err) => {
      if(err) throw err;
      console.log('User was updated.');
      res.send('Updated User successfully');
    });
    res.sendStatus(400);
  })
})


//Delete route for deleting a user by name
app.delete('users/:name', (req,res) => {
  console.log("I am in deleteApp");
  fs.readFile('./storage.json', 'utf8', function(err, data) {
    if (err) throw err;
    let parsedData = JSON.parse(data);
    let matchedUser = parsedData.filter((item) => {
      return item.name !== req.params.name;
    });

    fs.writeFile('./storage.json', JSON.stringify(matchedUser), function (err) {
      console.log("success!");
      res.sendStatus('User was deleted successfully');
    });
    res.sendStatus(400);
  })
})


app.listen(port, ()=>{
  console.log(`Listening on port ${port}`);
})
