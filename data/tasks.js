import validation from "../validation.js";
import { ObjectId } from "mongodb";
import { tasks, users } from "../config/mongoCollections.js";
import { userData } from "./index.js";

// Create a new task
const create = async (
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
) => {
  //Validate Null
  validation.checkNull(taskName);
  validation.checkNull(description);
  validation.checkNull(creatorId);
  validation.checkNull(creator);
  validation.checkNull(publicPost);
  validation.checkNull(dateDue);
  validation.checkNull(timeDue);
  validation.checkNull(durationH);
  validation.checkNull(durationM);
  validation.checkNull(maxContributors);

  //Input validation for types
  taskName = validation.checkString(taskName, "Task Name");
  description = validation.checkString(description, "Description");
  if (taskName.length < 2 || taskName.length > 50)
    throw "Error: Task Name is too short or too long";
  if (description.length < 15 || description.length > 250)
    throw "Error: Description is too short or too long";

  creatorId = validation.checkId(creatorId, "Creator ID");
  creator = validation.checkString(creator, "Creator Name"); //? Forgot if we have to turn this into a string...
  if (typeof publicPost != "boolean")
    throw "Error: publicPost input is not a boolean";
  dateDue = validation.checkString(dateDue, "Date Due");
  timeDue = validation.checkString(timeDue, "Time Due");
  if (typeof durationH != "number" || typeof durationM != "number")
    throw "Error: Duration is not a number";

  if (typeof maxContributors != "number")
    throw "Error: MaxContributors is not a number";
  //Date validation
  validation.validateDate(dateDue);
  validation.compareDate(dateDue);

  //Time validation
  validation.validateTime(timeDue);
  if (durationH > 24 || durationH < 0)
    throw "Error: Task Duration hour cannot be more than 24 hours long and less than 0";
  if (durationM > 60 || durationM < 0)
    throw "Error: Task Duration minutes cannot exceed 60 mins or be less than 0";

  //Create user obj to put into collection
  let newTask = {
    taskName: taskName,
    description: description,
    creatorId: creatorId,
    creator: creator,
    publicPost: publicPost,
    dateDue: dateDue,
    timeDue: timeDue,
    maxContributors: maxContributors,
    contributors: [creatorId],
    unauthorized: [],
    numContributors: 1,
    duration: {
      durationH: durationH,
      durationM: durationM,
    },
    status: 0,
    submitted: false,
    comments: [],
  };

  //* Add the task to the task collection
  const taskCollection = await tasks();
  const newInsertInformation = await taskCollection.insertOne(newTask);
  if (!newInsertInformation.insertedId) throw "Insert failed";

  //* Update user taskList
  const userCollection = await users();
  const updateUser = await userCollection.updateOne(
    { _id: new ObjectId(creatorId) },
    { $push: { tasks: newInsertInformation.insertedId.toString() } }
  );
  return await getTaskByID(newInsertInformation.insertedId.toString());
};

const getTaskByID = async (id) => {
  id = validation.checkId(id);
  const taskCollection = await tasks();
  const task = await taskCollection.findOne({
    _id: new ObjectId(id),
  });
  if (!task) throw "Error: Task not found";
  return task;
};

//TODO: We will probably need this later for displaying all the tasks on the public task board
// ! Note: we can get all tasks then sorting will be done through client side javascript
const getAllTasks = async () => {
  const taskCollection = await tasks();
  const taskList = await taskCollection.find({ publicPost: true }).toArray();
  if (!taskList) throw "Error: Could not get all tasks";
  return taskList;
};

const getNonBlackListedTasks = async (userId) => {
  let user = await userData.getUserByID(userId);
  const taskCollection = await tasks();

  const taskList = await taskCollection
    .find({
      publicPost: true,
      unauthorized: { $not: { $elemMatch: { $eq: userId } } },
    })
    .toArray();
  if (!taskList) throw "Error: Could not get all tasks";
  return taskList;
};

const deleteTask = async (userId, taskId) => {
  //Todo
  //* Start Validation
  validation.checkNull(userId);
  validation.checkNull(taskId);
  userId = validation.checkId(userId);
  taskId = validation.checkId(taskId);

  //* Get collections
  const taskCollection = await tasks();
  const userCollection = await users();

  //* Check and see if userId = creatorId
  let task = await getTaskByID(taskId);
  if (userId.localeCompare(task.creatorId) != 0)
    throw "Error: User is not the creator of the task!";

  //* Delete the task from taskCollection
  let deletedTask = await taskCollection.findOneAndDelete({
    _id: new ObjectId(taskId),
  });
  if (!deletedTask) throw "Error: Task couldn't be deleted";

  //* Go through all users and delete taskId from task list if they have it
  await userCollection.updateMany({}, { $pull: { tasks: taskId } });
  return { task: taskId, deleted: true };
};
// Update the status of a
const updateStatus = async (id, statusString) => {
  //* Status has the type number, so will have to convert status string to number
  let statusNum = 0;
  //*validation
  id = validation.checkId(id);
  statusString = validation.checkString(statusString);
  if (statusString.localeCompare("in progress") == 0) {
    statusNum = 0;
  } else if (statusString.localeCompare("revision required") == 0) {
    statusNum = 1;
  } else if (statusString.localeCompare("resolved") == 0) {
    statusNum = 2;
  } else {
    throw "Error: Invalid Status String";
  }

  const taskCollection = await tasks();
  const updateInfo = await taskCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { status: statusNum } },
    { returnDocument: "after" }
  );

  if (!updateInfo)
    throw `Error: Update failed, could not find a user with id of ${id}`;
  return updateInfo;
};

const addComment = async (userId, taskId, message) => {
  validation.checkNull(userId);
  validation.checkNull(taskId);
  validation.checkNull(message);

  validation.checkString(userId);
  validation.checkString(taskId);
  validation.checkString(message);

  userId = validation.checkId(userId);
  taskId = validation.checkId(taskId);

  let user = await userData.getUserByID(userId);
  let fullName = `${user.firstName} ${user.lastName}`;

  let currentdate = new Date();
  let datetime = `${currentdate.getDate()}/${
    currentdate.getMonth() + 1
  }/${currentdate.getFullYear()} (${currentdate.getHours()}:${currentdate.getMinutes()})`;

  let fullMSG = `${fullName} ${datetime}: ${message}`;

  const taskCollection = await tasks();
  let updatedTask = await taskCollection.updateOne(
    { _id: new ObjectId(taskId) },
    {
      $push: {
        comments: {
          _id: Math.random().toString().slice(2),
          msg: fullMSG,
          flagged: false,
          resolved: false,
        },
      },
    }
  );
};

const updateComment = async (taskId, commentId, flagged, resolved) => {
  validation.checkNull(taskId);
  validation.checkNull(commentId);
  validation.checkNull(flagged);
  validation.checkNull(resolved);

  validation.checkString(taskId);
  validation.checkString(commentId);

  taskId = validation.checkId(taskId);

  const taskCollection = await tasks();
  let updatedTask = await taskCollection.updateOne(
    {
      _id: new ObjectId(taskId),
      "comments._id": commentId,
    },
    {
      $set: {
        "comments.$.flagged": flagged,
        "comments.$.resolved": resolved,
      },
    }
  );
};

//Returns a list of Contributor Names in a given task
const getContributorByName = async (taskId) => {
  const task = await getTaskByID(taskId);
  const userCollection = await users();

  //* get the list of contributors (In id form)
  let contributors = task.contributors;
  let contributorsToId = contributors.map((x) => new ObjectId(x));

  //* Search for ids in userCollection and return the found user's name
  let userList = await userCollection
    .find({ _id: { $in: contributorsToId } })
    .project({ _id: 0, firstName: 1, lastName: 1 })
    .toArray();

  if (!userList) throw "Error: Users could not be found";
  return userList;
};

const blackListUser = async (userId, taskId) => {
  validation.checkNull(userId);
  validation.checkNull(taskId);

  validation.checkString(userId);
  validation.checkString(taskId);

  userId = validation.checkId(userId);
  taskId = validation.checkId(taskId);

  let user = await userData.getUserByID(userId);

  const taskCollection = await tasks();
  let updatedTask = await taskCollection.updateOne(
    { _id: new ObjectId(taskId) },
    {
      $push: {
        unauthorized: userId,
      },
    }
  );
  // If user is in the task remove from contributors list and decrement
  // numContributors by 1
  let userTasks = await userData.getTasks(userId);
  let userTasksId = userTasks.map((x) => x._id.toString());
  if (userTasksId.includes(taskId)) {
    await userData.removeTaskFromUser(userId, taskId);
  }
};

const whiteListUser = async (userId, taskId) => {
  validation.checkNull(userId);
  validation.checkNull(taskId);

  validation.checkString(userId);
  validation.checkString(taskId);

  userId = validation.checkId(userId);
  taskId = validation.checkId(taskId);

  let user = await userData.getUserByID(userId);

  const taskCollection = await tasks();
  let updatedTask = await taskCollection.updateOne(
    { _id: new ObjectId(taskId) },
    {
      $pull: {
        unauthorized: {
          _id: userId,
        },
      },
    }
  );
};

const getSchedule = async () =>
{
  const taskCollection = await tasks();
  const taskList = await taskCollection.find({}).toArray();
  console.log(taskList);
  if (taskList.length)
  {
    const ObjectList = taskList.map(task => {
      return {
        date: task.dateDue,
        time: task.timeDue,
        task: task.taskName
      }
    });
    return ObjectList.sort((a, b) => {
      const d1 = new Date (a.date + " " + a.time);
      const d2 = new Date (b.date + " " + b.time);
      return d1.getTime() - d2.getTime();
    });
  }
  else
  {
    throw new Error("Add a task!");
  }
}

export default {
  create,
  getTaskByID,
  deleteTask,
  getAllTasks,
  getNonBlackListedTasks,
  updateStatus,
  addComment,
  updateComment,
  getContributorByName,
  blackListUser,
  whiteListUser,
  getSchedule
};
