import { ObjectId } from 'mongodb'; // Used for ObjectId Checking
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
  if (typeof id !== 'string') throw `Error: ${varName} must be a string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
  return id;
}

function checkString(strVal, varName) {
  // strVal = string, varName = string
  if (!strVal) throw `Error: You must supply a ${varName}!`;
  if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  return strVal;
}

function checkStringArray(arr, varName) {
  //arr = [string], varName = string
  //We will allow an empty array for this,
  //if it's not empty, we will make sure all tags are strings
  if (!arr || !Array.isArray(arr))
    throw `You must provide an array of ${varName}`;
  for (let i in arr) {
    if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
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
  let indexLastAt = input.lastIndexOf('@');
  if (indexLastAt == -1) throw 'Error: No @ in email address found';

  let prefix = input.substring(0, indexLastAt); // Get prefix (local)
  let suffix = input.substring(indexLastAt + 1); // Get suffix (domain)

  //If suffix or prefix is just an empty string
  if (!prefix || !suffix)
    throw 'Error: prefix, suffix, or both are empty strings';
  if (prefix[0] == '.' || prefix[prefix.length - 1] == '.')
    throw 'Error: Leading or trailing period in prefix';
  if (
    prefix.includes('..') &&
    prefix[0] != `"` &&
    prefix[prefix.length - 1] != '"'
  )
    throw 'Error: sequence of double periods detected in prefix';

  // Defining allowed characters
  let allowedChars =
    "abcdefghijklmnopqrstuvwxyz0123456789!#&$%'*+-/=.?^_`{|}~".split('');
  let specialChars = `"(),:;<>@[\]`.split('');

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
        LCprefix[i] == ' '
      ) {
        continue;
      } else {
        throw 'Error: Prefix is quoted string but has a character that is unrecognized';
      }
    }
  } else {
    let LCprefix = prefix.toLowerCase();
    for (let i in LCprefix) {
      if (allowedChars.includes(LCprefix[i])) {
        continue;
      } else {
        throw 'Error: prefix is not valid';
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

  suffix = suffix.toLowerCase().split('.');

  let allowedDomainChars = 'abcdefghijklmnopqrstuvwxyz0123456789-'.split('');
  //Checking if domain is an ip
  if (suffix.length == 1) {
    if (suffix[0][0] == '[' && suffix[0][suffix[0].length - 1] == ']') {
      ip = suffix[0].substring(1, suffix[0].length - 1);
      if (ValidateIPaddress(ip)) {
        return;
      } else {
        throw 'Error: domain is not valid1';
      }
    } else {
      throw 'Error: domain is not valid2';
    }
  } else {
    for (let i in suffix) {
      for (let j in suffix[i]) {
        if (allowedDomainChars.includes(suffix[i][j])) {
          continue;
        } else {
          throw 'Error: domain is not valid3';
        }
      }
    }
  }
}

function validateDate(date) {
  date = date.split('/');
  if (date.length != 3) throw 'Error: date is not valid';
  let month = date[0];
  let day = date[1];
  let year = date[2];
  if (
    parseInt(month) != month ||
    parseInt(day) != day ||
    parseInt(year) != year
  )
    throw 'Error: date is not valid';
  if (month < 1 || month > 12) throw 'Error: date is not valid';
  if (day < 1) throw 'Error: date is invalid';
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
      throw 'Error: date can have more than 31 days';
    }
  }
  if (year.length > 4 && year.length < 0)
    throw 'Error: year has to be a number greater than 0 but less than 5';
}

export default {
  sanitize,
  checkId,
  checkString,
  checkStringArray,
  checkNull,
  validateEmail,
  validateDate,
};
