var express=require("express"),
    mongoose=require("mongoose"),
    passport=require("passport"),
    methodOverride=require("method-override"),
    bodyParser=require("body-parser"),
    User=require("./models/user"),
    LocalStrategy=require("passport-local"),
    passportLocalMongoose=require("passport-local-mongoose"); 
    
mongoose.connect('mongodb://localhost/student_record', {useNewUrlParser: true});
var app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.use(require("express-session")({
    secret:"ahmad firoz",
    resave:false,
    saveUninitialized:false
    
}));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var studentSchema=new mongoose.Schema({
    faculty_number:String,
    enrollment_number:String,
    name:String,
    course:String,
    department:String
})
var Student=mongoose.model("Student",studentSchema);


app.get("/",function(req,res){
    res.render("authentiaction");
});
app.get("/home",isLoggedIn,function(req,res){
    res.render("home");
});
app.get("/student_detail",isLoggedIn,function(req,res){
    //get all students detail from database
    Student.find({},function(err,allStudents){
        if(err){
            console.log(err);
        }else{
              res.render("student_detail",{students:allStudents});
        }
    });
});
//Destroy student detail

app.delete("/:id",function(req,res){
    res.send("you are trying to delete something");
});


app.get("/register",function(req,res){
    res.render("register");
    
})

app.post("/register",function(req,res){
   // res.send("jniknjh");
    req.body.username
    req.body.password
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/home");
        });
    });
});

app.get("/addstudent",isLoggedIn,function(req,res){
    //res.send("Ok I will log out!");
    res.render("addstudent");
})
app.post("/addstudent",function(req,res){
    var faculty_number=req.body.faculty_number;
    var enrollment_number=req.body.enrollment_number;
    var name=req.body.name;
    var course=req.body.course;
    var department=req.body.department; 
    var newStudent={faculty_number:faculty_number,
        enrollment_number:enrollment_number,
        name:name,
        course:course,
        department:department}
        
    Student.create(newStudent,function(err,newlyCreated){
          if(err){
              console.log(err);
          }else {
             //redirect back to home page
              res.redirect("student_detail");
          }
    
});
});

app.get("/login",function(req,res){
    res.render("login");
})

app.post("/login",passport.authenticate("local",{
        successRedirect:"/home",
        failureRedirect:"/login"
}),function(req,res){
    
});

app.get("/logout",function(req,res){
    //res.send("Ok I will log out!");
    req.logout();
    res.redirect("/");
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Sever Started...");
})
