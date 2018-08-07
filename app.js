const express = require("express");
const pg = require("pg");
const cors = require("cors");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const db = require('knex')({
  client: 'pg',
  version: '7.2',
  connection: {
    host : '127.0.0.1',
    user : 'duypeesea',
    password : '12121212',
    database : 'smartbrain'
  }
});

const app = express();

// Constants
const saltRounds = 3;
const salt = bcrypt.genSaltSync(saltRounds);

// Middlewares
app.use(bodyParser.json());

// Routing
app.post('/register', (req, res) => {
  // Destructuring user info and hashing password
  const { name, email, password } = req.body;
  if( !name ||  !email || !password ) {
    res.status(400).json({
      message: "Lack required information"
    })
  }
  db.select('email').from('users').where('email', email).then(emails => {
    if(emails.length){
      res.status(400).json({
        message: "Duplicated Email!"
      });
    }
    else{
      // Hashing password
      const hash = bcrypt.hashSync(password, salt);
      db('login')
      .returning('id')
      .insert({
        hash: hash
      })
      .then(id => {
        db('users').insert({
          id: id[0],
          name: name,
          email: email,
          joined: new Date()
        }).then(() => {})
        .catch(err =>  {})
      })
      .then(() => {
        res.status(201).json({
          message: "Register successfully"
        });
      })
      .catch(() => {
        res.status(500).json({
          message: "Something went wrong. Registration failed. Please try again"
        });
      })
    }
  })
})

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  db.select('*').from('users').where('email', email)
  .then(users => {
    if(!users.length){
      res.status(404).json({
        message: `User with email ${email} does not exist`
      })
    }else{
      const { id, name, email } = users[0];
      db.select('*').from('login').where('id', id)
      .then(accounts => {
        const { hash } = accounts[0];
        bcrypt.compare(password, hash, (req, valid) => {
          if(!valid){
            res.status(403).json({
              message: "Incorrect email or password!"
            })
          }
          else{
            res.status(200).json({
              message: "Welcome back!",
              data: {
                name: name,
                email: email
              }
            })
          }
        });
      })
    }
  })
})

app.get('/user/:id', function (req, res) {
  const { id } = req.params;
  db.select('*').from('users').where('id', id)
  .then(users =>  {
    if(!users.length){
      res.status(404).json({
        message: `Found no user with id ${id}`
      })
    }
    else{
      const user = users[0]
      res.status(200).json({
        message: "Retrieve user successfully",
        user: user
      });
    }
  })
})

app.put('/user/:id/rank/increment', function (req, res) {
  const { id } = req.params;
  db('users')
  .returning('rank')
  .increment('rank', 1)
  .where('id', id)
  .then(ranks =>  {
    if(!ranks.length){
      res.status(404).json({
        message: `User with ${id} does not exist`
      })
    } else{
      res.status(200).json({
        message: `Updated user ranking`,
        currentRankking: ranks[0]
      })
    }
  })
})

app.listen(3001 , () => {})
