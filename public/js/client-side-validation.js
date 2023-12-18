
(function () {
  const sanitize = (body) => {
    for (let element in body) body[element] = xss(body[element]);
    return body;
  };


})();
let errorlist = [];

console.log("AAAA!!!");



function checkNum(val){
  if (typeof(val) != "number") {
    return false}
  if(isNaN(val)) {
    return false}
  if( val === Infinity || val === -Infinity) {
    return false;
  }else{
    return true;
  }
}

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
    //console.log(date);
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
  
  //Birthday validation function
  function validateBirthday(dateString) {
    // Should be used after validating date
    let ageDifMs = new Date() - new Date(dateString);
    let ageDate = new Date(ageDifMs); // miliseconds from epoch
    let age = ageDate.getUTCFullYear() - 1970;
    if (age < 13)
      throw "Error: You must be at least 13 years or older to create an account!";
  }
  
  // Check if date is in the future
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
    let minute = splitTime[1].substring(0, 2);
    let AMPM = splitTime[1].substring(2);
  
    // Checking hour so that it is formatted correctly
    if (hour.length > 2 || hour.length < 1) {
      throw "Error: invalid Hour";
    } else if (hour.length == 2) {
      if (hour[0] == "0") {
        throw "Error: bad formatting for hour";
      }
    }
  
    if (minute.length != 2 || AMPM.length != 3) throw "Error: invalid time";
  
    AMPM = AMPM.trim();
    if (AMPM.length != 2) throw "Error AMPM Format error";
  
    if (parseInt(hour) != hour || parseInt(minute) != minute)
      throw "Error: invalid time";
    if (
      AMPM.toUpperCase().localeCompare("AM") != 0 &&
      AMPM.toUpperCase().localeCompare("PM") != 0
    )
      throw "Error: invalid time";
  
    if (hour < 1 || hour > 12) throw "Error: Invalid time";
    if (minute < 0 || minute > 59) throw "Error: Invalid time";
  }



function checkRegister(){
    $('#errorList').empty();
    errorlist = [];
    $("#registration-form").find('input').removeClass('errorInput');
    addStyle(!checkStr($('#firstNameInput').val()), $('#firstNameInput'), "firstNameInput must be strings");
    if(checkStr($('#firstNameInput').val())){
        addStyle(($('#firstNameInput').val().trim().length<2 || $('#firstNameInput').val().trim().length>25) ||Array.from($('#firstNameInput').val()).filter(elem => !elem.match(/[a-zA-Z]/)).length>0, $('#firstNameInput'), "firstname must be 2-25 alphabet characters");
        
    }

    addStyle(!checkStr($('#lastNameInput').val()), $('#lastNameInput'), "lastNameInput must be strings");

    if(checkStr($('#lastNameInput').val())){
        addStyle(($('#lastNameInput').val().trim().length<2 || $('#lastNameInput').val().trim().length>25) || Array.from($('#lastNameInput').val()).filter(elem => {elem.match(/[a-zA-Z]/)}).length>0, $('#lastNameInput'), "lastname must be 2-25 alphabet characters");

    }
    addStyle(!checkStr($('#userNameInput').val()), $('#userNameInput'), "userNameInput must be strings");

    if(checkStr($('#userNameInput').val())){
        addStyle(($('#userNameInput').val().trim().length<2 || $('#userNameInput').val().trim().length>25) || Array.from($('#userNameInput').val()).filter(elem => {elem.match(/[a-zA-Z]/)}).length>0, $('#userNameInput'), "400:userName must be 2-25 alphabet characters");

    }

    try{
        validateDate($('#dateOfBirthInput').val());
        validateBirthday($('#dateOfBirthInput').val());
    }catch(e){
        addStyle(true, $('#dateOfBirthInput'),e)
    }
    



    addStyle(!checkStr($('#emailAddressInput').val()), $('#emailAddressInput'), "emailAddress must be strings");
    
    


    addStyle(!checkStr($('#passwordInput').val()), $('#passwordInput'), "password must be strings");

    if(checkStr($('#passwordInput').val())){
        let password = $('#passwordInput').val();
        addStyle((Array.from(password).filter(elem => {elem.match(" ")}).length>0)?true:false, $('#passwordInput'), "password must be strings");
        
        let spec = ["`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "]", "\\", "{", "}", "|", ";", "'", ":", '"', ",", ".", "/", "<", ">", "?"];
                
        let cap = /[A-Z]/;
        let num = /[0-9]/;
        let special = Array.from(password).filter((item) => item.match(spec));
        let capital = Array.from(password).filter((item) => item.match(cap));
        let numbers = Array.from(password).filter((item) => item.match(num));
        addStyle($('#passwordInput').val().length < 8 || !special || !capital || !numbers, $('#passwordInput'), "400:invalid password. There needs to be more than 8 characters and contains at least one uppercase character, one number one special characte");
    }


    addStyle(!checkStr($('#confirmPasswordInput').val()), $('#confirmPasswordInput'), "confirm password must be strings");

    if($('#confirmPasswordInput').val()){
        addStyle(($('#confirmPasswordInput').val() !== $('#passwordInput').val())?true:false, $('#confirmPasswordInput'), "400: confirm password input is not the same as password input");
    }
    if (errorlist.length>0){  
      $(".error").empty();  
        for (let item of errorlist){
            li = `<li class = "error"> ${item} </li>`;
            $('#errorList').append(li);
                   
        }
        return false; 
    }
    return true;
    // $('#registration-form').trigger('reset');
};


function checkLogin(){
    $('#errorList').empty();
    errorlist = [];
    $("#login-form").find('input').removeClass('errorInput');
    addStyle(!checkStr($('#emailAddressInput').val()), $('#emailAddressInput'), "emailAddress must be strings");
    

    addStyle(!checkStr($('#passwordInput').val()), $('#passwordInput'), "password must be strings");

    if(checkStr($('#passwordInput').val())){
        let password = $('#passwordInput').val();
        addStyle((Array.from(password).filter(elem => {elem.match(" ")}).length>0)?true:false, $('#passwordInput'), "password must be strings");

        let spec = ["`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "]", "\\", "{", "}", "|", ";", "'", ":", '"', ",", ".", "/", "<", ">", "?"];
                
        let cap = /[A-Z]/;
        let num = /[0-9]/;
        let special = Array.from(password).filter((item) => item.match(spec));
        let capital = Array.from(password).filter((item) => item.match(cap));
        let numbers = Array.from(password).filter((item) => item.match(num));
        addStyle($('#passwordInput').val().length < 8 || !special || !capital || !numbers, $('#passwordInput'), "400:invalid password. There needs to be more than 8 characters and contains at least one uppercase character, one number one special characte");
    }
    console.log(errorlist);
    if (errorlist.length>0){
      $(".error").empty();    
        for (let item of errorlist){
            li = `<li class = "error"> ${item} </li>`;
            $('#errorList').append(li);
                   
        }
        return false; 
    }
    return true;
    // $('#loginForm').trigger('reset');
};


function checkTask(){
    $('#errorList').empty();
    errorlist = [];
    $("#create-form").find('input').removeClass('errorInput');
    addStyle(!checkStr($('#nameInput').val()), $('#nameInput'), "nameInput must be strings");
    if(checkStr($('#nameInput').val())){
        addStyle(($('#nameInput').val().trim().length<2 || $('#nameInput').val().trim().length>50), $('#firstNameInput'), "nameInput must be 2-50 characters");        
    }
    addStyle(!checkStr($('#descriptionInput').val()), $('#descriptionInput'), "descriptionInput must be strings");
    if(checkStr($('#descriptionInput').val())){
        addStyle(($('#descriptionInput').val().trim().length<2 || $('#descriptionInput').val().trim().length>250), $('#descriptionInput'), "descriptionInput must be 2-250 characters");        
    }

    try{
        validateDate($('#dateDueInput').val());
        compareDate($('#dateDueInput').val());
    }catch(e){
        addStyle(true, $('#dateDueInput'),e)
    }
    try{
      
        validateTime($('#timeDueInput').val());
    }catch(e){
        addStyle(true, $('#timeDueInput'),e)
    }



    let dh = Number(($('#durationInputH').val().trim()));
    let dm =  Number(($('#durationInputM').val().trim()));
    let co =  Number(($('#maxContributorInput').val().trim()));
    console.log("typeof(dh)",typeof(dh),dh);
    console.log("typeof(dh)",typeof(dm),dm);
    console.log("typeof(dh)",typeof(db),db);

    addStyle(!checkNum(dh) || dh<0 || dh>24, $('#durationInputH'), "Task Duration hour cannot be more than 24 hours long and less than 0");
    addStyle(!checkNum(dm) ||dm<0 || dm>60, $('#durationInputM'), "Task Duration minutes cannot exceed 60 mins or be less than 0");
    addStyle(!checkNum(co), $('#maxContributorInput'), "maxContributorInput must be numbers");




    if (errorlist.length>0){  
        $(".error").empty();  
        for (let item of errorlist){
            li = `<li class = "error"> ${item} </li>`;
            $('#errorList').append(li);
                   
        }
        return false; 
    }
    return true;
}
 
function checkSchedule(){
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
      $(".error").empty();  
      for (let item of errorlist){
          li = `<li class = "error"> ${item} </li>`;
          $('#errorList').append(li);
                 
      }
      return false; 
  }
  return true;


}


