import { userData } from "../data/index.js";
import { taskData } from "../data/index.js";
// import validation from "../validation.js"
import { dbConnection, closeConnection } from "../config/mongoConnection.js";

const db = await dbConnection();
await db.dropDatabase();

console.log("Starting the seed");
try {
  let chang = await userData.create(
    "Chang-Woo",
    "Ham",
    "cham@stevens.edu",
    "hamc24",
    "03/22/2002",
    "SomePassword123!"
  );
  let patrick = await userData.create(
    "Patrick",
    "Hill",
    "phill@stevens.edu",
    "graffixnyc",
    "05/11/1977",
    "Cs546Prof?*"
  );
  let changTask1 = await taskData.create(
    "CS546 Final Project",
    "Our final Project for CS546C, Our project name is 'Ducks in a Row' and it is a app solely made for task management",
    chang._id.toString(),
    ` ${chang.firstName} ${chang.lastName}`,
    false,
    "12/17/2023",
    "11:59 PM",
    3,
    30,
    10
  );

  let patrickTask1 = await taskData.create(
    "CS546 Office Hours",
    "Weekly Office Hours that are hosted at 4pm. Come if you have any questions, or not",
    patrick._id.toString(),
    ` ${patrick.firstName} ${patrick.lastName}`,
    true,
    "12/13/2023",
    "4:00 PM",
    3,
    30,
    4
  );

  console.log(chang);
  console.log(patrick);
  console.log(changTask1);
  console.log(patrickTask1);

  await userData.addTaskToUser(
    chang._id.toString(),
    patrickTask1._id.toString()
  );

  console.log(await userData.getUserByID(chang._id.toString()));
  console.log(await taskData.getTaskByID(patrickTask1._id.toString()));
  console.log(await userData.getTasks(chang._id.toString()));

  console.log(await taskData.deleteTask(patrickTask1._id.toString()));

  // console.log(
  //   await taskData.updateStatus(changTask1._id.toString(), "revision required")
  // );
} catch (error) {
  console.log(error);
}

console.log("Finished seeding the database");

await closeConnection();
