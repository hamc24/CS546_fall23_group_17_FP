(function () {

  const sanitize = (body) => {
    for (let element in body)
        body[element] = xss(body[element]);
    return body;
    }

})();


$('#registration-form').submit((event) => {
  event.preventDefault();
  errorlist = [];

  addStyle(checkStr($('#firstNameInput')), $('#firstNameInput'), "firstNameInput must be strings");

  if(checkStr($('#firstNameInput'))){
      addStyle(() => $('#firstNameInput').val().trim().length<2 || $('#firstNameInput').val().trim().length>25, $('#firstNameInput'), "400:firstname must be 2-25 characters");

      addStyle(() => Array.from($('#firstNameInput')).forEach(elem => {elem.match(/[a-zA-Z]/)}), $('#firstNameInput'), "400:firstname must be alphabet characters");
  }

  addStyle(checkStr($('#lastNameInput')),  $('#lastNameInput'), "lastNameInput must be strings");

  if(checkStr($('#lastNameInput'))){
      addStyle(() => $('#lastNameInput').val().trim().length<2 || $('#lastNameInput').val().trim().length>25,  $('#lastNameInput'), "400:lastname must be 2-25 characters");

      addStyle(() => Array.from($('#lastNameInput')).forEach(elem => {elem.match(/[a-zA-Z]/)}), $('#lastNameInput'), "400:lastname must be alphabet characters");
  }


  addStyle(checkStr($('#emailAddressInput')), $('#emailAddressInput'), "emailAddress must be strings");

  addStyle(checkStr($('#passwordInput')), $('#passwordInput'), "password must be strings");

  if(checkStr($('#passwordInput'))){
      addStyle(() => Array.from($('#lastNameInput')).forEach(elem => {elem.match(" ")}), $('#passwordInput'), "password must be strings");

      let spec = ["`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "]", "\\", "{", "}", "|", ";", "'", ":", '"', ",", ".", "/", "<", ">", "?"];
              
      let cap = /[A-Z]/;
      let num = /[0-9]/;
      addStyle($('#passwordInput').length < 8 || !spec.test($('#passwordInput')) || !cap.test($('#passwordInput')) || !num.test($('#passwordInput')), $('#passwordInput'), "400:invalid password. There needs to be more than 8 characters and contains at least one uppercase character, one number one special characte");
  }

  
  addStyle(() => $('#confirmPasswordInput') !== $('#passwordInput'), $('#confirmPasswordInput'), "400: confirm password input is not the same as password input");

  

  addStyle(() => $('#roleInput') !== "admin" && $('#roleInput') !== "user", $('#roleInput'), "400: role can only be admin or user");

  for (let item of errorlist){
      li = `<li class = "error"> ${item} </li>`
      $('#errorlist').append(li);       
  }
  // $('#registration-form').trigger('reset');
});

$('#login-Form').submit((event) => {
  event.preventDefault();
  errorlist = [];


  addStyle(checkStr($('#emailAddressInput')), $('#emailAddressInput'), "emailAddress must be strings");

  addStyle(checkStr($('#passwordInput')), $('#passwordInput'), "password must be strings");

  if(checkStr($('#passwordInput'))){
      addStyle(() => Array.from($('#lastNameInput')).forEach(elem => {elem.match(" ")}), $('#passwordInput'), "password must be strings");

      let spec = ["`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "]", "\\", "{", "}", "|", ";", "'", ":", '"', ",", ".", "/", "<", ">", "?"];
              
      let cap = /[A-Z]/;
      let num = /[0-9]/;
      addStyle($('#passwordInput').length < 8 || !spec.test($('#passwordInput')) || !cap.test($('#passwordInput')) || !num.test($('#passwordInput')), $('#passwordInput'), "400:invalid password. There needs to be more than 8 characters and contains at least one uppercase character, one number one special characte");
  }

  for (let item of errorlist){
      li = `<li class = "error"> ${item} </li>`
      $('#errorlist').append(li);       
  }
  // $('#loginForm').trigger('reset');
});

function checkStr(val){
      
  if(val || typeof(val) == "string" || val.trim()){
      return true;
  }else{
      return false
  }
}

function addStyle(funcA,val,msg){
  if(funcA){
      
      val.addClass('inputClass');
      errorlist.push(msg);
  }else{
      
      val.removeClass('inputClass');
  }
}