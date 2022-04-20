const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const crypto = require('crypto');
const { json, response } = require('express');
const { get, request } = require('http');
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'cjaygalima@gmail.com',
        pass:'cj012610112233'
    },
    tls:{
        rejectUnauthorized:false,
    }
});


//Encrypting text
function encrypt(text) {
   let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
   let encrypted = cipher.update(text);
   encrypted = Buffer.concat([encrypted, cipher.final()]);
   return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}
// Decrypting text
function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
 }
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
app.get('/getusers',(request,response)=>{
    con.query("select* from `users`",(err,rows)=>{
        let usersArray = JSON.stringify(rows);
        response.status(200).json({users:usersArray});
       
    }); 

});
app.post('/deleteUser',(request,response)=>{
    const name = request.body.name;
    con.query("DELETE from `users` WHERE `name` = '"+ name +"'");
 
});
app.post('/editEmail',(request,response)=>{
    const name = request.body.name;
    const email = request.body.email;
    con.query("UPDATE `users` SET `email`='" + email +"' WHERE `name` = '" + name + "'");
});
app.post('/hello',(request,response) =>{
    let name = request.body.name;
    let email = request.body.email;
    let temp_pass = randomstring(5);
    console.log(name);
    const query = "insert into `users`(`name`,`password`,`email`) values('" + name + "','"+ temp_pass +"','"+ email +"' );"
    con.query(query,(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("account created");
            const mailOptions = {
                from:'cjaygalima@gmail.com',
                to:email,
                subject:'hi',
                text:'your temporary password is ' + temp_pass
            };
            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    console.log("email send error " + error);
                }else{
                    console.log("email sent " + info.response);
                }
            });
        }
    });
    response.send("henlow");
});
con.connect((err) =>{
    if(err){
        console.log("error mysql");    
    }else{
        console.log("connected to mysql");
    }
});

/*const query = "CREATE TABLE users(id int(11)NOT NULL AUTO_INCREMENT primary key,name varchar(50),password varchar(50));";
con.query(query);*/
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

