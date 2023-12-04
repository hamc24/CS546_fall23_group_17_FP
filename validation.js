import { ObjectId } from "mongodb"; // Used for ObjectId Checking
import xss from 'xss';

// A helper to sanitize form input, be sure to call whenever a form is recieved.

function sanitize(body) {
  for (let element in body)
    body[element] = xss(body[element]);
  return body;
}

//
function checkId(id, varName) {
  // id = string, varName = string
  if (!id) throw `Error: You must provide a ${varName}`;
  if (typeof id !== "string") throw `Error: ${varName} must be a string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
  return id;
}

function checkString(strVal, varName) {
  // strVal = string, varName = string
  if (!strVal) throw `Error: You must supply a ${varName}!`;
  if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  return strVal;
}
function checkNumber(val,name){
  if (typeof(val) != "number"){
      throw `input ${name} ${val} is not number`;
  };
  if (isNaN(val)){
      throw `input ${name} ${val} is NaN`;
  };
  if (val === Infinity || val === -Infinity){
      throw `input ${name} ${val} is Infinity or -Infinity`;
  };
}
function checkStringArray(arr, varName) {
  //arr = [string], varName = string
  //We will allow an empty array for this,
  //if it's not empty, we will make sure all tags are strings
  if (!arr || !Array.isArray(arr))
    throw `You must provide an array of ${varName}`;
  for (let i in arr) {
    if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
      throw `One or more elements in ${varName} array is not a string or is an empty string`;
    }
    arr[i] = arr[i].trim();
  }

  return arr;
}

// Checks if input is null but excludes number 0 and boolean false
function checkNull(input) {
  if (!input && input != 0 && input != false)
    throw "Error: Input is not supplied, is undefined, null, '', or NaN";
}

// Email validation function based on:
// https://en.wikipedia.org/wiki/Email_address#Local-part
function validateEmail(input) {
  let indexLastAt = input.lastIndexOf("@");
  if (indexLastAt == -1) throw "Error: No @ in email address found";

  let prefix = input.substring(0, indexLastAt); // Get prefix (local)
  let suffix = input.substring(indexLastAt + 1); // Get suffix (domain)

  //If suffix or prefix is just an empty string
  if (!prefix || !suffix)
    throw "Error: prefix, suffix, or both are empty strings";
  if (prefix[0] == "." || prefix[prefix.length - 1] == ".")
    throw "Error: Leading or trailing period in prefix";
  if (
    prefix.includes("..") &&
    prefix[0] != `"` &&
    prefix[prefix.length - 1] != '"'
  )
    throw "Error: sequence of double periods detected in prefix";

  // Defining allowed characters
  let allowedChars =
    "abcdefghijklmnopqrstuvwxyz0123456789!#&$%'*+-/=.?^_`{|}~".split("");
  let specialChars = `"(),:;<>@[\]`.split("");

  /*
   * Start with prefix handling
   */

  // Flag that detects quoted string
  let isQuotedString;
  if (prefix[0] == '"' && prefix[prefix.length - 1] == '"') {
    isQuotedString = true;
  } else {
    isQuotedString = false;
  }

  // If quoted string detected in prefix
  if (isQuotedString) {
    let LCprefix = prefix.toLowerCase().substring(1, prefix.length - 1);
    //Checks all characters within the quotes and errors if an unrecognized character is found
    for (let i in LCprefix) {
      if (
        allowedChars.includes(LCprefix[i]) ||
        specialChars.includes(LCprefix[i]) ||
        LCprefix[i] == " "
      ) {
        continue;
      } else {
        throw "Error: Prefix is quoted string but has a character that is unrecognized";
      }
    }
  } else {
    let LCprefix = prefix.toLowerCase();
    for (let i in LCprefix) {
      if (allowedChars.includes(LCprefix[i])) {
        continue;
      } else {
        throw "Error: prefix is not valid";
      }
    }
  }

  function ValidateIPaddress(ipaddress) {
    if (
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        ipaddress
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  suffix = suffix.toLowerCase().split(".");

  let allowedDomainChars = "abcdefghijklmnopqrstuvwxyz0123456789-".split("");
  //Checking if domain is an ip
  if (suffix.length == 1) {
    if (suffix[0][0] == "[" && suffix[0][suffix[0].length - 1] == "]") {
      ip = suffix[0].substring(1, suffix[0].length - 1);
      if (ValidateIPaddress(ip)) {
        return;
      } else {
        throw "Error: domain is not valid1";
      }
    } else {
      throw "Error: domain is not valid2";
    }
  } else {
    for (let i in suffix) {
      for (let j in suffix[i]) {
        if (allowedDomainChars.includes(suffix[i][j])) {
          continue;
        } else {
          throw "Error: domain is not valid3";
        }
      }
    }
  }
}

//Date validations function
function validateDate(date) {
  date = date.split("/");
  if (date.length != 3) throw "Error: date is not valid (not long enough)";
  let month = date[0];
  let day = date[1];
  let year = date[2];
  if (
    parseInt(month) != month ||
    parseInt(day) != day ||
    parseInt(year) != year
  )
    throw "Error: date is not valid (did not match)";
  if (month < 1 || month > 12) throw "Error: date is not valid";
  if (day < 1) throw "Error: date is invalid";
  if (month == 4 || month == 6 || month == 9 || month == 11) {
    if (day > 30) {
      throw `Error: the ${month}th month only has 30 days`;
    }
  } else if (month == 2) {
    if (day > 28) {
      throw `Error: the ${month}th month only has 28 days`;
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
  date = date.split("/");
  let month = date[0];
  let day = date[1];
  let year = date[2];

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

// Checking if time is formatted correctly
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

//Compare two different times
function compareTimes(start, end) {
  validateTime(start);
  let splitStart = start.split(":");
  let startHour = splitStart[0];
  let startMin = splitStart[1].substring(0, 2);
  let startAMPM = splitStart[1].substring(2, 4);

  validateTime(end);
  let splitEnd = end.split(":");
  let endHour = splitEnd[0];
  let endMin = splitEnd[1].substring(0, 2);
  let endAMPM = splitEnd[1].substring(2, 4);

  // console.log(startHour);
  // console.log(startMin);
  // console.log(startAMPM);
  // console.log(endHour);
  // console.log(endMin);
  // console.log(endAMPM);

  if (endAMPM.toUpperCase() == "AM" && startAMPM.toUpperCase() == "PM") {
    throw "Error: end time can't be earlier than start time1";
  } else if (endAMPM.toUpperCase() == startAMPM.toUpperCase()) {
    if (parseInt(endHour) < parseInt(startHour)) {
      throw "Error: end time can't be later than start time2";
    } else if (parseInt(endHour) == parseInt(startHour)) {
      if (parseInt(endMin) < parseInt(startMin)) {
        throw "Error: end time cant be earlier than start time3";
      } else if (parseInt(endMin) - parseInt(startMin) < 30)
        throw "Error: end time must be at least 30 minutes later than the start time4";
    } else if (parseInt(endHour) - parseInt(startHour) == 1) {
      if (60 - parseInt(startMin) + parseInt(endMin) < 30) {
        throw "Error: end time must be at least 30 minutes later than the start time5";
      }
    }
  }
}

// Reference:
//https://stackoverflow.com/questions/12090077/javascript-regular-expression-password-validation-having-special-characters
function validatePassword(string) {
  var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!re.test(string))
    throw "Error: Password must be 8 Characters long, have at least one uppercase letter, one letter, and one special character";
  if (string.split(" ").length > 1)
    throw "Error: Spaces not allowed in password";
}

export default {
  sanitize,
  checkId,
  checkString,
  checkNumber,
  checkStringArray,
  checkNull,
  validateEmail,
  validateDate,
  validateBirthday,
  compareDate,
  validateTime,
  compareTimes,
  validatePassword,
};
