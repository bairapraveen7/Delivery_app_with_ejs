const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const res = require("express/lib/response");

let rollno1="";
var sumofd=0;
var deliveryc=0;
var totalc=0;

 
 
const app = express();
const listoit=[];
let emplistit=[];

app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://praveenb:Technothlon@getsganga.pgyia.mongodb.net/userd",{useNewUrlParser:true});



const userschema = new mongoose.Schema({
    rollno : String,
    roomno : String,
    phoneno : String
});

const orderschema = new mongoose.Schema({
      rollno:String,
      item:String,
      quantity:String,
      maxprice:String,
      dateoford:String
});

const User = new mongoose.model('User',userschema);

const Order = new mongoose.model('Order',orderschema);

app.use(bodyParser.urlencoded({
    extended: true
  }));

//mongoose.connect("mongodb://localhost:27017/orderd",{useNewUrlParser:true});
 
app.use(express.static("public"));

app.get("/",function(req,res){
    res.render("register",{message:""});
});

app.post("/register",function(req,res){

    rollno1 : req.body.rollno;
    
    const user = new User({
        rollno : req.body.rollno,
        roomno : req.body.roomno,
        phoneno : req.body.phoneno
    });

    user.save(function(err){
        if(err)
        console.log("There is an error");
        else
        res.render("orders",{greet:req.body.rollno,glist:[],emplist:emplistit,jagant:0,kcrd:0,jk:0});
    });
});

app.post("/addempty",function(req,res){

    var today = new Date();

    const comit = {
        rollno:rollno1,
        item:"",
        quantity:0,
        maxprice:"0",
        dateoford:today.toDateString()
    };
    
    emplistit.push(comit);
    res.render("orders",{greet:rollno1,glist:listoit,emplist:emplistit,jagant:sumofd,kcrd:deliveryc,jk:totalc});
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
                   resp.render("orders",{greet:foundres.phoneno,glist:[],emplist:emplistit,jagant:sumofd,kcrd:deliveryc,jk:totalc});
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

    var today=new Date();

    const item=req.params.item;

    const comit = {
        rollno:rollno1,
        item:item,
        quantity:0,
        maxprice:"0",
        dateoford:today.toDateString()
    };
     let flag=0;
    listoit.map(function(x){

        if(x.item===item)
         flag=1;
    })
     if(flag===0){
    listoit.push(comit);
    
    }
    resp.render("orders",{greet:rollno1,glist:listoit,emplist:emplistit,jagant:sumofd,kcrd:deliveryc,jk:totalc});


});

app.get("/delete/:itemno",function(req,res){

    const item=req.params.itemno;

    for(let i=0;i<listoit.length;i++){

        if(listoit[i].item=== item){

            listoit.splice(i,1);
            break;
        }

    }

    


    res.render("orders",{greet:rollno1,glist:listoit,emplist:emplistit,jagant:sumofd,kcrd:deliveryc,jk:totalc});

});

app.get("/changenemp/:items",function(req,res){

    let items = (req.params.items).split(",");

    listoit.find(function(itemit){
        if(itemit.item===items[0]){
            itemit.quantity=items[1];
            itemit.maxprice=items[2];
        }
    });
    
      sumofd=Number(items[3]);

     deliveryc=Math.floor(sumofd*0.19);

     totalc=Number(items[3])+deliveryc;

    res.render("orders",{greet:rollno1,glist:listoit,emplist:emplistit,jagant:sumofd,kcrd:deliveryc,jk:totalc});


});

app.get("/changeemp/:items",function(req,res){

    let items = (req.params.items).split(",");

    sumofd=Number(items[4]);

    deliveryc=Math.floor(Number(sumofd*0.19));

    let totalc=sumofd+deliveryc;

    emplistit.map(function(itemit,index){
        let stringind=(index+1).toString();
        if(stringind == items[0]){
            itemit.item=items[1];
            itemit.quantity=items[2];
            itemit.maxprice=items[3];
        }
    });

    res.render("orders",{greet:rollno1,glist:listoit,emplist:emplistit,jagant:sumofd,kcrd:deliveryc,jk:totalc});


});

app.post("/gettodatabase",function(req,res){

    const databasearr=[];

    listoit.map(function(eachitem){
        var item1=new Order(eachitem);
        databasearr.push(item1);
    });

    emplistit.map(function(eachitem){
        var item1=new Order(eachitem);
        databasearr.push(item1);
    })

    Order.insertMany(databasearr,function(err){
        if(!err)
        console.log(err);
    });

        res.render("finalord",{totalord:databasearr,jagant:sumofd,kcrd:deliveryc,jk:totalc,rolll:rollno1});

        sumofd=deliveryc=totalc=0;
});

app.get("/deleteempty/:itemno",function(req,res){

    const item=req.params.itemno;

    emplistit.splice(item-1,1);

    res.render("orders",{greet:rollno1,glist:listoit,emplist:emplistit,jagant:sumofd,kcrd:deliveryc,jk:totalc});

});

app.get("/login",function(req,res){
    res.render("login",{message:""});
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,function(){
    console.log("server is listening");
});

 
