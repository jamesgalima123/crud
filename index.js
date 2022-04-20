const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const { json, response } = require('express');
const e = require('express');




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
    temp_pass = randomstring(5);
    console.log(name);
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
/*const query = "CREATE TABLE users(id int(11)NOT NULL AUTO_INCREMENT primary key,name varchar(50),password varchar(50));";
con.query(query);*/

