import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  if (!req.session.user) return res.status(400).redirect("/");
  const anHourAgo = new Date();
  anHourAgo.setHours(anHourAgo.getHours() - 1);
  res.cookie("AuthState", "", { expires: anHourAgo }).clearCookie("AuthState");
  return res.status(200).render("logout", { title: "Logout Page" });
});

export default router;
