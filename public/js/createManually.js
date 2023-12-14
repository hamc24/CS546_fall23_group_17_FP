$(function(){
    console.log(Session);
    var tasks = $(".tasks");
    var schedule = $(".schedule");
    var schedule = $(".schedule");
    var tasklist = $("#tasklist").val();
    var full = $("#full").val();
    var fillStart = $("#fillStart").val();
    var fillEnd = $("#fillEnd").val();
    var stDt = $("#startDate")
    var fullHour = $("#fullHour").val();


    
    let days = stDt;
    num =0;
    for (let i = 0; i <= full; i++){
        schedule.find('tbody').append("<tr id='schTr'></tr>")
        for(let c = 0; c<=7; c++){
            if (i=0){
                for (start=0; start < fillStart;start++){
                $("#schTr").append(`<td class='fill'><a class='cell'days='${days}' hours='${fullHour}'>${fullHour}</a></td>`);
                C+=1;
                num +=1;
                days+=864000000;
                }
            }
            if (full*7-num<fillEnd){
                for (start=0; start < fillStart;start++){
                $("#schTr").append(`<td class='fill'><a class='cell'days='${days}' hours='${fullHour}min'min>${fullHour}</a></td>`);
                C+=1;
                num+=1;
                days+=864000000;
                }
            }
            
            $("#schTr").append(`<td class='real'><a class='cell' days='${days}' hours='${fullHour}'min>${fullHour}</a></td>`);
            num+=1;
            days+=864000000;
        }
    }
    for(i=0;i<tasklist.length; i++){
        tasks.find('tbodyd').append(`<td><a duration='${duration*60000}' id='${tasklist[i]._id}'class='atask'>${tasklist[i].taskName}:${duration}</a></td>`);
    }
    
    tasks.find('thead').on('click',function(event){
        event.preventDefault();
        let plan = {};
        
        let $tb = $(this).closest('tb');
        let id=$(this).attr('id');
        let duration = $(this).attr('duration');
        let atask = $(this);
        schedule.find('.cell').on('click',function(event){
            event.preventDefault();
             
            let dateMark = $(this).attr('days');
            plan[id] =dateMark;
            let requestConfig = {
                method: 'POST',
                url: 'schedule/addSingle',
                data:JSON.stringify(plan)};
            $.ajax(requestConfig).then(function (responseMessage){
                
                
                
                $("#"+id).remove(); 
                atask.attr('days',dateMark);
                let dur =$(this).attr('hours') -duration;
                $(this).attr('hours',dur)
                $(this).append(atask);
            })

               
            })
            
    })
    schedule.find('.atask').on('click',function(event){
        event.preventDefault();
        let plan = {};
        let cell = $(this).closest('tb').find('.cell');
        let hours =cell.attr('hours')
        let atask=$(this); 
        let id = atask.attr('id');
        tasks.find('thead').on('click',function(event){
            event.preventDefault();
            plan[id] =dateMark;
            let requestConfig = {
                method: 'POST',
                url: 'schedule/addSingle',
                data:JSON.stringify(plan)};
            $.ajax(requestConfig).then(function (responseMessage){
                
                $("#"+id).remove(); 

                var duration = atask.attr('duration');
                let dur =hours +duration;
                cell.attr('hours',dur)

                atask.removeAttr('days');
                tasks.append(`<tb class = 'tasks'>${atask}</tb>`)
                 
            })
        })
    })
    console.log("BBB")
});