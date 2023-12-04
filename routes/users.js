import { Router } from 'express';
const router = Router();
import validation from '../validation.js';
import {userData} from '../data/index.js';
import middleware from '../middleware.js'

router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
    return res.status(200).render('register');
  })
  .post(async (req, res) => {
    //code here for POST
    try {
      let firstName = req.body.firstNameInput;
      let lastName = req.body.lastNameInput;
      let email = req.body.emailAddressInput;
      let password = req.body.passwordInput;
      let confirmPassword = req.body.confirmPasswordInput;
      let role = req.body.roleInput;

      if (password !== confirmPassword)
        throw "Passwords do not match.";

      let status = (await userData.create(firstName, lastName, email, password, role));

      if (status.insertedUser)
        return res.status(200).redirect('/login');
      else
        return res.status(500).json({error: 'Internal server error'});
    }
    catch (error) {
      return res.status(400).render('register', {error: error});
    }
  });

router
  .route('/login')
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
        if (status.role == 'admin')
          return res.status(200).redirect('/users/admin');
        else
          return res.status(200).redirect('/users/protected');
        }
    }
    catch (error) {
      return res.status(400).render('login', {error: error});
    }
  });

router.route('/error').get(async (req, res) => {
  //code here for GET
  return res.status(200).render('error');
});

router.route('/logout').get(middleware.privateProtect,async (req, res) => {
  //code here for GET
  const anHourAgo = new Date();
  anHourAgo.setHours(anHourAgo.getHours() - 1);
  res.cookie('AuthState', '', {expires: anHourAgo});
  res.clearCookie('AuthState'); //Just the lecture code, it is convenient.

  return res.status(200).render('logout');
});


router.route('protected').get(middleware.privateProtect, async (req,res) => {
  return res.render('protected',{title:"protected"})
})
export default router;
