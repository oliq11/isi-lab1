import express from 'express';
import blogRoutes from './routes.js';
import { sequelize } from './models/Post.js';

const app = express(); 

sequelize.sync()
    .then(() => console.log('Baza danych SQLite została zsynchronizowana (tabele utworzone).'))
    .catch(err => console.error('Błąd synchronizacji bazy:', err));

app.use('/blog', blogRoutes); 

app.listen(3000, () => {
    console.log('Server runs on http://localhost:3000');
});