import { Router } from 'express';
const router = Router();
import { userData } from '../data/index.js';
import validation from '../validation.js';
import * as users from '../data/users.js';

router.route('/create').get(async (req, res) => {
  if (req.session.user)
    return res.status(200).render('tasks/create', {});

  return res.status(400).redirect('/');
});

router.route('/tasks').get(async (req, res) => {
  if (req.session.user)
    return res.status(200).render('tasks/tasks', {});

  return res.status(400).redirect('/');
});

router.route('/all').get(async (req, res) => {
  if (req.session.user)
    return res.status(200).render('tasks/all', {});

  return res.status(400).redirect('/');
});

router.route('/public').get(async (req, res) => {
  if (req.session.user)
    return res.status(200).render('tasks/public', {});

  return res.status(400).redirect('/');
});

router.route('/private').get(async (req, res) => {
  if (req.session.user)
    return res.status(200).render('tasks/private', {});

  return res.status(400).redirect('/');
});

router.route('/forum').get(async (req, res) => {
  if (req.session.user)
    return res.status(200).render('tasks/forum', {});

  return res.status(400).redirect('/');
});

router.route('/:id').get(async (req, res) => {
  if (req.session.user)
    return res.status(200).render('tasks/individual', {id: req.params.id});

  return res.status(400).redirect('/');
});

export default router;
