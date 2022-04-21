const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const { json, response } = require('express');
const e = require('express');
const cc =require('dotenv');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
console.log(crypto.randomBytes(64).toString('hex'));
require("dotenv").config();
console.log(process.env.HENLO);



const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootadmin',
    database:'testing',
});
app.use(cors());
app.use(express.json());
app.listen(3001,()=>{
    console.log("connect");
});
app.post('/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const user = {name : email};
    const accessToken =  jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
    res.json({accessToken : accessToken});
    con.query("select* from `users` where `email` = '" + email +"' and `password` = '" + password +"'",(err,rows) =>{
        console.log("row " + rows.length);
        if(err){
            console.log("error " + err);
        }else{
            if(rows.length > 0){
                console.log("log in success");
            }else{
                console.log("log in failed");
            }
        }
    });
});  
app.get('/read',(request,response)=>{
    con.query("select* from `users`",(err,rows)=>{
        if(!err){
            let usersArray = JSON.stringify(rows);
            response.status(200).json({users:usersArray});
        }else{
            console.log("SQL Read Query error " + err);
        }
       
    }); 

});
app.post('/delete',(request,response)=>{
    const name = request.body.name;
    try {
        con.query("DELETE from `users` WHERE `name` = '"+ name +"'");
    } catch (error) {
        console("SQL Delete Query error " + error);
    }
 
});
app.post('/update',(request,response)=>{
    const name = request.body.name;
    const email = request.body.email;
    try {
        con.query("UPDATE `users` SET `email`='" + email +"' WHERE `name` = '" + name + "'");
    } catch (error) {
        console("SQL Edit Query error " + error);
    }
});
app.post('/create',(request,response) =>{
    let name = request.body.name;
    let email = request.body.email;
    let pass = request.body.email;
    try {
        const query = "insert into `users`(`name`,`password`,`email`) values('" + name + "','"+ temp_pass +"','"+ email +"' );"
        con.query(query,(err)=>{
            if(err){
                console.log(err);
            }else{
                console.log("account created");
                
            }
        });
    } catch (error) {
        console("SQL Create Query error " + error);
    }
    
    response.send("henlow");
});
con.connect((err) =>{
    if(err){
        console.log("error mysql");    
    }else{
        console.log("connected to mysql");
    }
});
function randomstring(length) {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
/*function authenticateUser(req,res,next){
    const authHeader = req.headers('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}*/
/*const query = "CREATE TABLE users(id int(11)NOT NULL AUTO_INCREMENT primary key,name varchar(50),password varchar(50));";
con.query(query);*/

