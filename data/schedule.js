import validation from "../validation.js";
import { ObjectId } from "mongodb";
import { tasks, users, schedules } from "../config/mongoCollections.js";
import { userData } from "./index.js";
import date from 'date-and-time';

// function toWeek(day){
//     if (day == "Monday"){
//         return 0;
//     }else{
//         if (day == "Tuesday"){
//             return 1;
//         }else{
//             if(day == "Wednesday"){
//                 return 2;
//             }else{
//                 if(day == "Thursday"){
//                     return 3;
//                 }else{
//                     if(day == "Friday"){
//                         return 4;
//                     }else{
//                         if(day == "Saturday"){
//                             return 5;
//                         }else{
//                             return 6;
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }
// const manuallyCreate = async(

// ) => {
//     validation.checkNull(taskName);
    
//         let startDate = data.startDateInput;
//         let endDate = data.EndDateInput;
//         let startAM = data.StartAMInput;
//         let endAM = data.EndAMInput;
//         let startPM = data.StartPMInput;
//         let endPM = data.EndPMInput;
//         let select = data.selectInput;


//         try{
        
//         // console.log("startTime",typeof(startTime),startTime);
//         // console.log("endTime",typeof(endTime),endTime);
//         // console.log("method",typeof(method),method);
        
//         validation.validateDate(startDate);
//         validation.validateDate(endDate);
//         validation.compareDate(startDate);
//         validation.compareDate(endDate);
//         let stDt = Date.parse(startDate,'YYYY-MM-DD');
//         let edDt = Date.parse(endDate,'YYYY-MM-DD');
//         if(Date.now() >= stDt || stDt >= edDt){
//             throw 'end date must be later than start date.';
//         }
//         let numSAM = date.parse(startAM,'HH:mm');
//         let numEAM = date.parse(endAM,'HH:mm');
//         let numSPM = date.parse(startPM,'HH:mm');
//         let numEPM = date.parse(endPM,'HH:mm');
        
//         if(numSAM >= numEAM || numEAM >= numSPM || numSPM >= numEPM){
//             throw 'end time must be later than start time.';
//         }
//         return res.status(200).render("schedules/selectScheduleTime", {title: "schedule"})            
//     }catch(e){
//         errorlist.push(e);
//     }



//     if (select =="manually"){

        
//         try{
            
//             let startDay = date.format(startDate, "dddd");
//             let endDay = date.format(endDate, "DD");
//             let fillStart = toWeek(startDay);
//             let fillEnd = 6-toWeek(endDay);
//             let durationTime = date.subtract(edDt, stDt).toDays()
//             let full = fillStart+fillEnd+durationTime;
//             console.log(full);
//             for (let i = 0; i <=full/7, i++){
//                 for(let c = 0; c<=7; c++){

//                 }
//             }



            
//         }catch(e){
//             errorlist.push(e);
//         }   
//     }
    






// }



const create= async(id,days)=>{
    
};
const getSch= async(userId)=>{
    validation.checkNull(userId);
    userId = validation.checkId(userId);

    //Find user then get the tasks that they have
    let user = await getUserByID(userId);
    let userTasks = user.schedules.map(function (id) {
        return new ObjectId(id);
    });
    const scheduleCollection = await schedules();
    let schList = await scheduleCollection
    .find({ _id: { $in: userTasks } }).
    toArray();
    if (!schList) {
        eventList
    }
    schList = eventList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return eventList;
    if(scheduleCollection){
        let schedule = await scheduleCollection.find();
        return schedule;
    }else{
        let taskList= await userData.getTasks(req.session.user._id);
    }
    const taskCollection = await tasks();
    let schedule = 
    
};
export default {
    create,
    getSch
  };