import { Router } from 'express';
const router = Router();
import { userData } from '../data/index.js';
import validation from '../validation.js';
import * as users from '../data/users.js';

router.route('/').get(async (req, res) => {
  if (req.session.user)
    return res.status(200).render('tasks', {});

  return res.status(400).redirect('/');
});

export default router;
