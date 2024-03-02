import express, { response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; //soluzione per sistemare __dirname is not defined
import ejs from 'ejs';
import pg from 'pg';
import _ from 'lodash';
import bodyParser from 'body-parser'

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let books = [];

app.get('/', async (req, res) => {
    books = [];
    try {
        await db.query('SELECT * FROM books join opinions on books.opinion_id = opinions.id')
            .then((response) => {
                // console.log(response.rows);
                if (response.rows.length > 0) {
                    response.rows.forEach(el => {
                        books = [...books, {
                            id: el.id,
                            title: el.title,
                            author: el.author,
                            points: el.rating,
                            review: el.review
                        }]
                    });
                    console.log(books)
                }
            })
    } catch (error) {
        console.log(error)
    }

    res.render('index.ejs', { books: books })
})

app.post('/', (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const points = req.body.points;
    // console.log(points)
    const review = req.body.review;
    let opinion_id;

    if (books?.length === 0) {
        opinion_id = 1
    } else {
        opinion_id = books?.length
    }
    console.log(opinion_id)
    const id = opinion_id

    try {
        db.query('insert into opinions (id,review,rating) values($1,$2,$3)', [id,review, points])
        .then(()=>{
            db.query('INSERT INTO books (id,title, author, opinion_id) VALUES ($1,$2,$3,$4)', [id,title, author, opinion_id])
        })
    } catch (error) {
        console.log(error)
    }
    res.redirect('/')
})

app.listen(port || 4000, () => {
    console.log(`server is up and running on port ${port}`)
})