import { Router, json } from "express";
const router = Router();
import {scheduleData} from "../data/index.js";
import validation from "../validation.js";
import date from 'date-and-time';



router.route("/calculateFill").post(async (req,res)=>{
    let data = req.body;
    // data = validation.sanitize(data);
    let errorlist = [];
    if (!data || Object.keys(data).length === 0){
        return res.status(400).json("400:There are no fields in the request body");
    }
    let stDt = data.stDt;
    let edDt = data.edDt;
    try{
        let info = await scheduleData.calculateFill(stDt,edDt)
        return res.json(info);
    }catch(e){
        errorlist.push(e);
        return res.status(400).json({error:e});
    }
    
});
router.route("/")
    .get(async (req,res) => {
        const now = new Date();
        const tom = date.addDays(now, 1);
        const oneM = date.addMonths(tom, 1);
        let startDate= date.format(tom, 'YYYY-MM-DD');
        let endDate= date.format(oneM, 'YYYY-MM-DD');
    
        return res.status(200).render('schedules/selectTime',{
            title:"Schedule",
            startDate:startDate,
            endDate:endDate,
          })
    
    })
    .post(async (req, res)=>{
        let data = req.body;
        // data = validation.sanitize(data);
        let errorlist = [];
        if (!data || Object.keys(data).length === 0){
            return res.status(400).json("400:There are no fields in the request body");
        }
        let startDate = data.startDate;
        let endDate = data.endDate;
        let startAM = data.startAM;
        let endAM = data.endAM;
        let startPM = data.startPM;
        let endPM = data.endPM;
        console.log("hit backend",startDate,endDate,endPM)


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
        console.log("hit backend",startDate,endDate,endPM)
        try{
            const info = await scheduleData.createFill(
                req.session.user._id,
                startDate,
                endDate,
                startAM,
                endAM,
                startPM,
                endPM);
        
            return res.status(200).json(info);


            
        }catch(e){
            errorlist.push(e);
            return res.status(400).json({error:errorlist});  
        }
         
    




    });
router.route("/viewSch").get(async (req,res)=>{
    const allTasks = await scheduleData.getVievSch(req.session.user._id);
    return res.json(allTasks);
})
router.route("/mahually")
    .get(async (req,res) => {
        let id = req.session.user._id
        let SchList = await scheduleData.getSch(id);
        return res.status(200).render("schedules/selectTime", {SchList:SchList});
    })
    .post(async (req,res) => {
        let data = req.body;
        // data = validation.sanitize(data);
        let errorlist =[];
        if (!data || Object.keys(data).length === 0){
            return res.status(400).json("400:There are no fields in the request body");
        }
        console.log("manually:",data);
        let taskId=data.taskId;
        let schName = data.name;
        let schTime = data.time;
        let stDt = data.stDt;
        let edDt = data.edDt;

        try{
            const bool = await scheduleData.addSchedule(taskId,schName,stDt,edDt,schTime);
            return res.status(200).json({success:bool});
        }catch(e){
            errorlist.push(e);
            return res.status(400).json({error:errorlist});
        }
        

    })


    .patch(async (req,res)=>{
        let data = req.body;
        // data = validation.sanitize(data);
        let errorlist=[];
        if (!data || Object.keys(data).length === 0){
            return res.status(400).json("400:There are no fields in the request body");
        }
        let taskId = data.taskId;
        let schName=data.schName;

        try{
            const bool = await scheduleData.remove(taskId,schName);
            return res.status(200).json({success:bool});
        }catch(e){
            errorlist.push(e);
            return res.status(400).json({error:errorlist});
            }
    })
router.route("/:schName")
    .delete(async(req,res)=>{
        let userId = req.session.user._id;
        try{
            const bool = await scheduleData.deleteSch(userId,req.params.schName);
            return res.status(200).json({success:bool});
        }catch(e){
            return res.status(400).json({error:e});
        }
        

    })
router.route("/auto")
    .post(async(req,res)=>{
        let data = req.body;        
        // data = validation.sanitize(data);
        if (!data || Object.keys(data).length === 0){
            return res.status(400).json({error:"400:There are no fields in the request body"});
        }
        let schName = data.schName;
        let stDt = data.stDt;
        let edDt = data.edDt;
        let tasks = data.tasks;
        try{
            let bool = scheduleData.autoGenerate(schName, stDt, edDt, tasks);
            return res.json({success:bool});
        }catch(e){
            return res.status(400).json({error:e});
        }
    })
    .patch(async(req,res)=>{
        let data = req.body;
        // data = validation.sanitize(data);
        
        if (!data || Object.keys(data).length === 0){
            return res.status(400).json("400:There are no fields in the request body");
        }
        let taskId=data.taskId;
        let schName=data.schName;
        let daysAfter=data.daysAfter;
        try{
            const bool = await scheduleData.changeTime(taskId,schName,daysAfter);
            return res.status(200).json({success:bool});
        }catch(e){
            return res.status(400).json({error:e});
        }
    })

    
export default router;