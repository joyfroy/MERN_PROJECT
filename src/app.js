require('dotenv').config();
const express=require("express");
const path=require("path");
const app=express();
const hbs=require("hbs");
const bcrypt = require("bcryptjs");

require("./db/conn");
const Register=require("./models/registers");

const port= process.env.PORT|| 3000;
const static_path=path.join(__dirname,"../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
//console.log(path.join(__dirname));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("register");
});

//create a new user in db
app.post("/register", async(req, res) => {
    try{
        const password=req.body.password;
        const cpassword=req.body.cpassword;
        if (password == cpassword){
            const registerEmployee=new Register({
                fullname:req.body.fullname,
                username: req.body.username,
                email:req.body.email,
                phone: req.body.phonenumber,
                password:req.body.password,
                gender:req.body.gender,
                confirmpassword:req.body.cpassword,
            })

            //token
            const token= await registerEmployee.generateAuthToken();

            //password hash
            const register=await registerEmployee.save();
            res.status(201).render("index");
        }else{
            res.send("password are not same!!");
        }

    }catch(error){
        res.status(400).send(error);
    }
});

//login
app.get("/login",(req,res)=>{
    res.render("login");
});

app.post("/login",async(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        
        const useremail=await Register.findOne({email});
        //res.send(useremail);
        //console.log(useremail);

        const isMatch=bcrypt.compare(password,useremail.password);

        const token = await useremail.generateAuthToken();
        console.log("the oken part"+token);

        if(isMatch)
        {
            res.status(201).render("index");
        }else{
            res.send("passwords are not matching");
        }
        

    }catch(e){
        res.status(400).send("invalid Email");
    }
})

//hashing using bcrypt
/*
const bcrypt=require("bcryptjs");

const securePassword=async(password)=>{
   const passwrodHash=await bcrypt.hash( password,10);
   const passwordCompare=await bcrypt.compare(password,passwrodHash);

   console.log(passwrodHash);
   console.log(passwordCompare);

}

securePassword("Vishal");*/

/*

//json webtoken for cookies
const jwt=require("jsonwebtoken");
const { ok } = require("assert");

const createToken=async ()=>{
    const token=await jwt.sign({_id:""},"secretkey",{
        expiresIn:"2 seconds",
    });
    console.log(token);

    const userVer=await jwt.verify(token,"secretKey");
    console.log(userVer);
}


createToken();*/





app.listen(port,()=>{
    console.log(`server is running on port no ${port}`);
});