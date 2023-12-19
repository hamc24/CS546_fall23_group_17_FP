import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  //Todo
  if (req.session.user){
    return res.status(200).render("users", {
      title: `Home Page`,
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName,
      userName: req.session.user.userName,
      email: req.session.user.email,
      dateOfBirth: req.session.user.dateOfBirth,
    });
    }else{
      return res.status(400).redirect("/");
    }
  
});

export default router;
