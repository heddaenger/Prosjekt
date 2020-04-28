const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const secret = 'verysecret';

module.exports.router = router;
module.exports.jwt = jwt;
module.exports.secret = secret;
