import { Router } from 'express';
const router = Router();
import { userData } from '../data/index.js';
import validation from '../validation.js';

router.route('/').get(async (req, res) => {
  //Todo
});

export default router;
