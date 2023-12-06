import { Router } from 'express';
const router = Router();
import { userData } from '../data/index.js';
import validation from '../validation.js';
import * as users from '../data/users.js';

router
  .route('/')
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

      let status = (await users.registerUser(firstName, lastName, email, password, role));

      if (status.insertedUser)
        return res.status(200).redirect('/login');
      else
        return res.status(500).json({error: 'Internal server error'});
    }
    catch (error) {
      return res.status(400).render('register', {error: error});
    }
  });

export default router;
