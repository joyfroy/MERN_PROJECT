const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const employeeSchema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    username:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

})

employeeSchema.methods.generateAuthToken=async function(){

    try{

        const token = jwt.sign({ _id: this._id.toString() },process.env.SECRET_KEY);
        //console.log(token);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;

    }catch(error){
        res.send("the error part"+error);
        console.log("the error part"+error);
    }
}

//converting password into hash

employeeSchema.pre("save",async function(next){

    if(this.isModified("password")){
        //const passwrodHash = await bcrypt.hash(this.password, 10);
        //console.log(`the current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        //console.log(`the current password is ${this.password}`);

        this.confirmpassword = await bcrypt.hash(this.password, 10);;
    }

    next();
})

//now we need to creae collecion

const Register= new mongoose.model("Register", employeeSchema);

module.exports=Register;