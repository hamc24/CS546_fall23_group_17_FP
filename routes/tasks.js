import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";
import { taskData } from "../data/index.js";
import validation from "../validation.js";

router
  .route("/")
  .get(async (req, res) => {
    //get all the public tasks in the database
    try {
      const taskList = await taskData.getAllTasks();
      return res.render("tasks", {
        tasks: taskList,
        title: "Public Task Forum",
      });
    } catch (e) {
      return res.status(500).render("error", { error: e });
    }
  })
  .post(async (req, res) => {
    //Code here for POST
    //
  });

router
  .route("/:id")
  .get(async (req, res) => {
    //Todo
  })
  .post(async (req, res) => {
    //Todo
  });

export default router;
