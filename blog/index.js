import express from 'express';
import blogRoutes from './routes.js';
import { sequelize } from './models/Post.js';

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use('/blog', blogRoutes);

sequelize.sync().then(() => {
    app.listen(3000, () => console.log('http://localhost:3000/blog'));
});