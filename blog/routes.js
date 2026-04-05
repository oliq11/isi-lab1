import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Lista postów bloga');
});

export default router;