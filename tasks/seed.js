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
} catch (error) {
    console.log(error)
}

console.log("Finished seeding the database")

await closeConnection();