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
let booksInDB;

//TODO: gestire il click del bottone edit che rende true una variabile che mostra la card in versione edit 
//TODO: gestire la foto nel edit
//TODO: gestire inserimento file nel form
//TODO: aggiungere le immagini delle copertine usando la api di angela 
//TODO: gestire filtri
//TODO: error handling, aggiungere messaggi di errore in caso qualcoa non funziona


app.get('/', async (req, res) => {
    books = [];
    booksInDB = [];

    try {
        await db.query('SELECT * FROM books join opinions on books.opinion_id = opinions.id')
            .then((response) => {
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
                }
            })
    } catch (error) {
        console.log(error)
    }
    booksInDB = books
    res.render('index.ejs', { books: books })
})

app.post('/', async (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const points = req.body.points;
    const review = req.body.review;
    let id;
    let opinion_id;


    if (booksInDB?.length > 0) {
        // console.log('ciao', booksInDB)
        id = booksInDB.length + 1
    } else {
        // console.log('come', booksInDB)
        id = 1
    }
    opinion_id = id

    try {
        db.query('insert into opinions (id,review,rating) values($1,$2,$3)', [id, review, points])
            .then(() => {
                db.query('INSERT INTO books (id,title, author, opinion_id) VALUES ($1,$2,$3,$4)', [id, title, author, opinion_id])
            })
    } catch (error) {
        console.log(error)
    }
    res.redirect('/')
})

app.post('/delete', async (req, res) => {
    const id = req.body.bookId
    try {
        await db.query('DELETE from books WHERE  id = $1', [id]);
        await db.query('DELETE from opinions WHERE  id = $1', [id])
    } catch (error) {
        console.log(error)
    }
    res.redirect('/')
})

app.post('/edit', async(req, res) => {
    const id = req.body.bookId;
    const title = req.body.title;
    const author = req.body.author;
    const opinion_id = db.query('select opinion_id from books where id = $1',[id])
    const points = req.body.points;
    const review = req.body.review;
    console.log(id,title,author,points,review)
    try {
        await db.query('UPDATE books  SET title = $1, author = $2, opinion_id = $3 WHERE id = $4',[title, author, opinion_id, id]);
        await db.query('UPDATE opinions  SET review = $1, rating = $2 WHERE id = $3',[review, points, id]);
    } catch (error) {
        console.log(error)
    }
    res.redirect('/')
})

app.listen(port || 4000, () => {
    console.log(`server is up and running on port ${port}`)
})
