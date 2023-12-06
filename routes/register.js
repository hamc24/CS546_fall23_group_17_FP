import { Router } from 'express';
const router = Router();
import { userData } from '../data/index.js';
import validation from '../validation.js';

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
      let userName = req.body.userNameInput;
      let dateOfBirth = req.body.dateOfBirthInput;
      let password = req.body.passwordInput;
      let confirmPassword = req.body.confirmPasswordInput;

      if (password !== confirmPassword)
        throw "Passwords do not match.";

      let status = (await userData.create(firstName, lastName, email, userName, dateOfBirth, password));

      if (status)
        return res.status(200).redirect('/login');
      else
        return res.status(500).json({error: 'Internal server error'});
    }
    catch (error) {
      return res.status(400).render('register', {error: error});
    }
  });

export default router;
