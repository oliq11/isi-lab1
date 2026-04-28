import express from 'express';
const router = express.Router();
import { Post } from './models/Post.js';

import { getCityForecast24h } from './services/open_meteo.js';
import { getHolidaysData } from './services/nager-date.js';

const SUCHY_DWOR = {
    name: 'Suchy Dwór (Pomorskie)',
    latitude: 54.5744,
    longitude: 18.466
};

router.get('/add', (req, res) => {
    res.send(`
        <h1>Panel Admina - Dodaj Post</h1>
        <form action="/blog/add" method="POST">
            <input type="text" name="title" placeholder="Tytuł" required><br><br>
            <textarea name="content" placeholder="Treść posta" required></textarea><br><br>
            <input type="text" name="author" placeholder="Autor" required><br><br>
            <button type="submit">Zapisz w bazie</button>
        </form>
        <hr>
        <a href="/blog">← Powrót do listy</a>
    `);
});

router.post('/add', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        await Post.create({ title, content, author });
        res.redirect('/blog');
    } catch (error) {
        res.status(500).send("Błąd zapisu: " + error.message);
    }
});

router.get('/weather', async (req, res) => {
    try {
        const weather = await getCityForecast24h(SUCHY_DWOR);
        const labelsJson = JSON.stringify(weather.times);
        const valuesJson = JSON.stringify(weather.temperatures);

        res.send(`
            <h1>Pogoda - ${weather.cityName}</h1>
            
            <p><strong>Współrzędne:</strong> ${weather.latitude}, ${weather.longitude}</p>
            <p><strong>Aktualna temperatura:</strong> ${weather.currentTemperature.toFixed(1)}°C</p>
            <p><strong>Średnia temperatura (następne 24h):</strong> ${weather.averageTemperature}°C</p>
            <div style="max-width:1500px;">
                <canvas id="c" style="width:100%;height:500px;display:flex;"></canvas>
            </div>

            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <script>
                const ctx = document.getElementById('c').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                    labels: ${labelsJson},
                    datasets: [{ label: 'Temp', data: ${valuesJson}, borderColor: 'rgb(54, 119, 163)', fill: false }]
                    },
                    options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { display: true },
                        y: { display: true, beginAtZero: false }
                    }
                    }
                });
            </script>
            <hr>
            <a href="/blog">← Powrót do listy</a>
            `);

    } catch (error) {
        res.status(500).send(`
            <h1>Błąd</h1>
            <p>Nie udało się pobrać danych pogodowych.</p>
            <pre>${error.message}</pre>
            <a href="/blog">← Powrót do listy</a>
        `);
    }
});

router.get('/holidays', async (req, res) => {
    try {
        const data = await getHolidaysData(2026, 'PL');

        let listHtml = data.holidays.map(h => `<li>${h.date}: ${h.localName}</li>`).join('');

        let statsHtml = Object.entries(data.monthlyStats).map(([month, count]) => {
            const monthName = new Date(2026, month - 1).toLocaleString('pl-PL', { month: 'long' });
            return `<li>${monthName}: <strong>${count}</strong> dni wolnych</li>`;
        }).join('');

        res.send(`
            <h1>Dni wolne 2026</h1>
            
            <section>
                <h3><strong>Suma świąt w roku:</strong> ${data.globalTotal}</h3>
                <hr>
                <h3>Statystyki miesięczne:</h3>
                <ul>${statsHtml}</ul>
            </section>
            <hr>
            <h3>Lista wszystkich świąt:</h3>
            <ul>${listHtml}</ul>
            
            <hr>
            <a href="/blog">← Powrót do listy</a>
        `);
    } catch (error) {
        res.status(500).send("Błąd świąt: " + error.message);
    }
});

router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({ order: [['created_at', 'DESC']] });

        let html = `
            <h1>Mój Blog</h1>
            <a href="/blog/add"> + Dodaj nowy post</a> | 
            <a href="/blog/weather">Sprawdź pogodę</a> | 
            <a href="/blog/holidays">Sprawdź święta</a>
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
            return res.status(404).send("<h1>Błąd 404</h1><p>Nie znaleziono wpisu.</p><a href='/blog'>Wróć</a>");
        }

        const html = `
            <article>
                <h1>${post.title}</h1>
                <p><strong>Autor: ${post.author}</strong> | <em>Data: ${post.published_at.toLocaleString()}</em></p>
                <div style="white-space: pre-wrap;">${post.content}</div>
                <hr>
                    <a href="/blog">← Powrót do listy</a>
            </article>
            `;
        res.send(html);
    } catch (error) {
        res.status(500).send("Błąd serwera: " + error.message);
    }
});


// JSON API: zwraca przetworzone dane pogodowe
router.get('/api/weather', async (req, res) => {
    try {
        const weather = await getCityForecast24h(SUCHY_DWOR);
        return res.json({
            cityName: weather.cityName,
            latitude: weather.latitude,
            longitude: weather.longitude,
            currentTemperature: Number(weather.currentTemperature),
            averageTemperature: Number(weather.averageTemperature),
            times: weather.times,
            temperatures: weather.temperatures
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch weather', message: error.message });
    }
});

// JSON API: zwraca przetworzone dane świąt
router.get('/api/holidays', async (req, res) => {
    try {
        const data = await getHolidaysData(2026, 'PL');
        return res.json({
            total: data.total ?? data.length ?? null,
            globalTotal: data.globalTotal,
            monthlyStats: data.monthlyStats,
            holidays: data.holidays
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch holidays', message: error.message });
    }
});


export default router;