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
    maxContributors,
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

const deleteTask = async (id) => {
  //Todo
  //* Start Validation
  validation.checkNull(id);
  id = validation.checkId(id);

  //* Get collections
  const taskCollection = await tasks();
  const userCollection = await users();

  //* Delete the task from taskCollection
  let deletedTask = await taskCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });
  if (!deletedTask) throw "Error: Task couldn't be deleted";

  //* Go through all users and delete taskId from task list if they have it
  await userCollection.updateMany({}, { $pull: { tasks: id } });
  return { task: id, deleted: true };
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
    { $push: { comments: fullMSG } }
  );
};

export default {
  create,
  getTaskByID,
  deleteTask,
  getAllTasks,
  updateStatus,
  addComment,
};
