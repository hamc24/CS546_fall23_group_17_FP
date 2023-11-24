import {userData} from "../data/index.js"
import {taskData} from "../data/index.js"
// import validation from "../validation.js"
import {dbConnection, closeConnection} from "../config/mongoConnection.js"

const db = await dbConnection();
await db.dropDatabase();

console.log("Starting the seed")
try {
    const chang = await userData.create("Chang-Woo", "Ham", "cham@stevens.edu", "hamc24", "03/22/2002", "dummy");
    const patrick = await userData.create("Patrick", "Hill", "phill@stevens.edu", "graffixnyc", "05/11/1977", "dummy");
    // const changTask1 = await taskData.create("CS546 Final Project", 
    // "Our final Project for CS546C, Our project name is 'Ducks in a Row' and it is a app solely made for task management",
    // chang.id, chang.firstName + chang.lastName, false, "12/17/2023", "11:59 PM", 3, 30, 4)  
    //TODO: This createTask function is not working atm because I forgot to return the user object in my user.create function
} catch (error) {
    console.log(error)
}

console.log("Finished seeding the database")

await closeConnection();