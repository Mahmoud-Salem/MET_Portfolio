var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var multer  = require('multer')

var index = require('./routes/index');
//var tasks = require('./routes/tasks');
mongoose.connect('mongodb://localhost:27017/MiniProject');
var app= express();
// view engine
app.use(cookieParser());

app.use(session({secret: 'ssshhhhh'}));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);
app.use(express.static(__dirname + '/views/images'));

//set static Folder
//app.use(express.static(path.join(__dirname,'client')));

// Body Parser MW
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:false}));


app.use('/',index);
//app.use('/api',tasks);





//server
app.listen(8080,function(){
  console.log('Server started in 8080');
});
