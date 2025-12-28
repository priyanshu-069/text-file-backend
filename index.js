const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const fs = require('fs');
const { log } = require('console');

const helmet = require('helmet');
app.use(helmet()); // This hides technical details from hackers/trackers

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine' ,'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get("/" , (req,res) =>{
    fs.readdir(`./files` , (err, files)=> {
        res.render('index.ejs',{
            files:files
        });
        console.log(files);
    });
});
app.post("/create" , (req,res) =>{
    console.log(req.body);
    if(fs.existsSync(`./files/${req.body.title}.txt`)){
        fs.appendFile(`./files/${req.body.title}.txt` ,`\n${req.body.details}` , (err)=>{
            if(err) console.error(err);
            else console.log('data added successsfully');
            res.redirect("/");
        });
    }else{
        fs.writeFile(`./files/${req.body.title}.txt` , req.body.details, (err)=>{
            res.redirect("/");
        })
    }
});
app.get("/files/:filename" , (req,res) =>{
    // res.render('index.ejs');
    // res.send("Hello wotrl");
    fs.readFile(`./files/${req.params.filename}` , "utf-8", (err, filedata)=> {
        res.render('show.ejs', {filename: req.params.filename , filedata:filedata});
    });
});
app.get('/edit/:filename' , (req,res) =>{
    res.render('edit' ,{filename: req.params.filename});
});
app.post('/edit' , (req,res) =>{
    fs.rename(`./files/${req.body.previous}` , `./files/${req.body.new}` , (err)=>{
        res.redirect("/");
    })
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});