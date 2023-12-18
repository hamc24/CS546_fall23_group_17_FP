$(function(){

    let errorList=[];
    let error = $("#errorList");
    let tasks = $(".tasks");
    let schedule = $(".schedule");
    let createForm=$("#createForm");
    let deleteSch=$("#deleteSch");
    let deleteDiv = $("#deleteDiv");
    let confirmDel = $("#confirmDel");
    let noDel = $("#noDel");

    function checkStr(val){
        
        if(!val || !typeof(val) == "string" || val.trim().length == 0){
            return false;
        }else{
            return true
        }
    }
    
    function addStyle(funcA,val,msg){
        if(funcA){
            val.addClass('errorInput');
            errorlist.push(msg);
        }else{
            val.removeClass('errorInput');
        }
    }
    
    
    function validateDate(date) {
        date = date.split("-");
        if (date.length != 3) throw "Error: date is not valid (not long enough)";
        let month = date[1];
        let day = date[2];
        let year = date[0];
        if (
          parseInt(month) != month ||
          parseInt(day) != day ||
          parseInt(year) != year
        )
          throw "Error: date is not valid (did not match)";
        if (month < 1 || month > 12)
          throw `Error: date is not valid (has to be 1-12 but was ${month})`;
        if (day < 1) throw "Error: date is invalid";
        if (month == 4 || month == 6 || month == 9 || month == 11) {
          if (day > 30) {
            throw `Error: the ${month}th month only has 30 days`;
          }
        } else if (month == 2) {
          if (day > 29 && year%100 != 0 && year%400 == 0) {
            throw `Error: the ${month}th month in leap year only has 29 days`;
          }else{
            if(day > 28 )throw `Error: the ${month}th month only has 28 days`
          }
        } else {
          if (day > 31) {
            throw "Error: date can have more than 31 days";
          }
        }
        if (year.length > 4 && year.length < 0)
          throw "Error: year has to be a number greater than 0 but less than 5";
      }
  
      
      function compareDate(date) {
        date = date.split("-");
        let month = date[1];
        let day = date[2];
        let year = date[0];
      
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
      
        if (yyyy > year) {
          throw "Error: date has to be in the future";
        } else if (yyyy == year) {
          if (mm > month) {
            throw "Error: date has to be in the future";
          } else if (mm == month) {
            if (dd > day) {
              throw "Error: date has to be in the future";
            }
          }
        }
      }
    
      function validateTime(time) {
        let splitTime = time.split(":");
        if (splitTime.length != 2) throw "Error: invalid time";
        let hour = splitTime[0];
        let minute = splitTime[1]
      
        // Checking hour so that it is formatted correctly
        if (hour.length !=2) {
          throw "Error: invalid Hour";
        
        }
      
        if (minute.length != 2 ) throw "Error: invalid time";
      
        if (parseInt(hour) != hour || parseInt(minute) != minute)
          throw "Error: invalid time";
      
        if (hour < 1 || hour > 24) throw "Error: Invalid time";
        if (minute < 0 || minute > 59) throw "Error: Invalid time";
      }

      




    function checkSch(){
        
            $('#errorList').empty();
            errorlist = [];
            addStyle(!checkStr($('#nameInput').val()), $('#nameInput'), "nameInput must be strings");
              if(checkStr($('#nameInput').val())){
                addStyle(($('#nameInput').val().trim().length<2 || $('#nameInput').val().trim().length>25), $('#nameInput'), "schedule name must be 2-25 characters");
              }
          
              if(!checkStr($('#startDateInput').val()) || !checkStr($('#EndDateInput').val()) || !checkStr($('#StartAMInput').val())|| !checkStr($('#EndAMInput').val())|| !checkStr($('#StartPMInput').val())|| !checkStr($('#EndPMInput').val()) ){
                errorlist.push("time input must be strings")
              }else{
          
              
                try{
                  validateDate($('#startDateInput').val());
                  compareDate($('#startDateInput').val());
                }catch(e){
                    addStyle(true, $('#startDateInput'),e)
                }
                  try{
                    validateDate($('#EndDateInput').val());
                    compareDate($('#EndDateInput').val());
                }catch(e){
                    addStyle(true, $('#EndDateInput'),e)
                }
          
                try{
                  
                  validateTime($('#StartAMInput').val());
                }catch(e){
                    addStyle(true, $('#StartAMInput'),e)
                }
                
                try{
                  
                    validateTime($('#EndAMInput').val());
                }catch(e){
                    addStyle(true, $('#EndAMInput'),e)
                }
                try{
                  
                    validateTime($('#StartPMInput').val());
                }catch(e){
                    addStyle(true, $('#StartPMInput'),e)
                }
                try{
                  
                    validateTime($('#EndPMInput').val());
                }catch(e){
                    addStyle(true, $('#EndPMInput'),e)
                }
          
              }
          
            if (errorlist.length>0){  
                for (let item of errorlist){
                    li = `<li class = "error"> ${item} </li>`;
                    $('#errorList').append(li);
                           
                }
                return false; 
            }
            return true;
          
          
          
    }


    function fillCalendar(stDt,edDt,tasks,schName){

        let oneDay = 86400000;
        $(".schedule tbody").empty();
       // function addTasks(dayNum,days){
        //     for(let item of tasks){
        //         if(days<item["schTime"]<days+oneDay){
        //             $(`.cell #${dayNum}`).append(`<a href='/tasks/${item.taskId}'  id='${item.taskId}'class='atask' schTime=${item["schTime"]}>${item.taskName})</a>`);

        //         }
        //     }
        // }

        let requestConfig = {
            method: 'POST',
            url: '/schedule/calculateFill',
            data:{
                stDt:stDt,
                edDt:edDt
            }
            };
        $.ajax(requestConfig).then(function(data){
            let fillStart= data.fillStart;
            let fillEnd = data.fillEnd; 
            let startDate = data.strSt; 
            let endDate = data.strEnd;
            let full = data.full; 
            let dayNum = 0;
            let days = Number(stDt);
            let isFill =0;
            if(fillStart !== 0){
                isFill =1;
                if(fillEnd!=0){
                    isFill =2;
                }
            }
                
                
                $("#dateFooter").html(`Time span: from${startDate} to ${endDate}`)
                $(".schedule thead").attr('name', `${schName}`)
                $(".tasks thead").html(`${schName}`)


                if(fillStart !== 0){
                    schedule.find('tbody').append("<tr id='schTr00'></tr>");
                    for(let i = 0; i<fillStart; i++){
                        $("#schTr00").append(`<td class='fill'></td>`);
                        
                    }
                
                    for(let i = 0; i<7-fillStart; i++){
                        $("#schTr00").append(`<td class='real'><a href='/schedule' id='${dayNum}' class='cell' days='${days}' ></a></td>`);
                        days +=oneDay;
                        dayNum+=1;
                    }
                }

                
                for (let i = 0; i < full-isFill; i++){
                    schedule.find('tbody').append(`<tr id='schTrMid${i}'></tr>`);
                    for(let c = 0; c<7; c++){
                        $(`#schTrMid${i}`).append(`<td class='real'><a href='/schedule' id='${dayNum}' class='cell' days='${days}'></a></td>`);
                        days +=oneDay;
                        dayNum+=1;


                    }
                }
                if(fillEnd !== 0){
                    schedule.find('tbody').append("<tr id='schTrEnd'></tr>");
                    for (let i = 0; i < 7-fillEnd; i++){
                        $("#schTrEnd").append(`<td class='real'><a href='/schedule' id='${dayNum}' class='cell' days='${days}'></a></td>`);
                        days +=oneDay;
                        dayNum+=1;
                    }

                }
                    for(let i = 0; i<fillEnd; i++){
                        $("#schTrEnd").append(`<td class='fill'></td>`);
                    }


                    tasks.sort(function(a,b){return a["schTime"]-b["schTime"]})
                    for (let i=0; i<full*7-fillStart-fillEnd ; i++){
                        
                        
                        let days = Number($("#"+i).attr('days'));
                        while(tasks[0] && days+oneDay > tasks[0].schTime && days <= tasks[0].schTime){
                            let real = $("#"+i).closest('td');            
            
                            real.append(`<br><a href='/tasks/${tasks[0].taskId}'  schtime='${tasks[0].schTime}' id='${tasks[0].taskId}'class='atask' >${tasks[0].taskName}</a>`)
                            
                            tasks.shift();
                        }
                        
                    }
    },(error)=>{
        alert(JSON.stringify(error));
    })
        schedule.show();
        
    
    }





    $("#viewSch").on('click',function (event){
        event.preventDefault();
        function loadPage(){

            $("#switch").empty();
            
            deleteDiv.hide();
            confirmDel.hide();
            noDel.hide();
            deleteSch.show();
            $(".tasks tbody").empty();
            $("#taskCell").hide();
            
            createForm.hide();
            deleteSch.show();
            let allSch = {};
            $.ajax({type:'GET',url:'/schedule/viewSch',success:function(data){
                allSch = data;
                $.each(Object.keys(data),function(i,item){
                    $("#switch").append(`<li><a class='schList' href='/schedule' id='${item}'>${item}</a></li>`);
                });

                // function changeSchView(){}
                $("#switch").find('.schList').on('click', function(event){
                    event.preventDefault();
                    let schName = $(this).html();
                    let sch01 = data[$(this).html()];
                    let stDt = sch01["stDt"];
                    let edDt = sch01["edDt"];
                    let tasks = sch01["tasks"];
                    fillCalendar(stDt,edDt,tasks,schName);
                });
                let sch01 = data[Object.keys(data)[0]]
                let stDt = sch01["stDt"];
                let edDt = sch01["edDt"];
                let tasks = sch01["tasks"];
                fillCalendar(stDt,edDt,tasks,Object.keys(data)[0])        
                        
                },error:function(data){
                        alert(JSON.stringify(data));
                    }          
            });
            
                
            deleteSch.on('click',function(event){
                event.preventDefault()
                $("#deleteDiv").show();
                confirmDel.show();
                noDel.show();
                deleteSch.hide();
                noDel.on('click', function(event){
                    event.preventDefault();
                    deleteDiv.hide();
                    confirmDel.hide();
                    noDel.hide();
                    deleteSch.show();
                });
                confirmDel.on('click', function(event){
                    event.preventDefault()
                    let schName = $(".schedule thead").attr('name');
                    
                    // $.ajax({type:'DELETE',url:'/schedule/'+schName,success:function(data){
                        
                    //     if (data === true){
                    //         deleteSch.off('click');
                    //         confirmDel.off('click');
                    //         loadPage();
                    //         }
                    //     },error:function(data){
                    //         alert(JSON.stringify(data));
                    //     }
                    // })
                    $.ajax({type:'DELETE',url:'/schedule/'+schName}).then(function(data){
                        
                        
                            deleteSch.off('click');
                            confirmDel.off('click');
                            loadPage();
                            
                        },(error)=>{
                            alert(JSON.stringify(error));
                        })
                        
                    })
                    
                
            })
        }
        loadPage();
            tasks.show();
            
            
        

    })


    $("#selectScheduleTime").submit(function (event) {
        event.preventDefault();




        if(checkSch()){






        error.empty();
        deleteSch.hide();
        deleteDiv.hide();
        
        let schName = $("#nameInput").val();
        let startDate = $("#startDateInput").val();
        let endDate = $("#EndDateInput").val();
        let startAM = $("#StartAMInput").val();
        let endAM = $("#EndAMInput").val();
        let startPM = $("#StartPMInput").val();
        let endPM = $("#EndPMInput").val();
        let select = $("#selectInput").val();
        
        if (select == 'manually'){
            
            
            
            let requestConfig = {
                method: 'POST',
                url: '/schedule/',
                data:{
                    startDate:startDate,
                    endDate:endDate,
                    startAM:startAM,
                    endAM:endAM,
                    startPM:startPM,
                    endPM:endPM
                }
                };
            
            $.ajax(requestConfig).then(function(data){
                let full = data.full;
                let fillStart = data.fillStart;
                let fillEnd = data.fillEnd;
                let fullHour = data.fullHour;
                let durationDays = data.durationDays;
                let stDt = data.stDt;
                let edDt = data.edDt;
                let taskList = data.taskList;
                let oneDay = 86400000;


                $(".schedule tbody").empty();
                $(".tasks tbody").empty();

                let days = stDt;
                let isFill =0;
                if(fillStart !== 0){
                    isFill =1;
                    if(fillEnd!=0){
                        isFill =2;
                    }
                }
                $("#dateFooter").append(`<p>Time span: from${startDate} to ${endDate}</p>`)
                if(fillStart !== 0){

                    schedule.find('tbody').append("<tr id='schTr00'></tr>");

                    for(let i = 0; i<fillStart; i++){
                        $("#schTr00").append(`<td class='fill'></td>`);
                        
                    }
                
                    for(let i = 0; i<7-fillStart; i++){
                        $("#schTr00").append(`<td class='real'><a href='/schedule' class='cell' days='${days}' hours='${fullHour}'>${fullHour/3600000}:${fullHour%3600000}</a></td>`);
                        days+=oneDay;
                    }
                }
                for (let i = 0; i < full-isFill; i++){
                    schedule.find('tbody').append(`<tr id='schTrMid${i}'></tr>`);
                    for(let c = 0; c<7; c++){
                        $(`#schTrMid${i}`).append(`<td class='real'><a href='/schedule'class='cell' days='${days}' hours='${fullHour}'>${fullHour/3600000}:${fullHour%3600000}</a></td>`);
                        days+=oneDay;
                    }
                }
                if(fillEnd !== 0){
                    schedule.find('tbody').append("<tr id='schTrEnd'></tr>");
                    for (let i = 0; i < 7-fillEnd; i++){
                        $("#schTrEnd").append(`<td class='real'><a href='/schedule' class='cell'days='${days}' hours='${fullHour}'>${fullHour/3600000}:${fullHour%3600000}</a></td>`);
                        days+=oneDay;
                    }
                    for(let i = 0; i<fillEnd; i++){
                        $("#schTrEnd").append(`<td class='fill'></td>`);
                        days+=oneDay;
                    }
                }
                
            
                for(i=0;i<taskList.length; i++){
                    tasks.find('tbody').append(`<tr><td><a href='/tasks/${taskList[i].id}' dueTime='${taskList[i].dueTime}' duration='${taskList[i].duration.stamp}' id='${taskList[i]._id}'class='atask' name='${taskList[i].taskName}'>${taskList[i].taskName}(${taskList[i].duration.durationH}:${taskList[i].duration.durationM})</a></td></tr>`);
                }
                
                function bindAddEvent(){ 
                    // $('#taskCell').off('click'); 
                    // $("a:acrive").off('click');              
                    tasks.find('.tasks a').on('click',function(event){
                        event.preventDefault();
                        let atask = $(this);
                        let taskId = atask.attr('id');
                        let plan = {taskId:taskId,name:schName,stDt:stDt,edDt:edDt};
                        
                        let duration = Number(atask.attr('duration'));
                        let dueTime =Number(atask.attr('detime'));
                        let taskName =atask.attr('name');
                        
                        let trTask = atask.closest('tr')

                    
                        schedule.find('.cell').on('click',function(event){
                            event.preventDefault();
                            let cell = $(this);
                            // tasks.find('.tasks a').off('click');
                            // eventA.stopPropagation();
                            let dateMark = Number(cell.attr('days'));
                            if (dueTime>dateMark){
                                alert("schedule time must not later than dueTime!")
                            }
                            let real = cell.closest('td');
                            let dur =Number(cell.attr('hours')) -duration;
                            if (dur<0){
                                alert("Time for this day is not enough!")
                            }
                            if(real.children().length > 1){

                                let schStart = Number($(this).attr('days'));
                                real.find(".atask").map((item)=>{
                                    schStart += Number(item.attr('duration'));
                                })
                                plan["time"] = schStart;
                            }else{
                                plan["time"] =$(this).attr('days');
                            }
                            let requestConfig = {
                                method: 'POST',
                                url: 'schedule/mahually',
                                data:plan};
                            $.ajax(requestConfig).then(function (responseMessage){
                                if (responseMessage){
                                    alert(JSON.stringify(responseMessage));
                                    
                                    let dur =cell.attr('hours') -duration;
                                    cell.attr('hours',dur);
                                    cell.html(`${Math.floor(Number(dur)/3600000)}:${Math.floor(Number(dur)%3600000/60000)}`);
                                    trTask.remove();

                                    real.append(`<br><a href='/tasks/${taskId}' duration='${duration}' id='${taskId}'class='atask' name='${taskName}' days='${dateMark}'>${taskName}(${Math.floor(Number(duration)/3600000)}:${Math.floor(Number(duration)%3600000/60000)})</a>`);
                                    tasks.find('.tasks a').off('click');
                                    schedule.find('.cell').off('click');
                                    // event.stopPropagation();
                                    bindAddEvent();
                                    bindRemoveEvent();
                                }else{
                                    alert(JSON.stringify(error));
                                }
                                
                            })
                
                            
                        })
                        // event.stopPropagation();
                        // bindAddEvent();
                        
                            
                    })
                }
                function bindRemoveEvent(){
                    schedule.find('.atask').on('click',function(event){
                        event.preventDefault();
                        let atask=$(this); 
                        let taskId = atask.attr('id');
                        let plan = {taskId:taskId,schName:schName};

                        let cell = $(this).closest('tb').find('.cell');
                        
                        $('#taskCell').on('click',function(event){
                            event.preventDefault();
                            plan['taskId'] =taskId;
                            let requestConfig = {
                                method: 'PATCH',
                                url: 'schedule/mahually',
                                data:plan};
                            $.ajax(requestConfig).then(function (responseMessage){
                                let hours =Number(cell.attr('hours'));
                                let duration = Number(atask.attr('duration'));
                                let dur =hours +duration;                
                                            
                                cell.attr('hours',dur)
                                cell.html(`${Math.floor(Number(dur)/3600000)}:${Math.floor(Number(dur)%3600000/60000)}`);

                                atask.remove();

                                $(".tasks tbody").append(`<tr><td><a href='/tasks/${taskId}' duration='${duration}' id='${taskId}'class='atask' name='${taskName}' >${taskName}(${Math.floor(Number(duration)/3600000)}:${Math.floor(Number(duration)%3600000/60000)})</a></td></tr>`);
                                schedule.find('.atask').off('click');
                                $('#taskCell').off('click');

                                // event.stopPropagation();
                                bindAddEvent();
                                bindRemoveEvent();
                               
                                
                            },(error)=>{
                                alert(JSON.stringify(error));
                            })
                        })
                        
                    })
                }
                bindAddEvent();
                bindRemoveEvent();
            },(error)=>{
                alert(JSON.stringify(error));
            })
            tasks.show();
            schedule.show();
            createForm.hide();

        
        }else{
            if(select == 'oneClick'){
                tasks.hide();
            
                let requestConfig = {
                    method: 'POST',
                    url: '/schedule/',
                    data:{
                        startDate:startDate,
                        endDate:endDate,
                        startAM:startAM,
                        endAM:endAM,
                        startPM:startPM,
                        endPM:endPM
                    }
                    };
                
                $.ajax(requestConfig).then(function(data){
                    let full = data.full;
                    let fillStart = data.fillStart;
                    let fillEnd = data.fillEnd;
                    let fullHour = data.fullHour;
                    let durationDays = data.durationDays;
                    let stDt = data.stDt;
                    let edDt = data.edDt;
                    let taskList = data.taskList;
                    let oneDay = 86400000;
                    $(".schedule tbody").empty();
                    $(".tasks tbody").empty();

                            
                    


                    
                    let dayNum=0;
                    let days = stDt;
                    let isFill =0;
                    if(fillStart !== 0){
                        isFill =1;
                        if(fillEnd!=0){
                            isFill =2;
                        }
                    }
                    $("#dateFooter").append(`<p>Time span: from${startDate} to ${endDate}</p>`)
                    if(fillStart !== 0){
                        schedule.find('tbody').append("<tr id='schTr00'></tr>");
                        for(let i = 0; i<fillStart; i++){
                            $("#schTr00").append(`<td class='fill'></td>`);
                            
                        }
                    
                        for(let i = 0; i<7-fillStart; i++){
                            $("#schTr00").append(`<td class='real'><a href='/schedule' id='${dayNum}' class='cell' days='${days}' hours='${fullHour}'>${fullHour/3600000}:${fullHour%3600000}</a></td>`);
                            days+=oneDay;
                            dayNum+=1;
                        }
                    }
                    for (let i = 0; i < full-isFill; i++){
                        schedule.find('tbody').append(`<tr id='schTrMid${i}'></tr>`);
                        for(let c = 0; c<7; c++){
                            $(`#schTrMid${i}`).append(`<td class='real'><a href='/schedule' id='${dayNum}' class='cell' days='${days}' hours='${fullHour}'>${fullHour/3600000}:${fullHour%3600000}</a></td>`);
                            days+=oneDay;
                            dayNum+=1;
                        }
                    }
                    if(fillEnd !== 0){
                        schedule.find('tbody').append("<tr id='schTrEnd'></tr>");
                        for (let i = 0; i < 7-fillEnd; i++){
                            $("#schTrEnd").append(`<td class='real'><a href='/schedule' id='${dayNum}' class='cell' days='${days}' hours='${fullHour}'>${fullHour/3600000}:${fullHour%3600000}</a></td>`);
                            days+=oneDay;
                            dayNum+=1;
                        }
                        for(let i = 0; i<fillEnd; i++){
                            $("#schTrEnd").append(`<td class='fill'></td>`);
                            days+=oneDay;
                        }
                    }

                    taskList.sort(function(a,b){return a["dueTime"]-b["dueTime"]})
                    let autoSch=[];



                    for (let i=0; i<durationDays+1; i++){
                        let cell=$("#"+i)
                        let hours = Number(cell.attr('hours'));
                        let days = Number(cell.attr('days'));
                        while(taskList[0] && hours>=taskList[0].duration.stamp){
                            let real = cell.closest('td');
                            real.append(`<br><a href='/tasks/${taskList[0]._id}' duration='${taskList[0].duration.stamp}' dueTime='${taskList[0].dueTime}' id='${taskList[0]._id}'class='atask'  name = ${taskList[0].taskName}>${taskList[0].taskName}(${Math.floor(Number(taskList[0].duration.stamp)/3600000)}:${Math.floor(Number(taskList[0].duration.stamp)%3600000/60000)})</a>`)

                            autoSch.push({taskId: taskList[0]._id, schTime: days});
                            days+=taskList[0].duration.stamp;
                            hours -=taskList[0].duration.stamp;
                            
                            taskList.shift();
                        }
                        
                        cell.attr('hours',hours);
                        cell.html(`${Math.floor(Number(hours)/3600000)}:${Math.floor(Number(hours)%3600000/60000)}`)
                    }
                    
                    let autoSchObj ={
                        schName:schName,
                        stDt:stDt,
                        edDt:edDt,
                        tasks:autoSch
                    }
                    let requestConfig = {
                        method: 'POST',
                        url: 'schedule/auto',
                        data:autoSchObj};


                    $.ajax(requestConfig).then(function (responseMessage){
                        alert(JSON.stringify(responseMessage));
                    },(error)=>{
                        alert(JSON.stringify(error));
                    })
                    

                    function bindAddEvent(){ 
                        // $('#taskCell').off('click'); 
                        // $("a:acrive").off('click');              
                        $('.atask').on('click',function(event){
                            event.preventDefault();
                            let atask = $(this);
                            let taskId = atask.attr('id');
                            let plan = {taskId:taskId,name:schName,stDt:stDt,edDt:edDt};
                            
                            let duration = Number(atask.attr('duration'));
                            let dueTime =Number(atask.attr('detime'));
    
                        
                            $('.cell').on('click',function(event){
                                event.preventDefault();
                                let cell = $(this);
                                // tasks.find('.tasks a').off('click');
                                // eventA.stopPropagation();
                                let dateMark = Number(cell.attr('days'));
                                if (dueTime>dateMark){
                                    alert("schedule time must not later than dueTime!")
                                }
                                let real = cell.closest('td');
                                let dur =Number(cell.attr('hours')) -duration;
                                if (dur<0){
                                    alert("Time for this day is not enough!")
                                }
                                if(real.children().length > 1){
    
                                    let schStart = Number($(this).attr('days'));
                                    real.find(".atask").map((item)=>{
                                        schStart += Number(item.attr('duration'));
                                    })
                                    plan["time"] = schStart;
                                }else{
                                    plan["time"] =$(this).attr('days');
                                }
                                let requestConfig = {
                                    method: 'POST',
                                    url: 'schedule/mahually',
                                    data:plan};
                                $.ajax(requestConfig).then(function (responseMessage){
                                    if (responseMessage){
                                        
                                        
                                        let dur =cell.attr('hours') -duration;
                                        cell.attr('hours',dur);
                                        cell.html(`${Math.floor(Number(dur)/3600000)}:${Math.floor(Number(dur)%3600000/60000)}`);
                                        atask.remove();
    
                                        real.append(atask);
                                        tasks.find('.tasks a').off('click');
                                        schedule.find('.cell').off('click');
                                        // event.stopPropagation();
                                        bindAddEvent();
                                    }else{
                                        alert(JSON.stringify(error));
                                    }
                                    
                                })
                    
                                
                            })
                            // event.stopPropagation();
                            // bindAddEvent();
                            
                                
                        })
                    }
                    bindAddEvent();
                
                    schedule.show();
                    tasks.hide();
            
                    createForm.hide();
                
                },(error)=>{
                    alert(JSON.stringify(error));
                })
            }else{
                alert("select must be manually or one click!");
            }

        }
            $.each(errorList,function(data){error.append(`<li>${data}</li>`);})
        }else{
            alert("input invalid")
        }
    
        })   

});