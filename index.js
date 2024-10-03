import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Book_Notes",
    password: "yourpassword",
    port: 5432,
});
  
db.connect();

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

async function GetCovers(result) {
    const coverPromises = result.rows.map(async (row) => {
        try {
            const response = await axios.get(`https://covers.openlibrary.org/b/isbn/${row.isbn}-M.jpg`);
            return response.config.url;
        } catch (err) {
            console.log(err);
            return null;
        }
    });

    const covers = await Promise.all(coverPromises);
    return covers.filter(cover => cover !== null);
}

app.get("/", async (req,res) => {
    try{
        const result = await db.query("SELECT * FROM Books;");
        const covers = await GetCovers(result);
        res.render("index.ejs", {books: result, covers});
    }catch(err){
        console.log(err)
    }
});

app.post("/addbook", async (req,res) => {
    try{
        await db.query("INSERT INTO Books (Book_Title, Book_Author, Book_Review, Book_Rating, Date_Read, ISBN) VALUES ($1,$2,$3,$4,$5,$6);",[req.body.bookTitle, req.body.bookAuthor, req.body.bookReview, req.body.bookRating, req.body.dateRead, req.body.isbn]);
        res.redirect("/");
    }catch(err){
        console.log(err)
    }
});

app.post("/search", async (req, res) => {
    const { bookTitle } = req.body;
    try {
        const result = await db.query("SELECT * FROM Books WHERE book_title = $1", [bookTitle]);
        if (result.rows.length > 0) {
            const foundBook = result.rows[0];
            const resul = await db.query("SELECT * FROM Books;");
            const covers = await GetCovers(resul);
            res.render("index.ejs", { foundBook,books: resul, covers });
        } else {
            res.render("index.ejs", { message: "Book not found." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/edit/:id", async (req, res) => {
    const { newReview, newRating } = req.body;
    const bookId = req.params.id;

    try {
        await db.query(
            "UPDATE Books SET book_review = $1, book_rating = $2 WHERE id = $3",
            [newReview, newRating, bookId]
        );

        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
