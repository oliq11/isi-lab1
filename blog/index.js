import express from 'express';
import blogRoutes from './routes.js';

const app = express(); 

app.use('/blog', blogRoutes); 

app.listen(3000, () => {
    console.log('Server runs on port 3000');
});