import validation from '../validation.js';
import { ObjectId } from 'mongodb';
import { users } from '../config/mongoCollections.js';
import bcrypt from "bcrypt"

// Function for creating a user in the user data base
const create = async (firstName, lastName, email, userName, dateOfBirth, passWord) => {
  //Validation Handling
  //* Validate Null
  validation.checkNull(firstName);
  validation.checkNull(lastName);
  validation.checkNull(email);
  validation.checkNull(userName);
  validation.checkNull(dateOfBirth);

  // Validate String params
  firstName = validation.checkString(firstName, "First Name")
  lastName = validation.checkString(lastName, "Last Name");
  userName = validation.checkString(userName, "User Name")
  dateOfBirth = validation.checkString(dateOfBirth, "Date of Birth")

  // Validate Email
  validation.validateEmail(email)

  //Birthday Validation
  validation.validateDate(dateOfBirth);
  validation.validateBirthday(dateOfBirth);

  //Create user object to put into collection
  let newUser = {
    firstName: firstName,
    lastName:lastName,
    email:email,
    userName: userName,
    dateOfBirth: dateOfBirth,
    hashedPass : "Dummy",   // TODO: Will need to complete this later using the bcrypt module
    tasks: []
  }

  const userCollection = await users();
  const newInsertInformation = await userCollection.insertOne(newUser);
  if(!newInsertInformation) throw "Insert failed"




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

export default { create, remove, updateUser };
