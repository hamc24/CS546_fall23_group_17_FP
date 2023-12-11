import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";
import validation from "../validation.js";

router
  .route("/")
  .get(async (req, res) => {
    //code here for GET
    return res.status(200).render("register", { title: "Registration Page" });
  })
  .post(async (req, res) => {
    //code here for POST
    let data = req.body;
    data = validation.sanitize(data);
    try {
      let firstName = data.firstNameInput;
      let lastName = data.lastNameInput;
      let email = data.emailAddressInput;
      let userName = data.userNameInput;
      let dateOfBirth = data.dateOfBirthInput;
      let password = data.passwordInput;
      let confirmPassword = data.confirmPasswordInput;

      // Error Checking
      //* Null validations
      validation.checkNull(firstName);
      validation.checkNull(lastName);
      validation.checkNull(email);
      validation.checkNull(userName);
      validation.checkNull(dateOfBirth);
      validation.checkNull(password);
      validation.checkNull(confirmPassword);

      // *Validate String params
      firstName = validation.checkString(firstName, "First Name");
      lastName = validation.checkString(lastName, "Last Name");
      email = validation.checkString(email, "Email");
      userName = validation.checkString(userName, "User Name");
      dateOfBirth = validation.checkString(dateOfBirth, "Date of Birth");
      password = validation.checkString(password, "Password");
      confirmPassword = validation.checkString(
        confirmPassword,
        "Password Confirmation"
      );

      //* Name length check
      if (firstName.length < 2 || firstName.length > 25)
        throw "Error: First name is too short or too long";
      if (lastName.length < 2 || firstName.length > 25)
        throw "Error: Last name is too short or too long";

      // Validate Email
      validation.validateEmail(email);

      //Birthday Validation
      validation.validateDate(dateOfBirth);
      validation.validateBirthday(dateOfBirth);

      //Password validation and hashing
      validation.validatePassword(password);
      validation.validatePassword(confirmPassword);

      if (password !== confirmPassword) throw "Passwords do not match.";

      let status = await userData.create(
        firstName,
        lastName,
        email,
        userName,
        dateOfBirth,
        password
      );

      if (status) return res.status(200).redirect("/login");
      else return res.status(500).json({ error: "Internal server error" });
    } catch (error) {
      return res
        .status(400)
        .render("register", { title: "Registation Page", error: error });
    }
  });

export default router;
