import { Router } from "express";
const router = Router();
import { userData, scheduleData } from "../data/index.js";
import validation from "../validation.js";
import * as users from "../data/users.js";
import date from 'date-and-time';

router.route("/")
    .get(async (req,res) => {
        const now = new Date();
        const tom = date.addDays(now, 1);
        const oneM = date.addMonths(tom, 1);
        // console.log(typeof(new Date()),new Date());
        // console.log(typeof(Date.now()),Date.now());
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

        console.log(data);

        let startDate = data.startDateInput;
        let endDate = data.EndDateInput;
        let startAM = data.StartAMInput;
        let endAM = data.EndAMInput;
        let startPM = data.StartPMInput;
        let endPM = data.EndPMInput;
        let select = data.selectInput;
        let stDt =0;
        let edDt =0;
        let numSAM =0;
        let numEAM =0;
        let numSPM =0;
        let numEPM =0;
        try{
        
        // console.log("startTime",typeof(startTime),startTime);
        // console.log("endTime",typeof(endTime),endTime);
        // console.log("method",typeof(method),method);
        
        validation.validateDate(startDate);
        validation.validateDate(endDate);
        validation.compareDate(startDate);
        validation.compareDate(endDate);
        stDt = Date.parse(startDate,'YYYY-MM-DD');
        edDt = Date.parse(endDate,'YYYY-MM-DD');
        let num = Date.now()
        console.log(stDt,edDt,num,typeof(stDt),typeof(stDt),typeof(num));
        if(num >= stDt || stDt >= edDt){
            throw 'end date must be later than start date.';
        }
        let numSAM = date.parse(startAM,'HH:mm');
        let numEAM = date.parse(endAM,'HH:mm');
        let numSPM = date.parse(startPM,'HH:mm');
        let numEPM = date.parse(endPM,'HH:mm');
        
        if(numSAM >= numEAM || numEAM >= numSPM || numSPM >= numEPM){
            throw 'end time must be later than start time.';
        }
        // return res.status(200).redirect("/manually", {title: "schedule"})            
    }catch(e){
        errorlist.push(e);
    }

       

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


        


    if (select =="manually"){

        
        try{
            let startObj = new Date(stDt);
            let endtObj = new Date(edDt);
            let startDay = date.format(startObj, "dddd");
            let endDay = date.format(endtObj, "dddd");
            console.log(startDay,endDay);
            let fillStart = toWeek(startDay);
            let fillEnd = 6-toWeek(endDay);
            let durationTime = date.subtract(endtObj, startObj).toDays()
            console.log("lastlength",durationTime);
            let full = (fillStart+fillEnd+durationTime)/7;
            console.log("full",full);
            
            let fullHour = numEPM-numSAM - (numSPM-numEAM)
            let incomplete = [];
            
            let taskList= await userData.getTasks(req.session.user._id);
            for (let item of taskList){
                if(item.status<2){
                    incomplete.push(item);
                }
            }
            req.session.task = {
                incomplete
            }
            console.log("incomplete",incomplete);
            return res.status(200).render('schedules/createManually',{
                taskLists:incomplete,
                full:full,
                fillStart:fillStart,
                fillEnd:fillEnd,
                fullHour:fullHour,
                startDate:stDt
            });


            
        }catch(e){
            errorlist.push(e);
        }   
    }else{
        console.log(select);select
    }
    return res.render('schedules/selectTime',{
        title:"Schedule",
        hasErrors:true,
        errorList:errorlist,
        data:data
      })



    });
    
router.route("/mahually")
.get(async (req,res) => {
    let id = req.session.user._id
    let SchList = await scheduleData.getSch(id);
    res.json(SchList);
})
.post()
// router.route("/oneClick")
//     .get(async (req,res) => {
//         if (req.session.user){
//             return res.status(200).render("schedule/oneClick", {title: "Schedule"});
//         }else{          
//             return res.status(400).redirect("/");
//         }
//     })
//     .post(async (req, res)=>{

//     });
//     router.route("/")

    
export default router;