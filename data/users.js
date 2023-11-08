import validation from '../validation.js';
import { ObjectId } from 'mongodb';
import { users } from '../config/mongoCollections.js';

// Function for creating a user in the user data base
const create = async (firstName, lastName, email, userName, dateOfBirth) => {
  //Todo
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
