import validation from "../validation.js";
import { ObjectId } from "mongodb";
import { tasks } from "../config/mongoCollections.js";
import { userData } from "./index.js";
import date from 'date-and-time';


const getTasks = async (userId) => {
    validation.checkNull(userId);
    userId = validation.checkId(userId);
  
    //Find user then get the tasks that they have
    let user = await userData.getUserByID(userId);
    let userTasks = user.tasks.map(function (id) {
      return new ObjectId(id);
    });
    const taskCollection = await tasks();
    let foundTasks = await taskCollection
      .find({ _id: { $in: userTasks }, "status":{ $lte: 2 } })
      .toArray();
    return foundTasks;
  };

function toWeek(day){
    if (day == "Sunday"){
        return 0;
    }else{
        if (day == "Monday"){
            return 1;
        }else{
            if(day == "Tuesday"){
                return 2;
            }else{
                if(day == "Wednesday"){
                    return 3;
                }else{
                    if(day == "Thursday"){
                        return 4;
                    }else{
                        if(day == "Friday"){
                            return 5;
                        }else{
                            return 6;
                        }
                    }
                }
            }
        }
    }
}




const calculateFill=async(stDt,edDt)=>{
    validation.checkNull(stDt);   
    validation.checkNull(edDt);
    stDt=validation.checkString(stDt);
    edDt=validation.checkString(edDt);
    
    function toWeek(day){
        if (day == "Sunday"){
            return 0;
        }else{
            if (day == "Monday"){
                return 1;
            }else{
                if(day == "Tuesday"){
                    return 2;
                }else{
                    if(day == "Wednesday"){
                        return 3;
                    }else{
                        if(day == "Thursday"){
                            return 4;
                        }else{
                            if(day == "Friday"){
                                return 5;
                            }else{
                                return 6;
                            }
                        }
                    }
                }
            }
        }
    }


    let startObj = new Date(Number(stDt)+86400000);
    let endObj = new Date(Number(edDt)+86400000);
    let strSt = date.format(startObj, "YYYY-MM-DD");
    let strEnd = date.format(endObj, "YYYY-MM-DD");
    
    let startDay = date.format(startObj, "dddd");
    let endDay = date.format(endObj, "dddd");
    let fillStart = toWeek(startDay);
    let fillEnd = 6-toWeek(endDay);
    let durationDays = date.subtract(endObj, startObj).toDays()
    let full = (fillStart+fillEnd+durationDays+1)/7;
    let data={
        fillStart:fillStart,
        fillEnd:fillEnd,
        strSt:strSt,
        strEnd:strEnd,
        full:full
    }
    return data;
}

const createFill=async(userId,startDate,endDate,startAM,endAM,startPM,endPM)=>{
    validation.checkNull(userId);  
    validation.checkNull(startDate);  
    validation.checkNull(endDate);  
    validation.checkNull(startAM);  
    validation.checkNull(endAM);  
    validation.checkNull(startPM);  
    validation.checkNull(endPM);  
    startDate = validation.checkString(startDate);
    endDate = validation.checkString(endDate);
    startAM = validation.checkString(startAM);
    endAM = validation.checkString(endAM);
    startPM = validation.checkString(startPM);
    endPM = validation.checkString(endPM);
    let stDt =0;
    let edDt =0;
    let numSAM =0;
    let numEAM =0;
    let numSPM =0;
    let numEPM =0;
    

    stDt = Date.parse(startDate,'YYYY-MM-DD')+86400000;        
    edDt = Date.parse(endDate,'YYYY-MM-DD')+86400000;
    let num = Date.now()
    if(num >= stDt || stDt >= edDt){
        throw 'end date must be later than start date.';
    }
    numSAM = Date.parse(endDate+" "+startAM,'YYYY-MM-DD HH:mm');
    numEAM = Date.parse(endDate+" "+endAM,'YYYY-MM-DD HH:mm');
    numSPM = Date.parse(endDate+" "+startPM,'YYYY-MM-DD HH:mm');
    numEPM = Date.parse(endDate+" "+endPM,'YYYY-MM-DD HH:mm');
    if(numSAM >= numEAM || numEAM >= numSPM || numSPM >= numEPM){
        throw 'end time must be later than start time.';
    }
   






    let startObj = new Date(stDt);
    let endtObj = new Date(edDt);
    
    let startDay = date.format(startObj, "dddd");
    let endDay = date.format(endtObj, "dddd");
    let fillStart = toWeek(startDay);
    let fillEnd = 6-toWeek(endDay);
    let durationDays = date.subtract(endtObj, startObj).toDays()
    let full = (fillStart+fillEnd+durationDays+1)/7;
    
    let fullHour = numEPM-numSAM - (numSPM-numEAM);
    const inComplete = await getTasks(userId);
    let changeDur = [];
    inComplete.map((item)=>{
        let durObj = date.addMinutes(date.addHours(new Date(0), item.duration.durationH),item.duration.durationM)
        let durNum = Date.parse(date.format(durObj, "YYYY-MM-DD HH:mm"),"YYYY-MM-DD HH:mm")
        let duetime = Date.parse(item.dateDue,"YYYY-MM-DD HH:mm");
        item.duration.stamp=durNum;
        item.dueTime=duetime;
        changeDur.push(item);
    })
    let info = {
        full:full,
        fillStart:fillStart,
        fillEnd:fillEnd,
        fullHour:fullHour,
        durationDays:durationDays,
        stDt:stDt,
        edDt:edDt,
        taskList:changeDur
    };
    return info;

 
}




const addSchedule= async(taskId,schName,stDt,edDt,schTime)=>{
    console.log("all",taskId,schName,stDt,edDt,schTime);
    validation.checkNull(taskId); 
    validation.checkNull(schName); 
    validation.checkNull(stDt); 
    validation.checkNull(edDt); 
    validation.checkNull(schTime); 
    taskId = validation.checkId(taskId);
    schName = validation.checkString(schName);
    stDt = validation.checkString(stDt);
    edDt = validation.checkString(edDt);
    schTime = validation.checkString(schTime);
    const taskCollection = await tasks();
    const oneTask = await taskCollection.findOne({_id: new ObjectId(taskId)});
    if (oneTask === null) throw 'No task with that id';
    let taskSchedule ={}
    let oneSch = {schTime:schTime,stDt:stDt,edDt:edDt};
    if(oneTask.schedule){
        taskSchedule = oneTask.schedule;
        taskSchedule[schName] = oneSch;
    }else{
        taskSchedule[schName]=oneSch;
    }
    

    
    const updatedInfo = await taskCollection.findOneAndUpdate(
            {_id:new ObjectId(taskId)},
            {$set: {schedule:taskSchedule}},
            {returnDocument: 'after'}
        );
        if (!updatedInfo) {
            throw 'could not add to schedule successfully';
        }
        return true;
};
const changeTime= async(taskId,schName,daysAfter)=>{
    validation.checkNull(taskId);
    taskId = validation.checkId(taskId);
    console.log("changeTime,taskId,",typeof(taskId));
    console.log("changeTime,taskId,",typeof(schName));
    console.log("changeTime,taskId,",typeof(daysAfter));

    validation.checkNull(schName);
    schName = validation.checkString(schName);

    const taskCollection = await tasks();
    const oneTask = await taskCollection.findOne({_id: new ObjectId(taskId)});
    if (oneTask === null) throw 'No task with that id';
    
    let taskSchedule =[]
    if (oneTask.schedule){
        oneTask.schedule[schName][time] = daysAfter;
    }else{
        throw "the task doesn't have any schedule yet!";
    }
    
    const updatedInfo = await taskCollection.findOneAndUpdate(
            {_id:new ObjectId(taskId)},
            {$set: {schedule:taskSchedule}},
            {returnDocument: 'after'}
        );
        if (!updatedInfo) {
            throw 'could not remove schedule successfully';
        }
        return true;
};
const remove= async(taskId,schName)=>{
    
    validation.checkNull(taskId);
    taskId = validation.checkId(taskId);
    const taskCollection = await tasks();
    const oneTask = await taskCollection.findOne({_id: new ObjectId(taskId)});
    
    if (oneTask === null) throw 'No task with that id';
    let newSch = oneTask.schedule;
    delete newSch[schName];
    const updatedInfo = await taskCollection.findOneAndUpdate(
        {_id:new ObjectId(taskId)},
        {$set: {schedule:newSch}},
        {returnDocument: 'after'}
    );
    if (!updatedInfo) {
        throw 'could not remove schedule successfully';
    }
};

const deleteSch= async(userId,schName)=>{
    validation.checkNull(userId);
    userId = validation.checkId(userId);

    //Find user then get the tasks that they have
    let user = await userData.getUserByID(userId);
    
    let userTasks = user.tasks.map(function (id) {
    return new ObjectId(id);
    });
    const taskCollection = await tasks();
    


    let foundtasks = await taskCollection
    .find({ _id: { $in: userTasks } })
    .toArray();

    
    foundtasks = foundtasks.filter((item) => {return (item.schedule && item.schedule[schName])});
    if(foundtasks){
        for(let item of foundtasks){
            let newSch =item.schedule;
            delete newSch[schName];
            const updatedInfo = await taskCollection.findOneAndUpdate(
                {_id:new ObjectId(item._id)},
                {$set: {schedule:newSch}},
                {returnDocument: 'after'}
            );
            if (!updatedInfo) {
                throw 'could not remove schedule successfully';
            }
                
        }
        
    } else{
        throw "no schedule name with this name"
    }
    return true;
};    

const getVievSch= async(userId)=>{
    validation.checkNull(userId);
    userId = validation.checkId(userId);

    //Find user then get the tasks that they have
    let user = await userData.getUserByID(userId);
    
    let userTasks = user.tasks.map(function (id) {
    return new ObjectId(id);
    });
    const taskCollection = await tasks();
    let foundtasks = await taskCollection
    .find({ _id: { $in: userTasks }, schedule: { $exists: true }})
    .toArray();
    if (!foundtasks) {
        throw 'could not find any schedule';
      }

    let sches ={};
    
    foundtasks.forEach(element => {
        Object.keys(element.schedule).forEach((val)=>{
            let oneSch ={};
            if(!sches[val]){
                oneSch={
                    stDt:element.schedule[val]["stDt"],
                    edDt:element.schedule[val]["edDt"],
                    tasks:[]
                };
                let tasks={
                    taskId:element._id.toString(),
                    taskName:element.taskName,
                    schTime:element.schedule[val]["schTime"]
                };
                oneSch["tasks"].push(tasks);
            }else{
                oneSch = sches[val];
                let tasks={
                    taskId:element._id.toString(),
                    taskName:element.taskName,
                    schTime:element.schedule[val]["schTime"]
                };
                oneSch["tasks"].push(tasks);
            }
            sches[val]=oneSch;
        })
    })
    return sches;
        
}; 

const autoGenerate= async(schName, stDt, edDt, taskList)=>{
    validation.checkNull(schName);
    validation.checkNull(stDt);
    validation.checkNull(edDt);
    if (typeof(taskList) != "object" || taskList===null){
        throw "taskList is not a object";
    };
    schName = validation.checkString(schName);
    stDt = validation.checkString(schName);
    edDt = validation.checkString(schName);
    console.log("autoGenerate",typeof(schName),typeof(stDt),typeof(taskList),)
    for(let item of taskList){
        
        const taskCollection = await tasks();
        const oneTask = await taskCollection.findOne({_id: new ObjectId(item.taskId)});
        if (oneTask === null) throw 'No task with that id';
        
        let taskSchedule ={}
        let oneSch = {schTime:item.schTime,stDt:stDt,edDt:edDt};
        if(oneTask.schedule){
            taskSchedule = oneTask.schedule;
            taskSchedule[schName] = oneSch;
        }else{
            taskSchedule[schName]=oneSch;
        }
        
    
        
        const updatedInfo = await taskCollection.findOneAndUpdate(
                {_id:new ObjectId(item.taskId)},
                {$set: {schedule:taskSchedule}},
                {returnDocument: 'after'}
            );
            if (!updatedInfo) {
                throw 'could not add to schedule successfully';
            }
                
    };
    return true;
}


    





export default {
    calculateFill,
    createFill,
    getTasks,
    getVievSch,
    addSchedule,
    changeTime,
    remove,
    deleteSch,
    autoGenerate
  };