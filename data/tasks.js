import validation from "../validation.js";
import { ObjectId } from "mongodb";
import { tasks } from "../config/mongoCollections.js";

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
    maxContributors,
    contributors: [],
    unauthorized: [],
    numContributors: 0,
    duration: {
      durationH: durationH,
      durationM: durationM,
    },
    status: 0,
    submitted: false,
  };

  const taskCollection = await tasks();
  const newInsertInformation = await taskCollection.insertOne(newTask);
  if (!newInsertInformation.insertedId) throw "Insert failed";
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
  const taskList = await taskCollection
    .find({})
    .project({ taskName: 1 })
    .toArray();
  if (!taskList) throw "Error: Could not get all tasks";
  return taskList;
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

export default { create, getAllTasks, updateStatus };
