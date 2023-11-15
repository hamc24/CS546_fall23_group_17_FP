import validation from '../validation.js';
import { ObjectId } from 'mongodb';
import { tasks } from '../config/mongoCollections.js';

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
  durationM
) => {
  //Todo
};

const getTask = async (userId, taskId) => {};

// Update the status of a
const updateStatus = async (id) => {};

export default { create, getTask, updateStatus };
