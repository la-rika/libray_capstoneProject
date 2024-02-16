import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; //soluzione per sistemare __dirname is not defined
import ejs from 'ejs';
import pg from 'pg';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url); //soluzione per sistemare __dirname is not defined
const __dirname = path.dirname(__filename); //soluzione per sistemare __dirname is not defined
app.use(express.static(path.join(__dirname, "public")));

app.get('/',(req,res)=>{
    res.render('index.ejs')
})

app.listen(port||4000, ()=>{
    console.log(`server is up and running on port ${port}`)
})