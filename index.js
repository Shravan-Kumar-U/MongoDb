const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { UserModel, TodoModel } = require("./db");
const app = express();
mongoose.connect("");
const JWT_SECRETE = "OamGanapathi"
app.use(express.json());

app.post("/signup", async function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    await UserModel.create({
        username: username,
        password: password,
        name: name
    })
    res.status(200).json({
        message: "You are Signed up"
    })
})

app.post("/signin", async function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    const user = await UserModel.findOne({
        username: username,
        password: password
    })
    console.log(user);
    
    if(user){
        console.log({
            id: user._id.toString()
        });
        
        const token = jwt.sign({
            id: user._id.toString()
        }, JWT_SECRETE);
        res.json({
            token: token,
            message: "You are signed in"
        })
    }else{
        res.status(404).json({
            message: "Credentials are incorrect"
        })
    }
})

function auth(req, res, next){
    const token = req.headers.token;
    const decodedData = jwt.verify(token, JWT_SECRETE);
    if(decodedData){
        req.userId = decodedData._id;
        next();
    }else{
        res.status(404).json({
            message: "Credentials are incorrect"
        })
    }
}

app.post("/todo", auth, function(req, res){
    const userId = req.userId;
    res.json({
        userId : userId
    })
})

app.get("/todos", auth, function(req, res){
    const userId = req.userId;
    res.json({
        userId : userId
    })
})
app.listen(3000);