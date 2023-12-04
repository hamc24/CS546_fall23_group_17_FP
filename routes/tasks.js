import { Router } from 'express';
const router = Router();
import { taskData } from '../data/index.js';
import validation from '../validation.js';
import middleware from '../middleware.js'

router
  .route('/')
  .get(middleware.privateProtect,async (req, res) => {
    //Todo
    return res.render('createATask',{title:"createATask"});
  })
  .post(middleware.privateProtect, async (req, res)=> {
    let data = req.body;
    data = validation.sanitize(data)
    console.log(data);
    let errorlist = [];
    if (!data || Object.keys(data).length === 0){
      errorlist.push("400:There are no fields in the request body");
    }
    try{
      let taskName = data.taskNameInput;
      let description = data.taskDescriptionInput;
      let creatorId = req.session.user._id;
      let creator = req.session.user.userName;
      let publicPost = data.taskTypeInput;
      let dateDue = data.taskDateDueInput;
      let timeDue = data.taskTimeDueInput;
      let maxContributors = data.taskMaxContributorInput;
      let durationH = data.taskDurationInputH;
      let durationM = data.taskDurationInputM;
      taskName = validation.checkString(taskName);
      description = validation.checkString(description);
      creatorId = validation.checkId(creatorId)
      creator = validation.checkString(creator);
      publicPost = validation.checkString(publicPost);
      dateDue = validation.checkString(dateDue);
      timeDue = validation.checkString(timeDue);
      maxContributors = validation.checkNumber(maxContributors);
      durationH = validation.checkString(durationH);
      durationM = validation.checkString(durationM);
      
    }catch(e){
      errorlist.push(`400:${e}`)
    }
    try{
      const create = await taskData.create(
        taskName,
        description,
        creatorId,
        creator,
        publicPost,
        dateDue,
        timeDue,
        durationH,
        durationM,
        maxContributors);
      if (create){
        return res.redirect('/tasks/allTaskByDueTime?page=0');
      }else{
        errorlist.push(`500:Internal Server Error`);
      }
    }catch(e){
      errorlist.push(`400:${e}`)
    }
    return res.render('createATask',{
      hasErrors:true,
      errorlist:errorlist,
      date:date
    })
  });


router
  .route('/allTaskByDuration')
  .get(middleware.privateProtect, async(req,res)=> {
    let url = window.location.pathname
    let page = Number(url.split("=")[url.length-1]);
    let tasklist =await taskData.getAllTasksByDuration(page);
    
    return res.render('allTasksByLength',{title:"myAllTasks", taskList:tasklist});
  })


router
  .route('/allTaskByDueTime')
  .get(middleware.privateProtect, async (req,res) => {
    let url = window.location.pathname
    let page = Number(url.split("=")[url.length-1]);
    let tasklist =await taskData.getAllTasksByDueTime(page);
    return res.render('viewTasks',{title:"viewTasks", taskList:tasklist})
  })

router
.route('/:id')
  
export default router
