const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const { json, response } = require('express');





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
        let usersArray = JSON.stringify(rows);
        response.status(200).json({users:usersArray});
       
    }); 

});
app.post('/delete',(request,response)=>{
    const name = request.body.name;
    con.query("DELETE from `users` WHERE `name` = '"+ name +"'");
 
});
app.post('/edit',(request,response)=>{
    const name = request.body.name;
    const email = request.body.email;
    con.query("UPDATE `users` SET `email`='" + email +"' WHERE `name` = '" + name + "'");
});
app.post('/create',(request,response) =>{
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

