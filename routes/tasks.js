import { Router } from "express";
const router = Router();
import { userData, taskData } from "../data/index.js";
import validation from "../validation.js";

router
  .route("/create")
  .get(async (req, res) => {
    if (req.session.user)
      return res.status(200).render("tasks/create", { title: "Create Task" });

    return res.status(400).redirect("/");
  })
  .post(async (req, res) => {
    if (!req.session.user)
      return res.status(200).render("/", { title: "Create Task" });

    let data = req.body;
    data = validation.sanitize(data);
    let errorlist = [];
    try {
      let taskName = data.nameInput;
      let description = data.descriptionInput;
      let creatorId = req.session.user._id.toString();
      let creator = `${req.session.user.firstName} ${req.session.user.lastName}`;
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
      return res
        .status(400)
        .render("tasks/create", { title: "Create Task", error: error });
    }
  });

router.route("/tasks").get(async (req, res) => {

  if (req.session.user)
    {
      let schedules = [];
      try       
      {
        schedules = await taskData.getSchedule();
      } catch (e)
      {
        console.log(e);
      }
      //[
        // {
        //   date: "May 30 2002",
        //   time: "14:30",
        //   task: "Clean tables"
        // },
        // {
        //   date: "May 30 2004",
        //   time: "5:30",
        //   task: "Rake leaves"
        // } 
      //]
      return res.status(200).render("tasks/tasks", { title: "Tasks", Schedule: "Schedule", schedules: schedules});
    }
    
    
  return res.status(400).redirect("/");
});

router.route("/all").get(async (req, res) => {
  if (!req.session.user) return res.status(400).redirect("/");

  return res.status(200).render("tasks/view", {
    title: "All Tasks",
    taskList: await userData.getTasks(req.session.user._id),
  });
});

router.route("/public").get(async (req, res) => {
  if (req.session.user)
    return res.status(200).render("tasks/view", {
      title: "Public Tasks",
      taskList: await userData.getPublicTasks(req.session.user._id),
    });

  return res.status(400).redirect("/");
});

router.route("/private").get(async (req, res) => {
  if (req.session.user)
    return res.status(200).render("tasks/view", {
      title: "Private Tasks",
      taskList: await userData.getPrivateTasks(req.session.user._id),
    });

  return res.status(400).redirect("/");
});

router.route("/forum").get(async (req, res) => {
  if (req.session.user)
    return res.status(200).render("tasks/view", {
      title: "Public Task Forum",
      taskList: await taskData.getNonBlackListedTasks(req.session.user._id),
    });

  return res.status(400).redirect("/");
});

router
  .route("/:id")
  .get(async (req, res) => {
    if (req.session.user) {
      let task;
      let contributors;
      try {
        task = await taskData.getTaskByID(req.params.id);
        contributors = await taskData.getContributorByName(req.params.id);
      } catch (error) {
        return res
          .status(404)
          .render("error", { title: "Error Page", error: e });
      }

      let statusStrings = ["In progress.", "Revision required.", "Resolved."];

      //If private
      if (task.publicPost == false) {
        // Check if creatorId = sessionUserId
        if (task.creatorId.localeCompare(req.session.user._id) == 0) {
          return res.status(200).render("tasks/individual", {
            title: task.taskName,
            id: req.params.id,
            task: task,
            contributors: contributors,
            accepted: true,
            creator: true,
            status: statusStrings[task.status],
          });
        } else {
          return res.status(403).render("error", {
            title: "Error Page",
            error: "You don't have access to this task",
          });
        }
        //If public
      } else {
        //Get current user
        let user = await userData.getUserByID(req.session.user._id.toString());
        // Check if user has accepted public post and show comment box if true
        if (user.tasks.includes(req.params.id)) {
          if (user._id.toString().localeCompare(task.creatorId) == 0) {
            return res.status(200).render("tasks/individual", {
              title: task.taskName,
              id: req.params.id,
              task: task,
              contributors: contributors,
              accepted: true,
              creator: true,
              status: statusStrings[task.status],
            });
          } else {
            return res.status(200).render("tasks/individual", {
              title: task.taskName,
              id: req.params.id,
              task: task,
              contributors: contributors,
              accepted: true,
              creator: false,
              status: statusStrings[task.status],
            });
          }
        } else {
          return res.status(200).render("tasks/individual", {
            title: task.taskName,
            id: req.params.id,
            task: task,
            contributors: contributors,
            accepted: false,
          });
        }
      }
    }

    return res.status(400).redirect("/");
  })
  .post(async (req, res) => {
    if (!req.session.user)
      return res.status(200).render("/", { title: "Create Task" });

    let data = req.body;
    data = validation.sanitize(data);

    // If Join button was pressed
    if (data.joinSubmission) {
      try {
        await userData.addTaskToUser(
          req.session.user._id.toString(),
          req.params.id
        );
      } catch (e) {
        return res.render("error", { title: "Error Page", error: e });
      }
      return res.status(200).redirect(`/tasks/${req.params.id}`);
    }

    // If delete button was pressed
    if (data.deleteSubmission) {
      try {
        await taskData.deleteTask(
          req.session.user._id.toString(),
          req.params.id
        );
      } catch (e) {
        return res.render("error", { title: "Error Page", error: e });
      }
      return res.status(200).redirect(`/tasks/tasks`);
    }

    if (data.leaveSubmission) {
      try {
        await userData.removeTaskFromUser(
          req.session.user._id.toString(),
          req.params.id
        );
      } catch (e) {
        return res.render("error", { title: "Error Page", error: e });
      }
      return res.status(200).redirect(`/tasks/${req.params.id}`);
    }

    //If comment was inserted
    if (data.commentInput) {
      let comment;
      try {
        comment = data.commentInput;
        validation.checkNull(comment);
        comment = validation.checkString(comment, "Comment");
      } catch (error) {
        return res.redirect(`/tasks/${req.params.id}`);
      }
      try {
        await taskData.addComment(
          req.session.user._id.toString(),
          req.params.id,
          comment
        );
      } catch (e) {
        return res.render("error", { title: "Error Page", error: e });
      }
      return res.status(200).redirect(`/tasks/${req.params.id}`);
    }

    // If a request was sent to flag a comment.
    if (data.flag) {
      let commentID = data.commentID;
      validation.checkNull(commentID);
      try {
        await taskData.updateComment(req.params.id, commentID, true, false);
      } catch (e) {
        return res.render("error", { title: "Error Page", error: e });
      }
      return res.status(200).redirect(`/tasks/${req.params.id}`);
    }

    // If a request was sent to resolve a comment.
    if (data.resolve) {
      let commentID = data.commentID;
      validation.checkNull(commentID);
      try {
        await taskData.updateComment(req.params.id, commentID, false, true);
      } catch (e) {
        return res.render("error", { title: "Error Page", error: e });
      }
      return res.status(200).redirect(`/tasks/${req.params.id}`);
    }

    // If a request was sent to resolve a comment.
    if (data.progressOption) {
      validation.checkString(data.progressOption);
      try {
        await taskData.updateStatus(req.params.id, data.progressOption);
      } catch (e) {
        return res.render("error", { title: "Error Page", error: e });
      }
      return res.status(200).redirect(`/tasks/${req.params.id}`);
    }
  });

export default router;
