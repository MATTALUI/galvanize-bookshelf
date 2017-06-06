'use strict';
const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt');
const humps = require('humps');

router.post('/users', function(req, res){
  bcrypt.hash(req.body.password, 8, function(err, hash){
    let newUser = {
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      hashed_password: hash
    }
    knex('users')
    .insert(newUser)
    .returning(['email','first_name as firstName','id', 'last_name as lastName'])
    .then(function(post){
      res.send(post[0]);
    });
  });



});

module.exports = router;
