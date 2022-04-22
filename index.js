const express = require('express');
const app = express();
const mysql = require('mysql');
//const opencv = require('opencv4nodejs');
const cors = require('cors');
const { json, res } = require('express');
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
app.get('/api/v1/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    if(typeof email !== 'undefined' && typeof password !== 'undefined'){
        if(email.length > 0 && password.length > 0){
            const user = {name : email};
            const accessToken =  jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
            con.query("select* from `users` where `email`='" + email +"' and `password`='" + password +"'",(err,rows) =>{
                console.log("row " + email + " " + password + " " + rows.length);
                if(err){
                    console.log("error " + err);
                }else{
                    if(rows.length > 0){
                        console.log("log in success");
                        res.json({accessToken : accessToken,login:"success"});
                    }else{
                        console.log("log in failed");
                        res.json({login:"log in failed"});
    
                    }
                }
            });
        }
    }else{
        res.send("missing values");
    }
});  
app.get('/api/v1/read',(req,res)=>{
    const email = req.body.email;
    con.query("select `name` from `users` where `email` = '" + email +"'",(err,rows)=>{
        if(!err){
            let usersArray = JSON.stringify(rows);
            res.status(200).json({users:usersArray});
        }else{
            res.send("SQL Read Query error " + err);
        }
       
    }); 

});
app.put('/api/v1/changepassword',(req,res)=>{
    const password = req.body.password;
    const email = req.body.email;
    try {
        con.query("UPDATE `users` SET `password`='" + password +"' WHERE `name` = '" + email + "'",(err,result,field)=>{
            
        });
        res.send("password successfully changed");
    } catch (error) {
        console("SQL Edit Query error " + error);
        res.send("SQL Edit Query error " + error);

    }
});
app.delete('/api/v1/delete',(req,res)=>{
    const name = req.body.name;
    try {
        con.query("DELETE from `users` WHERE `name` = '"+ name +"'",(error,result,field)=>{
            const affectedRows = result.affectedRows;
            if(affectedRows == 1){
                res.send("Account successfully deleted");
            }else{
                res.send("No matching email");
            }
        });
    } catch (error) {
        console.log("SQL Delete Query error " + error);
        res.send("SQL Delete Query error " + error);

    }
 
});
app.put('/api/v1/update',(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    try {
        con.query("UPDATE `users` SET `name`='" + name +"' WHERE `email` = '" + email + "'",(error,result,field)=>{
            const affectedRows = result.affectedRows;
            if(affectedRows == 1){
                res.send("Name successfully updated");
            }else{
                res.send("No matching email");
            }
            
            
 
        });
        
    } catch (error) {
        console("SQL Edit Query error " + error);
        res.send("SQL Edit Query error " + error);
    }
});
app.post('/api/v1/create',(req,res) =>{
    let name = req.body.name;
    let email = req.body.email;
    let pass = req.body.password;
    try {
        const query = "insert into `users`(`name`,`password`,`email`) values('" + name + "','"+ pass +"','"+ email +"' );"
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
    
    res.send("account created");
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

