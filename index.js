import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; //soluzione per sistemare __dirname is not defined
import ejs from 'ejs';
import pg from 'pg';
import _ from 'lodash';

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "personal_library",
    password: "M1server370!!",
    port: 5432,
})

db.connect()

const __filename = fileURLToPath(import.meta.url); //soluzione per sistemare __dirname is not defined
const __dirname = path.dirname(__filename); //soluzione per sistemare __dirname is not defined
app.use(express.static("public"));

let books;

app.get('/', async(req, res) => {
    books = [];
    try {
        await db.query('SELECT * FROM books')
        .then((response)=>{
            // console.log(response.rows);
            response.rows.forEach(el => {
                books = [...books,{
                    id: el.id,
                    title: el.title,
                    author: el.author,
                    isbn: el.isbn,
                    opinion_id: el.opinion_id
                }]
            });
            // console.log(books)
        })
    } catch (error) {
        console.log(error)
    }

    res.render('index.ejs', {books:books})
})

app.listen(port || 4000, () => {
    console.log(`server is up and running on port ${port}`)
})