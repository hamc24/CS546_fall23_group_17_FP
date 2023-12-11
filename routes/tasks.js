import { Router } from "express";
const router = Router();
import { userData, taskData } from "../data/index.js";
import validation from "../validation.js";
import * as users from "../data/users.js";

router.route("/create").get(async (req, res) => {
  if (req.session.user) return res.status(200).render("tasks/create", {});

  return res.status(400).redirect("/");
});

router.route("/create").post(async (req, res) => {
  if (!req.session.user) return res.status(200).render("/", {});

  let data = req.body;
  data = validation.sanitize(data);
  let errorlist = [];
  try {
    let taskName = data.nameInput;
    let description = data.descriptionInput;
    let creatorId = req.session.user._id.toString();
    let creator = req.session.user.userName;
    let publicPost = data.publicPostInput;
    let dateDue = data.dateDueInput;
    let timeDue = data.timeDueInput;
    let maxContributors = data.maxContributorInput;
    let durationH = data.durationInputH;
    let durationM = data.durationInputM;

    //* Validate Null
    validation.checkNull(taskName);
    validation.checkNull(description);
    validation.checkId(creatorId);
    validation.checkNull(creator);
    validation.checkNull(publicPost);
    validation.checkNull(dateDue);
    validation.checkNull(timeDue);
    validation.checkNull(maxContributors);
    validation.checkNull(durationH);
    validation.checkNull(durationM);

    //* Validate String
    taskName = validation.checkString(taskName);
    description = validation.checkString(description);
    creatorId = validation.checkId(creatorId);
    creator = validation.checkString(creator);
    publicPost = validation.checkString(publicPost);
    dateDue = validation.checkString(dateDue);
    timeDue = validation.checkString(timeDue);
    maxContributors = validation.checkString(maxContributors);
    durationH = validation.checkString(durationH);
    durationM = validation.checkString(durationM);

    if (taskName.length < 2 || taskName.length > 50)
      throw "Error: Task Name is too short or too long";
    if (description.length < 15 || description.length > 250)
      throw "Error: Description is too short or too long";
    creatorId = validation.checkId(creatorId, "Creator ID");
    creator = validation.checkString(creator, "Creator Name"); //? Forgot if we have to turn this into a string...
    dateDue = validation.checkString(dateDue, "Date Due");
    timeDue = validation.checkString(timeDue, "Time Due");

    //Date validation
    validation.validateDate(dateDue);
    validation.compareDate(dateDue);

    //Time validation
    validation.validateTime(timeDue);
    if (durationH > 24 || durationH < 0)
      throw "Error: Task Duration hour cannot be more than 24 hours long and less than 0";
    if (durationM > 60 || durationM < 0)
      throw "Error: Task Duration minutes cannot exceed 60 mins or be less than 0";

    maxContributors = Number(maxContributors);
    durationH = Number(durationH);
    durationM = Number(durationM);

    if (publicPost == "public") publicPost = true;
    else publicPost = false;

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
      maxContributors
    );
    return res.status(200).redirect("/tasks/all");
  } catch (error) {
    return res.status(400).render("tasks/create", { error: error });
  }
});

router.route("/tasks").get(async (req, res) => {
  if (req.session.user) return res.status(200).render("tasks/tasks", {});

  return res.status(400).redirect("/");
});

router.route("/all").get(async (req, res) => {
  if (req.session.user)
    return res.status(200).render("tasks/all", {
      taskList: await userData.getTasks(req.session.user._id),
    });

  return res.status(400).redirect("/");
});

router.route("/public").get(async (req, res) => {
  if (req.session.user)
    return res.status(200).render("tasks/public", {
      taskList: await userData.getPublicTasks(req.session.user._id),
    });

  return res.status(400).redirect("/");
});

router.route("/private").get(async (req, res) => {
  if (req.session.user)
    return res.status(200).render("tasks/private", {
      taskList: await userData.getPrivateTasks(req.session.user._id),
    });

  return res.status(400).redirect("/");
});

router.route("/forum").get(async (req, res) => {
  if (req.session.user)
    return res.status(200).render("tasks/forum", {
      taskList: await taskData.getAllTasks(),
    });

  return res.status(400).redirect("/");
});

router.route("/:id").get(async (req, res) => {
  if (req.session.user) {
    let task;
    try {
      task = await taskData.getTaskByID(req.params.id);
    } catch (error) {
      return res.status(404).render("error", { error: e });
    }

    if (task.publicPost == false) {
      //If private
      if (task.creatorId.localeCompare(req.session.user._id) == 0) {
        // Check if creatorId = sessionUserId
        return res.status(200).render("tasks/individual", {
          id: req.params.id,
          task: task,
        });
      } else {
        return res
          .status(403)
          .render("error", { error: "You don't have access to this task" });
      }
    } else {
      return res.status(200).render("tasks/individual", {
        id: req.params.id,
        task: task,
      });
    }
  }

  return res.status(400).redirect("/");
});

export default router;
