var express = require('express');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var app = express();
var DataBase = require('../ing-tech-db/index');
var cors = require('cors');
var db = new DataBase();
var corsOptions = {
    origin: 'http://localhost:8000',
    optionsSuccessStatus: 200 // (IE11, various SmartTVs) choke on 204
};
app.database = db;
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use('/', indexRouter);

module.exports = app;
