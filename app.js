import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

let posts = [];
let  nextID = 1;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render('index', {posts: posts});
});

app.get('/create', (req, res) => {
    res.render('create');
});


app.post('/create', (req, res) => {
    const {title, content} = req.body;
    const newPost = {
        id: nextID++,
        title: title,
        content: content,
        date: new Date()
    };
    posts.push(newPost); // adds the newly created post object to the posts array, effectively storing it.
    res.redirect('/'); // redirects the user back to the homepage (/) after the post has been created, allowing them to see the updated list of posts. 
});

app.get('/edit:id', (req, res) => {
    const postID = parseInt(req.params.id);
    const post = posts.find(p=>p.id === postID);
    if (post){
        res.render('edit', {post: post});
    } else {
        res.redirect('/');
    }
});

app.post('/edit/:id', (req, res) => {
    const postID = parseInt(req.params.id);
    const {title, content} = req.body;
    const postIndex = posts.findIndex(p=>p.id === postID);
    if (postIndex !== -1) {
        posts[postIndex].title = title;
        posts[postIndex].content = content;
    }
    res.redirect('/');
});

app.post('/delete:id', (req, res) => {
    const postID = parseInt(req.params.id);
    posts = posts.filter(p => p.id !== postID);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});
