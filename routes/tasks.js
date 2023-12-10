import { Router } from 'express';
const router = Router();
import { userData } from '../data/index.js';
import { taskData } from '../data/index.js';
import validation from '../validation.js';
import * as users from '../data/users.js';

router.route('/create').get(async (req, res) => {
  if (req.session.user)
    return res.status(200).render('tasks/create', {});

  return res.status(400).redirect('/');
});

router.route('/create').post(async (req, res) => {
  if (!req.session.user)
    return res.status(200).render('/', {});

    let data = req.body;
    data = validation.sanitize(data)
    let errorlist = [];
    try{
      let taskName = data.nameInput;
      let description = data.descriptionInput;
      let creatorId = req.session.user._id;
      let creator = req.session.user.userName;
      let publicPost = data.publicPostInput;
      let dateDue = data.dateDueInput;
      let timeDue = data.timeDueInput;
      let maxContributors = data.maxContributorInput;
      let durationH = data.durationInputH;
      let durationM = data.durationInputM;
      taskName = validation.checkString(taskName);
      description = validation.checkString(description);
      creatorId = validation.checkId(creatorId)
      creator = validation.checkString(creator);
      publicPost = validation.checkString(publicPost);
      dateDue = validation.checkString(dateDue);
      timeDue = validation.checkString(timeDue);
      maxContributors = validation.checkString(maxContributors);
      durationH = validation.checkString(durationH);
      durationM = validation.checkString(durationM);

      maxContributors = Number(maxContributors);
      durationH = Number(durationH);
      durationM = Number(durationM);

      if (publicPost == "public")
        publicPost = true;
      else
        publicPost = false;

      const create = await taskData.create(
        taskName,
        description,
        creatorId,
        creator,
        publicPost,
        dateDue,
        timeDue,
        durationH,
        durationM,
        maxContributors);
        return res.status(200).redirect('/tasks/all');
    }
    catch(error) {
      return res.status(400).render('tasks/create', {error: error});
    }
});

router.route('/tasks').get(async (req, res) => {
  if (req.session.user)
    return res.status(200).render('tasks/tasks', {});

  return res.status(400).redirect('/');
});

router.route('/all').get(async (req, res) => {
  if (req.session.user)
    return res.status(200).render('tasks/all', {taskList: await taskData.getAllTasks()});

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
    return res.status(200).render('tasks/individual', {
      id: req.params.id,
      elements: await taskData.getTaskByID(req.params.id)
    });

  return res.status(400).redirect('/');
});

export default router;
