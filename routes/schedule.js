import { Router } from "express";
const router = Router();
import {scheduleData} from "../data/index.js";
import validation from "../validation.js";
import date from 'date-and-time';



router.route("/calculateFill").post(async (req,res)=>{
    const data = req.body;
    console.log("data",data)
    if (!data || Object.keys(data).length === 0){
    errorlist.push("400:There are no fields in the request body");
    }
    let stDt = data.stDt;
    let edDt = data.edDt;
    let info = await scheduleData.calculateFill(stDt,edDt)
    return res.json(info);
});
router.route("/")
    .get(async (req,res) => {
        const now = new Date();
        const tom = date.addDays(now, 1);
        const oneM = date.addMonths(tom, 1);
        let startDate= date.format(tom, 'YYYY-MM-DD');
        let endDate= date.format(oneM, 'YYYY-MM-DD');
        return res.status(200).render("schedules/selectTime", {title: "schedule",startDate:startDate, endDate:endDate});
    })
    .post(async (req, res)=>{
        const data = req.body;
        let errorlist = [];
        if (!data || Object.keys(data).length === 0){
        errorlist.push("400:There are no fields in the request body");
        }
        let startDate = data.startDate;
        let endDate = data.endDate;
        let startAM = data.startAM;
        let endAM = data.endAM;
        let startPM = data.startPM;
        let endPM = data.endPM;
        console.log("typeof startDate",typeof(startDate))
        console.log("typeof endDate",typeof(endDate))
        console.log("typeof startAM",typeof(startAM))
        console.log("typeof endAM",typeof(endAM))
        console.log("typeof startPM",typeof(startPM))
        console.log("typeof endPM",typeof(endPM))

        startDate = validation.checkString(startDate);
        endDate = validation.checkString(endDate);
        startAM = validation.checkString(startAM);
        endAM = validation.checkString(endAM);
        startPM = validation.checkString(startPM);
        endPM = validation.checkString(endPM);
        
        const info = await scheduleData.createFill(req.session.user._id,startDate,endDate,startAM,endAM,startPM,endPM);
    
        return res.json(info);


            
        // }catch(e){
        //     errorlist.push(e);
        // }
        // return res.json({err:errorlist});   
    // }else{
    //     console.log(select);select
    // }
    
    // return res.render('schedules/selectTime',{
    //     title:"Schedule",
    //     hasErrors:true,
    //     errorList:errorlist,
    //     data:data
    //   })



    });
router.route("/viewSch").get(async (req,res)=>{
    const allTasks = await scheduleData.getVievSch(req.session.user._id);
    console.log("allTasks",allTasks)
    return res.json(allTasks);
})
router.route("/mahually")
    .get(async (req,res) => {
        let id = req.session.user._id
        let SchList = await scheduleData.getSch(id);
        return res.status(200).render("schedules/selectTime", {SchList:SchList});
    })
    .post(async (req,res) => {
        const data = req.body;
        if (!data || Object.keys(data).length === 0){
        errorlist.push("400:There are no fields in the request body");
        }
        let taskId=data.taskId;
        let schName = data.name;
        let schTime = data.time;
        let stDt = data.stDt;
        let edDt = data.edDt;
        console.log("/mahually:post",data);
        console.log("/mahually:post",taskId,schName,stDt,edDt,schTime);

        
        const bool = await scheduleData.addSchedule(taskId,schName,stDt,edDt,schTime);
        return res.status(200).json(bool);
        

    })


    .patch(async (req,res)=>{
        const data = req.body;
        if (!data || Object.keys(data).length === 0){
        errorlist.push("400:There are no fields in the request body");
        }
        let taskId = data.taskId;
        let schName=data.schName;
        console.log(data);

        try{
            const bool = await scheduleData.remove(taskId,schName);
            return res.status(200).json(bool);
        }catch(e){
            return res.status(400).json({err:e});
            }
    })
router.route("/:schName")
    .delete(async(req,res)=>{
        let userId = req.session.user._id;
        console.log("param??",req.params.schName);
        const bool = await scheduleData.deleteSch(userId,req.params.schName);
        return res.status(200).json(bool);

    })
router.route("/auto")
    .post(async(req,res)=>{
        const data = req.body;
        if (!data || Object.keys(data).length === 0){
        errorlist.push("400:There are no fields in the request body");
        }
        let schName = data.schName;
        let stDt = data.stDt;
        let edDt = data.edDt;
        let tasks = data.tasks;
        let bool = scheduleData.aotoGenerate(schName, stDt, edDt, tasks);
        return res.json({bool:bool});
    })
    .patch(async(req,res)=>{
        const data = req.body;
        if (!data || Object.keys(data).length === 0){
        errorlist.push("400:There are no fields in the request body");
        }
        let taskId=data.taskId;
        let schName=data.schName;
        let daysAfter=data.daysAfter;
        const bool = await scheduleData.changeTime(taskId,schName,daysAfter);
        return res.status(200).json(bool);

    })

    
export default router;