'use strict';

var Firebase = require('firebase');
var express = require('express');
var router = express.Router();

var authMiddleware = require('../config/auth');

var User = require('../models/User');

var ref = new Firebase('https://seefoodapp.firebaseio.com/');

router.post('/register', function(req, res, next) {
  ref.createUser(req.body, function(err, userData) {
    if(err) return res.status(400).send(err);
    User.create(userData, function(err) {
      res.send();
    });
  });
});

router.post('/login', function(req, res, next) {
  ref.authWithPassword(req.body, function(err, authData) {
    if(err) return res.status(400).send(err);
    User.findOne({uid: authData.uid}, function(err, user) {
      var token = user.generateToken();
      res.cookie('mytoken', token).send();
    });
  });
});

router.get('/logout', function(req, res, next) {
  res.clearCookie('mytoken').redirect('/');
});

module.exports = router;
