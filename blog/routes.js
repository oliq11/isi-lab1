import express from 'express';
const router = express.Router();
import { Post } from './models/Post.js';

router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({ order: [['created_at', 'DESC']] });
        
        let html = `
            <h1>Mój Blog</h1>
            <a href="/blog/add"> + Dodaj nowy post</a>
            <hr>
        `;

        if (posts.length === 0) {
            html += '<p>Brak postów do wyświetlenia.</p>';
        } else {
            posts.forEach(post => {
                html += `
                    <article>
                        <h2><a href="/blog/${post.id}">${post.title}</a></h2>
                        <small>Autor: ${post.author} | Data: ${post.published_at.toLocaleDateString()}</small>
                    </article>
                    <hr>
                `;
            });
        }
        res.send(html);
    } catch (error) {
        res.status(500).send("Błąd bazy danych: " + error.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        
        if (!post) {
            return res.status(404).send("<h1>Błąd 404</h1><p>Nie znaleziono takiego wpisu.</p><a href='/blog'>Wróć do listy</a>");
        }

        const html = `
            <article>
                <h1>${post.title}</h1>
                <p><strong>Autor: ${post.author}</strong> | <em>Opublikowano: ${post.published_at.toLocaleString()}</em></p>
                <div style="white-space: pre-wrap; font-size: 1.2em;">${post.content}</div>
                <hr>
                <a href="/blog">Powrót do listy postów</a>
            </article>
        `;
        res.send(html);
    } catch (error) {
        res.status(500).send("Błąd serwera: " + error.message);
    }
});

export default router;