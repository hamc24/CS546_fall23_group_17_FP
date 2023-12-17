$(function(){
    let errorList=[];
    let error = $("#error");
    let tasks = $(".tasks");
    let schedule = $(".schedule");
    let createForm=$("#createForm");
    let deleteSch=$("#deleteSch")
    let deleteDiv = $("#deleteDiv");



    function fillCalendar(stDt,edDt,tasks,schName){

        let oneDay = 86400000;
        $(".schedule tbody").empty();
        
        
        tasks.sort(function(a,b){return b["schTime"]-a["schTime"]})
        function addTasks(dayNum,days){
            for(let item of tasks){
                if(days<item["schTime"]<days+oneDay){
                    $(`.cell #${dayNum}`).append(`<a href='/tasks/${item.taskId}'  id='${item.taskId}'class='atask' schTime=${item["schTime"]}>${item.taskName})</a>`);

                }
            }
        }
        console.log("sssstDt:",stDt,"eeeedDt:",edDt)
        let requestConfig = {
            method: 'POST',
            url: '/schedule/calculateFill',
            data:{
                stDt:stDt,
                edDt:edDt
            }
            };
        $.ajax(requestConfig).then(function(data){
            console.log("viewCalendatData:",data);
            let fillStart= data.fillStart;
            let fillEnd = data.fillEnd; 
            let startDate = data.strSt; 
            let endDate = data.strEnd;
            let full = data.full; 
            let dayNum = 0;
            let days = stDt;
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
                        $("#schTr00").append(`<td class='real' days='${days}' id='${dayNum}'></td>`);
                        days +=oneDay;
                        dayNum+=1;
                        addTasks(dayNum,days);
                    }
                }

                
                for (let i = 0; i < full-isFill; i++){
                    schedule.find('tbody').append(`<tr id='schTrMid${i}'></tr>`);
                    for(let c = 0; c<7; c++){
                        $(`#schTrMid${i}`).append(`<td class='real' days='${days}' id='${dayNum}'></td>`);
                        days +=oneDay;
                        dayNum+=1;
                        addTasks(dayNum,days);


                    }
                }
                if(fillEnd !== 0){
                    schedule.find('tbody').append("<tr id='schTrEnd'></tr>");
                    for (let i = 0; i < 7-fillEnd; i++){
                        $("#schTrEnd").append(`<td class='real' days='${days}' id='${dayNum}'></td>`);
                        days +=oneDay;
                        dayNum+=1;
                        addTasks(dayNum,days);
                    }


                    for(let i = 0; i<fillEnd; i++){
                        $("#schTrEnd").append(`<td class='fill'></td>`);
                    }

                }
        })
        schedule.show();
        
    
    }





    $("#viewSch").on('click',function(event){
        event.preventDefault();
        console.log("viewwwww");

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
                    
            }});
            
        deleteSch.on('click',function(event){
            event.preventDefault()
            deleteDiv.show();
            deleteSch.hide();
            $("#noDel").on('click', function(event){
                event.preventDefault();
                deleteDiv.hide();
                deleteSch.show();
            });
            $("#confirmDel").on('click', function(event){
                event.preventDefault()
                let schName = $(".schedule thead").attr('name');
                
                $.ajax({type:'DELETE',url:'/schedule/'+schName,success:function(data){
                    
                    if (data === true){
                        $(".schList #schName").remove();
                        delete allSch[schName];
                        if(Object.keys(allSch).length>0){
                            let sch01 = allSch[Object.keys(data)[0]]
                            let stDt = sch01[stDt];
                            let edDt = sch01[edDt];
                            let tasks = sch01[tasks];
                            fillCalendar(stDt,edDt,tasks,Object.keys(data)[0])
                        }
                    }
                }})
                deleteDiv.hide();
                deleteSch.show();
            })
        })
        tasks.show();
        
        
    })


    $("#selectScheduleTime").submit(function (event) {
        event.preventDefault();
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
                if (data.err){
                    console.log(data);
                }
                console.log("backend create sch data:",data);
                let full = data.full;
                let fillStart = data.fillStart;
                let fillEnd = data.fillEnd;
                let fullHour = data.fullHour;
                let durationDay = data.durationDay;
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
                                console.log("findSch",real.children().length);

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
                                    trTask.remove();

                                    // console.log(Math.floor(Number(duration)/3600000)+":"+Math.floor(Number(duration)%3600000/60000));
                                    // console.log(`<a href='/tasks/${id}' duration='${duration}' id='${id}'class='atask' name='${taskName}' days='${dateMark}>${taskName}(${Math.floor(Number(duration)/3600000)}:${Math.floor(Number(duration)%3600000/60000)})</a>`);
                                    // atask.attr('days',dateMark);
                                    // real.append("<a href='/tasks/65770cdf386810e3d7ca9e88' duration='15300000' id='65770cdf386810e3d7ca9e88'class='atask' name='doing' days='1703203200000'>doing(4:15)</a>");
                                    real.append(`<br><a href='/tasks/${taskId}' duration='${duration}' id='${taskId}'class='atask' name='${taskName}' days='${dateMark}'>${taskName}(${Math.floor(Number(duration)/3600000)}:${Math.floor(Number(duration)%3600000/60000)})</a>`);
                                    tasks.find('.tasks a').off('click');
                                    schedule.find('.cell').off('click');
                                    // event.stopPropagation();
                                    bindAddEvent();
                                    bindRemoveEvent();
                                }else{
                                    console.log(responseMessage);
                                    alert(responseMessage[Object.keys(responseMessage)[0]]);
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
                                console.log("requestConfig",requestConfig);
                            $.ajax(requestConfig).then(function (responseMessage){
                                console.log("callback done!!");
                                if (responseMessage===true){
                                    console.log("responseMessage",responseMessage);
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
                                }else{
                                    console.log(responseMessage);
                                    alert(responseMessage[Object.keys(responseMessage)[0]]);
                                }
                                
                            })
                        })
                        
                    })
                }
                bindAddEvent();
                bindRemoveEvent();
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
                    if (data.err){
                        console.log(data);
                    }
                    console.log("data",data);
                    let full = data.full;
                    let fillStart = data.fillStart;
                    let fillEnd = data.fillEnd;
                    let fullHour = data.fullHour;
                    let durationDay = data.durationDay;
                    let stDt = data.stDt;
                    let edDt = data.edDt;
                    let taskList = data.taskList;
                    let oneDay = 86400000;

                    $(".schedule tbody").empty();
                    $(".tasks tbody").empty();

                            
                    tasks.sort(function(a,b){return b["duetime"]-a["duetime"]})



                    
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
                    for (let i=0; i<durationDay+1; i++){
                        let hours = $("#"+i).attr('hours');
                        let days = $("#"+i).attr('days');
                        
                        if(hours>=item.duration.stamp){
                            
                            $("#"+i).append(`<br><a href='/tasks/${taskList[0].taskId}' duration='${taskList[0].duration}' duetime='${taskList[0].dueTime}' id='${taskList[0].taskId}'class='atask' days='${days}'>${taskList[0].taskName}(${Math.floor(Number(taskList[0].duration)/3600000)}:${Math.floor(Number(taskList[0].duration)%3600000/60000)})</a>`)
                            
                            autoSch.push({taskId: taskList[0].taskId, schTime: days});
                            days+=duration;
                            hours -=duration;
                            
                            taskList.shift();
                        }
                        
                        $("#"+i).attr('hours',hours);
                    }
                    let autoSchObj ={
                        schName:schName,
                        stDt:stDt,
                        edDt:edDt,
                        tasks:autoSch
                    }
                    let requestConfig = {
                        method: 'PATCH',
                        url: 'schedule/auto',
                        data:autoSchObj};
                    $.ajax(requestConfig).then(function (responseMessage){
                        console.log(responseMessage)
                    })
                    

                    // let cell =$(".cell");
                    // $.each(cell, function(i,item){
                    //     let count = 0;
                        
                    //     while(cell.attr('hours')<taskList[0].duration && cell.attr('days') < taskList[0].dueTime){
                    //         item.append(`<br><a href='/tasks/${taskList[0].id}' duration='${taskList[0].duration}' id='${taskList[0].id}'class='atask' name='${taskList[0].taskName}' days='${cell.attr('days')}'>${taskList[0].taskName}(${Math.floor(Number(taskList[0].duration)/3600000)}:${Math.floor(Number(taskList[0].duration)%3600000/60000)})</a>`);
                    //         let dur =cell.attr('hours') -= duration;
                    //         cell.attr('hours',dur);
                    //         count +=1;
                    //         taskList.shift()
                    //     }
                    //     cell.val(`${dur/3600000}:${dur%3600000}`);
                    // })
                    

                    schedule.find('.schedule .atask').on('click',function(event){
                        event.preventDefault();
                        let atask=$(this);
                        let cell = $(this).closest('tb').find('.cell');
                        let hours =cell.attr('hours')
                        let duration = atask.attr('duration');
                        let dueTime = atask.attr('dueTime');
                        let taskId = atask.attr('id');
                        schedule.find('.cell').on('click',function(event){
                            event.preventDefault();

                            let afterCell = $(this);
                            let daysAfter = Number($(this).attr('days'));
                            let tb = $(this).closest('tb');
                            
                            let hoursAfter = Number(afterCell.attr('hours'))

                            if (dueTime>daysAfter){
                                alert("schedule time must not later than dueTime!")
                            }
                            let real = afterCell.closest('td');
                            let dur =hoursAfter-duration;
                            if (dur<0){
                                alert("Time for this day is not enough!")
                            }
                            
                            if(real.children().length > 1){

                                real.find(".atask").map((item)=>{
                                    daysAfter += Number(item.attr('duration'));
                                })}


                            let plan = {taskId:taskId,schName:schName,daysAfter:daysAfter};
                            let requestConfig = {
                                method: 'PATCH',
                                url: 'schedule/auto',
                                data:plan};
                            $.ajax(requestConfig).then(function (responseMessage){
                                if (responseMessage === true){
                                    
                    
                                    var duration = atask.attr('duration');
                                    hours -= duration;
                                    cell.attr('hours',hours);
                                    cell.attr('hours',hours);
                                    cell.val(`${dur/3600000}:${dur%3600000}`);


                                    hoursAfter -= duration;
                                    afterCell.attr('hours',hoursAfter);
                                    
                                    atask.remove(); 


                                    real.append(`<br><a href='/tasks/${taskList[0].taskId}' duration='${taskList[0].duration}' duetime='${taskList[0].dueTime}' id='${taskList[0].taskId}'class='atask' days='${daysAfter}'>${taskList[0].taskName}(${Math.floor(Number(taskList[0].duration)/3600000)}:${Math.floor(Number(taskList[0].duration)%3600000/60000)})</a>`)
                                }else{
                                    console.log(responseMessage);
                                    alert(responseMessage[Object.keys(responseMessage)[0]]);
                                }
                                
                            })
                        })
                    })
                
                    schedule.show();
                    tasks.hide();
            
                    createForm.hide();
                
                })
            }else{
                alert("select must be manually or one click!");
            }

        }
            $.each(errorList,function(data){error.append(`<li>${data}</li>`);})
    })   

});