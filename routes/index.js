

var express = require('express');

var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'views/images/' })
var db = mongoose.connection;


var sess;
db.on('error', console.error.bind(console, 'connection error:'));
     db.once('open', function callback () {
         console.log('Conntected To Mongo Database');
     });


  var projSchema = new mongoose.Schema({
      username :{
        type :String,
        required:true,
        unique:true
      },
      password :String ,

      pp:String ,
          description:String,
      projects :[String]
  },{collection:'Projects'});


  //var salem = mongoose.model('Projects', projSchema);
//var adminLogin = mongoose.model("Projects");
var adminLogin = mongoose.model('MiniProject', projSchema);
router.get('/Login',function(req,res)
{
  sess = req.session ;
    res.render('index.ejs');
});

router.get('/Register',function(req,res)
{
    res.render('RegisterStudent.ejs');
});

router.get('/main',function(req,res)
{
  sess = req.session ;
  if(sess.username){
    adminLogin.find({ $where : "this.projects.length != 0" },function(err,projects)
  {


    adminLogin.findOne({username: sess.username}, function (err, user) {

    var  temp = new adminLogin({
        username:user.username ,
        password:user.password,

        pp:user.pp,
        description:user.description,
        projects:user.projects
      });

    res.render('main.ejs',{projects,temp});
  });

});}
});
  var sess ;
router.get('/',function(req,res)
{

    res.render('home.ejs');
});
router.get('/view',function(req,res)
{
  adminLogin.find({ $where : "this.projects.length != 0" },function(err,projects)
{
  res.render('view.ejs',{projects});
});
});


router.post('/Login', function(req, res)
{

  sess = req.session ;


    // new code should come over here
    adminLogin.findOne({username: req.body.uname, password: req.body.psw}, function(err, user){
        var username = req.body.uname ;
        if(err) {
            console.log(err);
        }
        else if(user){

          req.session.username = req.body.uname ;
          res.redirect('/main');

          // redirect to create a project
        }
        else {
          res.render('index.ejs',{error:true});
        //    console.log('Invalid');

        }
    });

});

router.post('/Register',upload.single('pic'), function(req, res)
{
//  router.post('/Register', function(req, res)
 //{
    // new code should come over here
  // console.log(req.file+" "+req.files)
    if(req.file)
   {
    var temp = new adminLogin({
      username:req.body.uname ,
      password:req.body.psw,
  //   pp:req.body.pp ,
     pp:"/"+req.file.filename,
      description:req.body.description,
      projects:[]
    });

          temp.save(function(err, temp){
         if(err){
            res.render('RegisterStudent.ejs',{error:true});
         }
         else{
               res.render('RegisterStudent.ejs',{right:true});
         }
     });
   }
            // redirect to home page

    });


    router.post('/main', function(req, res)
    {
      sess = req.session;
      adminLogin.findOne({username: sess.username}, function (err, user) {

      var  temp = new adminLogin({
          username:user.username ,
          password:user.password,
          pp:user.pp,
          description:user.description,
          projects:user.projects.concat([req.body.work])
        });


          adminLogin.remove({ username:sess.username }, function(err) {
            if (!err) {

            }
            else {

            }
        });

        temp.save(function(err, temp){

        if(err){

          var error =false ;
          adminLogin.find({ $where : "this.projects.length != 0" },function(err,projects)
        {
          console.log(projects);
          res.render('main.ejs',{projects,error,temp});
        });

        }
        else{
          //  res.redirect('/main?username='+temp2.username);
          if(temp.projects.length ==1)
          {
            var rr = true ;
            adminLogin.find({ $where : "this.projects.length != 0" },function(err,projects)
          {

            res.render('main.ejs',{projects,right,rr,temp});
          });
          }
          else{
          var right = true ;
          adminLogin.find({ $where : "this.projects.length != 0" },function(err,projects)
        {
          res.render('main.ejs',{projects,right,temp});
        });}




        }
        });



  });

  });




module.exports=router ;
