const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const { appendFile } = require('fs');
const mysql = require('mysql');

const app = express();

const database = mysql.createConnection({
    host:'127.0.0.1', 
    user: 'root',
    password: '12345678', 
    database:'Project'
})
database.connect();




app.use(session({ 
    secret:'kuaijieshuba',
    resave: false,
    saveUninitialized: true,

}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'/index.html'));
})

app.get('/teacher', (req, res) => {
    res.sendFile(path.join(__dirname,'/teacher.html'));

})

app.get('/student', (req, res) => {
    res.sendFile(path.join(__dirname,'/student.html'));

})

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname,'/admin.html'));

})

app.post('/login', (req, res)=> {
    //console.log(req.body.email);
    const postData = {
        namestudent: req.body.username,
        emailstudent:req.body.email,
        passwordstudent: req.body.password

    }
    const name = postData.namestudent;
    const email = postData.emailstudent;
    const password = postData.passwordstudent;
    

    database.query('select * from Student where emailstudent = ?',email,(err, result)=>{
        if (err) return console.log(err.message)
        if(result.length !== 1 && name !== 'admin') return res.send('This email has not been registered.');
        let nameData = [];
        result.forEach(item=>{
            nameData.push(item.namestudent);
        })
        let emailData = [];
        result.forEach(item=>{
            emailData.push(item.emailstudent);
        })

        let passwordData=[];
        result.forEach(item=>{
            passwordData.push(item.passwordstudent);
        })

        if(nameData.includes(name) && emailData.includes(email) && passwordData.includes(password)){
            req.session.user = postData;
            req.session.islogin =true;
            res.sendFile(path.join(__dirname,'/student.html'));
            
        }
        if(name == 'admin' && password == '000000'&& email=='admin@gmail.com'){
            req.session.user = postData;
            req.session.islogin =true; 
            res.sendFile(path.join(__dirname,'/admin.html'));
        }
       
  })
  

})

app.post('/teacherlogin', (req, res)=> {
    const tData = {
        tname: req.body.username,
        temail:req.body.email,
        tpassword: req.body.password

    }
    const name = tData.tname;
    const email = tData.temail;
    const password = tData.tpassword;
    

    database.query('select * from Teacher where temail = ?',email,(err, result)=>{
        if (err) return console.log(err.message)
        if(result.length !== 1 ) return res.send('This email has not been registered.');
        let nameData = [];
        result.forEach(item=>{
            nameData.push(item.tname);
        })
        let emailData = [];
        result.forEach(item=>{
            emailData.push(item.temail);
        })

        let passwordData=[];
        result.forEach(item=>{
            passwordData.push(item.tpassword);
        })

        if(nameData.includes(name) && emailData.includes(email) && passwordData.includes(password)){
            req.session.user = tData;
            req.session.islogin =true;
            res.sendFile(path.join(__dirname,'/teacher.html'));
            
        }
       
  })
  

})

app.post('/logout',(req, res)=>{
    req.session.destroy();
    res.sendFile(path.join(__dirname,'/index.html'))
})


app.post('/createteacher',(req, res,next) => {
    const name = req.body.tname;
    const email = req.body.temail;
    const password = req.body.tpassword;
    const postData = {
        tname: name,
        temail: email,
        tpassword: password
    }
    const sqlStr = 'INSERT INTO Teacher SET ?'
    database.query(sqlStr, postData,(err, result) => {
        if (err) return console.log(err.message);
        if(result.affectedRows ===1) {
            res.send('success');
        } 
        
    })
    
})

app.post('/changetpwd',(req, res,next) => {
    const email = req.body.email;
    const password2 = req.body.newpassword;
    const sqlStr = 'UPDATE Teacher SET tpassword=? WHERE temail=?'
    database.query(sqlStr, [password2,email],(err, result) => {
        if (err) return console.log(err.message);
        if(result.affectedRows ===1) {
            res.send('success');
        } 
        
    })
})

app.post('/changespwd',(req, res,next) => {
    const email = req.body.email;
    const password2 = req.body.newpassword;
    const sqlStr = 'UPDATE Student SET passwordstudent=? WHERE emailstudent=?'
    database.query(sqlStr, [password2,email],(err, result) => {
        if (err) return console.log(err.message);
        if(result.affectedRows ===1) {
            res.send('success');
        } 
        
    })
})
app.post('/signup',(req, res,next) => {
    const name = req.body.signname;
    const email = req.body.signemail;
    const password = req.body.signpassword;
    const postData = {
        namestudent: name,
        emailstudent: email,
        passwordstudent: password
    }
    const sqlStr = 'INSERT INTO Student SET ?'
    database.query(sqlStr, postData,(err, result) => {
        if (err) return console.log(err.message);
        if(result.affectedRows ===1) {
            res.send('success');
        } 
        
    })
    
    
   

   // res.end('');
})




app.listen(2330,() => {
    console.log('Express server running at http://localhost:2330')
})