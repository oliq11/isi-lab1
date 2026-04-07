import express from 'express';
const router = express.Router();
import { Post } from './models/Post.js';

router.get('/add', (req, res) => {
    res.send(`
        <h1>Panel Admina - Dodaj Post</h1>
        <form action="/blog/add" method="POST">
            <input type="text" name="title" placeholder="Tytuł" required><br>
            <textarea name="content" placeholder="Treść"></textarea><br>
            <input type="text" name="author" placeholder="Autor" required><br>
            <button type="submit">Zapisz w bazie</button>
        </form>
    `);
});

router.post('/add', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        await Post.create({ title, content, author });
        res.redirect('/blog'); 
    } catch (error) {
        res.send("Błąd: " + error.message);
    }
});

router.get('/', async (req, res) => {
    const posts = await Post.findAll();
    
    let html = '<h1>Lista Postów</h1><a href="/blog/add">Dodaj nowy</a><hr>';
    posts.forEach(post => {
        html += `
            <div>
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                <small>Autor: ${post.author} | Data: ${post.created_at}</small>
            </div>
            <hr>
        `;
    });
    res.send(html);
});

export default router;