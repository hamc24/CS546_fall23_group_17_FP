import { Router } from 'express';
const router = Router();
import { userData } from '../data/index.js';
import validation from '../validation.js';

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    return res.status(200).render('login');
  })
  .post(async (req, res) => {
    //code here for POST
    try {
      let email = req.body.emailAddressInput;
      let password = req.body.passwordInput;

      let status = (await userData.loginUser(email, password));

      if (status == "Database error.")
        return res.status(500).json({error: 'Internal server error'});
      else {
        res.cookie('AuthState', 'Logged in!');
        req.session.user = status;
        return res.status(200).redirect('users');
        }
    }
    catch (error) {
      return res.status(400).render('login', {error: error});
    }
  });

export default router;
