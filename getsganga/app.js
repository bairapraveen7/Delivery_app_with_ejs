const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const res = require("express/lib/response");

let rollno1="";


 
const app = express();
const listoit=[];

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userd",{useNewUrlParser:true});



const userschema = new mongoose.Schema({
    rollno : String,
    roomno : String,
    phoneno : String
});

const User = new mongoose.model('User',userschema);

app.use(bodyParser.urlencoded({
    extended: true
  }));

//mongoose.connect("mongodb://localhost:27017/orderd",{useNewUrlParser:true});
 
app.use(express.static("public"));

app.get("/",function(req,res){
    res.render("register",{message:""});
});

app.post("/register",function(req,res){
    
    const user = new User({
        rollno : req.body.rollno,
        roomno : req.body.roomno,
        phoneno : req.body.phoneno
    });

    user.save(function(err){
        if(err)
        console.log("There is an error");
        else
        res.render("orders",{greet:req.body.rollno,glist:[]});
    });
});

app.post("/login",function(req,resp){

    rollno1 = req.body.rollno;

      User.findOne({
          rollno : rollno1
     
      },
      function(err,foundres){
          if(err){
          console.log("error in finding");
          }
          else{
                if(foundres){
               if(foundres.phoneno === req.body.phoneno){
                   resp.render("orders",{greet:foundres.phoneno,glist:[]});
               }
               else{
                   resp.render("login",{message:"please make sure your phoneno is correct!!!!"})
               }
            }
            else{
                resp.render("register",{message:"register yourself before logging in."});
            }
               
          }
      }
      );

});

app.get("/additem/:item",function(req,resp){
  
    const item=req.params.item;
    let flag=0;
    listoit.map(function(x){

        if(x===item)
        flag=1;
    })
    if(flag===0){
    listoit.push(item);
    }
    resp.render("orders",{greet:rollno1,glist:listoit});


});

app.get("/delete/:item",function(req,res){

    const item=req.params.item;

    for(var i=0;i<listoit.length;i++){

        if(listoit[i]===item){
            listoit.splice(i,1);
            break;
        }
    }

    res.render("orders",{greet:rollno1,glist:listoit});

});

app.get("/login",function(req,res){
    res.render("login",{message:""});
});

app.listen(3000,function(){
    console.log("server is listening");
});

 
