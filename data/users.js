import validation from "../validation.js";
import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
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

  // Validate String params
  firstName = validation.checkString(firstName, "First Name");
  lastName = validation.checkString(lastName, "Last Name");
  userName = validation.checkString(userName, "User Name");
  dateOfBirth = validation.checkString(dateOfBirth, "Date of Birth");

  // Validate Email
  validation.validateEmail(email);

  //Birthday Validation
  validation.validateDate(dateOfBirth);
  validation.validateBirthday(dateOfBirth);

  //Password validation and hashing
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

  let user = await userCollection.findOne({email: email});
  if (user !== null)
    throw "User with email " + email + " already exists.";

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
  //Todo
};

// Function for updating a user with new descriptions
const updateUser = async (
  id,
  firstName,
  lastName,
  email,
  userName,
  dateOfBirth
) => {
  //Todo
};

// Function for adding tasks to user
const addTask = async (userName, taskId) => {
  //Todo
};

// Function for getting all tasks for a user
const getTasks = async (userId) => {};

// Function to return user login information.
const loginUser = async (email, password) => {
  let userCollection;
  try {
    userCollection = await users();
  }
  catch (error) {
    return "Database error.";
  }

  validation.validateEmail(email);
  validation.validatePassword(password);

  let user = await userCollection.findOne({email: email});
  if (user == null)
    throw "User with email " + email + " doesn't exist.";

  let authenticated = await bcrypt.compare(password, user.hashedPass);
  if (!authenticated)
    throw "Password is invalid.";

  return {firstName: user.firstName, lastName: user.lastName, email: user.email, userName: user.userName, dateOfBirth: user.dateOfBirth};
};

export default { create, remove, updateUser, addTask, getTasks, loginUser };
