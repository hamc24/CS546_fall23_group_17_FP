import validation from "../validation.js";
import { ObjectId } from "mongodb";
import { tasks, users } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";

// Function for creating a user in the user data base
const create = async (
  firstName,
  lastName,
  email,
  userName,
  dateOfBirth,
  passWord
) => {
  //Validation Handling
  //* Validate Null
  validation.checkNull(firstName);
  validation.checkNull(lastName);
  validation.checkNull(email);
  validation.checkNull(userName);
  validation.checkNull(dateOfBirth);
  validation.checkNull(passWord);

  // * Validate String params
  firstName = validation.checkString(firstName, "First Name");
  lastName = validation.checkString(lastName, "Last Name");
  email = validation.checkString(email, "Email");
  userName = validation.checkString(userName, "User Name");
  dateOfBirth = validation.checkString(dateOfBirth, "Date of Birth");
  passWord = validation.checkString(passWord, "Password");

  //* Name length check
  if (firstName.length < 2 || firstName.length > 25)
    throw "Error: First name is too short or too long";
  if (lastName.length < 2 || lastName.length > 25)
    throw "Error: Last name is too short or too long";

  // * Validate Email
  validation.validateEmail(email);

  // * Birthday Validation
  validation.validateDate(dateOfBirth);
  validation.validateBirthday(dateOfBirth);

  // * Password validation and hashing
  validation.validatePassword(passWord);

  const saltRounds = 16;
  const hash = await bcrypt.hash(passWord, saltRounds);

  //Create user object to put into collection
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    userName: userName,
    dateOfBirth: dateOfBirth,
    hashedPass: hash,
    tasks: [],
  };

  const userCollection = await users();

  let user = await userCollection.findOne({ email: email });
  if (user !== null) throw "User with email " + email + " already exists.";

  const newInsertInformation = await userCollection.insertOne(newUser);
  if (!newInsertInformation.insertedId) throw "Insert failed";
  return await getUserByID(newInsertInformation.insertedId.toString());
};

const getUserByID = async (id) => {
  id = validation.checkId(id);
  const userCollection = await users();
  const user = await userCollection.findOne({
    _id: new ObjectId(id),
  });
  if (!user) throw "Error: User not found";
  return user;
};

// Function for deleting user in database given the id
const remove = async (id) => {
  id = validation.checkId(id);
  const userCollection = await users();
  const userDeletionInfo = await userCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });

  if (!userDeletionInfo) {
    throw `Could not delete user with id of ${id}`;
  }

  const taskCollection = await tasks();
  // Remove user id from the contributors array and unauthorized
  // If the user was in there.
  const updatedTaskInfo = await taskCollection.updateMany(
    { _id: new ObjectId(id) },
    {
      $pull: {
        contributors: { $in: [new ObjectId(id)] },
        unauthorized: new ObjectId(id),
      },
    }
  );
  await taskCollection.updateOne(
    { _id: id },
    { $inc: { numContributors: -1 } }
  );

  return `User: ${id} has been deleted`;
};

// Function for updating a user with new descriptions
//! IN THE CLIENTSIDE FORM YOU MUST MAKE IT SO THAT THE FORM LOADS IN WITH THE EXISTING USER DATA
const updateUser = async (id, firstName, lastName, userName) => {
  //* Null Validation
  validation.checkNull(id);
  validation.checkNull(firstName);
  validation.checkNull(lastName);
  validation.checkNull(userName);

  //* id check
  id = validation.checkId(id);

  //* String input check
  firstName = validation.checkString(firstName);
  lastName = validation.checkString(lastName);
  userName = validation.checkString(userName);

  //* Name length check
  if (firstName.length < 2 || firstName.length > 25)
    throw "Error: First name is too short or too long";
  if (lastName.length < 2 || firstName.length > 25)
    throw "Error: Last name is too short or too long";

  const userCollection = await users();
  let user = await userCollection.findOne({ _id: new ObjectId(id) });
  if (!user) throw "Error: User not found!";

  let updateUser = userCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { firstName: firstName, lastName: lastName, userName: userName } }
  );

  if (!updateUser) throw "Error: User could not be updated";
  return await getUserByID(id);
};

// Function for adding tasks to user
const addTaskToUser = async (userId, taskId) => {
  userId = validation.checkId(userId);
  taskId = validation.checkId(taskId);

  const userCollection = await users();
  const taskCollection = await tasks();

  // First check if user is already in the contributor or unauthorized list in taskCollection
  let task = await taskCollection.findOne({ _id: new ObjectId(taskId) });
  if (!task) throw `Error: Couldn't find task`;
  if (task.contributors.includes(userId))
    throw "Error: User is already a Contributor";
  // IF user in blackList
  if (task.unauthorized.includes(userId))
    throw "Error: User is blacklisted from this task";

  // Check if it is a private task, if so check if creatorId is the userId
  if (!task.publicPost) {
    if (task.creatorId != userId)
      throw "You are not authorized to access this task";
  }

  // Then check if the task is full
  if (task.maxContributors == task.numContributors)
    throw "Error: This task is already filled up";

  // Add user id to task.contributors
  let updatedContNum = task.numContributors + 1;
  task.contributors.push(userId);
  let updateInfo = await taskCollection.updateOne(
    {
      _id: new ObjectId(taskId),
    },
    {
      $set: {
        numContributors: updatedContNum,
        contributors: task.contributors,
      },
    }
  );
  if (!updateInfo) throw "Error: Insert failed";

  //After user is added to task, the task id is put into user's tasks Array
  let pushed = await userCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $push: { tasks: taskId } }
  );
  if (!pushed) throw "Error: Couldn't update user tasklist";
};

const removeTaskFromUser = async (userId, taskId) => {
  //Check Null
  validation.checkNull(userId);
  validation.checkNull(taskId);

  //Check Id
  userId = validation.checkId(userId);
  taskId = validation.checkId(taskId);

  //Get collections
  const userCollection = await users();
  const taskCollection = await tasks();

  // From the user collection, delete the task from tasks list
  let updatedUser = await userCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $pull: { tasks: taskId } }
  );
  if (!updatedUser) throw "Error: User update failed";

  // From the task collection, delete userId from contributors and decrement contributor count
  let updatedTask = await taskCollection.updateOne(
    { _id: new ObjectId(taskId) },
    { $pull: { contributors: userId }, $inc: { numContributors: -1 } }
  );
  if (!updatedTask) throw "Error: Task update failed";
};

// Function for getting all tasks for a user
const getTasks = async (userId) => {
  validation.checkNull(userId);
  userId = validation.checkId(userId);

  //Find user then get the tasks that they have
  let user = await getUserByID(userId);
  let userTasks = user.tasks.map(function (id) {
    return new ObjectId(id);
  });
  const taskCollection = await tasks();
  let foundTasks = await taskCollection
    .find({ _id: { $in: userTasks } })
    .toArray();
  return foundTasks;
};

// Function for getting all public tasks for a user
const getPublicTasks = async (userId) => {
  validation.checkNull(userId);
  userId = validation.checkId(userId);

  //Find user then get the tasks that they have
  let user = await getUserByID(userId);
  let userTasks = user.tasks.map(function (id) {
    return new ObjectId(id);
  });
  const taskCollection = await tasks();
  let foundTasks = await taskCollection
    .find({ _id: { $in: userTasks }, publicPost: true })
    .toArray();
  return foundTasks;
};

// Function for getting all private tasks for a user
const getPrivateTasks = async (userId) => {
  validation.checkNull(userId);
  userId = validation.checkId(userId);

  //Find user then get the tasks that they have
  let user = await getUserByID(userId);
  let userTasks = user.tasks.map(function (id) {
    return new ObjectId(id);
  });

  const taskCollection = await tasks();
  let foundTasks = await taskCollection
    .find({ _id: { $in: userTasks }, publicPost: false })
    .toArray();
  return foundTasks;
};

// Function to return user login information.
const loginUser = async (email, password) => {
  let userCollection;
  try {
    userCollection = await users();
  } catch (error) {
    return "Database error.";
  }

  validation.validateEmail(email);
  validation.validatePassword(password);

  let user = await userCollection.findOne({ email: email });
  if (user == null) throw "Incorrect User Name or Password";

  let authenticated = await bcrypt.compare(password, user.hashedPass);
  if (!authenticated) throw "Incorrect User Name or Password";

  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userName: user.userName,
    dateOfBirth: user.dateOfBirth,
  };
};

export default {
  create,
  getUserByID,
  remove,
  updateUser,
  addTaskToUser,
  removeTaskFromUser,
  getTasks,
  getPublicTasks,
  getPrivateTasks,
  loginUser,
};
