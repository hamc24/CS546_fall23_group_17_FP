import { userData } from "../data/index.js";
import { taskData } from "../data/index.js";
// import validation from "../validation.js"
import { dbConnection, closeConnection } from "../config/mongoConnection.js";

const db = await dbConnection();
await db.dropDatabase();

console.log("Starting the seed");
try {
  // Add users
  let chang = await userData.create(
    "Chang-Woo",
    "Ham",
    "cham@stevens.edu",
    "hamc24",
    "2002-03-22",
    "SomePassword123!"
  );
  let patrick = await userData.create(
    "Patrick",
    "Hill",
    "phill@stevens.edu",
    "graffixnyc",
    "1977-05-11",
    "Cs546Prof?*"
  );
  let atilla = await userData.create(
    "Atilla",
    "Duck",
    "atilla@stevens.edu",
    "atillaDaDuck",
    "1877-05-11",
    "QuackQuack123!"
  );

  //Add tasks to user
  let changTask1 = await taskData.create(
    "CS546 Final Project",
    "Our final Project for CS546C, Our project name is 'Ducks in a Row' and it is a app solely made for task management",
    chang._id.toString(),
    ` ${chang.firstName} ${chang.lastName}`,
    false,
    "2023-12-31",
    "11:59 PM",
    3,
    30,
    10
  );
  let changTask2 = await taskData.create(
    "Chopping up onions",
    "I am going to have an onion cutting session so that I could cry while working on this final project",
    chang._id.toString(),
    ` ${chang.firstName} ${chang.lastName}`,
    true,
    "2023-12-30",
    "11:59 PM",
    2,
    20,
    10
  );
  let patrickTask1 = await taskData.create(
    "CS546 Office Hours",
    "Weekly Office Hours that are hosted at 4pm. Come if you have any questions, or not",
    patrick._id.toString(),
    ` ${patrick.firstName} ${patrick.lastName}`,
    true,
    "2023-12-31",
    "4:00 PM",
    3,
    30,
    4
  );
  let patrickTask2 = await taskData.create(
    "CS546 Super office hours",
    "Super Office Hours that are hosted at 4pm. Most of the TAs and I will be there resolving any issues you have with your code",
    patrick._id.toString(),
    ` ${patrick.firstName} ${patrick.lastName}`,
    true,
    "2024-1-30",
    "4:00 PM",
    3,
    0,
    25
  );
  let atillaTask1 = await taskData.create(
    "Flock Party 2024 Volunteering",
    "Hosting the annual Flock Party at stevens, need some volunteers to help set up and take care of consession stands",
    atilla._id.toString(),
    ` ${atilla.firstName} ${atilla.lastName}`,
    true,
    "2024-1-1",
    "3:00 PM",
    5,
    0,
    100
  );
  let atillaTask2 = await taskData.create(
    "Annual Quack off on the Hudson",
    "Looking for competitors for our Annual quack off, must be 18 years or older, and no geese allowed!",
    atilla._id.toString(),
    ` ${atilla.firstName} ${atilla.lastName}`,
    true,
    "2024-12-31",
    "7:00 PM",
    1,
    30,
    10
  );
  let atillaTask3 = await taskData.create(
    "Christmas Dinner with Favardin",
    "Come join us for the Christmas dinner with President Favardin, Bring a dish with you",
    atilla._id.toString(),
    ` ${atilla.firstName} ${atilla.lastName}`,
    true,
    "2024-12-26",
    "7:00 PM",
    2,
    30,
    15
  );

  // Inserting public task to user's task list
  await userData.addTaskToUser(
    chang._id.toString(),
    patrickTask1._id.toString()
  );

  await userData.addTaskToUser(
    chang._id.toString(),
    atillaTask1._id.toString()
  );

  // Deleting one task that a user has created
  console.log(
    await taskData.deleteTask(
      patrick._id.toString(),
      patrickTask1._id.toString()
    )
  );

  // Inserting Comments
  await taskData.addComment(
    chang._id.toString(),
    changTask1._id.toString(),
    "Where are the handlebars?"
  );
  await taskData.addComment(
    chang._id.toString(),
    changTask1._id.toString(),
    "Where are the input validations?"
  );
  await taskData.addComment(
    chang._id.toString(),
    changTask1._id.toString(),
    "Where is the CSS?"
  );
  await taskData.addComment(
    chang._id.toString(),
    changTask1._id.toString(),
    "What a mess...?"
  );

  console.log(
    await taskData.updateStatus(changTask1._id.toString(), "revision required")
  );
  console.log(await taskData.getContributorByName(atillaTask1._id.toString()));
} catch (error) {
  console.log(error);
}

console.log("Finished seeding the database");

await closeConnection();
